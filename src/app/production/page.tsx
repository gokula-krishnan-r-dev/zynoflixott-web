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
        <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl pt-12 mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg shadow-lg mb-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
                            FILM
                        </h1>
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                            PRODUCTION
                        </h1>
                    </div>

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
                        <h2 className="text-3xl font-bold text-white mb-2">ZYNOFLIX PRODUCTION </h2>
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

            {/* Production Process Timeline */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Script to Film: Step-by-Step Process
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Your journey from script submission to screen
                    </p>
                </motion.div>

                {/* Phase Cards */}
                <div className="space-y-16">
                    {/* Phase 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <div className="flex items-center mb-6">
                            <div className="bg-purple-600 rounded-full p-3">
                                <span className="text-2xl">🧩</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white ml-4">PHASE 1: Script Acquisition</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">1. Script Submission</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Submit via zynoflixott.com/production or email</li>
                                    <li>• Include logline, synopsis, screenplay</li>
                                    <li>• Attach writer's profile</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">2. Initial Screening</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Evaluation for originality</li>
                                    <li>• Budget feasibility check</li>
                                    <li>• Zynoflix audience fit analysis</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">3. Shortlist</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Move promising scripts to shortlist</li>
                                    <li>• Assign internal reviewer</li>
                                    <li>• Begin detailed evaluation</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Phase 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <div className="flex items-center mb-6">
                            <div className="bg-blue-600 rounded-full p-3">
                                <span className="text-2xl">📞</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white ml-4">PHASE 2: Writer Communication</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">4. First Contact</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Initial communication</li>
                                    <li>• Schedule discussion call</li>
                                    <li>• Share preliminary feedback</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">5. Concept Development</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Creative discussion</li>
                                    <li>• Character arc review</li>
                                    <li>• Audience targeting</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">6. Script Approval</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Final script lock</li>
                                    <li>• Move to legal phase</li>
                                    <li>• Prepare for agreements</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Phase 3 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <div className="flex items-center mb-6">
                            <div className="bg-green-600 rounded-full p-3">
                                <span className="text-2xl">📝</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white ml-4">PHASE 3: Agreement & Rights</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">7. Production Agreement</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Rights transfer/license</li>
                                    <li>• Compensation terms</li>
                                    <li>• Credit and copyright</li>
                                    <li>• NDA and confidentiality</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <h4 className="text-xl font-semibold text-white mb-3">8. Script Registration</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• SWA registration</li>
                                    <li>• Legal documentation</li>
                                    <li>• Rights protection</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Phase 4-8 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">🎥</span>
                                    <h4 className="text-xl font-semibold text-white">PHASE 4: Pre-Production</h4>
                                </div>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Planning and scheduling</li>
                                    <li>• Cast and crew finalization</li>
                                    <li>• Location scouting</li>
                                    <li>• Technical preparations</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">🎬</span>
                                    <h4 className="text-xl font-semibold text-white">PHASE 5: Production</h4>
                                </div>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Principal photography</li>
                                    <li>• Daily progress monitoring</li>
                                    <li>• Budget management</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">🧑‍💻</span>
                                    <h4 className="text-xl font-semibold text-white">PHASE 6: Post-Production</h4>
                                </div>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Editing and sound design</li>
                                    <li>• Color grading and VFX</li>
                                    <li>• Final review and delivery</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">📡</span>
                                    <h4 className="text-xl font-semibold text-white">PHASE 7: Release</h4>
                                </div>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Platform upload</li>
                                    <li>• Marketing campaign</li>
                                    <li>• Social media promotion</li>
                                </ul>
                            </div>
                            <div className="bg-[#1a0733]/80 p-6 rounded-lg">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">✅</span>
                                    <h4 className="text-xl font-semibold text-white">PHASE 8: Post-Release</h4>
                                </div>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Performance tracking</li>
                                    <li>• Revenue distribution</li>
                                    <li>• Feedback collection</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>


            {/* Terms & Conditions Section */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Terms & Conditions
                    </h2>
                    <p className="text-gray-300 text-lg">
                        For Script Submission & Film Production
                    </p>
                    <div className="mt-4 text-purple-400">
                        <p>Effective Date: June 1, 2024</p>
                        <p>Jurisdiction: India</p>
                    </div>
                </motion.div>

                <div className="space-y-8">
                    {/* Eligibility */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">1. Eligibility</h3>
                        <p className="text-gray-300 mb-4">
                            By submitting a script to Zynoflix Production, the submitter confirms that they:
                        </p>
                        <ul className="text-gray-300 space-y-3 list-disc pl-6">
                            <li>Are 18 years or older</li>
                            <li>Are the original creator and legal copyright holder of the script</li>
                            <li>Have full rights to submit the script for consideration</li>
                        </ul>
                    </motion.div>

                    {/* Script Submission */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">2. Script Submission</h3>
                        <ul className="text-gray-300 space-y-3 list-disc pl-6">
                            <li>Scripts must be original, unpublished, and not under contract with any third party</li>
                            <li>Zynoflix Production reserves the right to accept or reject any script without explanation</li>
                            <li>Submissions must be made via the official form or email listed on https://zynoflixott.com/production</li>
                        </ul>
                    </motion.div>

                    {/* Evaluation & Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">3. Evaluation & Selection</h3>
                        <ul className="text-gray-300 space-y-3 list-disc pl-6">
                            <li>All submissions will be reviewed by our internal creative team</li>
                            <li>Shortlisted scripts will be contacted for further discussion</li>
                            <li>Final selection does not guarantee production unless mutually agreed upon</li>
                        </ul>
                    </motion.div>

                    {/* Ownership & Rights */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">4. Ownership & Rights</h3>
                        <ul className="text-gray-300 space-y-3 list-disc pl-6">
                            <li>The scriptwriter retains copyright of the script until a Production Agreement is signed</li>
                            <li>Upon agreement, Zynoflix Production may acquire exclusive rights to develop, produce, distribute, and monetize the content in all formats and platforms</li>
                            <li>All rights transferred will be clearly outlined in a separate legal agreement</li>
                        </ul>
                    </motion.div>

                    {/* Compensation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">5. Compensation</h3>
                        <ul className="text-gray-300 space-y-3 list-disc pl-6">
                            <li>Writers of selected scripts will be compensated as per mutual agreement outlined in the Production Agreement</li>
                            <li>Compensation may include a fixed fee, revenue share, or other benefits</li>
                        </ul>
                    </motion.div>

                    {/* Confidentiality */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">6. Confidentiality</h3>
                        <ul className="text-gray-300 space-y-3 list-disc pl-6">
                            <li>All scripts submitted will be treated as confidential</li>
                            <li>Zynoflix Production agrees not to share scripts with third parties without prior written consent</li>
                        </ul>
                    </motion.div>

                    {/* Dispute Resolution */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">7. Dispute Resolution</h3>
                        <ul className="text-gray-300 space-y-3 list-disc pl-6">
                            <li>In the event of a dispute, parties agree to resolve matters amicably</li>
                            <li>If unresolved, disputes will be subject to the jurisdiction of courts in Coimbatore, Tamil Nadu, India</li>
                        </ul>
                    </motion.div>

                    {/* Modification of Terms */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="bg-[#292c41]/50 rounded-xl p-8 backdrop-blur-sm border border-[#7b61ff]/30"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">8. Modification of Terms</h3>
                        <p className="text-gray-300">
                            Zynoflix Production reserves the right to update these terms at any time. Continued submission implies acceptance of the latest terms.
                        </p>
                    </motion.div>
                </div>
            </div>

        </div>
    );
} 