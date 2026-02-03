import dynamic from "next/dynamic";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Ivideo } from "../types/video";

import { cn } from "@/lib/utils";
const VideoCard = dynamic(() => import("@/components/card/video-card"));

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to get random interval between min and max
const getRandomInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function VideoScroll({ data, title = '', sectionType = '' }: { data: Ivideo[], title?: string, sectionType?: string }) {
  const [shuffledVideos, setShuffledVideos] = useState<Ivideo[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mobileScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [mobileScrollPosition, setMobileScrollPosition] = useState(0);

  // Handle carousel API initialization for desktop
  useEffect(() => {
    if (!api) return;

    // Setup auto-scrolling function
    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }

      // Set a random interval between 4-8 seconds for next scroll
      const randomInterval = getRandomInterval(4000, 8000);

      autoScrollIntervalRef.current = setInterval(() => {
        // if (!isPaused) {
        //   api.scrollNext();
        // }
        // Set a new random interval after each scroll
        if (autoScrollIntervalRef.current) {
          clearInterval(autoScrollIntervalRef.current);
          startAutoScroll();
        }
      }, randomInterval);
    };

    // Start the auto-scrolling
    startAutoScroll();

    // Cleanup on unmount
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [api, isPaused]);

  // Mobile auto-scrolling functionality
  useEffect(() => {
    if (!mobileContainerRef.current || shuffledVideos.length === 0) return;

    const startMobileAutoScroll = () => {
      if (mobileScrollIntervalRef.current) {
        clearInterval(mobileScrollIntervalRef.current);
      }

      const randomInterval = getRandomInterval(3000, 6000);

      mobileScrollIntervalRef.current = setInterval(() => {
        if (!isMobilePaused && mobileContainerRef.current) {
          const container = mobileContainerRef.current;
          const maxScroll = container.scrollWidth - container.clientWidth;

          // Calculate new scroll position
          let newScrollPosition = mobileScrollPosition + 200;

          // If we've reached the end, reset to beginning
          if (newScrollPosition >= maxScroll) {
            newScrollPosition = 0;
          }

          // Smooth scroll to new position
          container.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth'
          });

          setMobileScrollPosition(newScrollPosition);
        }
      }, randomInterval);
    };

    startMobileAutoScroll();

    return () => {
      if (mobileScrollIntervalRef.current) {
        clearInterval(mobileScrollIntervalRef.current);
      }
    };
  }, [shuffledVideos, isMobilePaused, mobileScrollPosition]);

  // Handle scroll position update when user manually scrolls
  const handleMobileScroll = () => {
    if (mobileContainerRef.current) {
      setMobileScrollPosition(mobileContainerRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    if (Array.isArray(data)) {
      setShuffledVideos(shuffleArray(data));

      // Re-shuffle every 30 seconds
      const shuffleInterval = setInterval(() => {
        setShuffledVideos(shuffleArray(data));
      }, 30000);

      return () => clearInterval(shuffleInterval);
    }
  }, [data]);

  // Check if we should use large cards (for featured content like "TRENDING")
  const isLargeSection = sectionType === 'trending' || sectionType === 'featured';

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleMobileTouch = () => {
    setIsMobilePaused(true);
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => setIsMobilePaused(false), 5000);
  };

  return (
    <div className="w-full mobile-section-spacing">
      {/* Mobile view */}
      <div className="sm:hidden">
        <div className="mobile-section-title">
          <p className="!text-sm font-bold lg:text-xl">{title || 'Recommended'}</p>
          <Link href="/explore" className="text-sm text-purple-400">Let's Explore</Link>
        </div>

        <div
          ref={mobileContainerRef}
          className="flex overflow-x-auto gap-3 pl-4 pr-4 pb-3 scrollbar-hide"
          onScroll={handleMobileScroll}
          onTouchStart={handleMobileTouch}
          onTouchEnd={() => setTimeout(() => setIsMobilePaused(false), 5000)}
        >
          {Array.isArray(shuffledVideos) &&
            shuffledVideos.map((video: Ivideo, index: number) => (
              <div key={index} className="flex-none">
                <VideoCard video={video} index={index} isLarge={isLargeSection} />
              </div>
            ))}
        </div>
      </div>

      {/* Desktop view with Carousel */}
      <div
        className="hidden sm:block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="px-2"
          setApi={setApi}
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {Array.isArray(shuffledVideos) &&
              shuffledVideos.map((video: Ivideo, index: number) => (
                <CarouselItem
                  className="pl-4 md:pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 transition-all duration-300 py-4"
                  key={index}
                >
                  <div className="transform transition-all duration-500 hover:z-10">
                    <VideoCard video={video} index={index} isLarge={isLargeSection} />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="text-white bg-purple-600/80 hover:bg-purple-700 border-none -left-4 hover:scale-110 transition-transform" />
            <CarouselNext className="text-white bg-purple-600/80 hover:bg-purple-700 border-none -right-4 hover:scale-110 transition-transform" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
