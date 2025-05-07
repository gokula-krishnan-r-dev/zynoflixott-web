"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import Loading from "@/components/ui/loading";
import {
  isMonthMembershipCompleted,
  secondsToMinutes,
} from "@/lib/time";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authId, isLogin, userId } from "@/lib/user";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/video/video-player";
import { ChevronDown, Heart, Lock, Play, PlayCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoComment from "@/components/shared/video-comment";
import CategoryList from "@/components/shared/category-list";
import DescriptionCard from "@/components/ui/description-card";
import { motion } from "framer-motion";

// Format view count to K, M, B format
const formatViewCount = (count: number): string => {
  if (!count) return "0";

  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toString();
};

// View counter component
const ViewCounter = ({ count }: { count: number }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-r from-[#4e6fff] to-[#7e5cff] text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-lg"
    >
      <span className="font-bold text-sm sm:text-base">Views:</span>
      <span className="font-bold text-sm sm:text-base">{formatViewCount(count)}</span>
    </motion.div>
  );
};

export default function Page({ params }: { params: { videoId: string } }) {
  const videoId = params.videoId;
  const {
    data: video,
    isLoading,
    error,
    refetch,
  } = useQuery(["video", videoId], async () => {
    const response = await axios.get(`/video/${videoId}`);
    return response.data.video;
  });
  const { data: user, isLoading: userLoading } = useQuery(
    ["user", userId],
    async () => {
      const response = await axios.get(`/auth/user/${userId}`);
      const isMembership = isMonthMembershipCompleted(
        response.data.user.membershipId.createdAt
      );

      if (isMembership) {
        toast.warning(
          "You are watching a Promo video for watch full video subscription is required"
        );
      }

      return response.data.user;
    }
  );
  const { data: follower, refetch: refetchF } = useQuery(
    ["follower", videoId],
    async () => {
      const response = await axios.get(`/followers/${videoId}`);
      return response.data.followers;
    }
  );

  const isMembership = isMonthMembershipCompleted(
    user?.membershipId?.createdAt || new Date(-1)
  );

  const {
    data: like,
    refetch: refetchL,
    isLoading: likeLoading,
  } = useQuery(["like", videoId], async () => {
    const response = await axios.get(`/video/like/${videoId}`);
    return response.data.like;
  });

  const profileId = video?.created_by_id || null;
  const { data: userprofile } = useQuery(["user-video", profileId], async () => {
    const response = await axios.get(`/auth/user/${profileId}`);
    return response.data.user
  });

  console.log(userprofile, profileId, "userprofile");

  console.log(follower?.[0]?.user_id, "follower");
  const router = useRouter();
  const handletoFollow = async () => {
    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }
    const response = await axios.post(
      `/follow/${userId}`,
      {
        videoId: videoId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    refetchF();
    if (response.status === 200) {
      toast.success("Followed");

      const response = await axios.post("/notification", {
        title: follower?.[0]?.user_id.includes(userId) ? "follow" : "unfollow",
        message: follower?.[0]?.user_id.includes(userId)
          ? "you are followed"
          : "you are unfollowed",
        receiver: video.created_by_id,
      });

      if (response.status === 201) {
        console.log("notification sent");
      }

      refetchF();
    }
  };

  const handletoLike = async () => {
    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }
    const response = await axios.post(`/video/like/${videoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    refetch();
    refetchL();
    refetchL();
    if (response.status === 200) {
      toast.success("Liked");
      refetch();
      refetchL();
      refetchL();
    }
    refetchL();
  };

  const isLike = like?.[0]?.user_id?.includes(authId);
  const likeCount = like?.[0]?.user_id?.length;
  // React Query client instance
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch the rating data
  const { data: ratings } = useQuery<any>(
    ["rating", videoId],
    async () => {
      const response = await axios.get<any>(`/rating/${videoId}`);
      return response.data;
    },
    {
      enabled: !!videoId, // Ensure the query is only run when videoId is present
    }
  );

  useEffect(() => {
    if (ratings) {
      // get a list of user rating
      const userRating = ratings?.video?.ratings.find(
        (rating: any) => rating.userId === authId
      );

      console.log(userRating, "userRating");

      if (userRating) {
        setRating(userRating.rating);
      }
    }
  }, [ratings, authId]);

  // Set up local state for rating
  const [rating, setRating] = useState<number>(0);

  // Mutation for posting a new rating
  const postRating = async (newRating: number) => {
    return await axios.post(
      `/rating/${videoId}`,
      {
        rating: newRating,
        userId: authId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  // React Query mutation
  const { mutate } = useMutation(postRating, {
    onSuccess: () => {
      toast.success("Rating updated successfully");
      // Invalidate and refetch the rating data
      queryClient.invalidateQueries(["rating", videoId]);
      refetch();
    },
  });

  // Handle rating change
  const handleRatingChange = (newRating: number) => {
    if (!userId) {
      toast.error("Login before Voting ");
      router.push("/login");
    }
    setRating(newRating); // Update local state
    mutate(newRating); // Post the new rating
  };

  if (isLoading) {
    return <Loading className="h-screen flex items-center justify-center" />;
  }

  if (error) return <p>Error loading video</p>;

  const avgRating = ratings?.rating || 0;
  const displayRating = Number(avgRating.toFixed(1));

  const truncateDescription = (text: string, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const displayDuration = secondsToMinutes(video.duration);

  return (
    <main className="lg:pt-1 pt-20 pb-10">
      {/* Mobile design - Movie Card UI */}
      <div className="lg:hidden mx-auto px-0 max-w-md">
        <div className="">
          <VideoPlayer isMembership={isMembership} video={video} />

          {/* Title and heart icon */}
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="lg:text-2xl text-sm font-bold text-white">{video.title}</h1>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-white p-1"
              >
                <Heart className={cn("h-6 w-6", isFavorite ? "fill-white" : "")} />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                {video?.category?.[0]?.split(",")[0] || "Action"}
              </div>
              <div className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm">
                {displayDuration || "2:30 Hour"}
              </div>
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm">
                <span>{displayRating}</span>
                <Star className="h-4 w-4 fill-white" />
              </div>
              <ViewCounter count={video.views} />
            </div>

            {/* Profile with follow button - Mobile */}
            <div className="flex items-center justify-between bg-purple-900 bg-opacity-30 rounded-xl p-3">
              <Link
                href={`/profile/${video?.user}`}
                className="flex items-center gap-2 flex-1"
              >
                <Image
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover"
                  src={userprofile?.profilePic}
                  alt=""
                />
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{userprofile?.full_name}</div>
                  <div className="text-xs text-gray-400">
                    {follower?.[0]?.user_id.length || 0} followers
                  </div>
                </div>
              </Link>
              <button
                onClick={handletoFollow}
                className={cn(
                  "border-2 border-green-500 text-xs px-3 py-1.5 rounded-full duration-200 font-medium capitalize",
                  follower?.[0]?.user_id.includes(authId)
                    ? "bg-green-500 text-white"
                    : "bg-transparent text-green-500"
                )}
              >
                {follower?.[0]?.user_id.includes(authId) ? "Following" : "Follow"}
              </button>
            </div>

            {/* Description */}
            <DescriptionCard
              description={video.description || "This is a superhero film based on the Marvel Comics superhero team the Avengers. Produced by Marvel Studios and distributed by Walt Disney Studios."}
              maxLength={150}
              className="my-4"
            />
          </div>
        </div>

        {/* Additional sections for mobile */}
        <div className="mt-0">
          <VotePoll
            rating={rating}
            handleRatingChange={handleRatingChange}
            numberOfStars={Math.floor(displayRating)}
          />

          <div className="mt-6">
            <VideoComment videoId={video._id} />
          </div>

          <div className="mt-8">
            <CategoryList
              title={"Suggested for you"}
              desc={"POPULAR FILMS"}
            />
          </div>
        </div>
      </div>

      {/* Desktop design - keep existing layout */}
      <div className="hidden lg:block">
        <div className="pt-24">
          <VideoPlayer isMembership={isMembership} video={video} />
        </div>
        <div className="p-6">
          <div className="w-full mt-4 flex flex-row pb-3 justify-between items-center">
            <div className="w-full">
              <div className="flex items-center flex-row justify-between">
                <div className="">
                  <h3 className="text-xl font-bold">{video.title}</h3>
                </div>
                <div className="flex text-sm items-center flex-wrap gap-2">
                  {[
                    { label: "", value: <ViewCounter count={video.views} /> },
                    { label: "", value: video.certification },
                    { label: "", value: secondsToMinutes(video.duration) },
                    { label: "", value: video.language || "Tamil" },
                    { label: "", value: video?.category?.[0]?.split(",")[0] || "Short Film" },
                    { label: "", value: "Block Buster" }
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <div className="h-4 w-px bg-gray-600" />
                      )}
                      <div className={cn("px-2 py-1 rounded-md flex items-center",
                        typeof item.value !== "object" ? "bg-main" : "bg-transparent")}>
                        {item.label && <span className="mr-1">{item.label}</span>}
                        {item.value}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex items-center flex-row py-6 justify-between">
                <div className="flex items-center w-full justify-start gap-4">
                  <Link
                    href={`/profile/${video?.user}`}
                    className="flex items-center gap-3"
                  >
                    <Image
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      src={userprofile?.profilePic}
                      alt=""
                    />
                    <div>{userprofile?.full_name}</div>
                    <div className="font-medium dark:text-white">
                      <div className="card dark:text-gray-400">
                        {follower?.[0]?.user_id.length || 0}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={handletoFollow}
                    className={cn(
                      "border-2 border-green-500 flex-shrink-0 flex duration-300 justify-center gap-2 py-2 px-4 text-base items-center rounded-xl z-50 relative font-semibold capitalize",
                      follower?.[0]?.user_id.includes(authId)
                        ? " bg-green-500 text-white"
                        : "bg-transparent "
                    )}
                  >
                    {follower?.[0]?.user_id.includes(authId)
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
                <div className="w-[70%] !mt-0">
                  <VotePoll
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                    numberOfStars={Math.floor(displayRating)}
                  />
                </div>
              </div>
              <div className="border-t">
                <div className="w-full">
                  <div className="my-8">
                    <VideoComment videoId={video._id} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CategoryList langage={video.language || "Tamil"}
            title={"Suggested for you"}
            desc={"POPULAR FILMS"}
          />
        </div>
      </div>

    </main >
  );
}

const VOTE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const getNumberColor = (num: number) => {
  // Base gradient for all numbers with varying opacity based on value
  return `bg-gradient-to-r from-[#3a1a78] to-[#7b61ff] opacity-${Math.min(100, num * 10)}`;
};

function VotePoll({ numberOfStars, handleRatingChange, rating }: any) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(rating);
  const votes = numberOfStars;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLocked] = useState(true);

  const handleVote = (number: number) => {
    setIsAnimating(true);
    setSelectedNumber(number);
    handleRatingChange(number);

    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl space-y-4 rounded-xl bg-[rgba(25,28,51,0.5)] backdrop-blur-sm border border-[#292c41]/50 p-4 sm:p-6"
    >
      <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 bg-[rgba(123,97,255,0.2)] px-4 py-2 rounded-lg"
        >
          <h3 className="text-white font-medium">RATE THIS VIDEO</h3>
          <ChevronDown className="h-4 w-4 text-[#7b61ff]" />
        </motion.div>

        <div className="grid grid-cols-5 sm:grid-cols-10 w-full lg:w-auto gap-1.5">
          {VOTE_NUMBERS.map((number) => (
            <motion.button
              key={number}
              onClick={() => handleVote(number)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={selectedNumber === number && isAnimating ?
                { scale: [1, 1.2, 1], transition: { duration: 0.6 } } :
                {}}
              className={`
                h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center
                ${selectedNumber === number
                  ? `bg-gradient-to-r from-[#3a1a78] to-[#7b61ff] ring-2 ring-white/70 shadow-lg shadow-purple-900/30`
                  : `bg-[rgba(25,28,51,0.8)] hover:bg-[rgba(123,97,255,0.3)] text-gray-200`}
                transition-all duration-200
              `}
            >
              <span className="font-bold text-lg">{number}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff8a00] to-[#ff4d6d] rounded-lg text-white font-medium text-sm"
          >
            <span>EARN 50K VOTE SCRATCH</span>
            {isLocked && <Lock className="h-4 w-4" />}
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#7b61ff] font-medium bg-[rgba(123,97,255,0.1)] px-3 py-1 rounded-lg text-sm"
            >
              50,000/-
            </motion.span>
            <span className="text-gray-400 text-sm">
              {isLocked ? "Locked" : "Available"}
            </span>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#1a0733] to-[#2c1157] px-5 py-2.5 rounded-xl shadow-lg"
        >
          <span className="text-white font-bold">{votes?.toLocaleString() || 0}</span>
          <span className="text-gray-300 text-sm">VOTES</span>
        </motion.div>
      </div>

      {selectedNumber && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-3 border-t border-[#292c41]/50 mt-3"
        >
          <p className="text-center text-gray-300 text-sm">
            Thank you for rating this video! Your feedback helps creators improve their content.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
