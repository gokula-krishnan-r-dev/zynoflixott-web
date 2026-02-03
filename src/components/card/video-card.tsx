import axios from "@/lib/axios";
import { videoRatio } from "@/lib/config";
import { isLogin } from "@/lib/user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { Heart, Play } from "lucide-react";

const fetchWatchLater = async () => {
  const response = await axios.get("/watch-later", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${typeof window !== "undefined" && localStorage.getItem("accessToken")
        }`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Error loading watch later list");
  }

  return response.data;
};

const VideoCard = ({ video, index, hiddenNew, isLarge = false }: any) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    data: watchLaterData,
    isLoading,
    refetch,
  } = useQuery("watch-later", fetchWatchLater);
  const router = useRouter();
  const handletoWatch = async (id: any) => {
    setIsAnimating(true);

    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }
    const video_id = id;
    const response = await axios.post(
      `/watch-later/${video_id}`,
      {
        video_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== "undefined" && localStorage.getItem("accessToken")
            }`,
        },
      }
    );
    if (response.status !== 200) {
      toast.error(" Login to add video to watch later list");
    }
    refetch();
    toast.success("Video added to watch later list");

    // Reset animation after a delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const language =
    typeof video?.language[0] === "string"
      ? video.language[0].split(",")[0]
      : "Unknown";

  const isLiked = watchLaterData?.some((item: any) => item.video_id === video._id);

  return (
    <>
      {/* Mobile view card */}
      <div className={`sm:hidden ${videoRatio} movie-card-mobile ${isLarge ? 'movie-card-large' : ''}`}>
        {/* Heart Button */}
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handletoWatch(video._id);
          }}
          className="absolute top-2 right-2 z-50"
        >
          <div className={`p-1.5 rounded-full ${isLiked ? 'bg-pink-500' : 'bg-black/50'} backdrop-blur-sm ${isAnimating ? 'scale-125' : ''} transition-all duration-300`}>
            <Heart
              className={`${isLiked ? 'heart-liked' : 'text-white'} ${isAnimating ? 'animate-ping' : ''}`}
              size={18}
              fill={isLiked ? "#ff4d6d" : "none"}
            />
          </div>
        </button> */}

        <Link href={`/video/${video?._id}`} className="block h-full">
          <div className="relative h-full">
            {/* Video/Image Container */}
            {hoveredIndex === index ? (
              <video
                preload="auto"
                playsInline
                autoPlay
                loop
                muted
                poster={video.thumbnail}
                className="h-full w-full object-cover"
                controls={false}
              >
                <source src={video.preview_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                className={`h-full w-full object-cover ${videoRatio}`}
                src={video.thumbnail}
                alt={video.title}
                fill

              />
            )}

            {/* Overlay with gradient */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20"></div> */}

            {/* Play button overlay that appears on hover */}
            <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
              <div className="bg-purple-600/80 p-2 rounded-full transform transition-transform duration-300 hover:scale-110">
                <Play fill="white" size={20} className="text-white" />
              </div>
            </div>

            {/* Title at bottom */}
            {/*  <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
              <h3 className="font-bold text-xs line-clamp-1">{video.title}</h3>
            </div>*/}
          </div>
        </Link>
      </div>

      {/* Desktop view card */}
      <div
        className="hidden sm:block"
        key={index}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className="h-auto rounded-3xl overflow-hidden shadow-lg">
          {/* Heart button with pulse effect */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handletoWatch(video._id);
            }}
            className="absolute top-3 right-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className={`p-2 rounded-full ${isLiked ? 'bg-pink-500 animate-pulse-glow' : 'bg-black/50'} backdrop-blur-sm ${isAnimating ? 'scale-125' : ''} transition-all duration-300`}>
              <Heart
                className={`${isLiked ? 'heart-liked' : 'text-white'} ${isAnimating ? 'animate-ping' : ''} transition-colors duration-300`}
                size={20}
                fill={isLiked ? "#ff4d6d" : "none"}
              />
            </div>
          </button>

          <Link href={`/video/${video?._id}`} className="block">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Video/Image Container */}
              <div className="relative">
                {hoveredIndex === index ? (
                  <video
                    preload="auto"
                    playsInline
                    autoPlay
                    loop
                    muted
                    poster={video.thumbnail}
                    className={cn("object-cover rounded-3xl shadow-md transform transition-transform duration-500", videoRatio)}
                    controls={false}
                  >
                    <source src={video.preview_video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    className={cn("rounded-3xl object-cover transform transition-all duration-500", videoRatio)}
                    src={video.thumbnail}
                    alt={video.title}
                    width={320}
                    height={180}
                  />
                )}

                {/* Overlay with gradient */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-70 rounded-3xl"></div> */}

                {/* Play button overlay that appears on hover */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <div className="bg-purple-600/80 p-3 rounded-full transform transition-transform duration-300 hover:scale-110 animate-pulse-glow">
                    <Play fill="white" size={24} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Title and info overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-bold text-sm line-clamp-1">{video.title}</h3>

                <div className="flex capitalize items-center space-x-2 text-xs mt-1 text-gray-300">
                  <span className="bg-purple-600/80 px-2 py-0.5 rounded-full text-white text-[10px] animate-shimmer">
                    {video.category ? (video.category[0]?.split(",")[0] || "Unknown") : "Unknown"}
                  </span>
                  <span>{language}</span>
                  <span>{video.certification}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default VideoCard;
