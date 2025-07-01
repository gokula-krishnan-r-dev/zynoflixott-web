'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaListAlt, FaAlignLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// Predefined promotion types
const promotionTypes = [
    'Trailer Promotion',
    'Exclusive Interview',
    'Trailer Review',
    'Global Exposure',
    'Other'
];

type ValidationErrors = {
    [key: string]: string;
};

const AdvertisementPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        date: '',
        promotionType: '',
        contact: '',
        email: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Validate field on change
        validateField(name, value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formData[name as keyof typeof formData]);
    };


    useEffect(() => {
        // Google Ads conversion tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
                'send_to': 'AW-17096022152/a2q_CK3ZlucaEIixgtg_'
            });
        }
    }, []);

    const validateField = (name: string, value: string) => {
        let errors = { ...validationErrors };

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    errors[name] = 'Name is required';
                } else if (value.trim().length < 3) {
                    errors[name] = 'Name must be at least 3 characters';
                } else {
                    delete errors[name];
                }
                break;
            case 'email':
                if (!value.trim()) {
                    errors[name] = 'Email is required';
                } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    errors[name] = 'Please enter a valid email address';
                } else {
                    delete errors[name];
                }
                break;
            case 'contact':
                if (!value.trim()) {
                    errors[name] = 'Contact number is required';
                } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
                    errors[name] = 'Please enter a valid phone number';
                } else {
                    delete errors[name];
                }
                break;
            case 'location':
                if (!value.trim()) {
                    errors[name] = 'Location is required';
                } else {
                    delete errors[name];
                }
                break;
            case 'date':
                if (!value) {
                    errors[name] = 'Date is required';
                } else {
                    delete errors[name];
                }
                break;
            case 'promotionType':
                if (!value) {
                    errors[name] = 'Promotion type is required';
                } else {
                    delete errors[name];
                }
                break;
            case 'description':
                if (!value.trim()) {
                    errors[name] = 'Description is required';
                } else if (value.trim().length < 10) {
                    errors[name] = 'Description must be at least 10 characters';
                } else {
                    delete errors[name];
                }
                break;
            default:
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateForm = () => {
        // Mark all fields as touched to show errors
        const touchedFields = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as { [key: string]: boolean });

        setTouched(touchedFields);

        // Validate all fields
        let isValid = true;
        let errors = {} as ValidationErrors;

        Object.entries(formData).forEach(([field, value]) => {
            const fieldValid = validateField(field, value as string);
            if (!fieldValid) isValid = false;
        });

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate the form before submission
        if (!validateForm()) {
            setError('Please correct the errors in the form');
            // Scroll to first error
            const firstErrorField = document.querySelector('.error-field');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/advertisement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit form');
            }

            // Form submitted successfully
            setSuccess(true);
            setFormData({
                name: '',
                location: '',
                date: '',
                promotionType: '',
                contact: '',
                email: '',
                description: ''
            });
            setValidationErrors({});
            setTouched({});

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white pt-24 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-body shadow-xl rounded-lg overflow-hidden mb-10">
                    <div className="text-white py-8 px-6 text-center">
                        <h1 className="text-3xl font-bold tracking-wide">ADVERTISEMENT</h1>
                        <div className="mt-4 bg-blue-600 py-3 px-4 rounded-lg animate-pulse">
                            <span className="font-bold text-xl text-blue-100">FREE FOR 30 DAYS PROMOTION</span>
                            <p className="mt-1 text-blue-100">UNLIMITED REACHES AND ENGAGEMENT</p>
                        </div>
                    </div>

                    {success ? (
                        <div className="p-8 text-center">
                            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
                                <div className="flex justify-center mb-4">
                                    <FaCheckCircle className="text-green-400 text-5xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-green-400 mb-4">Thank you for your submission!</h2>
                                <p className="text-green-300 mb-6">Your advertisement request has been received. Our team will contact you shortly.</p>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => {
                                        setSuccess(false);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-8 text-white">
                                <h2 className="text-2xl font-bold text-white mb-6 text-center">CONTACT FORM</h2>
                                {error && (
                                    <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
                                        <FaExclamationTriangle className="text-red-400" />
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-5">
                                        <div className={`${touched.name && validationErrors.name ? 'error-field' : ''}`}>
                                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                                <FaUser className="text-blue-400" /> NAME
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                placeholder="Your full name"
                                                className={`w-full px-4 py-3 rounded-md border ${touched.name && validationErrors.name ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                                            />
                                            {touched.name && validationErrors.name && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-red-400" size={12} />
                                                    {validationErrors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`${touched.location && validationErrors.location ? 'error-field' : ''}`}>
                                            <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                                <FaMapMarkerAlt className="text-blue-400" /> LOCATION
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                placeholder="Your city/country"
                                                className={`w-full px-4 py-3 rounded-md border ${touched.location && validationErrors.location ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                                            />
                                            {touched.location && validationErrors.location && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-red-400" size={12} />
                                                    {validationErrors.location}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`${touched.date && validationErrors.date ? 'error-field' : ''}`}>
                                            <label htmlFor="date" className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                                <FaCalendarAlt className="text-blue-400" /> DATE
                                            </label>
                                            <input
                                                type="date"
                                                id="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                className={`w-full px-4 py-3 rounded-md border ${touched.date && validationErrors.date ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                                            />
                                            {touched.date && validationErrors.date && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-red-400" size={12} />
                                                    {validationErrors.date}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`${touched.promotionType && validationErrors.promotionType ? 'error-field' : ''}`}>
                                            <label htmlFor="promotionType" className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                                <FaListAlt className="text-blue-400" /> TYPE OF PROMOTION
                                            </label>
                                            <select
                                                id="promotionType"
                                                name="promotionType"
                                                value={formData.promotionType}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                className={`w-full px-4 py-3 rounded-md border ${touched.promotionType && validationErrors.promotionType ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                                            >
                                                <option value="" className="bg-gray-800">Select promotion type</option>
                                                {promotionTypes.map((type) => (
                                                    <option key={type} value={type} className="bg-gray-800">
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                            {touched.promotionType && validationErrors.promotionType && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-red-400" size={12} />
                                                    {validationErrors.promotionType}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`${touched.contact && validationErrors.contact ? 'error-field' : ''}`}>
                                            <label htmlFor="contact" className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                                <FaPhone className="text-blue-400" /> CONTACT
                                            </label>
                                            <input
                                                type="tel"
                                                id="contact"
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                placeholder="Your phone number"
                                                className={`w-full px-4 py-3 rounded-md border ${touched.contact && validationErrors.contact ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                                            />
                                            {touched.contact && validationErrors.contact && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-red-400" size={12} />
                                                    {validationErrors.contact}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`${touched.email && validationErrors.email ? 'error-field' : ''}`}>
                                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                                <FaEnvelope className="text-blue-400" /> EMAIL
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                placeholder="Your email address"
                                                className={`w-full px-4 py-3 rounded-md border ${touched.email && validationErrors.email ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                                            />
                                            {touched.email && validationErrors.email && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-red-400" size={12} />
                                                    {validationErrors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`${touched.description && validationErrors.description ? 'error-field' : ''}`}>
                                            <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                                <FaAlignLeft className="text-blue-400" /> DESCRIPTION
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                placeholder="Tell us more about your promotion needs"
                                                rows={5}
                                                className={`w-full px-4 py-3 rounded-md border ${touched.description && validationErrors.description ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                                            />
                                            {touched.description && validationErrors.description && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <FaExclamationTriangle className="text-red-400" size={12} />
                                                    {validationErrors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Submitting...
                                                </span>
                                            ) : 'Submit Request'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-gray-800/50 px-8 py-10">
                                <h2 className="text-2xl font-bold text-white mb-8 text-center">OUR PROMOTION FEATURES</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-900/70 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border border-blue-500/20">
                                        <div className="bg-blue-600 py-4 px-5">
                                            <h3 className="text-lg font-semibold text-white">Trailer Promotion</h3>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-gray-300">We'll publish your film trailer on the Zynoflix OTT platform to reach a wide audience.</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900/70 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border border-blue-500/20">
                                        <div className="bg-blue-600 py-4 px-5">
                                            <h3 className="text-lg font-semibold text-white">Exclusive Interview</h3>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-gray-300">Get a 25-minute featured interview hosted by us and published on our official platform.</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900/70 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border border-blue-500/20">
                                        <div className="bg-blue-600 py-4 px-5">
                                            <h3 className="text-lg font-semibold text-white">Trailer Review</h3>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-gray-300">Our team will create and share a professional review of your trailer.</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900/70 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border border-blue-500/20">
                                        <div className="bg-blue-600 py-4 px-5">
                                            <h3 className="text-lg font-semibold text-white">Global Exposure</h3>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-gray-300">We'll promote your content across our network for maximum international reach.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvertisementPage; 