"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DirectorsCarousel from "@/components/shared/directors-carousel";

// Do not export this - we'll use directors from the carousel component instead
const DirectorsPage = () => {
    return (
        <div className="min-h-screen bg-[#1a0033] text-white pb-16">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-white">
                    Short Film Directors Showcase
                </h1>

                <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                    Discover talented filmmakers who started with small projects and made a massive impact in the film industry.
                </p>

                {/* Dynamic Directors Carousel */}
                <div className="mb-16">
                    <DirectorsCarousel
                        title="Featured Directors"
                        showAll={true}
                        className="bg-transparent px-0"
                        showViewAll={false}
                    />
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-[#2b1161] rounded-lg p-8 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Begin Your Filmmaking Journey</h3>
                        <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                            Inspired by these filmmakers? Upload your short film today and begin your journey to success.
                        </p>
                        <Link href="/video-upload" className="inline-flex items-center px-6 py-3 rounded-full bg-[#4c2a9e] hover:bg-[#5f35c0] text-white font-medium transition-all">
                            Upload Your Short Film
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorsPage; 