"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { cn, formatNumber } from "@/lib/utils";
import VideoPlayer from "@/components/video/video-player";
import { ChevronDown, Copy, ExternalLink, Heart, Lock, Play, PlayCircle, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoComment from "@/components/shared/video-comment";
import CategoryList from "@/components/shared/category-list";
import DescriptionCard from "@/components/ui/description-card";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      className="stats-badge bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
    >
      <div className="bg-purple-500/20 p-1.5 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      <span className="font-medium">{formatViewCount(count)}</span>
    </motion.div>
  );
};

// Share video button component
const ShareVideoButton = ({ videoId, title }: { videoId: string, title: string }) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = `https://zynoflixott.com/video/${videoId}`;

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: <Copy className="h-4 w-4" />,
      action: () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setIsCopied(true);
          toast.success('Link copied to clipboard');
          setTimeout(() => setIsCopied(false), 2000);
        });
      }
    },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm shadow-md"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </motion.button>

      {isShareMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute z-50 top-full right-0 mt-2 w-48 bg-gradient-to-br from-[#232543] to-[#191c33] rounded-xl overflow-hidden shadow-xl border border-purple-900/40"
        >
          <div className="px-3 py-2 border-b border-purple-900/40">
            <h4 className="text-sm font-medium text-gray-200">Share via</h4>
          </div>
          <div className="p-2">
            {shareOptions.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: 'rgba(123, 97, 255, 0.2)' }}
                onClick={() => {
                  option.action();
                  setIsShareMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <span className="text-purple-400">{option.icon}</span>
                <span>{option.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
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

  const router = useRouter();

  // State to track sticky video player
  const [isVideoSticky, setIsVideoSticky] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Set up scroll tracking for sticky video
  useEffect(() => {
    const handleScroll = () => {
      if (videoContainerRef.current && contentRef.current) {
        const videoRect = videoContainerRef.current.getBoundingClientRect();
        if (videoRect.bottom < 20 && !isVideoSticky) {
          setIsVideoSticky(true);
        } else if (videoRect.bottom >= 20 && isVideoSticky) {
          setIsVideoSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVideoSticky]);

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
  const displayDuration = secondsToMinutes(video.duration);

  return (
    <main className="lg:pt-1 pt-16 pb-10 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen">
      {/* Sticky video player - visible when scrolling */}
      {isVideoSticky && (
        <div className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-sm shadow-xl border-b border-gray-800">
          <div className="flex items-center p-2">
            <div className="w-1/3 h-[80px] rounded-md overflow-hidden">
              <VideoPlayer isMembership={isMembership} video={video} miniPlayer={true} />
            </div>
            <div className="w-2/3 px-3">
              <h3 className="text-white font-medium text-sm line-clamp-1">{video.title}</h3>
              <div className="flex items-center mt-1">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs truncate">{userprofile?.full_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{formatViewCount(video.views)} views</span>
                    <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">{displayDuration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handletoLike}
                    className={cn(
                      "p-2 rounded-full",
                      isLike ? "text-red-500" : "text-gray-400"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", isLike ? "fill-current" : "")} />
                  </button>
                  <button
                    onClick={() => router.push(`/video/${videoId}`)}
                    className="p-2 text-blue-400"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto">
        {/* Video Container */}
        <div className="lg:px-4 px-0" ref={videoContainerRef}>
          <VideoPlayer isMembership={isMembership} video={video} />
        </div>

        {/* Content Container */}
        <div className="pt-3" ref={contentRef}>
          {/* Mobile Content */}
          <div className="lg:hidden">
            <div className="px-4 space-y-4">
              {/* Title and Share/Like */}
              <div className="flex justify-between items-start">
                <h1 className="text-lg font-bold text-white flex-1 pr-2">{video.title}</h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="rounded-full bg-gray-800/60 p-2.5"
                  >
                    <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-gray-300")} />
                  </button>
                  <ShareVideoButton videoId={videoId} title={video.title} />
                </div>
              </div>

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-2 pb-3 pt-1">
                <div className="flex items-center gap-1.5 bg-gray-800/60 px-3 py-1.5 rounded-full text-xs text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-purple-400">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>{formatViewCount(video.views)} views</span>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-800/60 px-3 py-1.5 rounded-full text-xs text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-blue-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{displayDuration}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-800/60 px-3 py-1.5 rounded-full text-xs text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-yellow-400">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{displayRating}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-800/60 px-3 py-1.5 rounded-full text-xs text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-indigo-400">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>{video?.category?.[0]?.split(",")[0] || "Action"}</span>
                </div>

                <Button
                  onClick={() => router.push('/monetization')}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full text-xs px-3 py-1.5 h-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
                    <line x1="12" x2="12" y1="2" y2="22"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Monetize
                </Button>
              </div>

              {/* Creator Profile Card */}
              <div className="p-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-900/30">
                <Link
                  href={`/profile/${video?.user}`}
                  className="flex items-center gap-3"
                >
                  <Image
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover border-2 border-purple-500"
                    src={userprofile?.profilePic || "https://via.placeholder.com/100"}
                    alt={userprofile?.full_name || "Creator"}
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base">{userprofile?.full_name}</h3>
                    <p className="text-gray-400 text-xs">
                      {formatNumber(userprofile?.followingId?.length || 0, true)} followers
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handletoFollow();
                    }}
                    className={cn(
                      "rounded-full px-4 h-9 text-sm",
                      follower?.[0]?.user_id.includes(authId)
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-transparent text-green-500 border-2 border-green-500 hover:bg-green-500/10"
                    )}
                  >
                    {follower?.[0]?.user_id.includes(authId) ? "Following" : "Follow"}
                  </Button>
                </Link>
              </div>

              {/* Description */}
              <DescriptionCard
                description={video.description || "This is a superhero film based on the Marvel Comics superhero team the Avengers. Produced by Marvel Studios and distributed by Walt Disney Studios."}
                maxLength={150}
                className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 p-3 rounded-xl border border-gray-700/30"
              />

              {/* Rating */}
              <div className="pt-2 pb-4">
                <HeartPoll
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                  numberOfStars={Math.floor(displayRating)}
                  videoTitle={video.title}
                />
              </div>

              {/* Comments */}
              <div className="pt-2 pb-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-indigo-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Comments
                </h3>
                <VideoComment videoId={video._id} />
              </div>

              {/* Suggested Videos */}
              <div className="pt-2 pb-6">
                <CategoryList
                  langage={video.language || "Tamil"}
                  title={"Suggested for you"}
                  desc={"POPULAR FILMS"}
                  className="pt-1"
                />
              </div>
            </div>
          </div>

          {/* Desktop Content */}
          <div className="hidden lg:block">
            {/* ...existing desktop layout... */}
          </div>
        </div>
      </div>
    </main>
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

const HEART_RATINGS = [1, 2, 3, 4, 5];

type HeartPollProps = {
  numberOfStars: number;
  handleRatingChange: (rating: number) => void;
  rating: number | null;
  videoTitle?: string;
};

function HeartPoll({ numberOfStars, handleRatingChange, rating, videoTitle }: HeartPollProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(rating);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const [showThankYou, setShowThankYou] = useState(Boolean(rating));
  const [activeTab, setActiveTab] = useState<'rate' | 'stats'>(rating ? 'stats' : 'rate');

  // Validation to prevent multiple ratings
  const [hasRated, setHasRated] = useState(Boolean(rating));

  // Calculate rating stats
  const formattedVotes = useMemo(() => {
    return numberOfStars ? numberOfStars.toLocaleString() : '0';
  }, [numberOfStars]);

  // Calculate percentage of current rating compared to all-time high
  const percentRating = useMemo(() => {
    return Math.min(100, Math.max(0, Math.round((selectedRating || 0) / 5 * 100)));
  }, [selectedRating]);

  useEffect(() => {
    // If user already has a rating, show stats first
    if (rating) {
      setActiveTab('stats');
      setShowThankYou(true);
    }
  }, [rating]);

  const handleRate = (heartRating: number) => {
    if (hasRated && selectedRating === heartRating) {
      // Toggle off the same rating
      setSelectedRating(null);
      setHasRated(false);
      handleRatingChange(0);
      setShowThankYou(false);
      return;
    }

    setIsAnimating(true);
    setSelectedRating(heartRating);
    setHasRated(true);

    // Convert 1-5 heart scale to 1-10 scale for API compatibility
    handleRatingChange(heartRating * 2);

    // Show thank you message
    setShowThankYou(true);

    // Switch to stats view after rating
    setTimeout(() => {
      setActiveTab('stats');
    }, 1500);

    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 700);
  };

  // Heart rating descriptions for better UX
  const ratingDescriptions = [
    "Not for me",
    "It's okay",
    "Good",
    "Great!",
    "Loved it!"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl space-y-4 rounded-xl bg-gradient-to-br from-[rgba(25,28,51,0.7)] to-[rgba(41,44,71,0.5)] backdrop-blur-sm border border-[#292c41]/50 p-0 sm:p-6 shadow-lg overflow-hidden"
    >
      {/* Header with tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-[#1E2033]/70 backdrop-blur-sm rounded-lg p-1">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(123,97,255,0.2)' }}
            onClick={() => setActiveTab('rate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'rate'
              ? 'bg-gradient-to-r from-[rgba(123,97,255,0.3)] to-[rgba(123,97,255,0.2)] text-white shadow-inner'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Rate
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(123,97,255,0.2)' }}
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'stats'
              ? 'bg-gradient-to-r from-[rgba(123,97,255,0.3)] to-[rgba(123,97,255,0.2)] text-white shadow-inner'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Stats
          </motion.button>
        </div>

        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#1a0733] to-[#2c1157] px-4 py-2 rounded-xl shadow-md border border-purple-900/30"
          >
            <span className="text-white font-bold">{formattedVotes}</span>
            <span className="text-gray-300 text-xs">HEARTS</span>
          </motion.div>
        </div>
      </div>

      {/* Rating UI Tab */}
      {activeTab === 'rate' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-1"
        >
          <h3 className="text-white font-medium text-center mb-4">How would you rate this video?</h3>

          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-3">
            {HEART_RATINGS.map((heartValue) => (
              <motion.button
                key={heartValue}
                onClick={() => handleRate(heartValue)}
                onMouseEnter={() => setIsHovering(heartValue)}
                onMouseLeave={() => setIsHovering(null)}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                animate={selectedRating === heartValue && isAnimating ?
                  { scale: [1, 1.4, 1], transition: { duration: 0.8 } } :
                  {}}
                className="relative flex items-center justify-center group"
                aria-label={`Rate ${heartValue} hearts`}
              >
                <Heart
                  className={`h-8 w-8 sm:h-11 sm:w-11 transition-all duration-300 
                    ${(selectedRating !== null && heartValue <= selectedRating)
                      ? "fill-red-500 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                      : (isHovering !== null && heartValue <= isHovering)
                        ? "fill-red-300 text-red-300"
                        : "text-gray-400 hover:text-red-300"
                    }`}
                />
                {/* Pulse animation for selected hearts */}
                {selectedRating !== null && heartValue <= selectedRating && (
                  <motion.span
                    initial={{ opacity: 0.7, scale: 1 }}
                    animate={{
                      opacity: [0.7, 0, 0],
                      scale: [1, 1.8, 2],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute inset-0 rounded-full bg-red-500/20"
                  />
                )}

                {/* Number below each heart */}
                <span className="absolute -bottom-6 text-xs font-medium text-gray-400">{heartValue}</span>
              </motion.button>
            ))}
          </div>

          {/* Rating description text */}
          <div className="h-8 mt-6">
            {isHovering && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-gray-300"
              >
                {ratingDescriptions[isHovering - 1]}
              </motion.p>
            )}
            {!isHovering && selectedRating && (
              <p className="text-sm font-medium text-gray-300">
                {ratingDescriptions[selectedRating - 1]}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Stats UI Tab */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-3"
        >
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-sm text-gray-400">Your Rating</span>
              <div className="flex items-center gap-2 mt-1">
                {selectedRating ? Array.from({ length: selectedRating }).map((_, i) => (
                  <Heart key={i} className="h-5 w-5 fill-red-500 text-red-500" />
                )) : (
                  <span className="text-gray-500 italic text-sm">Not rated yet</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedRating && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#7b61ff] to-[#5549c2] flex items-center justify-center ring-2 ring-[#7b61ff]/30 shadow-lg">
                    <span className="text-2xl font-bold text-white">{selectedRating}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">Your Score</span>
                </motion.div>
              )}

              <div className="flex flex-col items-center">
                <div className="w-full flex items-center gap-2">
                  <div className="h-4 w-full max-w-[120px] bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentRating}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-red-500 to-red-400"
                    />
                  </div>
                  <span className="text-xs text-gray-300">{percentRating}%</span>
                </div>
                <span className="text-xs text-gray-400 mt-1">Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Button to rate again */}
          {selectedRating && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('rate')}
              className="text-sm text-[#7b61ff] hover:text-[#9f8aff] transition-colors duration-200 mt-2"
            >
              Change your rating
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Thank you message with animation */}
      {showThankYou && hasRated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-3 border-t border-[#292c41]/50 mt-3"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-lg p-3 text-center"
          >
            <p className="text-center text-gray-200 text-sm">
              Thanks for rating {videoTitle && <span className="font-medium">"{videoTitle}"</span>} with {selectedRating} {selectedRating === 1 ? 'heart' : 'hearts'}!
              <br />
              <span className="text-xs text-gray-400">Your feedback helps creators improve their content.</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}