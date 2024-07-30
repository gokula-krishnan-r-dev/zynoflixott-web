"use client";
import axios from "@/lib/axios";
import React from "react";
import { useQuery } from "react-query";
import Loading from "../ui/loading";
import Link from "next/link";
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

  return (
    <div>
      <Link href={data?.[0]?.link} className="">
        <video
          preload="auto"
          playsInline
          autoPlay
          loop
          poster={data[0]?.video}
          muted
          width="320"
          className="w-full h-[350px] rounded-3xl object-cover"
          height="240"
          controls={false}
        >
          <source src={data[0]?.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Link>
    </div>
  );
};

export default AdsCard;
