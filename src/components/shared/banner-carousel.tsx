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
import { PathLink } from "@/lib/generate-aws-link";
import Link from "next/link";

// Mock API function
const fetchBannerVideo = async () => {
  const response = await axios.get("/banner");
  if (response.status !== 200) {
    throw new Error("Error loading banner video");
  }
  return response.data;
};

export function BannerCarousel() {
  const { data, error, isLoading } = useQuery("banner", fetchBannerVideo);

  if (isLoading)
    return (
      <Loading className="flex items-center justify-center mx-auto h-screen w-full" />
    );
  if (error) return "An error has occurred: ";

  return (
    <Carousel className="lg:h-[650px] h-[550px] w-full">
      <CarouselContent>
        {data.video.map((video: Ivideo, index: number) => (
          <CarouselItem key={index} className="">
            <div className="relative">
              <video
                preload="auto"
                playsInline
                autoPlay
                loop
                muted
                poster={PathLink(video.processedImages.medium.path)}
                width="320"
                className="w-full lg:h-[650px] h-[550px] aspect-auto object-cover"
                height="240"
                controls={false}
              >
                <source src={video.preview_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
              <div className="absolute top-[50%] lg:top-[45%] left-12 right-0">
                <div className="">
                  <div className="lg:w-1/2 w-[80%]">
                    <div className="text-white">
                      <h2 className="lg:text-4xl text-base title line-clamp-3 font-bold">
                        {video.title}
                      </h2>

                      <div className="gap-2 capitalize text-base text-black flex items-center py-4">
                        <div className="border-2 border-cut bg-[#00ffff] px-4 py-4 border-[#00ffff] w-max rounded-t-xl">
                          <span className="font-extrabold text-xs lg:text-xl">
                            {video.certification}
                          </span>
                        </div>
                        <span className="pl-2 text-white lg:text-base text-sm">
                          {video.language}
                        </span>
                        <span>|</span>
                        <span className="lg:text-base text-white text-sm">
                          {video.category}
                        </span>
                      </div>
                      {/* <p className="text-base text-white">
                        {video.description}
                      </p> */}

                      <Link
                        href={`/video/${video._id}`}
                        className="bg-[#00ffff] w-max font-bold text-black flex items-center gap-2 rounded-xl lg:px-6 px-4 py-2 lg:py-3 mt-6"
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
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
          fill="#000"
        ></path>{" "}
      </g>
    </svg>
  );
}
