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

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function VideoScroll({ data }: { data: Ivideo[] }) {
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

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {Array.isArray(shuffledVideos) &&
            shuffledVideos.map((video: Ivideo, index: number) => (
              <CarouselItem
                className="z-10 basis-auto transition-transform relative transform"
                key={index} // Use video.id instead of index for stable keys
              >
                <VideoCard video={video} index={index} />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="text-black ml-12" />
        <CarouselNext className="text-black mr-12" />
      </Carousel>
    </div>
  );
}
