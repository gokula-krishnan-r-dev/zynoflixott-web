"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { Search, Filter, Calendar, Clock, Film, Users, Sparkles } from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { userId } from "@/lib/user";

// Type for live stream event
type LiveStreamEvent = {
    _id: string;
    producerName: string;
    directorName: string;
    heroName: string;
    heroinName: string;
    movieTitle: string;
    movieSubtitles?: string;
    moviePoster?: string;
    movieCategory: string;
    movieDescription: string;
    movieTrailer: string;
    movieLength: number;
    movieCertificate: string;
    movieLanguage: string;
    streamingDate: string;
    streamingTime: string;
    ticketCost: number;
    ticketsSold?: number;
    fundsRaised?: number;
    posterImage?: string;
};

export default function LiveStreamsPage() {
    const router = useRouter();
    const [liveStreams, setLiveStreams] = useState<LiveStreamEvent[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<LiveStreamEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // Categories and languages for filters
    const categories = ["Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];
    const languages = ["Tamil", "Telugu", "Malayalam", "Kannada", "Hindi", "English", "Bengali", "Marathi"];

    // Fetch live stream events
    useEffect(() => {
        const fetchLiveStreams = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/live-stream", {
                    headers: {
                        userId: userId
                    }
                });
                setLiveStreams(response.data);
                setFilteredEvents(response.data);
            } catch (error) {
                console.error("Error fetching live streams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveStreams();
    }, []);

    // Filter events based on search query and filters
    useEffect(() => {
        let result = liveStreams;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (event) =>
                    event.movieTitle.toLowerCase().includes(query) ||
                    event.producerName.toLowerCase().includes(query) ||
                    event.directorName.toLowerCase().includes(query) ||
                    event.heroName.toLowerCase().includes(query) ||
                    event.heroinName.toLowerCase().includes(query) ||
                    event.movieDescription.toLowerCase().includes(query)
            );
        }

        // Apply category filter
        if (categoryFilter) {
            result = result.filter((event) => event.movieCategory === categoryFilter);
        }

        // Apply language filter
        if (languageFilter) {
            result = result.filter((event) => event.movieLanguage === languageFilter);
        }

        // Apply date filter
        if (dateFilter) {
            result = result.filter((event) => {
                const eventDate = new Date(event.streamingDate).toISOString().split('T')[0];
                return eventDate === dateFilter;
            });
        }

        setFilteredEvents(result);
    }, [searchQuery, categoryFilter, languageFilter, dateFilter, liveStreams]);

    // Navigate to event details page
    const handleBookNow = (eventId: string) => {
        router.push(`/live-streams/${eventId}`);
    };

    // Format date to readable format
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "MMM dd, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a0f2d] text-gray-100 pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/cinema-bg.jpg')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0f1a]"></div>
                <div className="container mx-auto relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
                    >
                        Live Stream Events
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-2xl"
                    >
                        Discover and book exclusive live streaming events for upcoming short films
                    </motion.p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-[#1e1b2d] rounded-xl p-6 shadow-lg mb-10 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full h-10 rounded-md bg-[#2a2742] border border-gray-700 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Language Filter */}
                        <div>
                            <select
                                value={languageFilter}
                                onChange={(e) => setLanguageFilter(e.target.value)}
                                className="w-full h-10 rounded-md bg-[#2a2742] border border-gray-700 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                            >
                                <option value="">All Languages</option>
                                {languages.map((language) => (
                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="pl-10 bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"} Available
                    </h2>
                    {/* Reset Filters */}
                    {(searchQuery || categoryFilter || languageFilter || dateFilter) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setCategoryFilter("");
                                setLanguageFilter("");
                                setDateFilter("");
                            }}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            Reset Filters
                        </Button>
                    )}


                    <Button
                        onClick={() => router.push("/create-live-stream")}
                        className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                    >
                        Create Live Stream
                    </Button>
                </div>

                {loading ? (
                    // Loading skeletons
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#1e1b2d] rounded-xl overflow-hidden border border-gray-800">
                                <Skeleton className="h-56 w-full bg-gray-800" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                                    <Skeleton className="h-4 w-full bg-gray-800" />
                                    <Skeleton className="h-12 w-full bg-gray-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    // No results
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-5xl mb-4">😕</div>
                        <h3 className="text-2xl font-semibold mb-2">No events found</h3>
                        <p className="text-gray-400">
                            We couldn't find any events matching your search criteria.
                        </p>
                    </motion.div>
                ) : (
                    // Events grid
                    <AnimatePresence>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-[#1e1b2d] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-purple-700 transition-all"
                                >
                                    {/* Event Poster/Image */}
                                    <div className="relative h-56 bg-gray-800 overflow-hidden">
                                        {event.moviePoster ? (
                                            <img
                                                src={event.moviePoster}
                                                alt={event.movieTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-900">
                                                <Film className="w-16 h-16 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b2d] to-transparent"></div>
                                        <div className="absolute top-2 right-2 flex space-x-2">
                                            <Badge className="bg-purple-700">{event.movieCertificate}</Badge>
                                            <Badge className="bg-blue-700">{event.movieLanguage}</Badge>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold mb-1 line-clamp-1">{event.movieTitle}</h3>
                                        {event.movieSubtitles && (
                                            <p className="text-sm text-gray-400 mb-2 italic line-clamp-1">
                                                {event.movieSubtitles}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <Badge variant="outline" className="border-purple-600">
                                                {event.movieCategory}
                                            </Badge>
                                            <Badge variant="outline" className="border-green-600 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {event.movieLength} min
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="flex items-center space-x-1 text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm">{formatDate(event.streamingDate)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{event.streamingTime}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-gray-400">
                                                <Sparkles className="w-4 h-4" />
                                                <span className="text-sm">₹{event.ticketCost}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-gray-400">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm">{event.ticketsSold || 0} tickets</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleBookNow(event._id)}
                                            className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
} 