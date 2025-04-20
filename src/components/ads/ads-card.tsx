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
            "https://zynoflix.s3.ap-south-1.amazonaws.com/zynoflix-ott/1733575844428-%C3%A0%C2%A4%C2%AA%C3%A0%C2%A4%C2%BE%C3%A0%C2%A4%C2%82%C3%A0%C2%A4%C2%9A%C3%A0%C2%A4%C2%B5%C3%A0%C2%A4%C2%BE%C3%A0%C2%A4%C2%81+%C3%A0%C2%A4%C2%AA%C3%A0%C2%A4%C2%B0%C3%A0%C2%A4%C2%BE%C3%A0%C2%A4%C2%A0%C3%A0%C2%A4%C2%BE+-+%C3%A0%C2%A4%C2%AA%C3%A0%C2%A4%C2%A6%C3%A0%C2%A5%C2%8D%C3%A0%C2%A4%C2%AE%C3%A0%C2%A4%C2%B6%C3%A0%C2%A5%C2%8D%C3%A0%C2%A4%C2%B0%C3%A0%C2%A5%C2%80+%C3%A0%C2%A4%C2%A1%C3%A0%C2%A5%C2%89.+%C3%A0%C2%A4%C2%97%C3%A0%C2%A4%C2%BF%C3%A0%C2%A4%C2%B0%C3%A0%C2%A4%C2%BF%C3%A0%C2%A4%C2%B0%C3%A0%C2%A4%C2%BE%C3%A0%C2%A4%C2%9C+%C3%A0%C2%A4%C2%95%C3%A0%C2%A4%C2%BF%C3%A0%C2%A4%C2%B6%C3%A0%C2%A5%C2%8B%C3%A0%C2%A4%C2%B0+-+Award+winning+short+film+-+Panchva+Prantha+-+2024.mp4"
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AdsCard;
