"use client";
import axios from "@/lib/axios";
import React from "react";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
const VideoCarousel = dynamic(() => import("../shared/video-scroll"));

const fetchCategories = async (langage: string) => {
  const response = await axios.get(`/videos?language=${langage}`);
  if (response.status !== 200) {
    throw new Error("Error loading categories");
  }

  return response.data.videos;
};

const CategoryList = ({ title, desc, langage }: any) => {
  const { data, isLoading, error } = useQuery(["video", langage], () => fetchCategories(langage));
  if (isLoading) return <p>Loading...</p>;

  if (data.length === 0) return null;

  return (
    <div className="pt-4">
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
