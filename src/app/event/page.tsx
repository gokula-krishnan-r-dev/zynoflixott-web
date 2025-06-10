'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaTrophy, FaFilm, FaAward, FaCertificate, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

// Define styles for the shadow-glow effect
// This will be added to the existing element with className="shadow-glow"
const shadowGlowStyle = {
    boxShadow: '0 0 15px rgba(129, 140, 248, 0.5), 0 0 30px rgba(129, 140, 248, 0.3)'
};

const EventPage = () => {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        filmTitle: '',
        filmDuration: '',
        filmGenre: '',
        driverLink: "",
        agreeToTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [formValidated, setFormValidated] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: (e.target as HTMLInputElement).checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone ||
            !formData.filmTitle || !formData.filmDuration ||
            !formData.filmGenre || !formData.driverLink ||
            !formData.agreeToTerms) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            setError("Please fill all required fields");
            return;
        }

        setFormValidated(true);
        setLoading(true);
        setError(null);

        try {
            // Initialize Razorpay payment directly
            const options = {
                key: "rzp_live_N9cN73EC0erg5Y", // Replace with your Razorpay test key
                amount: 10000, // ₹100 in paise
                currency: "INR",
                name: "Zynoflix OTT",
                description: "Short Film Festival Registration Fee",
                image: "/logo_sm.png",
                handler: function (response: any) {
                    // Payment successful, submit the form
                    submitFormData(response);
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                notes: {
                    filmTitle: formData.filmTitle,
                    filmGenre: formData.filmGenre
                },
                theme: {
                    color: "#6366F1" // Indigo color
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setPaymentProcessing(false);
                    }
                }
            };

            // Open Razorpay checkout
            const razorpayInstance = new (window as any).Razorpay(options);
            setPaymentProcessing(true);
            razorpayInstance.open();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setLoading(false);
            setPaymentProcessing(false);
        }
    };

    const submitFormData = async (paymentResponse: any) => {
        try {
            // Form submission after successful payment
            const submissionData = {
                ...formData,
                payment: {
                    id: paymentResponse.razorpay_payment_id,
                    amount: 100, // ₹100
                    currency: "INR",
                    status: "completed"
                }
            };

            // Store in localStorage as a fallback
            localStorage.setItem('filmFestivalRegistration', JSON.stringify(submissionData));

            // Registration submitted successfully
            setShowRegistrationModal(false);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                filmTitle: '',
                driverLink: "",
                filmDuration: '',
                filmGenre: '',
                agreeToTerms: false
            });

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred during registration');
        } finally {
            setLoading(false);
            setPaymentProcessing(false);
        }
    };

    const openRegistrationModal = () => {
        setShowRegistrationModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Success Message */}
            {success && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8 max-w-md text-center animate-fade-in shadow-2xl">
                        <FaCheckCircle className="mx-auto text-green-400 text-5xl mb-4" />
                        <h2 className="text-2xl font-bold mb-3">Registration Successful!</h2>
                        <p className="mb-4">Thank you for registering your film for the Zynoflix OTT Online Short Film Festival 2025.</p>
                        <p className="mb-6">We've sent a confirmation email with further details. Our team will review your submission and get back to you soon.</p>
                        <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-lg"
                            onClick={() => setSuccess(false)}
                        >
                            Continue to Event Page
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6">
                            <Image
                                src="/logo_sm.png"
                                alt="Zynoflix Logo"
                                width={150}
                                height={150}
                                className="animate-pulse"
                            />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Zynoflix OTT</span>
                            <br />Online Short Film Festival 2025
                        </h1>
                        <div className="flex items-center justify-center space-x-2 mb-10 bg-indigo-900 bg-opacity-50 px-6 py-3 rounded-full">
                            <FaCalendarAlt className="text-indigo-300" />
                            <span className="text-xl">20th July 2025</span>
                        </div>
                        <button
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full transform transition duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                            onClick={openRegistrationModal}
                        >
                            <span>Register Now</span>
                            <FaArrowRight className="animate-bounce" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Prize Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-center mb-8">
                        <FaTrophy className="text-yellow-400 text-3xl mr-3" />
                        <h2 className="text-3xl md:text-4xl font-bold">Win Cash & Recognition</h2>
                    </div>
                    <p className="text-center text-2xl md:text-3xl font-bold mb-12 text-indigo-300">Total Prizes Over ₹25 Lakhs!</p>

                    <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 mb-12">
                        {/* First Prize */}
                        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 transform hover:scale-105 transition duration-300 shadow-xl">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-900 font-bold text-xl mr-4">1</div>
                                <h3 className="text-3xl font-bold">$12,019.23 USD</h3>
                            </div>
                            <p className="text-yellow-100">+ Chance to Get Your Film Produced by Zynoflix</p>
                        </div>

                        {/* Second Prize */}
                        <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl p-6 transform hover:scale-105 transition duration-300 shadow-xl">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-bold text-xl mr-4">2</div>
                                <h3 className="text-3xl font-bold">$9,014.42 USD</h3>
                            </div>
                        </div>

                        {/* Third Prize */}
                        <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl p-6 transform hover:scale-105 transition duration-300 shadow-xl">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 font-bold text-xl mr-4">3</div>
                                <h3 className="text-3xl font-bold">$6,009.62 USD</h3>
                            </div>
                        </div>
                    </div>

                    {/* Other Prizes */}
                    <div className="bg-indigo-900 bg-opacity-30 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-bold mb-4 text-center text-indigo-300">Additional Prizes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">4th Prize:</span>
                                <span>$3,004.81 USD</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">5th Prize:</span>
                                <span>$1,165.50 USD</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">6th Prize:</span>
                                <span>$600 USD</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">7th Prize:</span>
                                <span>$116.51 USD</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">8th Prize:</span>
                                <span>Certificate + Trophy</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">9th & 10th:</span>
                                <span>Certificates</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-4 bg-indigo-900 bg-opacity-20 rounded-lg">
                        <FaCertificate className="text-indigo-300 mr-2" />
                        <p className="text-lg">All Participants Receive Official Certificates</p>
                    </div>
                </div>

                {/* Showcase Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-center mb-8">
                        <FaFilm className="text-indigo-400 text-3xl mr-3" />
                        <h2 className="text-3xl md:text-4xl font-bold">Submit Your Film. Showcase Your Talent.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-indigo-900 bg-opacity-20 p-6 rounded-xl border border-indigo-600 hover:border-indigo-400 transition duration-300">
                            <h3 className="text-xl font-bold mb-3 text-indigo-300">Who Can Participate?</h3>
                            <p>Open to filmmakers of all ages and backgrounds. Students, professionals, and independent creators are welcome.</p>
                        </div>

                        <div className="bg-indigo-900 bg-opacity-20 p-6 rounded-xl border border-indigo-600 hover:border-indigo-400 transition duration-300">
                            <h3 className="text-xl font-bold mb-3 text-indigo-300">Film Requirements</h3>
                            <p>Short films between 5-30 minutes. Any genre welcome. Films must be original and produced after January 2023.</p>
                        </div>

                        <div className="bg-indigo-900 bg-opacity-20 p-6 rounded-xl border border-indigo-600 hover:border-indigo-400 transition duration-300">
                            <h3 className="text-xl font-bold mb-3 text-indigo-300">Selection Process</h3>
                            <p>Films will be judged by an esteemed panel of industry professionals. Selection criteria include storytelling, direction, cinematography, and overall impact.</p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full transform transition duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                            onClick={openRegistrationModal}
                        >
                            <span>Register Now</span>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-center mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Event Timeline</h2>
                    </div>

                    {/* Mobile Timeline */}
                    <div className="md:hidden relative">
                        <div className="absolute left-4 top-0 h-full w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 rounded-full"></div>

                        {/* Timeline Items - Mobile */}
                        <div className="space-y-12 pl-12 relative">
                            {[
                                { title: "Submissions Open", date: "01/06/2025", icon: "📝", color: "from-green-500 to-emerald-700" },
                                { title: "Submission Deadline", date: "20/07/2025", icon: "⏱️", color: "from-yellow-500 to-amber-700" },
                                { title: "Finalists Announcement", date: "27/07/2025", icon: "🏆", color: "from-blue-500 to-indigo-700" },
                                { title: "Festival & Awards", date: "01/08/2025", icon: "🎬", color: "from-purple-500 to-pink-700" }
                            ].map((item, index) => (
                                <div key={index} className="relative group">
                                    <div className="absolute -left-12 top-0 bg-indigo-600 border-4 border-indigo-900 rounded-full h-8 w-8 flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300" style={shadowGlowStyle}>
                                        <div className="bg-white h-2 w-2 rounded-full"></div>
                                    </div>
                                    <div className={`bg-gradient-to-br ${item.color} p-5 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}>
                                        <div className="text-2xl mb-2">{item.icon}</div>
                                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                        <p className="text-white text-opacity-80">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Timeline */}
                    <div className="hidden md:block relative mx-auto max-w-5xl">
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 rounded-full"></div>

                        {/* Timeline Items - Desktop */}
                        <div>
                            {[
                                { title: "Submissions Open", date: "01/06/2025", icon: "📝", color: "from-green-500 to-emerald-700", position: "left" },
                                { title: "Submission Deadline", date: "20/07/2025", icon: "⏱️", color: "from-yellow-500 to-amber-700", position: "right" },
                                { title: "Finalists Announcement", date: "27/07/2025", icon: "🏆", color: "from-blue-500 to-indigo-700", position: "left" },
                                { title: "Festival & Awards", date: "01/08/2025", icon: "🎬", color: "from-purple-500 to-pink-700", position: "right" }
                            ].map((item, index) => (
                                <div key={index} className={`flex items-center justify-center mb-16 ${item.position === 'left' ? 'md:justify-start' : 'md:justify-end'}`}>
                                    <div className={`relative flex ${item.position === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center w-full mx-auto`}>
                                        <div className="order-1 w-6/12"></div>

                                        <div className="z-10 flex items-center order-1 bg-indigo-600 border-4 border-indigo-900 rounded-full w-10 h-10 md:absolute md:left-1/2 md:-ml-5" style={shadowGlowStyle}>
                                            <div className="mx-auto bg-white h-3 w-3 rounded-full"></div>
                                        </div>

                                        <div className={`order-1 ${item.position === 'left' ? 'md:w-5/12 md:pr-10' : 'md:w-5/12 md:pl-10'}`}>
                                            <div className={`p-6 bg-gradient-to-br ${item.color} rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 group`}>
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl mr-2">{item.icon}</span>
                                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                                </div>
                                                <p className="text-white text-opacity-80">{item.date}</p>
                                                <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 text-center">
                        <p className="text-xl text-indigo-300 mb-6 animate-pulse">Mark your calendars for this exciting event!</p>
                        <button
                            onClick={openRegistrationModal}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transform transition duration-300 hover:scale-105 shadow-xl flex items-center mx-auto"
                        >
                            <span>Register Now</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {showRegistrationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Register for Film Festival</h2>
                            <button
                                className="text-gray-400 hover:text-white text-2xl"
                                onClick={() => setShowRegistrationModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <p className="mb-6 text-gray-300">Fill out the form below to register your short film for the festival.</p>

                        {error && (
                            <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="filmTitle" className="block text-sm font-medium text-gray-300 mb-1">Film Title</label>
                                <input
                                    type="text"
                                    id="filmTitle"
                                    name="filmTitle"
                                    value={formData.filmTitle}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="filmDuration" className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        id="filmDuration"
                                        name="filmDuration"
                                        min="5"
                                        max="30"
                                        value={formData.filmDuration}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="filmGenre" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <select
                                        id="filmGenre"
                                        name="filmGenre"
                                        value={formData.filmGenre}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Genre</option>
                                        <option value="drama">Drama</option>
                                        <option value="comedy">Comedy</option>
                                        <option value="thriller">Thriller</option>
                                        <option value="horror">Horror</option>
                                        <option value="documentary">Documentary</option>
                                        <option value="animation">Animation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* //google link */}

                            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="driverLink" className="block text-sm font-medium text-gray-300 mb-1">Google Driver Link</label>
                                    <input
                                        type="text"
                                        id="driverLink"
                                        name="driverLink"
                                        value={formData.driverLink}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>


                            </div>

                            <div className="flex items-start mt-4">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToTerms" className="text-gray-300">
                                        I agree to the terms and conditions of the festival
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 bg-indigo-900 bg-opacity-30 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-indigo-300 font-medium">Registration Fee</span>
                                </div>
                                <p className="text-gray-300 text-sm">A one-time registration fee of <span className="font-bold text-white">$1.3</span> is required to submit your film.</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 mt-6 flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : paymentProcessing ? 'Processing Payment...' : 'Pay $1.3 & Submit Registration'}
                                {!loading && !paymentProcessing && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div >
                </div >
            )}

            {/* Footer */}
            <div className="bg-gray-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 mb-4 md:mb-0">© 2024 Zynoflix OTT. All rights reserved.</p>
                        <div className="flex space-x-6">
                            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition">Terms & Conditions</Link>
                            <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EventPage;