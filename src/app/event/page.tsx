'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaTrophy, FaFilm, FaAward, FaCertificate, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const EventPage = () => {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        filmTitle: '',
        filmDuration: '',
        filmGenre: '',
        agreeToTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/event-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit registration');
            }

            // Registration submitted successfully
            setShowRegistrationModal(false);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                filmTitle: '',
                filmDuration: '',
                filmGenre: '',
                agreeToTerms: false
            });

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
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
                                <h3 className="text-3xl font-bold">₹10 Lakhs</h3>
                            </div>
                            <p className="text-yellow-100">+ Chance to Get Your Film Produced by Zynoflix</p>
                        </div>

                        {/* Second Prize */}
                        <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl p-6 transform hover:scale-105 transition duration-300 shadow-xl">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-bold text-xl mr-4">2</div>
                                <h3 className="text-3xl font-bold">₹7.5 Lakhs</h3>
                            </div>
                        </div>

                        {/* Third Prize */}
                        <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl p-6 transform hover:scale-105 transition duration-300 shadow-xl">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 font-bold text-xl mr-4">3</div>
                                <h3 className="text-3xl font-bold">₹5 Lakhs</h3>
                            </div>
                        </div>
                    </div>

                    {/* Other Prizes */}
                    <div className="bg-indigo-900 bg-opacity-30 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-bold mb-4 text-center text-indigo-300">Additional Prizes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">4th Prize:</span>
                                <span>₹2.5 Lakhs</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">5th Prize:</span>
                                <span>₹1 Lakh</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">6th Prize:</span>
                                <span>₹50,000</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-indigo-300">7th Prize:</span>
                                <span>₹10,000</span>
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
                    <h2 className="text-3xl font-bold text-center mb-12">Event Timeline</h2>
                    <div className="relative">
                        {/* Line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-600"></div>

                        {/* Timeline Items */}
                        <div className="space-y-12 md:space-y-0">
                            {/* Item 1 */}
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                                    <h3 className="text-xl font-bold text-indigo-300">Submissions Open</h3>
                                    <p className="text-gray-300">23/05/2025</p>
                                </div>
                                <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center z-10 mb-4 md:mb-0">
                                    <div className="bg-white h-3 w-3 rounded-full"></div>
                                </div>
                                <div className="md:w-1/2 md:pl-12 md:text-left hidden md:block"></div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="md:w-1/2 md:pr-12 md:text-right hidden md:block"></div>
                                <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center z-10 mb-4 md:mb-0">
                                    <div className="bg-white h-3 w-3 rounded-full"></div>
                                </div>
                                <div className="md:w-1/2 md:pl-12 md:text-left">
                                    <h3 className="text-xl font-bold text-indigo-300">Submission Deadline</h3>
                                    <p className="text-gray-300">07/07/2025</p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                                    <h3 className="text-xl font-bold text-indigo-300">Finalists Announcement</h3>
                                    <p className="text-gray-300">15/07/2025</p>
                                </div>
                                <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center z-10 mb-4 md:mb-0">
                                    <div className="bg-white h-3 w-3 rounded-full"></div>
                                </div>
                                <div className="md:w-1/2 md:pl-12 md:text-left hidden md:block"></div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="md:w-1/2 md:pr-12 md:text-right hidden md:block"></div>
                                <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center z-10 mb-4 md:mb-0">
                                    <div className="bg-white h-3 w-3 rounded-full"></div>
                                </div>
                                <div className="md:w-1/2 md:pl-12 md:text-left">
                                    <h3 className="text-xl font-bold text-indigo-300">Festival & Awards</h3>
                                    <p className="text-gray-300">20/07/2025</p>
                                </div>
                            </div>
                        </div>
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

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 mt-6"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </form>
                    </div>
                </div>
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
        </div>
    );
};

export default EventPage;