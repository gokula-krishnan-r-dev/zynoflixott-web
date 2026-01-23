"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import Loading from "@/components/ui/loading";
import {
  isMonthMembershipCompleted,
  secondsToMinutes,
} from "@/lib/time";
import { isSubscriptionActive } from "@/lib/subscription";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authId, isLogin, userId } from "@/lib/user";
import { toast } from "sonner";
import Image from "next/image";
import { cn, formatNumber } from "@/lib/utils";
import VideoPlayer from "@/components/video/video-player";
import { ChevronDown, Copy, Heart, Lock, Play, PlayCircle, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoComment from "@/components/shared/video-comment";
import CategoryList from "@/components/shared/category-list";
import DescriptionCard from "@/components/ui/description-card";
import { motion } from "framer-motion";
import GiftPaymentContainer from "@/components/payment/GiftPaymentContainer";

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
  const { data: user, isLoading: userLoading, refetch: refetchUser } = useQuery(
    ["user", userId],
    async () => {
      const response = await axios.get(`/auth/user/${userId}`);
      return response.data.user;
    },
    {
      // Refetch user data when subscription might have changed
      refetchOnWindowFocus: true,
      staleTime: 0, // Always check for fresh subscription status
    }
  );

  // Separate query for subscription status - checks database directly using new optimized API
  const { data: subscriptionStatus, refetch: refetchSubscription } = useQuery(
    ["subscription-status", userId],
    async () => {
      const response = await axios.get('https://zynoflixott.com/api/subscription/check', {
        headers: {
          userId: userId || ''
        }
      });
      return response.data;
    },
    {
      enabled: !!userId,
      refetchOnWindowFocus: true,
      refetchInterval: 10000, // Check every 10 seconds for better responsiveness
      staleTime: 0,
    }
  );
  const { data: follower, refetch: refetchF } = useQuery(
    ["follower", videoId],
    async () => {
      const response = await axios.get(`/followers/${videoId}`);
      return response.data.followers;
    }
  );

  // Check subscription status - prioritize API subscription check, then user model, then old membership
  const hasSubscriptionFromAPI = subscriptionStatus?.hasSubscription || false;
  const hasSubscriptionFromUser = user?.subscription 
    ? isSubscriptionActive(user.subscription) 
    : false;
  const hasOldMembership = isMonthMembershipCompleted(
    user?.membershipId?.createdAt || new Date(-1)
  );

  console.log(user, "hasOldMembership");
  console.log(user?.isPremium, "user?.isPremium");
  
  // Final membership status - prioritize API check (most reliable)
  const isMembership = hasSubscriptionFromAPI || hasSubscriptionFromUser || user?.isPremium;
  
  // Debug log subscription status
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Subscription Status Check:', {
        hasSubscriptionFromAPI,
        hasSubscriptionFromUser,
        hasOldMembership,
        isPremium: user?.isPremium,
        isMembership,
        subscriptionFromAPI: subscriptionStatus?.subscription,
        subscriptionFromUser: user?.subscription,
        hasOriginalVideo: !!video?.original_video,
        subscriptionSource: subscriptionStatus?.subscriptionStatus?.source
      });
    }
  }, [hasSubscriptionFromAPI, hasSubscriptionFromUser, hasOldMembership, isMembership, user, video, subscriptionStatus]);

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


  const displayDuration = secondsToMinutes(video.duration);

  return (
    <main className="lg:pt-1 pt-20 pb-10">
      {/* Mobile design - Movie Card UI */}
      <div className="lg:hidden mx-auto px-0 max-w-2xl">
        <div className="relative">
          <VideoPlayer 
            isMembership={isMembership} 
            video={video}
            onSubscriptionSuccess={async () => {
              // Refetch both user data and subscription status after payment
              console.log('🔄 Refreshing subscription status after payment (mobile)...');
              await Promise.all([
                refetchUser(),
                refetchSubscription()
              ]);
              console.log('✅ Subscription status refreshed (mobile)');
            }}
          />
          <div className="h-[60vh] overflow-y-auto">
            {/* Fullscreen rotate button */}
            <Button
              onClick={() => {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen();
                }
              }}
              size="icon"
              variant="outline"
              className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm z-10 rounded-full p-2 h-auto w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 3 6 6m0-6h-6m6 0v6"></path>
                <path d="M9 21 3 15m0 6h6m-6 0v-6"></path>
                <rect width="12" height="7" x="6" y="8.5" rx="1"></rect>
              </svg>
            </Button>

            {/* Title and heart icon */}
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="lg:text-2xl text-sm font-bold text-white">{video.title}</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="text-white p-1"
                  >
                    <Heart className={cn("h-6 w-6", isFavorite ? "fill-white" : "")} />
                  </button>
                  <ShareVideoButton videoId={videoId} title={video.title} />
                </div>
              </div>

              {/* Video Stats - Mobile Professional UI */}
              <div className="mt-3 -mx-5 px-5 md:mx-0 md:px-0 flex flex-nowrap md:flex-wrap gap-1.5 md:gap-2 overflow-x-auto md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="stats-badge whitespace-nowrap flex-shrink-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-white border border-gray-700/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs">
                  <div className="bg-blue-500/20 p-0.5 md:p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <span className="font-medium">{video?.category?.[0]?.split(",")[0] || "Action"}</span>
                </div>

                <div className="stats-badge whitespace-nowrap flex-shrink-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-white border border-gray-700/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs">
                  <div className="bg-indigo-500/20 p-0.5 md:p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 md:w-3 md:h-3 text-indigo-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <span className="font-medium">{displayDuration || "2:30 Hour"}</span>
                </div>

                <div className="stats-badge whitespace-nowrap flex-shrink-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-white border border-gray-700/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs">
                  <div className="bg-yellow-500/20 p-0.5 md:p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="font-medium">{displayRating}</span>
                </div>

                <div className="stats-badge whitespace-nowrap flex-shrink-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-white border border-gray-700/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs">
                  <div className="bg-purple-500/20 p-0.5 md:p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-400"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </div>
                  <span className="font-medium">{formatViewCount(video.views)}</span>
                </div>
              </div>
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 whitespace-nowrap">

                  <button
                    onClick={() => router.push('/monetization')}
                    className="stats-badge bg-gradient-to-br from-emerald-600 to-green-500 text-white px-2 md:px-3 py-1.5 md:py-2.5 rounded-full shadow-sm flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs hover:brightness-110 flex-shrink-0"
                  >
                    <div className="bg-white/20 p-0.5 md:p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 md:w-3 md:h-3 text-white"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <span className="font-medium">Monetize</span>
                  </button>
                  <div className="flex-shrink-0">

                    <GiftPaymentContainer
                      videoId={video._id}
                      creatorId={video.created_by_id}
                      creatorName={userprofile?.full_name}
                      variant="mobile"
                      className=""
                    />
                  </div>
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
                    src={userprofile?.profilePic || "/images/default-company-logo.svg"}
                    alt={userprofile?.full_name || "ASR MOVIES"}
                  />
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">{userprofile?.full_name || "ASR MOVIES"}</div>
                    <div className="text-xs text-gray-400">
                      {/* {formatNumber(userprofile?.followingId?.length || 0, true)} */}
                      134K
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handletoFollow}
                  className={cn(
                    "border-2 border-green-500 text-xs px-3 py-1.5 rounded-full duration-200 font-medium capitalize",
                    follower?.[0]?.user_id?.includes(authId)
                      ? "bg-green-500 text-white"
                      : "bg-transparent text-green-500"
                  )}
                >
                  {follower?.[0]?.user_id?.includes(authId) ? "Following" : "Follow"}
                </button>
              </div>

              {/* Description */}
              <DescriptionCard
                description={video.description || "This is a superhero film based on the Marvel Comics superhero team the Avengers. Produced by Marvel Studios and distributed by Walt Disney Studios."}
                maxLength={150}
                className="my-4"
              />
            </div>
            <CategoryList langage={video.language || "Tamil"}
              title={"Suggested for you"}
              desc={"POPULAR FILMS"}
            />


            {/* Additional sections for mobile */}
            <div className="mt-0">
              <HeartPoll
                rating={rating}
                handleRatingChange={handleRatingChange}
                numberOfStars={Math.floor(displayRating)}
                videoTitle={video.title}
              />

              <div className="mt-6">
                <VideoComment videoId={video._id} />
              </div>


            </div>

          </div>
        </div>
      </div>

      {/* Desktop design - keep existing layout */}
      <div className="hidden lg:block">
        <div className="pt-24">
          <VideoPlayer 
            isMembership={isMembership} 
            video={video}
            onSubscriptionSuccess={async () => {
              // Refetch both user data and subscription status after payment
              console.log('🔄 Refreshing subscription status after payment (desktop)...');
              await Promise.all([
                refetchUser(),
                refetchSubscription()
              ]);
              console.log('✅ Subscription status refreshed (desktop)');
            }}
          />
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
                      <div className={cn("px-2 py-1 capitalize rounded-md flex items-center",
                        typeof item.value !== "object" ? "bg-main" : "bg-transparent")}>
                        {item.label && <span className="mr-1">{item.label}</span>}
                        {item.value}
                      </div>
                    </React.Fragment>
                  ))}
                  <ShareVideoButton videoId={videoId} title={video.title} />
                  <button
                    onClick={() => router.push('/monetization')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-md text-sm flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>Monetize Content</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  </button>
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
                        {formatNumber(userprofile?.followingId?.length || 0, true)}
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
                  <HeartPoll
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                    numberOfStars={Math.floor(displayRating)}
                    videoTitle={video.title}
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

          {/* Gift Payment - Desktop */}
          <div className="mt-8 mb-6">
            <GiftPaymentContainer
              videoId={video._id}
              creatorId={video.created_by_id}
              creatorName={userprofile?.full_name}
            />
          </div>

          {/* Video Stats - Desktop Professional UI */}
          <div className="flex-wrap lg:hidden flex gap-3 mt-3">
            <div className="stats-badge bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg transition-all">
              <div className="bg-blue-500/20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <span className="font-medium">{video?.category?.[0]?.split(",")[0] || "Action"}</span>
            </div>

            <div className="stats-badge bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg transition-all">
              <div className="bg-indigo-500/20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-indigo-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <span className="font-medium">{displayDuration || "2:30 Hour"}</span>
            </div>

            <div className="stats-badge bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg transition-all">
              <div className="bg-yellow-500/20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
              </div>
              <span className="font-medium">{displayRating}</span>
            </div>

            <div className="stats-badge bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg transition-all">
              <div className="bg-purple-500/20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <span className="font-medium">{formatViewCount(video.views)}</span>
            </div>

            <button
              onClick={() => router.push('/monetization')}
              className="stats-badge bg-gradient-to-br from-emerald-600 to-green-500 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:brightness-110 hover:shadow-lg transition-all"
            >
              <div className="bg-white/20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span className="font-medium">Monetize</span>
            </button>
          </div>
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