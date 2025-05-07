import dynamic from "next/dynamic";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Ivideo } from "../types/video";

import { cn } from "@/lib/utils";
const VideoCard = dynamic(() => import("@/components/card/video-card"));

import { useEffect, useState } from "react";
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

export default function VideoScroll({ data, title = '', sectionType = '' }: { data: Ivideo[], title?: string, sectionType?: string }) {
  const [shuffledVideos, setShuffledVideos] = useState<Ivideo[]>([]);

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

  return (
    <div className="w-full mobile-section-spacing">
      {/* Mobile view */}
      <div className="sm:hidden">
        <div className="mobile-section-title">
          <h2>{title || 'Recommended'}</h2>
          <Link href="/explore" className="text-sm text-purple-400">Let's Explore</Link>
        </div>

        <div className="flex overflow-x-auto gap-3 pl-4 pr-4 pb-3 scrollbar-hide">
          {Array.isArray(shuffledVideos) &&
            shuffledVideos.map((video: Ivideo, index: number) => (
              <div key={index} className="flex-none">
                <VideoCard video={video} index={index} isLarge={isLargeSection} />
              </div>
            ))}
        </div>
      </div>

      {/* Desktop view with Carousel */}
      <div className="hidden sm:block">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="px-2"
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
