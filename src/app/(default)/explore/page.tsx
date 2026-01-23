"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "@/lib/axios";
import { useQuery } from "react-query";
import Image from "next/image";
import Link from "next/link";
import { ZYNOPROD } from "@/lib/config";
import { Ivideo } from "@/components/types/video";
import Loading from "@/components/ui/loading";
import { debounce } from "lodash";
import DescriptionCard from "@/components/ui/description-card";
import { Play, Search, Filter, X, Star, Clock, Eye, ChevronDown, TrendingUp, Award, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fetch all videos
const fetchAllVideos = async () => {
    const response = await axios.get("/videos");
    if (response.status !== 200) {
        throw new Error("Failed to fetch videos");
    }
    return response.data;
};

// Video card component with optimized hover video
const VideoCard = ({ video }: { video: Ivideo }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Format video duration
    const formatDuration = (duration: string) => {
        const minutes = Math.floor(parseInt(duration || "0") / 60);
        return minutes > 60
            ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
            : `${minutes}m`;
    };

    // Extract year from createdAt or use a default
    const year = video.createdAt ? new Date(video.createdAt).getFullYear() : "2023";

    // Handle mouse enter to preload video
    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play()
                .then(() => {
                    setIsVideoPlaying(true);
                })
                .catch(err => console.error("Error playing video:", err));
        }
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsVideoPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    // Handle video loaded state
    const handleVideoLoaded = () => {
        setIsVideoLoaded(true);
    };

    return (
        <div
            ref={cardRef}
            className="group relative overflow-hidden rounded-lg transition-all duration-500"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={"/video/" + video._id} className="block">
                <div className="aspect-video relative w-full rounded-xl bg-[#6021b1]">
                    {/* Thumbnail */}
                    <div className={`absolute inset-0 overflow-hidden rounded-lg transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}>
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover transform transition-transform duration-700"
                            loading="lazy"
                        />
                    </div>

                    {/* Video element */}
                    {isHovered && (
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
                            <video
                                ref={videoRef}
                                playsInline
                                muted
                                loop
                                preload="metadata"
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                                poster={video.thumbnail}
                                onLoadedData={handleVideoLoaded}
                            >
                                <source src={video.preview_video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    {/* Duration badge */}
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black/70 text-white text-[10px] sm:text-xs px-1 py-0.5 rounded-sm backdrop-blur-sm flex items-center space-x-0.5 sm:space-x-1">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{formatDuration(video.duration)}</span>
                    </div>

                    {/* Category pill */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                        <span className="text-[10px] sm:text-xs text-white bg-[#7b61ff]/80 backdrop-blur-sm rounded-sm px-1.5 py-0.5 font-medium">
                            {video.category[0]?.split(",")[0] || "Unknown"}
                        </span>
                    </div>

                    {/* Title and info at bottom */}
                    {/* <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-10 transform transition-transform duration-300 group-hover:translate-y-0">
                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow-md">
                            {video.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-300">
                            <span>{video.language}</span>
                            <span className="flex items-center">
                                <Star className="w-2.5 h-2.5 text-yellow-500 mr-0.5" fill="currentColor" />
                                {(Math.random() * 2 + 7).toFixed(1)}
                            </span>
                        </div>
                    </div> */}

                    {/* Play button overlay - smaller on mobile */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#ff4d6d]/80 backdrop-blur-sm flex items-center justify-center transform transition-transform duration-300 scale-75 group-hover:scale-100 hover:scale-110 hover:bg-[#ff4d6d]">
                            <Play fill="white" size={16} className="text-white ml-0.5" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

// Auto-scrolling carousel component
const AutoScrollCarousel = ({ videos }: { videos: Ivideo[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const totalVideos = videos.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % totalVideos);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [totalVideos]);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: activeIndex * carouselRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };

    if (!videos.length) return null;

    return (
        <div className="relative overflow-hidden rounded-xl">
            {/* Main carousel */}
            <div
                ref={carouselRef}
                className="flex snap-x snap-mandatory overflow-x-hidden scroll-smooth"
                style={{ scrollbarWidth: 'none' }}
            >
                {videos.map((video, index) => (
                    <div
                        key={String(video._id.$oid || video._id)}
                        className="flex-none w-full snap-center"
                    >
                        <div className="relative aspect-[21/9] sm:aspect-[21/9] xs:aspect-[16/9]">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10 z-10">
                                <div className="flex items-start gap-4">
                                    {/* Left: Video Thumbnail with Play - only on tablets and up */}
                                    <div className="relative flex-none hidden sm:block w-40 h-24 lg:w-64 lg:h-36 rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl">
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-[#ff4d6d]/90 flex items-center justify-center">
                                                <Play fill="white" size={16} className="text-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Text Content */}
                                    <div className="flex-1">
                                        {/* Mobile optimized title size */}
                                        <div className="sm:block hidden">
                                            <h1 className="text-xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                                                {video.title.split('').map((char, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-block animate-fadeIn opacity-0"
                                                        style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'forwards' }}
                                                    >
                                                        {char === ' ' ? '\u00A0' : char}
                                                    </span>
                                                ))}
                                            </h1>
                                        </div>

                                        {/* Mobile title - simplified without animation for performance */}
                                        <div className="sm:hidden block">
                                            <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                                                {video.title}
                                            </h2>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                                            <span className="text-[10px] sm:text-xs text-white bg-[#7b61ff]/80 backdrop-blur-sm rounded-sm px-2 py-0.5 font-medium">
                                                {video.category[0]?.split(",")[0] || "Drama"}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-200 bg-black/60 backdrop-blur-sm rounded-sm px-2 py-0.5">
                                                {video.language}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-200 bg-black/60 backdrop-blur-sm rounded-sm px-2 py-0.5 flex items-center">
                                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500 mr-1" fill="currentColor" />
                                                {(Math.random() * 2 + 7).toFixed(1)}
                                            </span>
                                        </div>
                                        <p className="hidden sm:block text-gray-300 text-sm lg:text-base mb-4 line-clamp-2 max-w-2xl">
                                            {video.description || "Experience this captivating film that explores themes of human connection through stunning cinematography and powerful performances."}
                                        </p>
                                        <Link
                                            href={`/video/${video._id}`}
                                            className="inline-flex items-center text-[10px] sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-[#ff4d6d] hover:bg-[#ff3a5f] text-white rounded-md font-medium transition-colors"
                                        >
                                            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="white" /> Watch
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center gap-1 sm:gap-2">
                {videos.map((_, index) => (
                    <button
                        key={index}
                        className={`w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full transition-all ${index === activeIndex
                            ? 'bg-[#ff4d6d] w-4 sm:w-8'
                            : 'bg-white/50 hover:bg-white/80'
                            }`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation arrows - hidden on smallest screens */}
            <button
                className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 p-1 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden xs:flex items-center justify-center"
                onClick={() => setActiveIndex((prevIndex) => (prevIndex - 1 + totalVideos) % totalVideos)}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <button
                className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 p-1 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden xs:flex items-center justify-center"
                onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % totalVideos)}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};

// Enhance horizontal category with auto-scroll - mobile optimized
const HorizontalCategory = ({ title, icon, videos = [] }: { title: string, icon: React.ReactNode, videos: Ivideo[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);

    // Auto-scroll function
    useEffect(() => {
        if (!scrollRef.current || !isAutoScrolling || videos.length <= 4) return;

        let scrollAmount = 1;
        let scrollDirection = 1;
        let timeout: NodeJS.Timeout;

        const autoScroll = () => {
            if (!scrollRef.current) return;

            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // Change direction if reached the end
            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                scrollDirection = -1;
            } else if (scrollLeft <= 10) {
                scrollDirection = 1;
            }

            scrollRef.current.scrollLeft += scrollAmount * scrollDirection;

            timeout = setTimeout(autoScroll, 30);
        };

        timeout = setTimeout(autoScroll, 2000); // Start after 2 seconds

        return () => {
            clearTimeout(timeout);
        };
    }, [isAutoScrolling, videos.length]);

    // Pause auto-scroll on mouse enter
    const handleMouseEnter = () => {
        setIsAutoScrolling(false);
    };

    // Resume auto-scroll on mouse leave
    const handleMouseLeave = () => {
        setIsAutoScrolling(true);
    };

    // Manual scroll function
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.clientWidth / 1.5 : current.clientWidth / 1.5;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-[#7b61ff]/20 text-[#7b61ff]">
                        {icon}
                    </div>
                    <h2 className="text-base sm:text-xl font-bold text-white">{title}</h2>
                </div>
                <div className="flex gap-1 sm:gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 sm:p-2 rounded-full bg-[#292c41]/50 text-white hover:bg-[#292c41] transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 sm:p-2 rounded-full bg-[#292c41]/50 text-white hover:bg-[#292c41] transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {videos.map((video, index) => (
                        <div
                            key={String(video._id.$oid || video._id)}
                            className="flex-none w-[160px] xs:w-[200px] sm:w-[280px] snap-start transition-transform duration-300 hover:-translate-y-1"
                        >
                            <VideoCard video={video} />
                        </div>
                    ))}
                </div>

                {/* Left gradient fade */}
                <div className="absolute top-0 bottom-4 left-0 w-8 sm:w-12 bg-gradient-to-r from-[#1a0733] to-transparent pointer-events-none"></div>

                {/* Right gradient fade */}
                <div className="absolute top-0 bottom-4 right-0 w-8 sm:w-12 bg-gradient-to-l from-[#1a0733] to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

// Main explore page component
export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [popularFilters, setPopularFilters] = useState(['Recent', 'Trending', 'Award Winning']);
    const [activeFilter, setActiveFilter] = useState('Recent');

    const { data, isLoading, error, refetch } = useQuery("allVideos", fetchAllVideos);

    const debouncedRefetch = useCallback(
        debounce(() => {
            refetch();
        }, 500),
        [refetch]
    );

    useEffect(() => {
        debouncedRefetch();
        return () => {
            debouncedRefetch.cancel();
        };
    }, [searchTerm, debouncedRefetch]);

    // Extract categories and languages
    const categories = data?.videos
        ? ["All", ...Array.from(new Set(data.videos.flatMap((video: Ivideo) => video.category))).map(cat => String(cat))]
        : ["All"];

    const languages = data?.videos
        ? ["All", ...Array.from(new Set(data.videos.map((video: Ivideo) => video.language))).map(lang => String(lang))]
        : ["All"];

    // Filter videos
    const filteredVideos = data?.videos
        ? data.videos.filter((video: Ivideo) => {
            const matchesSearch = searchTerm === "" ||
                video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === "All" ||
                video.category.some(cat => cat === selectedCategory);

            const matchesLanguage = selectedLanguage === "All" ||
                video.language === selectedLanguage;

            return matchesSearch && matchesCategory && matchesLanguage;
        })
        : [];

    // Choose a featured film (first one or random)
    const featuredFilm = filteredVideos.length > 0 ? filteredVideos[0] : null;

    // Create category groupings
    const trendingFilms = filteredVideos.slice(0, 10);
    const awardWinningFilms = [...filteredVideos].sort(() => 0.5 - Math.random()).slice(0, 10);
    const newReleasesFilms = [...filteredVideos].sort(() => 0.5 - Math.random()).slice(0, 10);

    // CSS class for custom glow effect
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .hover\\:shadow-glow:hover {
                box-shadow: 0 0 25px rgba(123, 97, 255, 0.3);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .animate-fadeIn {
                animation: fadeIn 0.5s ease-in-out;
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-slideUp {
                animation: slideUp 0.5s ease-out;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0733] to-[#2c1157]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#7b61ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading amazing content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0733] to-[#2c1157] p-4">
                <div className="text-center max-w-md p-8 rounded-xl bg-[#2c1157]/50 backdrop-blur-lg">
                    <div className="text-5xl mb-4">😢</div>
                    <h3 className="text-2xl text-white font-bold mb-2">Something went wrong</h3>
                    <p className="text-gray-300 mb-6">We couldn't load the videos at this time. Please try again later.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 bg-[#7b61ff] text-white rounded-full hover:bg-[#6c52ee] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-br from-[#1a0733] to-[#2c1157]">
            {/* Main content area */}
            <div className="pt-2 sm:pt-8 px-3 sm:px-4 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Auto-scrolling Featured Films Carousel */}
                    <div className="mb-8 sm:mb-16">
                        <h2 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-6 flex items-center">
                            <span className="mr-2 p-1 sm:p-1.5 bg-[#ff4d6d] rounded-md">
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
                            </span>
                            Featured Films
                        </h2>

                        <AutoScrollCarousel videos={filteredVideos.slice(0, 6)} />
                    </div>

                    {/* Advanced Filters panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl bg-[rgba(25,28,51,0.5)] backdrop-blur-lg border border-[#292c41]/50 animate-slideUp">
                                <div className="flex justify-between items-center mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-bold text-white">Filters</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="p-1 rounded-full bg-[#292c41]/50 text-white hover:bg-[#292c41] transition-colors"
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Category Filter */}
                                    <div>
                                        <h3 className="text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">Categories</h3>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {categories.slice(0, 8).map((category: string) => (
                                                <button
                                                    key={category}
                                                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap transition-all ${selectedCategory === category
                                                        ? "bg-[#7b61ff] text-white"
                                                        : "bg-[rgba(25,28,51,0.6)] text-[#cccdd2] hover:bg-[rgba(25,28,51,0.8)]"
                                                        }`}
                                                    onClick={() => setSelectedCategory(category)}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language Filter */}
                                    <div>
                                        <h3 className="text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">Languages</h3>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {languages.slice(0, 8).map((language: string) => (
                                                <button
                                                    key={language}
                                                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap transition-all ${selectedLanguage === language
                                                        ? "bg-[#7b61ff] text-white"
                                                        : "bg-[rgba(25,28,51,0.6)] text-[#cccdd2] hover:bg-[rgba(25,28,51,0.8)]"
                                                        }`}
                                                    onClick={() => setSelectedLanguage(language)}
                                                >
                                                    {language}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {(selectedCategory !== "All" || selectedLanguage !== "All" || searchTerm !== "") && (
                                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#292c41]/50 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("All");
                                                setSelectedLanguage("All");
                                                setSearchTerm("");
                                            }}
                                            className="flex items-center text-xs sm:text-sm text-gray-300 hover:text-white"
                                        >
                                            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            Clear filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Horizontal scroll categories */}
                    <HorizontalCategory
                        title="Trending Now"
                        icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
                        videos={trendingFilms}
                    />

                    <HorizontalCategory
                        title="Award Winners"
                        icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                        videos={awardWinningFilms}
                    />

                    <HorizontalCategory
                        title="New Releases"
                        icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
                        videos={newReleasesFilms}
                    />

                    {/* All Films Grid */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center">
                                <h2 className="text-base sm:text-xl font-bold text-white mr-2 sm:mr-3">All Films</h2>
                                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-md bg-[#7b61ff]/30 text-[#7b61ff]">
                                    {filteredVideos.length}
                                </span>
                            </div>
                        </div>

                        {filteredVideos.length > 0 ? (
                            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                {filteredVideos.map((video: Ivideo) => (
                                    <VideoCard key={String(video._id.$oid || video._id)} video={video} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-16 rounded-xl bg-[rgba(25,28,51,0.3)] backdrop-blur-sm">
                                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1d0e40] mb-3 sm:mb-4">
                                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg sm:text-2xl text-white font-bold mb-1 sm:mb-2">No films found</h3>
                                <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto px-4">
                                    Try adjusting your filters or search term
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 