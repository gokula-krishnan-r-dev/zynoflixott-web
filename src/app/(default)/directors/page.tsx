"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DirectorsCarousel from "@/components/shared/directors-carousel";

// Static data for directors who started with short films and became big filmmakers
export const directors = [
    {
        id: 1,
        name: "MR. RAM",
        image: "https://m.media-amazon.com/images/M/MV5BZTcxZmM4NmYtZjZlYy00YTlhLWFiNTYtODUzMmRiNWU2NTUzXkEyXkFqcGdeQXVyNDI3NjU1NzQ@._V1_.jpg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM SUPERMINT COMING SOON",
        path: "/profile/rajamouli"
    },
    {
        id: 2,
        name: "MR. KASHYAP",
        image: "https://img.etimg.com/thumb/msid-98546103,width-650,height-488,imgsize-44978,,resizemode-75/anurag-kashyap.jpg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM KENNEDY COMING SOON",
        path: "/profile/kashyap"
    },
    {
        id: 3,
        name: "MR. NOLAN",
        image: "https://variety.com/wp-content/uploads/2023/07/Christopher-Nolan.jpg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM PROJECT COMING SOON",
        path: "/profile/nolan"
    },
    {
        id: 4,
        name: "MR. CHAZELLE",
        image: "https://variety.com/wp-content/uploads/2022/12/damien-chazelle.jpg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM CONCEPT COMING SOON",
        path: "/profile/chazelle"
    },
    {
        id: 5,
        name: "MR. RATNAM",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Mani_Ratnam_at_IONIC_Rare_Ragas_by_Amaan_Ali_Khan_%26_Ayaan_Ali_Khan.jpg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM PONNIYIN SELVAN 3 COMING SOON",
        path: "/profile/ratnam"
    },
];

const DirectorsPage = () => {
    return (
        <div className="min-h-screen bg-[#1a0033] text-white pb-16">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-white">
                    Short Film Directors Turned Big Filmmakers
                </h1>

                <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                    These talented filmmakers started with small projects but created massive impact in the film industry.
                    Explore their journeys from short films to blockbuster cinema.
                </p>

                {/* Featured Directors Carousel */}
                <div className="mb-16">
                    <DirectorsCarousel
                        title="Featured Directors"
                        showAll={true}
                        className="bg-transparent px-0"
                    />
                </div>

                {/* Top Picks Carousel */}
                <div className="mb-16">
                    <DirectorsCarousel
                        title="Top Picks This Month"
                        displayCount={3}
                        className="bg-transparent px-0"
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