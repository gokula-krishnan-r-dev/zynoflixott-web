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

// Language to flag emoji mapping
const LANGUAGE_TO_FLAG: Record<string, string> = {
  // English variants
  english: "🇬🇧",
  en: "🇬🇧",
  // Hindi
  hindi: "🇮🇳",
  hi: "🇮🇳",
  // Tamil
  tamil: "🇮🇳",
  ta: "🇮🇳",
  // Telugu
  telugu: "🇮🇳",
  te: "🇮🇳",
  // Malayalam
  malayalam: "🇮🇳",
  ml: "🇮🇳",
  // Kannada
  kannada: "🇮🇳",
  kn: "🇮🇳",
  // Spanish
  spanish: "🇪🇸",
  es: "🇪🇸",
  // Chinese
  chinese: "🇨🇳",
  zh: "🇨🇳",
  // Arabic
  arabic: "🇸🇦",
  ar: "🇸🇦",
  // French
  french: "🇫🇷",
  fr: "🇫🇷",
  // Russian
  russian: "🇷🇺",
  ru: "🇷🇺",
  // Portuguese
  portuguese: "🇵🇹",
  pt: "🇵🇹",
  // German
  german: "🇩🇪",
  de: "🇩🇪",
  // Japanese
  japanese: "🇯🇵",
  ja: "🇯🇵",
  // Korean
  korean: "🇰🇷",
  ko: "🇰🇷",
  // Italian
  italian: "🇮🇹",
  it: "🇮🇹",
  // Bengali
  bengali: "🇧🇩",
  bn: "🇧🇩",
  // Punjabi
  punjabi: "🇮🇳",
  pa: "🇮🇳",
  // Urdu
  urdu: "🇵🇰",
  ur: "🇵🇰",
  // Vietnamese
  vietnamese: "🇻🇳",
  vi: "🇻🇳",
  // Indonesian
  indonesian: "🇮🇩",
  id: "🇮🇩",
  // Turkish
  turkish: "🇹🇷",
  tr: "🇹🇷",
  // Persian/Farsi
  persian: "🇮🇷",
  farsi: "🇮🇷",
  fa: "🇮🇷",
};

/**
 * Get flag emoji for a given language
 * @param language - Language name or code (case-insensitive)
 * @returns Flag emoji string or default globe emoji
 */
const getFlagForLanguage = (language: string | number | undefined | null | any): string => {
  // Handle null, undefined, or falsy values
  if (!language) return "🌍";
  
  // Convert to string safely - handle numbers, objects, etc.
  let languageStr: string;
  
  if (typeof language === 'string') {
    languageStr = language;
  } else if (typeof language === 'number') {
    languageStr = String(language);
  } else if (typeof language === 'object' && language !== null) {
    // If it's an object, try to get a string representation
    languageStr = String(language);
  } else {
    languageStr = String(language);
  }
  
  // Normalize the language string
  const normalizedLang = languageStr.toLowerCase().trim();
  
  // Return early if empty after normalization
  if (!normalizedLang) return "🌍";
  
  // Direct match
  if (LANGUAGE_TO_FLAG[normalizedLang]) {
    return LANGUAGE_TO_FLAG[normalizedLang];
  }
  
  // Partial match (e.g., "English" contains "english")
  const match = Object.keys(LANGUAGE_TO_FLAG).find(
    (key) => normalizedLang.includes(key) || key.includes(normalizedLang)
  );
  
  return match ? LANGUAGE_TO_FLAG[match] : "🌍";
};

/**
 * Flag Icon Component - Displays country flag based on language
 */
const FlagIcon = ({ language }: { language: string | number | undefined | null | any }) => {
  const flagEmoji = getFlagForLanguage(language);
  
  // Safely convert language to string for display
  const languageDisplay = language 
    ? (typeof language === 'string' ? language : String(language))
    : "Unknown";
  
  return (
    <span 
      className="text-base lg:text-lg leading-none" 
      role="img" 
      aria-label={`${languageDisplay} language flag`}
      title={languageDisplay}
    >
      {flagEmoji}
    </span>
  );
};

