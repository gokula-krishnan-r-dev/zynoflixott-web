"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Upload, X, Calendar, Clock } from "lucide-react";
import Image from "next/image";

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  cityState: z.string().min(2, "City/State must be at least 2 characters"),
  shortFilmTitle: z.string().min(1, "Short film title is required"),
  runtime: z.string().min(1, "Runtime is required"),
  filmLanguage: z.string().min(1, "Film language is required"),
  isReleased: z.string(),
  driveLink: z.string().url("Please enter a valid URL").or(z.literal("")),
  synopsis: z.string().max(500, "Synopsis must be less than 500 words"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  budget: z.string().min(1, "Budget is required"),
  rightsType: z.string().min(1, "Rights type is required"),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductionPage() {
  const [poster, setPoster] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [posterError, setPosterError] = useState<string | null>(null);
  const [productionId, setProductionId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Handle poster file change
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosterError(null);
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Check file type (image only)
    if (!selectedFile.type.startsWith("image/")) {
      setPosterError("Only image files are allowed");
      return;
    }

    // Check file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (selectedFile.size > MAX_FILE_SIZE) {
      setPosterError("File size exceeds the 5MB limit");
      return;
    }

    setPoster(selectedFile);
  };

  // // Google Analytics conversion tracking
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && (window as any).gtag) {
  //     (window as any).gtag('event', 'conversion', {
  //       'send_to': 'AW-17096022152/fRVVCIyWjecaEIixgtg_'
  //     });
  //   }
  // }, []);

//    // Google Analytics conversion tracking
//    useEffect(() => {
//     if (typeof window !== 'undefined') {
//         // Google Tag Manager
//         (function(w: Window, d: Document, s: string, l: string, i: string) {
//             const wl = w as any;
//             wl[l] = wl[l] || [];
//             wl[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
//             const f = d.getElementsByTagName(s)[0];
//             const j = d.createElement(s) as HTMLScriptElement;
//             const dl = l !== 'dataLayer' ? '&l='+l : '';
//             j.async = true;
//             j.src = 'https://www.googletagmanager.com/gtm.js?id='+i+dl;
//             f.parentNode?.insertBefore(j,f);
//         })(window, document, 'script', 'dataLayer', 'GTM-P7RJCDB2');
        
//         // Google Ads conversion tracking
//         if ((window as any).gtag) {
//             (window as any).gtag('event', 'conversion', {
//                 'send_to': 'AW-17096022152/J8kWCP3PlucaEIixgtg_'
//             });
//         }
//     }
// }, []);

  // Remove selected poster
  const removePoster = () => {
    setPoster(null);
    if (posterInputRef.current) {
      posterInputRef.current.value = "";
    }
    setPosterError(null);
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Create form data
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("cityState", data.cityState);
      formData.append("shortFilmTitle", data.shortFilmTitle);
      formData.append("runtime", data.runtime);
      formData.append("filmLanguage", data.filmLanguage);
      formData.append("isReleased", data.isReleased);
      formData.append("driveLink", data.driveLink);
      formData.append("synopsis", data.synopsis);
      formData.append("appointmentDate", data.appointmentDate);
      formData.append("appointmentTime", data.appointmentTime);
      formData.append("budget", data.budget);
      formData.append("rightsType", data.rightsType);
      formData.append("additionalNotes", data.additionalNotes || "");

      if (poster) {
        formData.append("poster", poster);
      }

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
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_S6AcB6I8TQuoVM",
        amount: 500 * 100, // Amount in paise
        currency: "INR",
        name: "ZynoFlix",
        description: "Short Film Purchase Review",
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
      toast.success("Your request has been submitted successfully!");
      reset();
      setPoster(null);
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
      setIsPaymentLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">

      {/* Google tag (gtag.js) */}
      {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-R92MZPEMQD"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R92MZPEMQD');
          `
        }}
      /> */}
      <div className="max-w-5xl pt-12 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            SELL YOUR SHORTFILMS TO ZYNOFLIX OTT
          </h1>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-[#292c41]/50 rounded-lg p-6 backdrop-blur-sm border border-[#7b61ff]/30"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Ready to Monetize Your Short Film?
              </h2>
              <p className="text-gray-300">
                Join our platform and reach a global audience. We offer competitive rates and professional distribution for your creative work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-[#292c41]/50 rounded-lg p-6 backdrop-blur-sm border border-[#7b61ff]/30"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Fair Market Value
              </h2>
              <p className="text-gray-300">
                Get the best value for your short film. We evaluate each submission individually and offer competitive rates based on quality and market potential.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-[#292c41]/50 rounded-lg p-8 backdrop-blur-sm border border-[#7b61ff]/30 mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-2">REACH MILLIONS OF VIEWERS</h2>
            <p className="text-xl text-[#7b61ff]">Start your journey to success today</p>
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
              Request Submitted Successfully!
            </h2>
            <p className="text-gray-300 mb-6">
              Thank you for submitting your short film. Your appointment has been scheduled.
              You will receive updates on your email within 48 hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="bg-[#7b61ff] text-white px-6 py-3 rounded-full font-medium hover:bg-[#6a4ff1] transition-colors"
            >
              Submit Another Film
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
              {/* Full Name */}
              <div className="mb-6">
                <label
                  htmlFor="fullName"
                  className="block text-white font-medium mb-2"
                >
                  FULL NAME
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Your full name"
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-white font-medium mb-2"
                >
                  EMAIL ID
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

              {/* Phone Number */}
              <div className="mb-6">
                <label
                  htmlFor="phoneNumber"
                  className="block text-white font-medium mb-2"
                >
                  PHONE NUMBER
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  {...register("phoneNumber")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Your phone number"
                  disabled={isSubmitting}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* City/State */}
              <div className="mb-6">
                <label
                  htmlFor="cityState"
                  className="block text-white font-medium mb-2"
                >
                  CITY/STATE
                </label>
                <input
                  id="cityState"
                  type="text"
                  {...register("cityState")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Your city and state"
                  disabled={isSubmitting}
                />
                {errors.cityState && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.cityState.message}
                  </p>
                )}
              </div>

              {/* Short Film Title */}
              <div className="mb-6">
                <label
                  htmlFor="shortFilmTitle"
                  className="block text-white font-medium mb-2"
                >
                  SHORT FILM TITLE
                </label>
                <input
                  id="shortFilmTitle"
                  type="text"
                  {...register("shortFilmTitle")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Title of your short film"
                  disabled={isSubmitting}
                />
                {errors.shortFilmTitle && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.shortFilmTitle.message}
                  </p>
                )}
              </div>

              {/* Runtime */}
              <div className="mb-6">
                <label
                  htmlFor="runtime"
                  className="block text-white font-medium mb-2"
                >
                  RUNTIME (IN MINS)
                </label>
                <input
                  id="runtime"
                  type="text"
                  {...register("runtime")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Duration in minutes"
                  disabled={isSubmitting}
                />
                {errors.runtime && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.runtime.message}
                  </p>
                )}
              </div>

              {/* Film Language */}
              <div className="mb-6">
                <label
                  htmlFor="filmLanguage"
                  className="block text-white font-medium mb-2"
                >
                  FILM LANGUAGE
                </label>
                <input
                  id="filmLanguage"
                  type="text"
                  {...register("filmLanguage")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Language of your film"
                  disabled={isSubmitting}
                />
                {errors.filmLanguage && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.filmLanguage.message}
                  </p>
                )}
              </div>

              {/* Is Released */}
              <div className="mb-6">
                <label
                  className="block text-white font-medium mb-2"
                >
                  IS THE FILM ALREADY RELEASED ELSEWHERE?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      value="Yes"
                      {...register("isReleased")}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    Yes
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      value="No"
                      {...register("isReleased")}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    No
                  </label>
                </div>
                {errors.isReleased && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.isReleased.message}
                  </p>
                )}
              </div>

              {/* Drive Link */}
              <div className="mb-6">
                <label
                  htmlFor="driveLink"
                  className="block text-white font-medium mb-2"
                >
                  GOOGLE DRIVE/YOUTUBE LINK
                </label>
                <input
                  id="driveLink"
                  type="text"
                  {...register("driveLink")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Link to your film"
                  disabled={isSubmitting}
                />
                {errors.driveLink && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.driveLink.message}
                  </p>
                )}
              </div>

              {/* Synopsis */}
              <div className="mb-6">
                <label
                  htmlFor="synopsis"
                  className="block text-white font-medium mb-2"
                >
                  SYNOPSIS (MAX 500 WORDS)
                </label>
                <textarea
                  id="synopsis"
                  {...register("synopsis")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff] h-32"
                  placeholder="Brief description of your film"
                  disabled={isSubmitting}
                ></textarea>
                {errors.synopsis && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.synopsis.message}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div className="mb-6">
                <label
                  htmlFor="budget"
                  className="block text-white font-medium mb-2"
                >
                  Expected Price (₹2,000 - ₹10 LAKHS)
                </label>
                <input
                  id="budget"
                  type="text"
                  {...register("budget")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  placeholder="Budget in rupees"
                  disabled={isSubmitting}
                />
                {errors.budget && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.budget.message}
                  </p>
                )}
              </div>

              {/* Rights Type */}
              <div className="mb-6">
                <label
                  htmlFor="rightsType"
                  className="block text-white font-medium mb-2"
                >
                  TYPE OF RIGHTS YOU'RE OFFERING
                </label>
                <select
                  id="rightsType"
                  {...register("rightsType")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  disabled={isSubmitting}
                >
                  <option value="">Select rights type</option>
                  <option value="Full rights">Full rights</option>
                  <option value="Streaming rights only">Streaming rights only</option>
                  <option value="Open to discussion">Open to discussion</option>
                </select>
                {errors.rightsType && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.rightsType.message}
                  </p>
                )}
              </div>

              {/* Poster Upload */}
              <div className="mb-6">
                <label
                  htmlFor="poster"
                  className="block text-white font-medium mb-2"
                >
                  POSTER UPLOAD (OPTIONAL)
                </label>

                {poster ? (
                  <div className="flex items-center p-4 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg">
                    <div className="flex-1 truncate">
                      <p className="text-white truncate">{poster.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(poster.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removePoster}
                      className="ml-4 text-gray-400 hover:text-white"
                      disabled={isSubmitting}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${posterError
                      ? "border-red-400 bg-red-400/10"
                      : "border-[#7b61ff]/30 bg-[#1a0733]/80 hover:bg-[#1a0733] hover:border-[#7b61ff]/50"
                      } transition-colors cursor-pointer`}
                    onClick={() => posterInputRef.current?.click()}
                  >
                    <input
                      ref={posterInputRef}
                      id="poster"
                      type="file"
                      accept="image/*"
                      onChange={handlePosterChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-[#7b61ff] mb-2" />
                      <p className="text-white font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Image files only (max 5MB)
                      </p>
                    </div>
                  </div>
                )}

                {posterError && (
                  <p className="mt-1 text-red-400 text-sm">{posterError}</p>
                )}
              </div>

              {/* Appointment Date and Time */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="block text-white font-medium mb-2"
                  >
                    APPOINTMENT DATE
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar className="w-5 h-5 text-[#7b61ff]" />
                    </div>
                    <input
                      id="appointmentDate"
                      type="date"
                      {...register("appointmentDate")}
                      className="w-full pl-10 px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.appointmentDate && (
                    <p className="mt-1 text-red-400 text-sm">
                      {errors.appointmentDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="appointmentTime"
                    className="block text-white font-medium mb-2"
                  >
                    APPOINTMENT TIME
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock className="w-5 h-5 text-[#7b61ff]" />
                    </div>
                    <input
                      id="appointmentTime"
                      type="time"
                      {...register("appointmentTime")}
                      className="w-full pl-10 px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.appointmentTime && (
                    <p className="mt-1 text-red-400 text-sm">
                      {errors.appointmentTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mb-8">
                <label
                  htmlFor="additionalNotes"
                  className="block text-white font-medium mb-2"
                >
                  ADDITIONAL NOTES (OPTIONAL)
                </label>
                <textarea
                  id="additionalNotes"
                  {...register("additionalNotes")}
                  className="w-full px-4 py-3 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7b61ff] h-24"
                  placeholder="Any additional information you'd like to share"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* Payment Information */}
              <div className="mb-8 p-4 bg-[#1a0733]/80 border border-[#7b61ff]/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    Review Fee
                  </span>
                  <span className="text-white font-bold">₹500</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  This fee covers the review process of your short film by our team.
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
                  "Request for Purchase Review - ₹500"
                )}
              </button>

              {/* Additional Information */}
              <div className="mt-6 text-center text-gray-400 text-sm">
                <p>APPOINTMENT SCHEDULED</p>
                <p className="mt-1">
                  YOU WILL GET UPDATES ON YOUR EMAIL WITHIN 48 HOURS
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Terms and Conditions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mt-16 mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Terms & Conditions</h2>

        <div className="bg-[#292c41]/50 rounded-lg p-8 backdrop-blur-sm border border-[#7b61ff]/30">
          {/* Eligibility */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="bg-[#7b61ff] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
              Eligibility
            </h3>
            <ul className="text-gray-300 space-y-2 ml-11">
              <li>• Any independent filmmaker or production house can submit a completed short film for consideration.</li>
              <li>• The film must be original and not under contract with any other platform (unless rights are available).</li>
            </ul>
          </div>

          {/* Content Guidelines */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="bg-[#7b61ff] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
              Content Guidelines
            </h3>
            <ul className="text-gray-300 space-y-2 ml-11">
              <li>• Duration: Preferably under 30 minutes (flexible based on quality).</li>
              <li>• Language: Any Indian language (with subtitles if not Tamil/English).</li>
              <li>• Content: Should not promote hate speech, violence, or explicit adult content.</li>
            </ul>
          </div>

          {/* Submission */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="bg-[#7b61ff] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
              Submission
            </h3>
            <ul className="text-gray-300 space-y-2 ml-11">
              <li>• All submissions must be done via the official form only.</li>
              <li>• Submit: Film link (YouTube unlisted / Google Drive), trailer, synopsis, and poster (optional).</li>
            </ul>
          </div>

          {/* Selection Process */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="bg-[#7b61ff] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
              Selection Process
            </h3>
            <ul className="text-gray-300 space-y-2 ml-11">
              <li>• Our content team will review all submissions within 7–10 working days.</li>
              <li>• Only selected films will be contacted for further discussions.</li>
            </ul>
          </div>

          {/* Rights & Purchase */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="bg-[#7b61ff] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">5</span>
              Rights & Purchase
            </h3>
            <ul className="text-gray-300 space-y-2 ml-11">
              <li>• Selected films will be purchased for exclusive/limited-time OTT streaming.</li>
              <li>• The purchase model can be:</li>
              <ul className="ml-6 mt-2 space-y-1">
                <li>- One-Time Buyout (full rights)</li>
                <li>- Revenue Share (based on views)</li>
              </ul>
              <li className="mt-2">• Final decision on pricing and rights will be mutual.</li>
            </ul>
          </div>

          {/* Copyright & Ownership */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="bg-[#7b61ff] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">6</span>
              Copyright & Ownership
            </h3>
            <ul className="text-gray-300 space-y-2 ml-11">
              <li>• Filmmaker must own full rights to the film, including music, script, and footage.</li>
              <li>• You may be asked to sign a declaration or contract confirming ownership.</li>
            </ul>
          </div>

          {/* Platform Display */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="bg-[#7b61ff] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">7</span>
              Platform Display
            </h3>
            <ul className="text-gray-300 space-y-2 ml-11">
              <li>• ZynoFlix OTT reserves the right to promote, modify thumbnails, or include branding.</li>
              <li>• Filmmaker's name/director credit will be mentioned unless requested otherwise.</li>
            </ul>
          </div>
        </div>
      </motion.div>

    </div>
  );
} 
