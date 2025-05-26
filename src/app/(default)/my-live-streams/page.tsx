"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import { Calendar, Clock, Film, Tag, Users, Video, Ticket, Clock3 } from "lucide-react";

type LiveStream = {
    _id: string;
    producerName: string;
    moviePoster: string;
    directorName: string;
    heroName: string;
    heroinName: string;
    movieTitle: string;
    movieSubtitles?: string;
    movieCategory: string;
    movieDescription: string;
    movieTrailer: string;
    movieLength: number;
    movieCertificate: string;
    movieLanguage: string;
    streamingDate: string;
    streamingTime: string;
    ticketCost: number;
    ticketsSold: number;
    status: "scheduled" | "live" | "completed" | "cancelled";
    createdAt: string;
};

type TicketData = {
    [x: string]: any;
    ticket: {
        _id: string;
        orderId: string;
        paymentId: string;
        purchaseDate: string;
        status: string;
        amount: number;
    };
    stream: {
        _id: string;
        movieTitle: string;
        movieSubtitles?: string;
        streamingDate: string;
        streamingTime: string;
        moviePoster: string;
        status: string;
        movieCategory: string;
        movieLanguage: string;
    } | null;
};

export default function MyLiveStreamsPage() {
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
    const [purchasedTickets, setPurchasedTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ticketPage, setTicketPage] = useState(1);
    const [ticketTotalPages, setTicketTotalPages] = useState(1);
    const [userId, setUserId] = useState("");
    const [activeTab, setActiveTab] = useState("created");

    useEffect(() => {
        const userIdK = localStorage.getItem("userId");
        // Get user ID from cookie
        if (userIdK) {
            setUserId(userIdK);
            fetchLiveStreams(userIdK, 1);
            fetchPurchasedTickets(userIdK, 1);
        } else {
            setLoading(false);
            setError("You must be logged in to view your live streams");
        }
    }, []);

    const fetchLiveStreams = async (userId: string, page: number) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/live-stream?userId=${userId}&page=${page}&limit=6`, {
                headers: {
                    userId: userId
                }
            });
            setLiveStreams(data);
            setTotalPages(data?.length);
            setCurrentPage(1);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching live streams:", error);
            setError("Failed to fetch live streams");
            setLoading(false);
        }
    };

    const fetchPurchasedTickets = async (userId: string, page: number) => {
        try {
            const { data } = await axios.get(`/api/tickets?page=${page}&limit=6`, {
                headers: {
                    userId: userId
                }
            });
            setPurchasedTickets(data.tickets);
            setTicketTotalPages(data.pagination.totalPages);
            setTicketPage(data.pagination.currentPage);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            toast.error("Failed to fetch your tickets");
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchLiveStreams(userId, page);
    };

    const handleTicketPageChange = (page: number) => {
        if (page < 1 || page > ticketTotalPages) return;
        setTicketPage(page);
        fetchPurchasedTickets(userId, page);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "bg-indigo-900 text-indigo-200";
            case "live":
                return "bg-green-900 text-green-200";
            case "completed":
                return "bg-gray-800 text-gray-200";
            case "cancelled":
                return "bg-red-900 text-red-200";
            default:
                return "bg-gray-800 text-gray-200";
        }
    };

    const getTicketStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-900 text-green-200";
            case "used":
                return "bg-blue-900 text-blue-200";
            case "cancelled":
                return "bg-red-900 text-red-200";
            case "expired":
                return "bg-gray-800 text-gray-200";
            default:
                return "bg-gray-800 text-gray-200";
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "dd MMM yyyy");
        } catch (error) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center pt-20">
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400 text-lg">Loading your data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center pt-20">
                <div className="max-w-md p-8 bg-[#1e1b2d] rounded-lg shadow-xl border border-gray-800 text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <Link href="/login">
                        <Button className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white">Log In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a0f2d] py-10 px-4 md:px-6 pt-24 text-gray-100">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">My Live Streams</h1>
                        <p className="text-gray-400 text-lg">Manage your short film live streams</p>
                    </div>
                    <Link href="/create-live-stream">
                        <Button className="mt-4 md:mt-0 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white">
                            <Video className="w-4 h-4 mr-2" />
                            Create New Stream
                        </Button>
                    </Link>
                </div>

                <Tabs defaultValue="created" className="mb-10" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-8 bg-[#1e1b2d] p-1 rounded-lg">
                        <TabsTrigger value="created" className="rounded-md py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-700">
                            Created Streams
                        </TabsTrigger>
                        <TabsTrigger value="purchased" className="rounded-md py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-700">
                            Purchased Tickets
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="created">
                        {liveStreams.length === 0 ? (
                            <div className="bg-[#1e1b2d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800 p-10 text-center">
                                <Film className="w-20 h-20 mx-auto text-gray-600 mb-6" />
                                <h2 className="text-2xl font-semibold mb-4 text-gray-200">No Live Streams Yet</h2>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                    You haven't created any live streams yet. Get started by creating your first live stream.
                                </p>
                                <Link href="/create-live-stream">
                                    <Button className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-6 py-5 text-lg">Create Your First Live Stream</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {liveStreams.map((stream, index) => (
                                        <motion.div
                                            key={stream._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="bg-[#1e1b2d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800 overflow-hidden hover:border-purple-800 transition-all duration-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                        >
                                            <div
                                                className="h-48 bg-gray-700 bg-cover bg-center relative"
                                                style={{
                                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${stream.moviePoster})`
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b2d] to-transparent opacity-60"></div>
                                                <div className="p-4 flex justify-between relative z-10">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stream.status)}`}>
                                                        {stream.status.charAt(0).toUpperCase() + stream.status.slice(1)}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full bg-black bg-opacity-50 text-white text-xs font-medium">
                                                        {stream.movieLength} mins
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-200 mb-1">{stream.movieTitle}</h3>
                                                {stream.movieSubtitles && (
                                                    <p className="text-gray-400 text-sm italic mb-3">{stream.movieSubtitles}</p>
                                                )}

                                                <div className="mt-4 space-y-3">
                                                    <div className="flex items-center text-sm text-gray-300">
                                                        <Tag className="w-4 h-4 mr-2 text-purple-400" />
                                                        <span>{stream.movieCategory} | {stream.movieLanguage}</span>
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-300">
                                                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                                        <span>{formatDate(stream.streamingDate)}</span>
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-300">
                                                        <Clock className="w-4 h-4 mr-2 text-purple-400" />
                                                        <span>{stream.streamingTime}</span>
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-300">
                                                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                                                        <span>{stream.directorName} (Director)</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <span className="font-bold text-xl text-purple-300">₹{stream.ticketCost}</span>
                                                        <span className="ml-2 text-xs text-gray-400">
                                                            {stream.ticketsSold || 0} tickets sold
                                                        </span>
                                                    </div>
                                                    <Link href={`/live-streams/${stream._id}`}>
                                                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {/* {totalPages > 1 && (
                                    <div className="flex justify-center mt-10">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                Previous
                                            </Button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    onClick={() => handlePageChange(page)}
                                                    className={currentPage === page
                                                        ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white"
                                                        : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                                                >
                                                    {page}
                                                </Button>
                                            ))}

                                            <Button
                                                variant="outline"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )} */}
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="purchased">
                        {purchasedTickets.length === 0 ? (
                            <div className="bg-[#1e1b2d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800 p-10 text-center">
                                <Ticket className="w-20 h-20 mx-auto text-gray-600 mb-6" />
                                <h2 className="text-2xl font-semibold mb-4 text-gray-200">No Tickets Yet</h2>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                    You haven't purchased any tickets yet. Browse available live streams to book your first ticket.
                                </p>
                                <Link href="/live-streams">
                                    <Button className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-6 py-5 text-lg">Browse Live Streams</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {purchasedTickets.map((item, index) => (
                                        <motion.div
                                            key={item.ticket._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="bg-[#1e1b2d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800 overflow-hidden hover:border-purple-800 transition-all duration-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                        >
                                            {item.stream ? (
                                                <>
                                                    <div
                                                        className="h-48 bg-gray-700 bg-cover bg-center relative"
                                                        style={{
                                                            backgroundImage: item.moviePoster
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b2d] to-transparent opacity-60"></div>
                                                        <div className="p-4 flex justify-between relative z-10">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTicketStatusColor(item.ticket.status)}`}>
                                                                {item.ticket.status.charAt(0).toUpperCase() + item.ticket.status.slice(1)}
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.stream.status)}`}>
                                                                {item.stream.status.charAt(0).toUpperCase() + item.stream.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-6">
                                                        <h3 className="text-xl font-bold text-gray-200 mb-1">{item.stream.movieTitle}</h3>
                                                        {item.stream.movieSubtitles && (
                                                            <p className="text-gray-400 text-sm italic mb-3">{item.stream.movieSubtitles}</p>
                                                        )}

                                                        <div className="mt-4 space-y-3">
                                                            <div className="flex items-center text-sm text-gray-300">
                                                                <Tag className="w-4 h-4 mr-2 text-purple-400" />
                                                                <span>{item.stream.movieCategory} | {item.stream.movieLanguage}</span>
                                                            </div>

                                                            <div className="flex items-center text-sm text-gray-300">
                                                                <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                                                <span>{formatDate(item.stream.streamingDate)}</span>
                                                            </div>

                                                            <div className="flex items-center text-sm text-gray-300">
                                                                <Clock className="w-4 h-4 mr-2 text-purple-400" />
                                                                <span>{item.stream.streamingTime}</span>
                                                            </div>

                                                            <div className="flex items-center text-sm text-gray-300">
                                                                <Clock3 className="w-4 h-4 mr-2 text-purple-400" />
                                                                <span>Purchased: {formatDate(item.ticket.purchaseDate)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 flex justify-between items-center">
                                                            <span className="font-bold text-xl text-purple-300">₹{item.ticket.amount}</span>
                                                            <Link href={`/live-streams/${item.stream._id}`}>
                                                                <Button variant="outline" size="sm" className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white">
                                                                    View Stream
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-red-400 mb-4">Stream Not Available</h3>
                                                    <p className="text-gray-400 mb-4">This stream may have been removed or is no longer available.</p>
                                                    <div className="mt-4 space-y-3">
                                                        <div className="flex items-center text-sm text-gray-300">
                                                            <Ticket className="w-4 h-4 mr-2 text-purple-400" />
                                                            <span>Order ID: {item.ticket.orderId}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-300">
                                                            <Clock className="w-4 h-4 mr-2 text-purple-400" />
                                                            <span>Purchased: {formatDate(item.ticket.purchaseDate)}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-300">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTicketStatusColor(item.ticket.status)}`}>
                                                                {item.ticket.status.charAt(0).toUpperCase() + item.ticket.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {/* {ticketTotalPages > 1 && (
                                    <div className="flex justify-center mt-10">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleTicketPageChange(ticketPage - 1)}
                                                disabled={ticketPage === 1}
                                                className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                Previous
                                            </Button>

                                            {Array.from({ length: ticketTotalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={ticketPage === page ? "default" : "outline"}
                                                    onClick={() => handleTicketPageChange(page)}
                                                    className={ticketPage === page
                                                        ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white"
                                                        : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                                                >
                                                    {page}
                                                </Button>
                                            ))}

                                            <Button
                                                variant="outline"
                                                onClick={() => handleTicketPageChange(ticketPage + 1)}
                                                disabled={ticketPage === ticketTotalPages}
                                                className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )} */}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 