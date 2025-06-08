"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import CountdownTimer from "../../components/CountdownTimer";

// Form validation schema
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    contact: z.string().min(10, "Contact must be at least 10 characters"),
    email: z.string().email("Invalid email address"),
    appointmentDate: z.string().min(1, "Please select a meeting date"),
    appointmentTime: z.string().min(1, "Please select a meeting time"),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductionPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [productionId, setProductionId] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    // Handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        // Check file type (PDF only)
        if (selectedFile.type !== "application/pdf") {
            setFileError("Only PDF files are allowed");
            return;
        }

        // Check file size (10MB max)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
        if (selectedFile.size > MAX_FILE_SIZE) {
            setFileError("File size exceeds the 10MB limit");
            return;
        }

        setFile(selectedFile);
    };

    // Remove selected file
    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileError(null);
    };

    // Handle form submission
    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);

            if (!file) {
                setFileError("Please upload your script in PDF format");
                setIsSubmitting(false);
                return;
            }

            // Create form data
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("contact", data.contact);
            formData.append("email", data.email);
            formData.append("appointmentDate", data.appointmentDate);
            formData.append("appointmentTime", data.appointmentTime);
            formData.append("file", file);

            // Submit form
            const response = await axios.post("/api/production/submit", formData);

            if (response.data.success) {
                setProductionId(response.data.productionId);
                // Initiate payment
                handlePayment(response.data.productionId);
            }
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error.response?.data?.error || "Failed to submit form");
            setIsSubmitting(false);
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

    // Handle payment
    const handlePayment = async (id: string) => {
        try {
            setIsPaymentLoading(true);

            // Initialize payment with Razorpay
            const { data } = await axios.post("/api/production/payment", {
                productionId: id,
            });

            // Load Razorpay script
            if (!(window as any).Razorpay) {
                await loadRazorpay();
            }

            // Open Razorpay payment dialog
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_2wtNMTtIzCco0O",
                amount: data.amount * 100, // Amount in paise
                currency: data.currency,
                name: "ZynoFlix",
                description: "Short Film Production Submission",
                order_id: data.orderId,
                handler: function (response: any) {
                    handlePaymentSuccess(response, id);
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                theme: {
                    color: "#7c3aed",
                },
                modal: {
                    ondismiss: function () {
                        setIsPaymentLoading(false);
                        setIsSubmitting(false);
                    },
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment initialization failed:", error);
            toast.error("Payment initialization failed. Please try again.");
            setIsPaymentLoading(false);
            setIsSubmitting(false);
        }
    };

    // Handle payment success
    const handlePaymentSuccess = async (
        response: any,
        productionId: string
    ) => {
        try {
            // Verify payment
            await axios.post("/api/production/verify-payment", {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                productionId,
            });

            setIsPaymentLoading(false);
            setIsSubmitting(false);
            setIsSuccess(true);
            toast.success("Your script has been submitted successfully!");
            reset();
            setFile(null);
        } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
            setIsPaymentLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a0733] to-[#2c1157] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl pt-12 mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        FILM PRODUCTION
                    </h1>

                    {/* Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="bg-[#292c41]/50 rounded-lg p-6 backdrop-blur-sm border border-[#7b61ff]/30"
                        >
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                ARE YOU LOOKING PRODUCER FOR A FILM
                            </h2>
                            <p className="text-gray-300">
                                We are looking for amazing scripts to produce. Submit your work and get a chance to bring your story to life.
                            </p>
                        </motion.div>


                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="bg-[#292c41]/50 rounded-lg p-8 backdrop-blur-sm border border-[#7b61ff]/30 mb-10"
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">1000+ ZYNOFLIX PRODUCTION COMPANIES</h2>
                        <p className="text-xl text-[#7b61ff]">WE ARE LOOKING EMOTIONAL SCRIPT
                        </p>
                    </motion.div>
                </motion.div>

                {/* Success Message */}
                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#292c41]/50 rounded-lg p-8 backdrop-blur-sm border border-[#7b61ff]/30 text-center max-w-2xl mx-auto"
                    >
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-20 h-20 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Script Submitted Successfully!
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Thank you for submitting your script. Your meeting has been scheduled.
                            You will receive updates on your email within 48 hours.
                        </p>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="bg-[#7b61ff] text-white px-6 py-3 rounded-full font-medium hover:bg-[#6a4ff1] transition-colors"
                        >
                            Submit Another Script
                        </button>
                    </motion.div>
                ) : (
                    /* Form */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-[#292c41]/50 rounded-lg p-6 md:p-8 backdrop-blur-sm border border-[#7b61ff]/30 max-w-2xl mx-auto"
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Name Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="name"
                                    className="block text-white font-medium mb-2"
                                >
                                    NAME
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                                    placeholder="Your full name"
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-red-400 text-sm">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Contact Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="contact"
                                    className="block text-white font-medium mb-2"
                                >
                                    CONTACT
                                </label>
                                <input
                                    id="contact"
                                    type="text"
                                    {...register("contact")}
                                    className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                                    placeholder="Your phone number"
                                    disabled={isSubmitting}
                                />
                                {errors.contact && (
                                    <p className="mt-1 text-red-400 text-sm">
                                        {errors.contact.message}
                                    </p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="email"
                                    className="block text-white font-medium mb-2"
                                >
                                    EMAIL
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                                    placeholder="Your email address"
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-red-400 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Date and Time for Meeting */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Date Input */}
                                <div>
                                    <label
                                        htmlFor="appointmentDate"
                                        className="block text-white font-medium mb-2"
                                    >
                                        MEETING DATE
                                    </label>
                                    <input
                                        id="appointmentDate"
                                        type="date"
                                        {...register("appointmentDate")}
                                        className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                                        disabled={isSubmitting}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.appointmentDate && (
                                        <p className="mt-1 text-red-400 text-sm">
                                            {errors.appointmentDate.message}
                                        </p>
                                    )}
                                </div>

                                {/* Time Input */}
                                <div>
                                    <label
                                        htmlFor="appointmentTime"
                                        className="block text-white font-medium mb-2"
                                    >
                                        MEETING TIME
                                    </label>
                                    <input
                                        id="appointmentTime"
                                        type="time"
                                        {...register("appointmentTime")}
                                        className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                                        disabled={isSubmitting}
                                    />
                                    {errors.appointmentTime && (
                                        <p className="mt-1 text-red-400 text-sm">
                                            {errors.appointmentTime.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="mb-8">
                                <label
                                    htmlFor="script"
                                    className="block text-white font-medium mb-2"
                                >
                                    SCRIPT PDF
                                </label>

                                {file ? (
                                    <div className="flex items-center p-4 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg">
                                        <div className="flex-1 truncate">
                                            <p className="text-white truncate">{file.name}</p>
                                            <p className="text-gray-400 text-sm">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="ml-4 text-gray-400 hover:text-white"
                                            disabled={isSubmitting}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center ${fileError
                                            ? "border-red-400 bg-red-400/10"
                                            : "border-[#7b61ff]/30 bg-[#1a0733]/80 hover:bg-[#1a0733] hover:border-[#7b61ff]/50"
                                            } transition-colors cursor-pointer`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            id="script"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            disabled={isSubmitting}
                                        />
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-8 h-8 text-[#7b61ff] mb-2" />
                                            <p className="text-white font-medium">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                PDF file only (max 10MB)
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {fileError && (
                                    <p className="mt-1 text-red-400 text-sm">{fileError}</p>
                                )}
                            </div>

                            {/* Payment Information */}
                            <div className="mb-8 p-4 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">
                                        Submission Fee
                                    </span>
                                    <span className="text-white font-bold">₹100</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-2">
                                    This fee covers the review process of your script by our team.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#7b61ff] text-white rounded-lg font-medium text-lg hover:bg-[#6a4ff1] transition-colors flex items-center justify-center"
                            >
                                {isSubmitting || isPaymentLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {isPaymentLoading ? "Processing Payment..." : "Submitting..."}
                                    </>
                                ) : (
                                    "Submit & Pay ₹100"
                                )}
                            </button>

                            {/* Additional Information */}
                            <div className="mt-6 text-center text-gray-400 text-sm">
                                <p>MEETING SCHEDULED</p>
                                <p className="mt-1">
                                    YOU WILL GET UPDATES ON YOUR MAIL WITHIN 48 HOURS
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>

            {/* //LAST DATE ( JUNE 30 ) ( live timer ) */}

            <div className="w-full py-8 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 rounded-xl p-6 md:p-8 border border-purple-500/30 shadow-lg max-w-md w-full"
                >
                    <h3 className="text-center text-xl md:text-2xl font-bold text-white mb-3">
                        SUBMISSION DEADLINE
                    </h3>
                    <p className="text-center text-sm md:text-base text-purple-200 mb-6">
                        Don't miss your chance! Submit before the deadline.
                    </p>
                    <CountdownTimer targetDate="June 30, 2025" />
                </motion.div>
            </div>

            {/* <div className="py-14">
                <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                    <h2 className="text-center text-sm font-semibold text-gray-600">
                        TRUSTED BY TEAMS FROM AROUND THE WORLD
                    </h2>
                    <div className="mt-6">
                        <div className="overflow-x-auto">
                            <ul className="flex items-center space-x-8 min-w-max px-4">
                                <li>
                                    <img
                                        src="/images/company/1.png"
                                        alt="Company 1"
                                        className="h-auto w-24 lg:w-[150px] object-contain px-2 dark:brightness-0 dark:invert"
                                    />
                                </li>
                                <li>
                                    <img
                                        src="/images/company/2.png"
                                        alt="Company 2"
                                        className="h-auto w-24 lg:w-[150px] object-contain px-2 dark:brightness-0 dark:invert"
                                    />
                                </li>
                                <li>
                                    <img
                                        src="/images/company/3.png"
                                        alt="Company 3"
                                        className="h-auto w-24 lg:w-[150px] object-contain px-2 dark:brightness-0 dark:invert"
                                    />
                                </li>
                                <li>
                                    <img
                                        src="/images/company/4.png"
                                        alt="Company 4"
                                        className="h-auto w-24 lg:w-[150px] object-contain px-2 dark:brightness-0 dark:invert"
                                    />
                                </li>
                                <li>
                                    <img
                                        src="/images/company/5.png"
                                        alt="Company 5"
                                        className="h-auto w-24 lg:w-[150px] object-contain px-2 dark:brightness-0 dark:invert"
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> */}

        </div>
    );
} 