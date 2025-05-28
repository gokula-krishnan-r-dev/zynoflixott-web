"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { userId } from "@/lib/user";

// Validation schema
const liveStreamSchema = z.object({
    producerName: z.string().min(1, "Producer name is required"),
    directorName: z.string().min(1, "Director name is required"),
    heroName: z.string().min(1, "Hero name is required"),
    heroinName: z.string().min(1, "Heroin name is required"),
    movieTitle: z.string().min(1, "Movie title is required"),
    movieSubtitles: z.string().optional(),
    movieCategory: z.string().min(1, "Movie category is required"),
    movieDescription: z.string().min(10, "Movie description must be at least 10 characters"),
    movieTrailer: z.string().min(1, "Movie trailer is required"),
    moviePoster: z.string().min(1, "Movie poster is required"),
    movieVideo: z.string().min(1, "Original movie video is required"),
    movieLength: z.coerce.number().min(1, "Movie length is required"),
    movieCertificate: z.string().min(1, "Movie certificate is required"),
    movieLanguage: z.string().min(1, "Movie language is required"),
    streamingDateTime: z.date({
        required_error: "Streaming date and time is required",
        invalid_type_error: "That's not a valid date and time",
    }),
    ticketCost: z.coerce.number().min(1, "Ticket cost must be at least 1"),
    paymentId: z.string().optional(),
    orderId: z.string().optional()
});

type FormData = z.infer<typeof liveStreamSchema>;

// Movie categories
const movieCategories = [
    "Action", "Adventure", "Comedy", "Crime", "Drama",
    "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"
];

// Movie certificates
const movieCertificates = ["U", "U/A", "A", "S"];

// Movie languages
const movieLanguages = [
    "Tamil", "Telugu", "Malayalam", "Kannada",
    "Hindi", "English", "Bengali", "Marathi"
];

