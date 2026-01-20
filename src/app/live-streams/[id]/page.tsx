"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { Film, Clock, Calendar, Users, Ticket, Tag, BadgeInfo, Play } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { userId } from "@/lib/user";

// Type for live stream event
type LiveStreamEvent = {
    id: string;
    producerName: string;
    directorName: string;
    moviePoster: string;
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
    ticketsSold?: number;
    fundsRaised?: number;
    posterImage?: string;
};

export default function LiveStreamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<LiveStreamEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [paymentId, setPaymentId] = useState("");

    // Format price with GST
    const ticketPrice = event?.ticketCost || 0;
    const basePrice = ticketPrice * ticketQuantity;
    const gstAmount = basePrice * 0.18; // 18% GST
    const totalPrice = basePrice + gstAmount;

    // Fetch event details
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/live-stream/${params.id}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
                toast.error("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchEventDetails();
        }
    }, [params.id]);

    // Format date to readable format
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "EEEE, MMMM d, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    // Handle payment initialization
    const handlePayment = async () => {
        try {
            setPaymentLoading(true);

            setIsBookingModalOpen(false);

            // Initialize payment with Razorpay
            const { data } = await axios.post("/api/live-stream/book", {
                eventId: params.id,
                ticketQuantity,
            }, {
                headers: {
                    userId: userId
                }
            });

            setOrderId(data.orderId);

            // Load Razorpay script
            if (!(window as any).Razorpay) {
                await loadRazorpay();
            }

            // Open Razorpay payment dialog
            const options = {
                key: process.env.RAZORPAY_KEY_ID || "rzp_test_HJG5Rtuy8Xh2NB",
                amount: data.amount * 100, // Amount in paisa
                currency: data.currency,
                name: "Zynoflix",
                description: `Tickets for ${event?.movieTitle}`,
                order_id: data.orderId,
                handler: function (response: any) {
                    handlePaymentSuccess(response);
                },
                prefill: {
                    name: "Viewer",
                    email: "viewer@example.com",
                    contact: ""
                },
                theme: {
                    color: "#7c3aed"
                },
                modal: {
                    ondismiss: function () {
                        setPaymentLoading(false);
                    }
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment initialization failed:", error);
            toast.error("Payment initialization failed. Please try again.");
            setPaymentLoading(false);
        }
    };

    // Load Razorpay script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            document.body.appendChild(script);
        });
    };

    // Handle payment success
    const handlePaymentSuccess = async (response: any) => {
        setPaymentLoading(false);
        setPaymentId(response.razorpay_payment_id);

        try {
            // Verify payment on the server
            await axios.post("/api/live-stream/verify-payment", {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                eventId: params.id,
                ticketQuantity,
            }, {
                headers: {
                    userId: userId
                }
            });



            await axios.post("/api/live-stream/update-tickets", {
                eventId: params.id,
                ticketQuantity,
            }, {
                headers: {
                    userId: userId
                }
            });



            setIsPaymentSuccess(true);
            toast.success("Payment successful! Your tickets are confirmed.");
        } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
        }
    };

    // Handle booking click
    const handleBookNow = () => {
        if (!userId) {
            toast.error("Please log in to book tickets");
            return;
        }

        // Check if the event date is in the past
        if (event?.streamingDate) {
            const eventDate = new Date(`${event.streamingDate}T${event.streamingTime}`);
            if (eventDate < new Date()) {
                toast.error("This event has already passed");
                return;
            }
        }

        setIsBookingModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a0f2d] text-gray-100 p-4 md:p-8">
                <div className="container mx-auto">
                    <div className="w-full h-[40vh] rounded-xl overflow-hidden">
                        <Skeleton className="w-full h-full bg-gray-800" />
                    </div>
                    <div className="mt-8 space-y-4">
                        <Skeleton className="h-10 w-3/4 bg-gray-800" />
                        <Skeleton className="h-6 w-1/2 bg-gray-800" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <Skeleton className="h-40 w-full bg-gray-800" />
                            <Skeleton className="h-40 w-full bg-gray-800" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a0f2d] text-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <div className="text-5xl mb-4">😕</div>
                    <h3 className="text-2xl font-semibold mb-2">Event not found</h3>
                    <p className="text-gray-400 mb-8">
                        We couldn't find the event you're looking for.
                    </p>
                    <Button
                        onClick={() => router.push("/live-streams")}
                        className="bg-purple-700 hover:bg-purple-800"
                    >
                        Back to All Events
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a0f2d] text-gray-100 pb-20">
            {/* Hero Banner */}
            <div className="relative h-[75vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900"
                    style={{
                        backgroundImage: event.moviePoster ? `url(${event.moviePoster})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-[#0f0f1a]/70"></div>
                </div>

                <div className="container mx-auto relative z-10 h-full flex flex-col justify-end pb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-purple-700">{event.movieCertificate}</Badge>
                            <Badge className="bg-blue-700">{event.movieLanguage}</Badge>
                            <Badge variant="outline" className="border-purple-600">
                                {event.movieCategory}
                            </Badge>
                            <Badge variant="outline" className="border-green-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {event.movieLength} min
                            </Badge>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white">{event.movieTitle}</h1>

                        {event.movieSubtitles && (
                            <p className="text-xl text-gray-300 mb-4 italic">
                                {event.movieSubtitles}
                            </p>
                        )}

                        <div className="flex lg:flex-row flex-col gap-4 mt-6">
                            <Button
                                onClick={handleBookNow}
                                className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-8 py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 font-bold text-lg"
                                size="lg"
                            >
                                <Ticket className="h-6 w-6 animate-pulse" />
                                <span>Book Tickets</span>
                                <Badge className="ml-2 bg-white/20 text-white">
                                    ₹{event.ticketCost}
                                </Badge>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setIsTrailerModalOpen(true)}
                                className="bg-white/10 backdrop-blur-sm border-2 border-purple-500/50 hover:bg-purple-700/30 text-white px-8 py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 font-bold text-lg"
                                size="lg"
                            >
                                <Play className="h-6 w-6" fill="currentColor" />
                                <span>Watch Trailer</span>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-[#1e1b2d] rounded-xl p-6 shadow-lg border border-gray-800"
                        >
                            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                About The Movie
                            </h2>
                            <p className="text-gray-300 whitespace-pre-line">
                                {event.movieDescription}
                            </p>

                            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-gray-400 text-sm mb-1">Producer</h3>
                                    <p className="font-medium">{event.producerName}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm mb-1">Director</h3>
                                    <p className="font-medium">{event.directorName}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm mb-1">Hero</h3>
                                    <p className="font-medium">{event.heroName}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm mb-1">Heroine</h3>
                                    <p className="font-medium">{event.heroinName}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm mb-1">Category</h3>
                                    <p className="font-medium">{event.movieCategory}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm mb-1">Length</h3>
                                    <p className="font-medium">{event.movieLength} minutes</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Streaming Details & Booking */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-[#1e1b2d] rounded-xl p-6 shadow-lg border border-gray-800 sticky top-4"
                        >
                            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                Streaming Details
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-6 w-6 text-purple-400" />
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Date</h3>
                                        <p className="font-medium">{formatDate(event.streamingDate)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-purple-400" />
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Time</h3>
                                        <p className="font-medium">{event.streamingTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Tag className="h-6 w-6 text-purple-400" />
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Ticket Price</h3>
                                        <p className="font-medium">₹{event.ticketCost}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Users className="h-6 w-6 text-purple-400" />
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Tickets Sold</h3>
                                        <p className="font-medium">{event.ticketsSold || 0}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-700">
                                    <Button
                                        onClick={handleBookNow}
                                        className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white py-6"
                                        size="lg"
                                    >
                                        <Ticket className="mr-2 h-5 w-5" /> Book Tickets
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                <DialogContent className="bg-[#1e1b2d] text-white border-gray-800 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold mb-2">
                            Book Tickets for {event.movieTitle}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Movie:</span>
                            <span className="font-semibold">{event.movieTitle}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Date & Time:</span>
                            <span>{formatDate(event.streamingDate)} at {event.streamingTime}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Ticket Price:</span>
                            <span>₹{event.ticketCost}</span>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="ticketQuantity" className="text-gray-300">
                                Number of Tickets:
                            </label>
                            <Input
                                id="ticketQuantity"
                                type="number"
                                min={1}
                                max={10}
                                value={ticketQuantity}
                                onChange={(e) => setTicketQuantity(Number(e.target.value))}
                                className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-700 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Base Price:</span>
                                <span>₹{basePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">GST (18%):</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsBookingModalOpen(false)}
                            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={paymentLoading}
                            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                        >
                            {paymentLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>Proceed to Payment</>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Payment Success Modal */}
            <Dialog open={isPaymentSuccess} onOpenChange={setIsPaymentSuccess}>
                <DialogContent className="bg-[#1e1b2d] text-white border-gray-800 max-w-md">
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-green-400">Payment Successful!</h2>
                        <p className="text-gray-300 mb-6">
                            Your tickets for {event.movieTitle} have been confirmed.
                        </p>

                        <div className="bg-[#2a2742] rounded-md p-4 text-left space-y-2 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Order ID:</span>
                                <span className="font-mono">{orderId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Payment ID:</span>
                                <span className="font-mono">{paymentId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Amount Paid:</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Tickets:</span>
                                <span>{ticketQuantity}</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setIsPaymentSuccess(false);
                                router.push("/my-tickets");
                            }}
                            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                        >
                            View My Tickets
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Trailer Modal */}
            <Dialog open={isTrailerModalOpen} onOpenChange={setIsTrailerModalOpen}>
                <DialogContent className="bg-[#1e1b2d] text-white border-gray-800 max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold mb-2">
                            {event.movieTitle} - Trailer
                        </DialogTitle>
                    </DialogHeader>

                    <div className="aspect-video w-full overflow-hidden rounded-md">
                        <video
                            src={event.movieTrailer}
                            controls
                            className="w-full h-full"
                            autoPlay
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 