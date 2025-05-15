"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { secondsToMinutes } from "@/lib/time";

// Language options
const LANGUAGES = [
    "All", "English", "Hindi", "Tamil", "Telugu", "Malayalam",
    "Kannada", "Bengali", "Marathi", "Punjabi", "Gujarati",
    "Spanish", "French", "German", "Chinese", "Japanese"
];

// Category options
const CATEGORIES = [
    "All", "Action", "Drama", "Comedy", "Thriller", "Romance",
    "Horror", "Documentary", "Animation", "Fantasy", "Sci-Fi"
];

const SearchPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get search params from URL
    const query = searchParams.get("q") || "";
    const language = searchParams.get("language") || "All";
    const category = searchParams.get("category") || "All";
    const page = parseInt(searchParams.get("page") || "1");

    // Local state for filter UI
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(query);
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [selectedCategory, setSelectedCategory] = useState(category);

    // Reset form if URL params change
    useEffect(() => {
        setSearchQuery(query);
        setSelectedLanguage(language);
        setSelectedCategory(category);
    }, [query, language, category]);

    // Fetch search results
    const { data, isLoading, error } = useQuery(
        ["search", query, language, category, page],
        async () => {
            // Build query params
            const params = new URLSearchParams();
            if (query) params.append("q", query);
            if (language !== "All") params.append("language", language);
            if (category !== "All") params.append("category", category);
            params.append("page", page.toString());

            const response = await fetch(`https://zynoflixott.com/api/search?${params.toString()}`);
            return response.json();
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
        }
    );

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // Build URL params
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (selectedLanguage !== "All") params.append("language", selectedLanguage);
        if (selectedCategory !== "All") params.append("category", selectedCategory);
        params.append("page", "1"); // Reset to page 1 on new search

        // Navigate to search results
        router.push(`/search?${params.toString()}`);
    };

    // Handle pagination
    const changePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/search?${params.toString()}`);
    };

    // Calculate pagination details
    const totalPages = data?.pagination?.pages || 1;
    const hasResults = data?.videos && data.videos.length > 0;

    return (
        <main className="min-h-screen pt-20 pb-12 px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Search Form */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search videos, titles, directors..."
                                    className="w-full bg-[rgba(25,28,51,0.5)] backdrop-blur-sm text-white rounded-lg px-4 py-3 pl-10 border border-[#292c41]/50 focus:border-[#7b61ff] outline-none transition-all"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="bg-[#7b61ff] hover:bg-[#6c52ee] px-6 py-2 text-white rounded-lg"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Filters Section */}
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-[rgba(25,28,51,0.5)] backdrop-blur-sm rounded-lg p-4 border border-[#292c41]/50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Language Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Language
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {LANGUAGES.slice(0, 8).map((lang) => (
                                                <button
                                                    key={lang}
                                                    type="button"
                                                    onClick={() => setSelectedLanguage(lang)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-xs rounded-full transition-all",
                                                        selectedLanguage === lang
                                                            ? "bg-[#7b61ff] text-white"
                                                            : "bg-[rgba(41,44,65,0.5)] text-gray-300 hover:bg-[rgba(41,44,65,0.8)]"
                                                    )}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                            <select
                                                value={selectedLanguage}
                                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                                className="bg-[rgba(41,44,65,0.5)] text-gray-300 px-3 py-1.5 text-xs rounded-full border-none outline-none focus:ring-1 focus:ring-[#7b61ff]"
                                            >
                                                <option value="">More...</option>
                                                {LANGUAGES.map((lang) => (
                                                    <option key={lang} value={lang}>
                                                        {lang}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {CATEGORIES.slice(0, 8).map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-xs rounded-full transition-all",
                                                        selectedCategory === cat
                                                            ? "bg-[#7b61ff] text-white"
                                                            : "bg-[rgba(41,44,65,0.5)] text-gray-300 hover:bg-[rgba(41,44,65,0.8)]"
                                                    )}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="bg-[rgba(41,44,65,0.5)] text-gray-300 px-3 py-1.5 text-xs rounded-full border-none outline-none focus:ring-1 focus:ring-[#7b61ff]"
                                            >
                                                <option value="">More...</option>
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* Search Info */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-white mb-2">
                        {query ? `Results for "${query}"` : "All Videos"}
                    </h1>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        {language !== "All" && (
                            <div className="bg-[rgba(123,97,255,0.2)] px-3 py-1 rounded-full">
                                Language: {language}
                            </div>
                        )}

                        {category !== "All" && (
                            <div className="bg-[rgba(123,97,255,0.2)] px-3 py-1 rounded-full">
                                Category: {category}
                            </div>
                        )}

                        {data?.pagination?.total !== undefined && (
                            <div className="bg-[rgba(41,44,65,0.5)] px-3 py-1 rounded-full">
                                Found: {data.pagination.total} videos
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <Loading />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/20 text-red-200 p-4 rounded-lg">
                        <p>Something went wrong. Please try again.</p>
                    </div>
                )}

                {/* No Results */}
                {!isLoading && !error && data?.videos?.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            We couldn't find any videos matching your search. Try adjusting your filters or searching for something else.
                        </p>
                        <Button
                            onClick={() => {
                                router.push("/search");
                                setSearchQuery("");
                                setSelectedLanguage("All");
                                setSelectedCategory("All");
                            }}
                            className="bg-[#7b61ff] hover:bg-[#6c52ee]"
                        >
                            Clear Search
                        </Button>
                    </div>
                )}

                {/* Results Grid */}
                {!isLoading && !error && hasResults && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data.videos.map((video: any) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !error && hasResults && totalPages > 1 && (
                    <div className="flex items-center justify-center mt-8 space-x-2">
                        <Button
                            variant="outline"
                            className="border-[#292c41] text-white"
                            disabled={page <= 1}
                            onClick={() => changePage(page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Prev
                        </Button>

                        <div className="px-4 py-2 bg-[rgba(41,44,65,0.5)] rounded-lg text-gray-300">
                            Page {page} of {totalPages}
                        </div>

                        <Button
                            variant="outline"
                            className="border-[#292c41] text-white"
                            disabled={page >= totalPages}
                            onClick={() => changePage(page + 1)}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
};

// Video Card Component
const VideoCard = ({ video }: { video: any }) => {
    const { _id, title, thumbnail, views, duration, language, category } = video;

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.2 }}
            className="bg-[rgba(25,28,51,0.5)] backdrop-blur-sm rounded-lg overflow-hidden shadow-md border border-[#292c41]/30 group"
        >
            <Link href={`/video/${_id}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={thumbnail || "/placeholder.jpg"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                        {secondsToMinutes(duration) || "2:30"}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                        <div className="h-12 w-12 rounded-full bg-[#7b61ff]/80 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 2.5V13.5L13 8L3 2.5Z" fill="white" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="p-3">
                    <h3 className="font-medium text-white line-clamp-2 mb-1">{title}</h3>

                    <div className="flex items-center text-xs text-gray-400 space-x-2">
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3.3C4.4 3.3 1.3 5.1 0 7.8C1.3 10.5 4.4 12.3 8 12.3C11.6 12.3 14.7 10.5 16 7.8C14.7 5.1 11.6 3.3 8 3.3ZM8 10.8C6.4 10.8 5.1 9.5 5.1 7.8C5.1 6.1 6.4 4.8 8 4.8C9.6 4.8 10.9 6.1 10.9 7.8C10.9 9.5 9.6 10.8 8 10.8ZM8 6C7.1 6 6.3 6.8 6.3 7.8C6.3 8.8 7.1 9.6 8 9.6C8.9 9.6 9.7 8.8 9.7 7.8C9.7 6.8 8.9 6 8 6Z" fill="currentColor" />
                            </svg>
                            {views?.toLocaleString() || "0"} views
                        </div>

                        {language && (
                            <div className="px-1.5 py-0.5 bg-[rgba(123,97,255,0.2)] rounded-sm">
                                {language}
                            </div>
                        )}

                        {category?.[0] && (
                            <div className="px-1.5 py-0.5 bg-[rgba(255,128,64,0.2)] rounded-sm">
                                {typeof category === 'string' ? category.split(',')[0] : category[0].split(',')[0]}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default SearchPage; 