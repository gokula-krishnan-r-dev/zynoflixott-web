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

const CategoryList = () => {
  const { data, isLoading, error } = useQuery("video", fetchCategories);
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="">
      <div className="">
        <h2 className="lg:text-3xl text-xl pb-5 font-bold">Categories</h2>
        <VideoCarousel data={data} />
      </div>
    </div>
  );
};

export default CategoryList;
