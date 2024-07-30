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

function VideoCarousel({
  data,
  className,
}: {
  data: Ivideo[];
  className?: string;
}) {
  if (!data) return <p>No data</p>;

  return (
    <Carousel className={cn(className, "w-full max-w-[91vw] lg:max-w-[94vw]")}>
      <CarouselContent className="">
        {Array.isArray(data) &&
          data?.map((video: Ivideo, index: number) => (
            <CarouselItem
              className="z-10  basis-auto transition-transform relative transform"
              key={index}
            >
              <VideoCard video={video} index={index} />
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12 text-black" />
      <CarouselNext className="mr-12 text-black" />
    </Carousel>
  );
}

export default VideoCarousel;
