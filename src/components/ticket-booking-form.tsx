"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Ticket, Calendar, Clock, CreditCard } from "lucide-react";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { userId } from "@/lib/user";

interface TicketBookingFormProps {
    eventId: string;
    movieTitle: string;
    streamingDate: string;
    streamingTime: string;
    ticketCost: number;
}

export default function TicketBookingForm({
    eventId,
    movieTitle,
    streamingDate,
    streamingTime,
    ticketCost
}: TicketBookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<"initial" | "processing" | "success" | "error">("initial");
    const [error, setError] = useState<string | null>(null);

    // Format date for display
    const formattedDate = format(new Date(streamingDate), "EEE, MMM d, yyyy");

    // Format price with currency
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(ticketCost);

    // Calculate GST (18%)
    const gst = ticketCost * 0.18;
    const formattedGst = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(gst);

    // Total amount
    const totalAmount = ticketCost + gst;
    const formattedTotal = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(totalAmount);

    // Handler for initiating payment
    const handleBookTicket = async () => {
        try {
            if (!userId) {
                toast.error("Please login to book tickets");
                return;
            }

            setLoading(true);
            setBookingStatus("processing");
            setError(null);

            // 1. Initialize Razorpay payment
            const { data: paymentData } = await axios.post("/api/live-stream/payment", {
                eventId,
                headers: {
                    userId
                }
            });

            if (!paymentData || !paymentData.orderId) {
                throw new Error("Failed to initialize payment");
            }

            // 2. Load Razorpay script if not already loaded
            if (!(window as any).Razorpay) {
                await loadRazorpayScript();
            }

            // 3. Open Razorpay payment dialog
            const razorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_sFWdQDykS3jwfU",
                amount: paymentData.amount * 100, // Amount in paisa
                currency: paymentData.currency || "INR",
                name: "Zynoflix",
                description: `Ticket for ${movieTitle}`,
                order_id: paymentData.orderId,
                handler: function (response: any) {
                    handlePaymentSuccess(response, paymentData.orderId);
                },
                prefill: {
                    name: "User",
                    email: "user@example.com"
                },
                theme: {
                    color: "#7c3aed"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setBookingStatus("initial");
                    }
                }
            };

            const razorpay = new (window as any).Razorpay(razorpayOptions);
            razorpay.open();

        } catch (error: any) {
            console.error("Payment initialization error:", error);
            setError(error.response?.data?.error || "Failed to initialize payment");
            setBookingStatus("error");
            toast.error(error.response?.data?.error || "Failed to initialize payment");
        } finally {
            setLoading(false);
        }
    };

    // Handle successful payment
    const handlePaymentSuccess = async (paymentResponse: any, orderId: string) => {
        try {
            setLoading(true);

            // Create ticket in database
            const response = await axios.post("/api/live-stream/book", {
                eventId,
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: orderId,
                amount: totalAmount
            }, {
                headers: {
                    userId
                }
            });

            if (response.data.success) {
                setBookingStatus("success");
                toast.success("Ticket booked successfully!");

                // Navigate to tickets page after a brief delay
                setTimeout(() => {
                    router.push("/my-tickets");
                }, 2000);
            } else {
                throw new Error(response.data.error || "Failed to book ticket");
            }
        } catch (error: any) {
            console.error("Ticket booking error:", error);
            setError(error.response?.data?.error || "Failed to book ticket");
            setBookingStatus("error");
            toast.error(error.response?.data?.error || "Failed to book ticket");
        } finally {
            setLoading(false);
        }
    };

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            document.body.appendChild(script);
        });
    };

    return (
        <Card className="bg-[#1e1b2d] border-gray-800 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
                <CardTitle className="flex items-center text-2xl">
                    <Ticket className="mr-2 h-6 w-6" />
                    Book Your Ticket
                </CardTitle>
                <CardDescription className="text-gray-200">
                    Secure your spot for this live streaming event
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                        <div>
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="font-medium text-white">{formattedDate}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-purple-400" />
                        <div>
                            <p className="text-sm text-gray-400">Time</p>
                            <p className="font-medium text-white">{streamingTime}</p>
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Ticket Price</span>
                        <span className="text-white">{formattedPrice}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">GST (18%)</span>
                        <span className="text-white">{formattedGst}</span>
                    </div>
                    <Separator className="bg-gray-700 my-2" />
                    <div className="flex justify-between font-semibold">
                        <span className="text-gray-300">Total</span>
                        <span className="text-white">{formattedTotal}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="bg-[#211f32] p-6">
                {bookingStatus === "success" ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full text-center"
                    >
                        <div className="flex items-center justify-center text-green-400 mb-2">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-green-400 font-medium">Ticket booked successfully!</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Redirecting to your tickets...
                        </p>
                    </motion.div>
                ) : bookingStatus === "error" ? (
                    <div className="w-full">
                        <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-md mb-4">
                            <p className="font-medium">Booking failed</p>
                            <p className="text-sm">{error || "An error occurred while booking your ticket"}</p>
                        </div>
                        <Button
                            onClick={() => setBookingStatus("initial")}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={handleBookTicket}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Book Now ({formattedTotal})
                            </>
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
} 