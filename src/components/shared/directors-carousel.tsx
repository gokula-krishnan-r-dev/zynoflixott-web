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
import { ChevronRight } from "lucide-react";

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
                            <Link
                                href={director.path}
                                className="group block"
                            >
                                <div className="relative bg-[#302269] rounded-lg aspect-[3/4] overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                    {/* ZYNOFLIXOTT at top */}
                                    <div className="absolute top-0 left-0 w-full text-center py-2 z-10">
                                        <p className="text-white text-xs font-medium uppercase tracking-wide">ZYNOFLIXOTT</p>
                                    </div>

                                    {/* Profile image with circular frame */}
                                    <div className="absolute top-[22%] sm:top-[25%] left-1/2 transform -translate-x-1/2 z-10">
                                        <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[3px] border-white flex items-center justify-center shadow-md">
                                            <Image
                                                src={director.image}
                                                alt={director.name}
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%234b0082'/%3E%3C/svg%3E";
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Director name */}
                                    <div className="absolute top-[50%] xs:top-[52%] left-0 w-full text-center z-10">
                                        <h3 className="text-white text-base xs:text-lg sm:text-lg md:text-xl font-bold px-1">{director.name}</h3>
                                    </div>

                                    {/* NEW FILM info */}
                                    <div className="absolute top-[60%] xs:top-[62%] left-0 w-full text-center px-2 xs:px-3 z-10">
                                        <p className="text-white text-xs font-medium">
                                            <span className="block">NEW FILM</span>
                                            <span className="block mt-1 text-xs xs:text-sm">
                                                {director.upcomingFilm.replace('NEW FILM ', '').replace(' COMING SOON', '')}
                                            </span>
                                            <span className="block mt-1">COMING SOON</span>
                                        </p>
                                    </div>

                                    {/* ANIMAL PICTURES at bottom */}
                                    <div className="absolute bottom-4 left-0 w-full text-center z-10">
                                        <p className="text-white text-xs font-bold">{director.company}</p>
                                    </div>
                                </div>
                            </Link>
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