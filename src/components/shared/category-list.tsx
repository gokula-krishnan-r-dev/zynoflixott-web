"use client";
import axios from "@/lib/axios";
import React from "react";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
const VideoCarousel = dynamic(() => import("../shared/video-scroll"));

const fetchCategories = async (langage: string) => {
  const response = await axios.get(`/videos?language=${langage}`);
  if (response.status !== 200) {
    throw new Error("Error loading categories");
  }

  return response.data.videos;
};

const CategoryList = ({ title, desc, langage, sectionType }: any) => {
  const { data, isLoading, error } = useQuery(["video", langage], () => fetchCategories(langage));
  if (isLoading) return <p>Loading...</p>;

  if (data.length === 0) return null;

  // Determine if this is a trending or featured section
  const isFeatured = sectionType === 'trending' || sectionType === 'featured';
  const isMainCategory = title === 'TRENDING' || title === 'COMING SOON' || title === 'BEST FOR KIDS';

  return (
    <div className="pt-0 md:pt-4">
      {/* Desktop view */}
      <div className="hidden sm:block">
        <div className="lg:pb-6 pb-0">
          <div className="flex items-center">
            <div className="h-6 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-3"></div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {title}
            </h2>
          </div>
          <p className="text-gray-400 text-sm mt-1 ml-4 tracking-wide">{desc}</p>
        </div>
      </div>

      {/* Mobile view with tabs (for main categories only) */}
      {isMainCategory && (
        <div className="sm:hidden pb-2">
          <div className="px-4">
            <h3 className="text-base text-gray-200 mb-1">Lets Explore</h3>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white uppercase">{title} {title === 'TRENDING' && <span className="inline-block ml-1">↗</span>}</h2>
              <Link href="/explore" className="text-sm text-purple-400">Let's Explore</Link>
            </div>
          </div>

          {title === 'TRENDING' && (
            <div className="mobile-tabs px-4 mt-2">
              <button className="mobile-tab active">Popular</button>
              <button className="mobile-tab">Action</button>
              <button className="mobile-tab">Love</button>
              <button className="mobile-tab">Drama</button>
            </div>
          )}
        </div>
      )}

      <VideoCarousel data={data} title={title} sectionType={sectionType} />
    </div>
  );
};

export default CategoryList;
