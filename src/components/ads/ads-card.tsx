"use client";
import axios from "@/lib/axios";
import React from "react";
import { useQuery } from "react-query";
import Loading from "../ui/loading";
import Link from "next/link";
import { cn } from "@/lib/utils";
const AdsCard = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const response = await axios.get(`/ads`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      return data;
    },
  });

  if (isLoading) return <Loading />;

  if (error) return <div>Something went wrong</div>;

  return (
    <div>
      <video
        preload="auto"
        playsInline
        autoPlay
        loop
        muted
        className={cn("object-cover rounded-xl w-full h-[450px] ")}
        controls={false}
      >
        <source
          src={
            "/ads.mp4"
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AdsCard;
