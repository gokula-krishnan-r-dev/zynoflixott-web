"use client";
import axios from "@/lib/axios";
import React from "react";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
const VideoCarousel = dynamic(() => import("../shared/video-scroll"));

const fetchCategories = async () => {
  const response = await axios.get("/videos");
  if (response.status !== 200) {
    throw new Error("Error loading categories");
  }

  return response.data.videos;
};

const CategoryList = ({ title, desc }: any) => {
  const { data, isLoading, error } = useQuery("video", fetchCategories);
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="">
      <div className="">
        <div className="pb-8">
          <h2 className="lg:text-xl text-base font-semibold">{title}</h2>
          <p className="text-gray-600 text-sm">{desc}</p>
        </div>
        <VideoCarousel data={data} />
      </div>
    </div>
  );
};

export default CategoryList;
