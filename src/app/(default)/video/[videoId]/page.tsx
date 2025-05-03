"use client";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import Loading from "@/components/ui/loading";
import {
  isMonthMembershipCompleted,
  secondsToMinutes,
} from "@/lib/time";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authId, isLogin, userId } from "@/lib/user";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/video/video-player";

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
  const { data: userprofile } = useQuery(["user", profileId], async () => {
    const response = await axios.get(`/auth/user/${profileId}`);
    return response.data.user;
  });

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

      // if (true) {
      //   setRating(ratings.rating);
      // }
    }
  }, [ratings, authId]);
  console.log(ratings, "ratings");

  // Set up local state for rating
  const [rating, setRating] = useState<number>(0);

  // Update local rating state when data is fetched

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
    return <div>Loading...</div>;
  }
  console.log(ratings, "ratings");

  const numberOfStars = Math.max(
    0,
    Math.min(5, Math.floor(ratings?.rating || 0))
  );
  // Use numberOfStars safely here, ensuring it's a valid number between 0 and 5

  if (isLoading)
    return <Loading className="h-screen flex items-center justify-center" />;

  if (error) return <p>Error: </p>;

  return (
    <main>
      <div className="pt-16 lg:pt-24">
        <VideoPlayer isMembership={isMembership}  video={video} />
      </div>
      <div className="lg:p-6 p-3">
        <div className="w-full mt-4 flex lg:flex-row flex-col pb-3 justify-between items-start lg:items-center">
          <div className="lg:w-full w-full">
            <div className="flex items-start space-y-2 lg:space-y-0 lg:items-center lg:flex-row flex-col justify-between">
              <div className="">
                <h3 className="lg:text-xl text-lg font-bold">{video.title}</h3>
              </div>
              <div className="flex lg:text-sm text-xs items-center flex-wrap gap-2 mt-2 lg:mt-0">
                {[
                  { label: "Views", value: video.views },
                  { label: "", value: video.certification },
                  { label: "", value: secondsToMinutes(video.duration) },
                  { label: "", value: video.language || "Tamil" },
                  { label: "", value: video?.category?.[0]?.split(",")[0] || "Short Film" },
                  { label: "", value: "Block Blaster" }
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <div className="hidden lg:block h-4 w-px bg-gray-600" />
                    )}
                    <div className="bg-main px-2 py-1 rounded-md flex items-center">
                      {item.label && <span className="mr-1">{item.label}:</span>}
                      <span>{item.value}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex items-center lg:flex-row flex-col py-6 justify-between">
              <div className="flex items-center w-full lg:justify-start justify-between gap-4">
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
                    "border-2 border-green-500 flex-shrink-0  lg:flex duration-300 justify-center gap-2 py-2 px-4 text-xs lg:text-base items-center rounded-full lg:rounded-xl  z-50 relative  font-semibold capitalize",
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
              <div className="lg:w-[70%] w-full">
                <VotePoll
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                  numberOfStars={numberOfStars}
                />
              </div>
            </div>
            <div className="border-t">
              <div className="w-full">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="px-4 w-full text-start py-6 bg-gray-900 my-5 rounded-3xl"
                >
                  <h2 className="uppercase text-sm lg:text-xl font-semibold">
                    Comment
                  </h2>
                </button>
                {isOpen && (
                  <div className="">
                    <VideoComment videoId={video._id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        <CategoryList
            title={"Suggested for you"}
            desc={"POPULAR TAMIL FILMS"}
          />
        {/* <div className="flex items-center lg:flex-row flex-col justify-start py-6 lg:justify-end">
          <div className="lg:pt-0 pt-4 lg:pb-0 pb-4">
            <Link
              href={isMembership ? "/membership" : "/profile"}
              className="lg:text-base capitalize border px-4 py-1.5 rounded-full text-sm font-semibold"
            >
              {isMembership
                ? "Watch Full Film"
                : "you watching a orginal video"}
            </Link>
          </div>
        </div> */}
        {/* <ProfileVideo
          refetch={refetch}
          userId={video.created_by_id}
          video={video}
          videoId={video?._id}
        /> */}
      </div>
    </main>
  );
}

import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoComment from "@/components/shared/video-comment";
import CategoryList from "@/components/shared/category-list";

const VOTE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const getNumberColor = (num: number) => {
  switch (num) {
    case 1:
      return "bg-red-500 hover:bg-red-600";
    case 2:
      return "bg-rose-500 hover:bg-rose-600";
    case 3:
      return "bg-orange-500 hover:bg-orange-600";
    case 4:
      return "bg-yellow-500 hover:bg-yellow-600";
    case 5:
      return "bg-lime-500 hover:bg-lime-600";
    case 6:
      return "bg-green-500 hover:bg-green-600";
    case 7:
      return "bg-emerald-500 hover:bg-emerald-600";
    case 8:
      return "bg-blue-500 hover:bg-blue-600";
    case 9:
      return "bg-indigo-500 hover:bg-indigo-600";
    case 10:
      return "bg-violet-500 hover:bg-violet-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

function VotePoll({ numberOfStars, handleRatingChange, rating }: any) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(rating);
  const votes = numberOfStars;
  const [isLocked] = useState(true);

  return (
    <div className="w-full max-w-5xl p-4 space-y-4 rounded-lg ">
      <div className="flex items-center lg:flex-row flex-col gap-6 justify-between">
        <Button
          variant="ghost"
          className=" text-white hover:bg-purple-800 hover:text-white px-6"
        >
          VOTE POLL
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>

        <div className="grid grid-cols-10 w-full gap-1">
          {VOTE_NUMBERS.map((number) => (
            <Button
              key={number}
              onClick={() => {
                setSelectedNumber(number);
                handleRatingChange(number);
              }}
              className={cn(
                "h-10 p-0 text-white font-medium",
                getNumberColor(number),
                selectedNumber === number && "ring-2 ring-white"
              )}
            >
              {number}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center lg:flex-row flex-col justify-between gap-2">
        <div className="flex items-center gap-3">
          <Button
            disabled
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium"
          >
            EARN 50K VOTE SCRATCH
          </Button>
          <Button
            disabled={isLocked}
            className="bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2"
          >
            50,000/-
            {isLocked && <Lock className="h-4 w-4" />}
          </Button>
          <span>Locked</span>
        </div>
        <div className="text-white bg-gray-700 rounded-xl px-4 py-2 font-medium">
          {votes.toLocaleString()} VOTES
        </div>
      </div>
    </div>
  );
}