export default function LiveStreamForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [progress, setProgress] = useState(0);

    // File upload states
    const [uploadProgress, setUploadProgress] = useState({
        trailer: 0,
        poster: 0,
        video: 0
    });
    const [uploading, setUploading] = useState({
        trailer: false,
        poster: false,
        video: false
    });

    // Files and preview URLs
    const [trailerFile, setTrailerFile] = useState<File | null>(null);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState({
        trailer: "",
        poster: "",
        video: ""
    });

    // Form handling
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm<FormData>({
        resolver: zodResolver(liveStreamSchema),
        defaultValues: {
            producerName: "",
            directorName: "",
            heroName: "",
            heroinName: "",
            movieTitle: "",
            movieSubtitles: "",
            movieCategory: "",
            movieDescription: "",
            movieTrailer: "",
            moviePoster: "",
            movieVideo: "",
            movieLength: 0,
            movieCertificate: "",
            movieLanguage: "",
            streamingDateTime: new Date(),
            ticketCost: 199,
            paymentId: "",
            orderId: ""
        }
    });

    const formStep = (currentStep: number) => {
        return step === currentStep;
    };

    const nextStep = () => {
        if (step < 2) {
            setStep(step + 1);
            setProgress((step + 1) * 33.33);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setProgress((step - 1) * 33.33);
        }
    };

    // Handle payment initialization
    const handlePayment = async () => {
        try {
            setPaymentLoading(true);

            // Initialize payment with Razorpay
            const { data } = await axios.post("/api/live-stream/payment", {
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
                key: process.env.RAZORPAY_KEY_ID || "rzp_test_sFWdQDykS3jwfU",
                amount: data.amount * 100, // Amount in paisa
                currency: data.currency,
                name: "Zynoflix",
                description: "Create Live Stream Payment",
                order_id: data.orderId,
                handler: function (response: any) {
                    handlePaymentSuccess(response);
                },
                prefill: {
                    name: watch("producerName"),
                    email: "user@example.com",
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
        toast.success("Payment successful! You can now create your live stream.");
        // Store payment details for form submission
        setValue("paymentId", response.razorpay_payment_id);
        setValue("orderId", response.razorpay_order_id);
        nextStep();
    };

    // Submit form data
    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);

            const today = new Date();

            // Check if streaming date is in the future
            if (data.streamingDateTime <= today) {
                toast.error("Streaming date and time must be in the future");
                setLoading(false);
                return;
            }

            // Format streamingDateTime for the API
            const formattedData = {
                ...data,
                streamingDate: data.streamingDateTime.toISOString().split('T')[0],
                streamingTime: data.streamingDateTime.toTimeString().split(' ')[0].slice(0, 5)
            };

            // Submit data to API
            const response = await axios.post("/api/live-stream", formattedData, {
                headers: {
                    userId: userId
                }
            });

            if (response.status === 200) {
                toast.success("Live stream created successfully!");
                reset();
                router.push("/my-live-streams");
            } else {
                toast.error("Failed to create live stream");
            }

        } catch (error: any) {
            console.error("Form submission error:", error);
            toast.error(error.response?.data?.error || "Failed to create live stream");
        } finally {
            setLoading(false);
        }
    };

    // Handle trailer file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file is a video
        if (!file.type.startsWith('video/')) {
            toast.error("Please upload a video file");
            return;
        }

        // Check file size (limit to 100MB)
        if (file.size > 100 * 1024 * 1024) {
            toast.error("File size should be less than 100MB");
            return;
        }

        setTrailerFile(file);

        // Create a temporary preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(prev => ({ ...prev, trailer: objectUrl }));

        // Cleanup the URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl);
    };

    // Upload the trailer file
    const uploadTrailer = async () => {
        if (!trailerFile) {
            toast.error("Please select a trailer video to upload");
            return false;
        }

        try {
            setUploading(prev => ({ ...prev, trailer: true }));
            setUploadProgress(prev => ({ ...prev, trailer: 0 }));

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', trailerFile);
            formData.append('userId', userId || '');
            formData.append('fileType', 'trailer');

            // Upload the file with progress tracking
            const response = await axios.post("/api/upload/media", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    userId: userId
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({ ...prev, trailer: percentCompleted }));
                    }
                }
            });

            // Check if the response has fileUrl
            if (!response.data.fileUrl) {
                throw new Error("No file URL returned from server");
            }

            // Set the trailer URL in the form
            setValue("movieTrailer", response.data.fileUrl);
            toast.success("Trailer uploaded successfully!");

            return true;
        } catch (error) {
            console.error("Trailer upload failed:", error);
            // Fallback option - if API is not fully set up, use the local URL temporarily
            if (process.env.NODE_ENV === 'development') {
                const fallbackUrl = URL.createObjectURL(trailerFile);
                setValue("movieTrailer", fallbackUrl);
                toast.warning("Using local preview URL for trailer (development mode)");
                return true;
            }

            toast.error("Failed to upload trailer. Please try again.");
            return false;
        } finally {
            setUploading(prev => ({ ...prev, trailer: false }));
        }
    };

    // Handle poster file upload
    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file for the poster");
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Poster image size should be less than 5MB");
            return;
        }

        setPosterFile(file);

        // Create a temporary preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(prev => ({ ...prev, poster: objectUrl }));

        // Cleanup the URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl);
    };

    // Upload the poster file to Azure
    const uploadPoster = async () => {
        if (!posterFile) {
            toast.error("Please select a poster image to upload");
            return false;
        }

        try {
            setUploading(prev => ({ ...prev, poster: true }));
            setUploadProgress(prev => ({ ...prev, poster: 0 }));

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', posterFile);
            formData.append('userId', userId || '');
            formData.append('fileType', 'poster');

            // Upload the file with progress tracking
            const response = await axios.post("/api/upload/media", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    userId: userId
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({ ...prev, poster: percentCompleted }));
                    }
                }
            });

            // Check if the response has fileUrl
            if (!response.data.fileUrl) {
                throw new Error("No file URL returned from server");
            }

            // Set the poster URL in the form
            setValue("moviePoster", response.data.fileUrl);
            toast.success("Poster uploaded successfully!");

            return true;
        } catch (error) {
            console.error("Poster upload failed:", error);
            // Fallback option - if API is not fully set up, use the local URL temporarily
            if (process.env.NODE_ENV === 'development') {
                const fallbackUrl = URL.createObjectURL(posterFile);
                setValue("moviePoster", fallbackUrl);
                toast.warning("Using local preview URL for poster (development mode)");
                return true;
            }

            toast.error("Failed to upload poster. Please try again.");
            return false;
        } finally {
            setUploading(prev => ({ ...prev, poster: false }));
        }
    };

    // Handle original video file upload
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file is a video
        if (!file.type.startsWith('video/')) {
            toast.error("Please upload a video file");
            return;
        }

        // Check file size (limit to 1GB)
        if (file.size > 1024 * 1024 * 1024) {
            toast.error("File size should be less than 1GB");
            return;
        }

        setVideoFile(file);

        // Create a temporary preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(prev => ({ ...prev, video: objectUrl }));

        // Cleanup the URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl);
    };

    //handleFirstStepNext
    const handleFirstStepNext = () => {
        if (watch("movieTrailer") && watch("moviePoster")) {
            nextStep();
        } else {
            toast.error("Please upload the trailer and poster before proceeding");
        }
    }

    // Upload the original video file to Azure
    const uploadVideo = async () => {
        if (!videoFile) {
            toast.error("Please select the original movie video to upload");
            return false;
        }

        try {
            setUploading(prev => ({ ...prev, video: true }));
            setUploadProgress(prev => ({ ...prev, video: 0 }));

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', videoFile);
            formData.append('userId', userId || '');
            formData.append('fileType', 'video');

            // Upload the file with progress tracking
            const response = await axios.post("/api/upload/media", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    userId: userId
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({ ...prev, video: percentCompleted }));
                    }
                }
            });

            // Check if the response has fileUrl
            if (!response.data.fileUrl) {
                throw new Error("No file URL returned from server");
            }

            // Set the video URL in the form
            setValue("movieVideo", response.data.fileUrl);
            toast.success("Movie video uploaded successfully!");

            return true;
        } catch (error) {
            console.error("Video upload failed:", error);
            // Fallback option - if API is not fully set up, use the local URL temporarily
            if (process.env.NODE_ENV === 'development') {
                const fallbackUrl = URL.createObjectURL(videoFile);
                setValue("movieVideo", fallbackUrl);
                toast.warning("Using local preview URL for video (development mode)");
                return true;
            }

            toast.error("Failed to upload movie video. Please try again.");
            return false;
        } finally {
            setUploading(prev => ({ ...prev, video: false }));
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-6 bg-gradient-to-b from-[#0f0f1a] to-[#1a0f2d] min-h-screen text-gray-100">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Create a Live Stream</h1>
                <p className="text-gray-400 text-lg">Share your short film with the world through a live stream</p>

                {/* Progress bar */}
                <div className="mt-8">
                    <Progress value={progress} className="h-2 bg-gray-800" />
                    <div className="flex justify-between mt-3 text-sm">
                        <span className={step >= 1 ? "font-medium text-purple-400" : "text-gray-500"}>Movie Information</span>
                        {/* <span className={step >= 2 ? "font-medium text-purple-400" : "text-gray-500"}>Payment</span> */}
                        <span className={step >= 2 ? "font-medium text-purple-400" : "text-gray-500"}>Streaming Details</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
                {/* Step 1: Basic Information */}
                {formStep(1) && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6 p-8 bg-[#1e1b2d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="producerName" className="text-gray-300">Producer Name</Label>
                                <Input
                                    id="producerName"
                                    placeholder="Enter producer name"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("producerName")}
                                />
                                {errors.producerName && (
                                    <span className="text-red-400 text-sm">{errors.producerName.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="directorName" className="text-gray-300">Director Name</Label>
                                <Input
                                    id="directorName"
                                    placeholder="Enter director name"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("directorName")}
                                />
                                {errors.directorName && (
                                    <span className="text-red-400 text-sm">{errors.directorName.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="heroName" className="text-gray-300">Hero Name</Label>
                                <Input
                                    id="heroName"
                                    placeholder="Enter hero name"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("heroName")}
                                />
                                {errors.heroName && (
                                    <span className="text-red-400 text-sm">{errors.heroName.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="heroinName" className="text-gray-300">Heroin Name</Label>
                                <Input
                                    id="heroinName"
                                    placeholder="Enter heroin name"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("heroinName")}
                                />
                                {errors.heroinName && (
                                    <span className="text-red-400 text-sm">{errors.heroinName.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="movieTitle" className="text-gray-300">Movie Title</Label>
                                <Input
                                    id="movieTitle"
                                    placeholder="Enter movie title"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("movieTitle")}
                                />
                                {errors.movieTitle && (
                                    <span className="text-red-400 text-sm">{errors.movieTitle.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="movieSubtitles" className="text-gray-300">Movie Subtitle (Optional)</Label>
                                <Input
                                    id="movieSubtitles"
                                    placeholder="Enter movie subtitle"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("movieSubtitles")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="movieCategory" className="text-gray-300">Movie Category</Label>
                                <select
                                    id="movieCategory"
                                    className="flex h-10 w-full rounded-md bg-[#2a2742] border border-gray-700 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                    {...register("movieCategory")}
                                >
                                    <option value="">Select a category</option>
                                    {movieCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.movieCategory && (
                                    <span className="text-red-400 text-sm">{errors.movieCategory.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="movieLength" className="text-gray-300">Movie Length (minutes)</Label>
                                <Input
                                    id="movieLength"
                                    type="number"
                                    placeholder="Enter movie length in minutes"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("movieLength")}
                                />
                                {errors.movieLength && (
                                    <span className="text-red-400 text-sm">{errors.movieLength.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="movieCertificate" className="text-gray-300">Movie Certificate</Label>
                                <select
                                    id="movieCertificate"
                                    className="flex h-10 w-full rounded-md bg-[#2a2742] border border-gray-700 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                    {...register("movieCertificate")}
                                >
                                    <option value="">Select a certificate</option>
                                    {movieCertificates.map((cert) => (
                                        <option key={cert} value={cert}>
                                            {cert}
                                        </option>
                                    ))}
                                </select>
                                {errors.movieCertificate && (
                                    <span className="text-red-400 text-sm">{errors.movieCertificate.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="movieLanguage" className="text-gray-300">Movie Language</Label>
                                <select
                                    id="movieLanguage"
                                    className="flex h-10 w-full rounded-md bg-[#2a2742] border border-gray-700 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                                    {...register("movieLanguage")}
                                >
                                    <option value="">Select a language</option>
                                    {movieLanguages.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                                {errors.movieLanguage && (
                                    <span className="text-red-400 text-sm">{errors.movieLanguage.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="movieTrailer" className="text-gray-300">Movie Trailer Video</Label>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="dropzone-file-trailer"
                                        className={`flex flex-col items-center justify-center w-full h-48 border-2 ${errors.movieTrailer ? 'border-red-500' : 'border-gray-700 border-dashed'
                                            } rounded-lg cursor-pointer bg-[#2a2742] hover:bg-[#302e4d] transition-colors`}
                                    >
                                        {previewUrl.trailer ? (
                                            <div className="relative w-full h-full">
                                                <video
                                                    src={previewUrl.trailer}
                                                    className="w-full h-full object-contain"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setTrailerFile(null);
                                                        setPreviewUrl(prev => ({ ...prev, trailer: "" }));
                                                        setValue("movieTrailer", "");
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload trailer</span> or drag and drop</p>
                                                <p className="text-xs text-gray-400">MP4, WebM, MKV (MAX. 100MB)</p>
                                            </div>
                                        )}
                                        <input
                                            id="dropzone-file-trailer"
                                            type="file"
                                            className="hidden"
                                            accept="video/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>

                                {trailerFile && !watch("movieTrailer") && (
                                    <Button
                                        type="button"
                                        onClick={uploadTrailer}
                                        disabled={uploading.trailer}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        {uploading.trailer ? (
                                            <div className="flex items-center space-x-2">
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Uploading Trailer {uploadProgress.trailer}%</span>
                                            </div>
                                        ) : (
                                            <span>Upload Trailer</span>
                                        )}
                                    </Button>
                                )}

                                {watch("movieTrailer") && (
                                    <div className="flex items-center space-x-2 p-2 bg-green-900/30 border border-green-800 rounded">
                                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-green-400 text-sm">
                                            Trailer uploaded successfully!
                                            {process.env.NODE_ENV === 'development' &&
                                                <span className="ml-2 text-amber-300 text-xs">(Development mode)</span>
                                            }
                                        </p>
                                    </div>
                                )}

                                {errors.movieTrailer && (
                                    <span className="text-red-400 text-sm">{errors.movieTrailer.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="moviePoster" className="text-gray-300">Movie Poster Image</Label>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="dropzone-file-poster"
                                        className={`flex flex-col items-center justify-center w-full h-48 border-2 ${errors.moviePoster ? 'border-red-500' : 'border-gray-700 border-dashed'
                                            } rounded-lg cursor-pointer bg-[#2a2742] hover:bg-[#302e4d] transition-colors`}
                                    >
                                        {previewUrl.poster ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={previewUrl.poster}
                                                    className="w-full h-full object-contain"
                                                    alt="Movie poster preview"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPosterFile(null);
                                                        setPreviewUrl(prev => ({ ...prev, poster: "" }));
                                                        setValue("moviePoster", "");
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload poster</span> or drag and drop</p>
                                                <p className="text-xs text-gray-400">JPG, PNG (MAX. 5MB)</p>
                                            </div>
                                        )}
                                        <input
                                            id="dropzone-file-poster"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePosterChange}
                                        />
                                    </label>
                                </div>

                                {posterFile && !watch("moviePoster") && (
                                    <Button
                                        type="button"
                                        onClick={uploadPoster}
                                        disabled={uploading.poster}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        {uploading.poster ? (
                                            <div className="flex items-center space-x-2">
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Uploading Poster {uploadProgress.poster}%</span>
                                            </div>
                                        ) : (
                                            <span>Upload Poster</span>
                                        )}
                                    </Button>
                                )}

                                {watch("moviePoster") && (
                                    <div className="flex items-center space-x-2 p-2 bg-green-900/30 border border-green-800 rounded">
                                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-green-400 text-sm">
                                            Poster uploaded successfully!
                                            {process.env.NODE_ENV === 'development' &&
                                                <span className="ml-2 text-amber-300 text-xs">(Development mode)</span>
                                            }
                                        </p>
                                    </div>
                                )}

                                {errors.moviePoster && (
                                    <span className="text-red-400 text-sm">{errors.moviePoster.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="movieVideo" className="text-gray-300">Original Movie Video</Label>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="dropzone-file-video"
                                        className={`flex flex-col items-center justify-center w-full h-48 border-2 ${errors.movieVideo ? 'border-red-500' : 'border-gray-700 border-dashed'
                                            } rounded-lg cursor-pointer bg-[#2a2742] hover:bg-[#302e4d] transition-colors`}
                                    >
                                        {previewUrl.video ? (
                                            <div className="relative w-full h-full">
                                                <video
                                                    src={previewUrl.video}
                                                    className="w-full h-full object-contain"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setVideoFile(null);
                                                        setPreviewUrl(prev => ({ ...prev, video: "" }));
                                                        setValue("movieVideo", "");
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload original video</span> or drag and drop</p>
                                                <p className="text-xs text-gray-400">MP4, WebM, MKV (MAX. 1GB)</p>
                                            </div>
                                        )}
                                        <input
                                            id="dropzone-file-video"
                                            type="file"
                                            className="hidden"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                        />
                                    </label>
                                </div>

                                {videoFile && !watch("movieVideo") && (
                                    <Button
                                        type="button"
                                        onClick={uploadVideo}
                                        disabled={uploading.video}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        {uploading.video ? (
                                            <div className="flex items-center space-x-2">
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Uploading Video {uploadProgress.video}%</span>
                                            </div>
                                        ) : (
                                            <span>Upload Original Video</span>
                                        )}
                                    </Button>
                                )}

                                {watch("movieVideo") && (
                                    <div className="flex items-center space-x-2 p-2 bg-green-900/30 border border-green-800 rounded">
                                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-green-400 text-sm">
                                            Original video uploaded successfully!
                                            {process.env.NODE_ENV === 'development' &&
                                                <span className="ml-2 text-amber-300 text-xs">(Development mode)</span>
                                            }
                                        </p>
                                    </div>
                                )}

                                {errors.movieVideo && (
                                    <span className="text-red-400 text-sm">{errors.movieVideo.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="movieDescription" className="text-gray-300">Movie Description</Label>
                            <Textarea
                                id="movieDescription"
                                placeholder="Enter a detailed description of your movie"
                                className="min-h-[120px] bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                {...register("movieDescription")}
                            />
                            {errors.movieDescription && (
                                <span className="text-red-400 text-sm">{errors.movieDescription.message}</span>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={handleFirstStepNext}
                                disabled={loading || uploading.trailer}
                                className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-6"
                            >
                                Next Step
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Payment */}
                {/* {formStep(2) && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 p-8 bg-[#1e1b2d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">Payment</h2>
                            <p className="text-gray-400 mb-8">
                                To create a live stream, a payment of ₹199 is required as a platform fee.
                            </p>

                            <div className="p-8 border border-purple-800 rounded-lg bg-[#2a1f4a] mb-8">
                                <h3 className="text-xl font-semibold mb-4 text-purple-300">What you get:</h3>
                                <ul className="list-disc list-inside text-left space-y-3 text-gray-300">
                                    <li>Host your short film live on our platform</li>
                                    <li>Access to analytics dashboard</li>
                                    <li>Promotion on our homepage</li>
                                    <li>In-app notifications to subscribers</li>
                                    <li>24/7 technical support during your stream</li>
                                </ul>
                            </div>

                            <Button
                                type="button"
                                className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white text-lg py-6 px-10"
                                onClick={handlePayment}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>Pay ₹199</>
                                )}
                            </Button>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={loading}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Previous Step
                            </Button>
                        </div>
                    </motion.div>
                )} */}

                {/* Step 3: Streaming Details */}
                {formStep(2) && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 p-8 bg-[#1e1b2d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800"
                    >
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="streamingDateTime" className="text-gray-300">Streaming Date and Time</Label>
                                <div className="relative">
                                    <Controller
                                        control={control}
                                        name="streamingDateTime"
                                        render={({ field }) => (
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date: Date | null) => {
                                                    field.onChange(date || new Date());
                                                }}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                minDate={new Date()}
                                                className="w-full bg-[#2a2742] border border-gray-700 focus:border-purple-500 text-white rounded-md p-2"
                                                calendarClassName="bg-[#2a2742] text-white border border-gray-700 shadow-xl rounded-md"
                                                dayClassName={date =>
                                                    date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()
                                                        ? "bg-purple-600 text-white rounded-full"
                                                        : "text-white hover:bg-purple-500 hover:text-white rounded-full"
                                                }
                                                popperClassName="react-datepicker-popper"
                                            />
                                        )}
                                    />
                                </div>
                                {errors.streamingDateTime && (
                                    <span className="text-red-400 text-sm">{errors.streamingDateTime.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ticketCost" className="text-gray-300">Ticket Cost (₹)</Label>
                                <Input
                                    id="ticketCost"
                                    type="number"
                                    placeholder="Enter ticket cost in rupees"
                                    className="bg-[#2a2742] border-gray-700 focus:border-purple-500 text-white"
                                    {...register("ticketCost")}
                                />
                                {errors.ticketCost && (
                                    <span className="text-red-400 text-sm">{errors.ticketCost.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={loading}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Previous Step
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-6"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>Create Live Stream</>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </form>
        </div>
    );
} 