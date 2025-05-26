"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Ticket, Calendar, Clock, Film, ArrowRight, Tag, CheckCircle, ChevronRight, Share2, Video, Users, Star } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { userId } from "@/lib/user";
import { toast } from "sonner";

// Types
type Purchase = {
    ticketId: string;
    orderId: string;
    paymentId: string;
    purchaseDate: string;
    quantity: number;
    amount: number;
    status: string;
};

type EventDetails = {
    _id: string;
    movieTitle: string;
    movieSubtitles?: string;
    movieCategory: string;
    movieLanguage: string;
    streamingDate: string;
    streamingTime: string;
    status: string;
};

type EventTicket = {
    event: EventDetails;
    totalTickets: number;
    purchases: Purchase[];
    totalAmount: number;
};

type ApiResponse = {
    tickets: EventTicket[];
    summary: {
        totalEvents: number;
        totalTickets: number;
        totalSpent: number;
    };
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasMore: boolean;
    };
};

export default function MyTicketsPage() {
    const router = useRouter();
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'past'>('all');

    // Fetch user's tickets
    useEffect(() => {
        const fetchUserTickets = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get("/api/user/my-tickets", {
                    headers: {
                        userId: userId
                    }
                });

                setData(response.data);
            } catch (error: any) {
                console.error("Error fetching tickets:", error);
                setError(error.response?.data?.error || "Failed to fetch your tickets. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserTickets();
        } else {
            setError("You need to be logged in to view your tickets");
            setLoading(false);
        }
    }, []);

    // Format date to readable format
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "EEE, MMM d, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    // Format date to relative time (e.g., "2 days ago")
    const formatPurchaseDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            const now = new Date();
            const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) {
                return "Today";
            } else if (diffInDays === 1) {
                return "Yesterday";
            } else if (diffInDays < 7) {
                return `${diffInDays} days ago`;
            } else {
                return format(date, "MMM d, yyyy");
            }
        } catch (error) {
            return dateString;
        }
    };

    // Format amount to currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Check if ticket is for a past event
    const isEventInPast = (dateString: string, timeString: string) => {
        try {
            // Parse the date string to handle various formats
            let eventDate;
            if (dateString.includes("GMT")) {
                eventDate = new Date(dateString);
            } else {
                eventDate = new Date(`${dateString}T${timeString}`);
            }
            return eventDate < new Date();
        } catch (error) {
            console.error("Date parsing error:", error);
            return false;
        }
    };

    // Get ticket status badge class
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active':
                return "bg-green-600 hover:bg-green-700";
            case 'used':
                return "bg-blue-600 hover:bg-blue-700";
            case 'cancelled':
                return "bg-red-600 hover:bg-red-700";
            case 'expired':
                return "bg-gray-600 hover:bg-gray-700";
            default:
                return "bg-purple-600 hover:bg-purple-700";
        }
    };

    // Filter tickets by status
    const filterEvents = () => {
        if (!data?.tickets) return [];

        if (activeStatus === 'all') {
            return data.tickets;
        } else if (activeStatus === 'upcoming') {
            return data.tickets.filter(ticket =>
                !isEventInPast(ticket.event.streamingDate, ticket.event.streamingTime) &&
                ticket.purchases.some(p => p.status === 'active')
            );
        } else {
            return data.tickets.filter(ticket =>
                isEventInPast(ticket.event.streamingDate, ticket.event.streamingTime) ||
                !ticket.purchases.some(p => p.status === 'active')
            );
        }
    };

    // Navigate to event details
    const goToEvent = (eventId: string) => {
        router.push(`/live-stream/${eventId}`);
    };

    // Join live stream
    const joinLiveStream = (eventId: string, ticketId: string) => {
        // Check if event is live before joining
        axios.get(`/api/live-stream/${eventId}/check-access`, {
            headers: {
                userId: userId
            }
        })
            .then(response => {
                if (response.data.hasAccess) {
                    router.push(`/watch/${eventId}?ticket=${ticketId}`);
                } else {
                    toast.error("This event is not live yet or you don't have access");
                }
            })
            .catch(error => {
                toast.error("Failed to verify access. Please try again.");
                console.error("Access verification error:", error);
            });
    };

    // Share event
    const shareEvent = (eventId: string, title: string) => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this amazing event: ${title}`,
                url: `${window.location.origin}/live-stream/${eventId}`
            })
                .then(() => toast.success("Shared successfully"))
                .catch((error) => console.error("Error sharing:", error));
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/live-stream/${eventId}`);
            toast.success("Link copied to clipboard");
        }
    };

    // Get random placeholder image for events without posters
    const getPlaceholderImage = (eventId: string) => {
        const seeds = ['fantasy', 'adventure', 'mystery', 'scifi', 'drama', 'action'];
        const seed = seeds[eventId.charCodeAt(0) % seeds.length];
        return `https://source.unsplash.com/500x300/?${seed},movie`;
    };

    const filteredEvents = filterEvents();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a0f2d] text-gray-100 pb-20">
            {/* Hero Section */}
            <div className="relative h-[30vh] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0f1a]"></div>
                <div className="container mx-auto relative z-10 h-full flex flex-col justify-center px-4 pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
                            <Ticket className="w-8 h-8 mr-3 text-purple-400" />
                            <span>My Tickets</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl">
                            View and manage your booked live stream events
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Summary Card */}
            {data?.summary && !loading && !error && (
                <div className="container mx-auto px-4 -mt-10 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 backdrop-blur-md rounded-xl border border-purple-500/30 p-6 shadow-xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-500/20 p-3 rounded-full">
                                    <Film className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm">Total Events</p>
                                    <p className="text-2xl font-bold text-white">{data.summary.totalEvents}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-500/20 p-3 rounded-full">
                                    <Ticket className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm">Total Tickets</p>
                                    <p className="text-2xl font-bold text-white">{data.summary.totalTickets}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-pink-500/20 p-3 rounded-full">
                                    <Tag className="w-8 h-8 text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm">Total Spent</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(data.summary.totalSpent)}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Filter Tabs */}
            {!loading && !error && data?.tickets && data.tickets.length > 0 && (
                <div className="container mx-auto px-4 mt-8">
                    <div className="flex space-x-2 mb-6 overflow-x-auto py-2">
                        <Button
                            onClick={() => setActiveStatus('all')}
                            variant={activeStatus === 'all' ? 'default' : 'outline'}
                            className={activeStatus === 'all'
                                ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white"
                                : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                        >
                            All Events ({data.tickets.length})
                        </Button>

                        <Button
                            onClick={() => setActiveStatus('upcoming')}
                            variant={activeStatus === 'upcoming' ? 'default' : 'outline'}
                            className={activeStatus === 'upcoming'
                                ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white"
                                : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Upcoming
                        </Button>

                        <Button
                            onClick={() => setActiveStatus('past')}
                            variant={activeStatus === 'past' ? 'default' : 'outline'}
                            className={activeStatus === 'past'
                                ? "bg-gradient-to-r from-gray-600 to-slate-700 text-white"
                                : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Past
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {loading ? (
                    // Loading skeleton
                    <div className="space-y-8">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-[#1e1b2d] rounded-xl overflow-hidden border border-gray-800">
                                <div className="flex flex-col md:flex-row">
                                    <Skeleton className="h-60 md:w-80 bg-gray-800" />
                                    <div className="p-6 w-full space-y-4">
                                        <Skeleton className="h-8 w-3/4 bg-gray-800" />
                                        <Skeleton className="h-4 w-1/2 bg-gray-800" />
                                        <div className="flex space-x-2">
                                            <Skeleton className="h-6 w-20 rounded-full bg-gray-800" />
                                            <Skeleton className="h-6 w-20 rounded-full bg-gray-800" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Skeleton className="h-12 bg-gray-800" />
                                            <Skeleton className="h-12 bg-gray-800" />
                                        </div>
                                        <div className="flex space-x-3">
                                            <Skeleton className="h-10 w-32 bg-gray-800" />
                                            <Skeleton className="h-10 w-32 bg-gray-800" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Error state
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-5xl mb-4">😕</div>
                        <h3 className="text-2xl font-semibold mb-2">Oops! Something went wrong</h3>
                        <p className="text-gray-400 mb-8">
                            {error}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                        >
                            Try Again
                        </Button>
                    </motion.div>
                ) : !data || data.tickets.length === 0 ? (
                    // No tickets
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-7xl mb-4">🎫</div>
                        <h3 className="text-2xl font-semibold mb-2">No tickets found</h3>
                        <p className="text-gray-400 mb-8">
                            You haven't booked any live stream events yet.
                        </p>
                        <Button
                            onClick={() => router.push("/live-streams")}
                            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                        >
                            Explore Events <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {filteredEvents.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-400">No events found for the selected filter.</p>
                            </div>
                        ) : (
                            filteredEvents.map((eventTicket, index) => {
                                const event = eventTicket.event;
                                const isUpcoming = !isEventInPast(event.streamingDate, event.streamingTime);
                                const isLive = event.status === 'live';

                                // Get the most recent active ticket for the event
                                const activeTickets = eventTicket.purchases.filter(p => p.status === 'active');
                                const latestTicket = activeTickets.length > 0
                                    ? activeTickets.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())[0]
                                    : eventTicket.purchases[0];

                                return (
                                    <motion.div
                                        key={event._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className={`bg-[#1e1b2d] rounded-xl overflow-hidden border ${isUpcoming ? 'border-purple-700/30' : 'border-gray-800'} hover:border-purple-600 transition-all shadow-lg ${!isUpcoming ? 'opacity-80' : ''}`}
                                    >
                                        <div className="flex flex-col lg:flex-row">
                                            {/* Left Section - Image */}
                                            <div className="relative h-60 lg:h-auto lg:w-1/3 xl:w-1/4 overflow-hidden bg-gray-800">
                                                <div className={`absolute inset-0 bg-cover bg-center ${!isUpcoming ? 'grayscale' : ''}`}
                                                    style={{ backgroundImage: `url('${getPlaceholderImage(event._id)}')` }}>
                                                </div>

                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b2d] to-transparent opacity-70"></div>

                                                {/* Event Status Banner */}
                                                <div className="absolute top-4 left-0">
                                                    <div className={`py-1 px-4 ${isLive
                                                        ? 'bg-red-600 animate-pulse'
                                                        : isUpcoming
                                                            ? 'bg-green-600'
                                                            : 'bg-gray-700'} rounded-r-full font-medium shadow-lg`}>
                                                        {isLive ? 'LIVE NOW' : isUpcoming ? 'UPCOMING' : 'PAST EVENT'}
                                                    </div>
                                                </div>

                                                {/* Ticket Count Badge */}
                                                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                                                    <div className="bg-black/60 backdrop-blur-sm py-1 px-3 rounded-full flex items-center">
                                                        <Ticket className="w-4 h-4 text-purple-400 mr-1" />
                                                        <span className="text-sm font-medium">{eventTicket.totalTickets} Tickets</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section - Content */}
                                            <div className="p-6 lg:w-2/3 xl:w-3/4">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <Badge className="bg-purple-900/70">{event.movieCategory}</Badge>
                                                    <Badge className="bg-blue-900/70">{event.movieLanguage}</Badge>
                                                    <Badge className={`${isLive ? 'bg-red-600' : isUpcoming ? 'bg-green-600/70' : 'bg-gray-700'}`}>
                                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                    </Badge>
                                                </div>

                                                <h3 className="text-2xl font-bold mb-1">{event.movieTitle}</h3>

                                                {event.movieSubtitles && (
                                                    <p className="text-gray-400 mb-4 italic">{event.movieSubtitles}</p>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-4 my-6">
                                                    <div className="flex items-start space-x-3">
                                                        <Calendar className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Date</p>
                                                            <p className="font-medium">{formatDate(event.streamingDate)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3">
                                                        <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Time</p>
                                                            <p className="font-medium">{event.streamingTime}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3">
                                                        <Users className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Purchases</p>
                                                            <p className="font-medium">{eventTicket.purchases.length} Order{eventTicket.purchases.length !== 1 ? 's' : ''}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3">
                                                        <Tag className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Total Spent</p>
                                                            <p className="font-medium">{formatCurrency(eventTicket.totalAmount)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Last Purchase Info */}
                                                <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-800">
                                                    <p className="text-sm text-gray-400 mb-2">Latest Purchase:</p>
                                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-300">
                                                                Order #{latestTicket.orderId.slice(-8)}
                                                                <span className="mx-2">•</span>
                                                                {formatPurchaseDate(latestTicket.purchaseDate)}
                                                            </p>
                                                        </div>
                                                        <Badge className={getStatusBadgeClass(latestTicket.status)}>
                                                            {latestTicket.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-3">
                                                    {isUpcoming && isLive && (
                                                        <Button
                                                            onClick={() => joinLiveStream(event._id, latestTicket.ticketId)}
                                                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                                                        >
                                                            <Video className="w-4 h-4 mr-2" />
                                                            Join Live Stream
                                                        </Button>
                                                    )}

                                                    {isUpcoming && !isLive && (
                                                        <Button
                                                            onClick={() => joinLiveStream(event._id, latestTicket.ticketId)}
                                                            variant="default"
                                                            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Ready to Watch
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                                        onClick={() => goToEvent(event._id)}
                                                    >
                                                        View Details
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                                        onClick={() => shareEvent(event._id, event.movieTitle)}
                                                    >
                                                        <Share2 className="h-4 w-4 mr-1" />
                                                        Share
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}

                        {/* Pagination if needed */}
                        {data && data.pagination && data.pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-10">
                                {/* Pagination UI would go here */}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 