// Trending Section Component
function TrendingSection({ activeTab, setActiveTab, refetch }: { activeTab: string, setActiveTab: (tab: string) => void, refetch: () => void }) {
  const tabs = ["Trending", "Action", "Love", "Drama"];

  return (
    <div className="px-4 lg:px-12 lg:hidden block pt-4 lg:pt-8 w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <Link href="/explore" className="flex items-center">
          <h2 className="text-white text-xl lg:text-xl font-bold uppercase bg-main px-4 py-2 rounded-xl tracking-wide">Let's Explore</h2>
        </Link>
      </div>
      <div className="flex space-x-3 duration-200 overflow-x-auto pb-2 no-scrollbar max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 lg:px-4 rounded-full duration-200 text-xs lg:text-base font-medium whitespace-nowrap transition-all flex items-center flex-shrink-0 ${activeTab === tab
              ? "bg-[#411567]  text-white"
              : "text-white hover:opacity-80"
              }`}
            onClick={() => {
              setActiveTab(tab);
              refetch()
            }}
          >
            {activeTab === tab && (
              <span className="w-2 h-2 bg-[#ff4d6d] rounded-full mr-2 inline-block"></span>
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
    <div ref={containerRef} className="relative w-full lg:mt-0 mt-0 lg:h-[650px] h-[280px] overflow-hidden max-w-full">
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
  const [activeTab, setActiveTab] = useState("Trending");
  const { data, error, refetch, isLoading } = useQuery("banner", fetchBannerVideo);

  // Filter and randomize videos
  const filteredVideos = useMemo(() => {
    if (!data || !data.video) return [];

    // Filter videos based on active tab
    let filtered = data.video;
    if (activeTab !== "Trending") {
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
      <div className="relative w-full overflow-hidden">
        <Carousel className="w-full lg:h-[650px] h-[280px]">
          <CarouselContent className="-ml-0">
            {filteredVideos.map((video: Ivideo, index: number) => (
              <CarouselItem key={index} className="pl-0 basis-full">
                <div className="relative w-full">
                  <OptimizedBannerVideo video={video} />
                  <div className="video-overlay"></div>
                  <div className="absolute bottom-4 lg:bottom-12 left-3 lg:left-12 right-3 lg:right-12 z-10">
                    <div className="flex items-end justify-between gap-2 lg:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-white mb-2 lg:mb-4">
                          <h2 className="lg:text-5xl text-xl font-bold mb-2 lg:mb-4 line-clamp-2">
                            {video.title}
                          </h2>
                          
                          <div className="flex items-center gap-2">
                            <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 lg:px-4 lg:py-2 rounded-full flex items-center gap-1.5 lg:gap-2">
                              <FlagIcon language={video.language} />
                              <span className="text-white capitalize text-[10px] lg:text-sm font-medium whitespace-nowrap">
                                {typeof video.language === 'string' 
                                  ? video.language 
                                  : video.language 
                                    ? String(video.language) 
                                    : 'Unknown'} | {video.category?.[0]?.split(",")[0] || "General"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="p-1.5 lg:p-3 rounded-full hover:bg-white/10 transition-colors flex-shrink-0">
                        <HeartSVG />
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 lg:left-4 bg-white/90 hover:bg-white border-2 border-gray-800 text-gray-800 w-8 h-8 lg:w-12 lg:h-12 z-20 hidden sm:flex" />
          <CarouselNext className="right-2 lg:right-4 bg-white/90 hover:bg-white border-2 border-gray-800 text-gray-800 w-8 h-8 lg:w-12 lg:h-12 z-20 hidden sm:flex" />
        </Carousel>
      </div>
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
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default BannerCarousel;