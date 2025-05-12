"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronRight, ExternalLink } from "lucide-react";

interface DirectorsCarouselProps {
    className?: string;
    showAll?: boolean;
    displayCount?: number;
    showViewAll?: boolean;
    title?: string;
}

const DirectorsCarousel = ({
    className,
    showAll = false,
    displayCount = 5,
    showViewAll = false,
    title = "Directors Spotlight"
}: DirectorsCarouselProps) => {
    // Use all directors or just the first few based on the props
    const displayDirectors = showAll
        ? directors
        : directors.slice(0, Math.min(displayCount, directors.length));

    return (
        <div className={cn("relative", className)}>
            {/* Section header with View All link */}
            {title && (
                <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-0">
                    <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
                    {showViewAll && (
                        <Link href="/directors" className="text-indigo-300 hover:text-indigo-200 flex items-center text-sm md:text-base">
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    )}
                </div>
            )}

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {displayDirectors.map((director) => (
                        <CarouselItem
                            key={director.id}
                            className="pl-2 md:pl-4 basis-[80%] xs:basis-[48%] sm:basis-1/3 md:basis-1/3 lg:basis-1/3 xl:basis-1/5"
                        >
                            <div className="group relative">
                                <div
                                    className="block"
                                >
                                    <div className="relative  rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
                                        {/* Image with overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 z-10"></div>

                                        <img
                                            src={director.image}
                                            alt={director.name}
                                            className="w-full object-cover"
                                        />

                                    </div>
                                </div>

                                {/* Read Article button */}
                                <div className="absolute bottom-3 left-0 w-full text-center z-30">
                                    <Link
                                        href="https://zynoflixcineworld.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                                    >
                                        Read Article
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation controls - shown on all screen sizes but styled differently */}
                <CarouselPrevious className="left-0 -translate-y-1/2 bg-indigo-700/80 hover:bg-indigo-700 border-0 text-white h-8 w-8 sm:h-10 sm:w-10 md:left-2" />
                <CarouselNext className="right-0 -translate-y-1/2 bg-indigo-700/80 hover:bg-indigo-700 border-0 text-white h-8 w-8 sm:h-10 sm:w-10 md:right-2" />
            </Carousel>

            {/* Mobile carousel indicators */}
            <div className="flex justify-center mt-4 space-x-1 sm:hidden">
                {displayDirectors.map((_, index) => (
                    <div key={index} className={`h-1.5 rounded-full ${index === 0 ? 'w-6 bg-indigo-500' : 'w-1.5 bg-gray-600'}`}></div>
                ))}
            </div>
        </div>
    );
};

export default DirectorsCarousel;


const directors = [
    {
        id: 1,
        name: "MR. RAM",
        image: "/images/photo.jpeg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM SUPERMINT COMING SOON",
        path: "/profile/rajamouli"
    },
    {
        id: 2,
        name: "MR. KASHYAP",
        image: "/images/photo5.jpeg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM KENNEDY COMING SOON",
        path: "/profile/kashyap"
    },
    {
        id: 3,
        name: "MR. NOLAN",
        image: "/images/photo2.jpeg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM PROJECT COMING SOON",
        path: "/profile/nolan"
    },
    {
        id: 4,
        name: "MR. CHAZELLE",
        image: "/images/photo3.jpeg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM CONCEPT COMING SOON",
        path: "/profile/chazelle"
    },
    {
        id: 5,
        name: "MR. RATNAM",
        image: "/images/photo5.jpeg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM PONNIYIN SELVAN 3 COMING SOON",
        path: "/profile/ratnam"
    },
    {
        id: 6,
        name: "MR. RATNAM",
        image: "/images/photo6.jpeg",
        company: "ANIMAL PICTURES",
        upcomingFilm: "NEW FILM PONNIYIN SELVAN 3 COMING SOON",
        path: "/profile/ratnam"
    }
];