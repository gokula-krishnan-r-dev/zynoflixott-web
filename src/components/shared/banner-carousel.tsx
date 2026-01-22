"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "@/lib/axios";
import { useQuery } from "react-query";
import Loading from "../ui/loading";
import { Ivideo } from "../types/video";
import Link from "next/link";
import { Suspense, useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { ZYNOPROD } from "@/lib/config";

// Trending Section Component
function TrendingSection({ activeTab, setActiveTab, refetch }: { activeTab: string, setActiveTab: (tab: string) => void, refetch: () => void }) {
  const tabs = ["Popular", "Action", "Love", "Drama"];

  return (
    <div className="px-4 lg:px-12 lg:hidden block pt-4 lg:pt-8">
      <div className="text-[#cccdd2] px-3 py-2 bg-main rounded-full w-max text-sm lg:text-base"><Link href="/explore">Lets Explore</Link></div>
      <div className="flex justify-between items-center mt-1 mb-3">
        <div className="flex items-center">
          <h2 className="text-white text-xl lg:text-3xl font-bold uppercase tracking-wide">Trending</h2>
          <svg className="ml-2 w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* <Link href="/trending" className="text-[#cccdd2] text-sm lg:text-base hover:text-white transition">
          See All
        </Link> */}
      </div>
      <div className="flex space-x-4 duration-200 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full duration-200 text-sm lg:text-base font-medium whitespace-nowrap transition-all ${activeTab === tab
              ? " text-white"
              : " text-[#cccdd2] hover:bg-[rgba(25,28,51,0.8)]"
              }`}
            onClick={() => {
              setActiveTab(tab);
              refetch()
            }}
          >
            {activeTab === tab && (
              <span className="inline-block duration-200 w-2 h-2 bg-[#ff4d6d] rounded-full mr-2"></span>
            )}
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}


// Mock API function
const fetchBannerVideo = async () => {
  const response = await axios.get("/banner");
  if (response.status !== 200) {
    throw new Error("Error loading banner video");
  }
  return response.data;
};

// Optimized video component with progressive loading
function OptimizedBannerVideo({ video }: { video: Ivideo }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  // Set up intersection observer to load video only when in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setInView(entry.isIntersecting);

      if (entry.isIntersecting) {
        // When in view, try to play video after a short delay
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(err => console.error("Error playing video:", err));
          }
        }, 500);
      } else {
        // Pause when out of view
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    });

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Handle video loaded state
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    if (inView && videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing video:", err));
    }
  };

  // Handle poster loaded state
  const handlePosterLoaded = () => {
    setPosterLoaded(true);
  };

  return (
    <div ref={containerRef} className="relative w-full lg:mt-0 mt-0 lg:h-[650px] h-[280px] overflow-hidden">
      {/* Hidden poster preloader */}
      <Image
        src={ZYNOPROD + video.processedImages.medium.path}
        alt={video.title}
        fill
        className="hidden"
        onLoad={handlePosterLoaded}
        priority
      />

      {/* Visible poster image (shown while video loads) */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isVideoLoaded && isPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover object-center"
          priority
        />

        {/* Loading indicator shown on top of poster */}
        {!isVideoLoaded && inView && (
          <div className="absolute bottom-4 right-4 flex items-center bg-black/50 px-3 py-1 rounded-full">
            <div className="w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            <span className="text-white text-xs">Loading video...</span>
          </div>
        )}
      </div>

      {/* Video element - loaded progressively */}
      {inView && (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          loop
          muted
          poster={ZYNOPROD + video.processedImages.medium.path}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${isVideoLoaded && isPlaying ? 'opacity-100' : 'opacity-0'}`}
          controls={false}
          preload="auto"
          onLoadedData={handleVideoLoaded}
        >
          <source src={video.preview_video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

function BannerCarousel() {
  const [activeTab, setActiveTab] = useState("Popular");
  const { data, error, refetch, isLoading } = useQuery("banner", fetchBannerVideo);

  // Filter and randomize videos
  const filteredVideos = useMemo(() => {
    if (!data || !data.video) return [];

    // Filter videos based on active tab
    let filtered = data.video;
    if (activeTab !== "Popular") {
      filtered = data.video.filter((video: Ivideo) => {
        // Check if video categories include the active tab
        return video.category.some((cat: string) =>
          cat.toLowerCase().includes(activeTab.toLowerCase())
        );
      });
    }

    // If we don't have enough filtered videos, use all videos
    if (filtered.length < 6) {
      filtered = data.video;
    }

    // Randomize and limit to 6 videos
    return [...filtered]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }, [data, activeTab]);

  if (isLoading)
    return (
      <Loading className="flex items-center justify-center mx-auto h-screen w-full" />
    );
  if (error) return "An error has occurred: ";

  return (
    <>
      <TrendingSection refetch={refetch} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Carousel className="lg:h-[650px] lg:mt-0 mt-0 h-[280px] w-full">
        <CarouselContent>
          {filteredVideos.map((video: Ivideo, index: number) => (
            <CarouselItem key={index} className="">
              <div className="relative">
                <OptimizedBannerVideo video={video} />
                <div className="video-overlay"></div>
                <div className="absolute top-[60%] lg:top-[60%] left-3 lg:left-12 right-0 z-10">
                  <div className="">
                    <div className="lg:w-1/2 w-[80%]">
                      <div className="text-white">
                        <div className="flex items-center justify-between">
                          <h2 className="lg:text-4xl text-base title line-clamp-1 lg:line-clamp-1 font-bold">
                            {video.title}
                          </h2>
                          <button className="lg:hidden block p-2 rounded-full hover:bg-white/10 transition-colors">
                            <HeartSVG />
                          </button>
                        </div>

                        <div className="gap-2 capitalize text-base text-black flex items-center py-4">
                          <div className="border-cut bg-main px-4 py-4 text-white  w-max rounded-t-xl">
                            <span className="font-extrabold text-xs lg:text-xl">
                              {video.certification}
                            </span>
                          </div>
                          <span className="pl-2 text-white lg:text-base text-sm">
                            {video.language}
                          </span>
                          <span>|</span>
                          <span className="lg:text-base text-white text-sm">
                            {video.category[0].split(",")[0]}
                          </span>
                        </div>
                        {/* <p className="text-base text-white">
                          {video.description}
                        </p> */}

                        <Link
                          href={`/video/${video._id}`}
                          className="bg-main w-max lg:flex hidden font-bold text-white  items-center gap-2 rounded-xl lg:px-6 px-4 py-2 lg:py-3 mt-6"
                        >
                          <PlaySVG />
                          PLAY
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16 text-black" />
        <CarouselNext className="mr-16 text-black" />
      </Carousel>
    </>
  );
}

export function PlaySVG() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
          fill="#fff"
        ></path>{" "}
      </g>
    </svg>
  );
}

export function HeartSVG() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BannerCarousel;