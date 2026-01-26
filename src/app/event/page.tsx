'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaArrowRight,
} from 'react-icons/fa';
import { HiCalendar } from 'react-icons/hi2';

// Static data - Event dates (DD/MM/YYYY)
const EVENT_DATES = {
    submissionOpen: '23/01/2026',
    submissionDeadline: '24/02/2026',
    finalistAnnouncement: '28/02/2026',
    festivalAndAwards: '01/03/2026',
};

// Countdown target: Festival and Awards (01/03/2026 10:00 AM IST)
const COUNTDOWN_TARGET = new Date('2026-03-01T10:00:00+05:30');

// Event schedule (static)
const EVENT_SCHEDULE = [
    {
        name: 'Lola Singh',
        role: 'Director',
        time: '10:00 AM',
        date: '01/03/2026',
        avatar: '/images/photo.jpeg',
    },
    {
        name: 'Laura Thomas',
        role: 'Film Critic at FilmHub',
        time: '11:00 AM',
        date: '01/03/2026',
        avatar: '/images/photo2.jpeg',
    },
    {
        name: 'Break & Networking',
        role: '12:00 PM',
        time: '12:00 PM',
        date: '01/03/2026',
        avatar: '/images/photo3.jpeg',
    },
    {
        name: 'Short Film Screenings',
        role: '1:00 PM',
        time: '1:00 PM',
        date: '01/03/2026',
        avatar: '/images/photo5.jpeg',
    },
];

// Timeline (static)
const TIMELINE_ITEMS = [
    { title: 'Submission open', date: EVENT_DATES.submissionOpen, icon: '📝', color: 'from-green-500 to-emerald-700' },
    { title: 'Submission deadline', date: EVENT_DATES.submissionDeadline, icon: '⏱️', color: 'from-yellow-500 to-amber-700' },
    { title: 'Finalist Announcement', date: EVENT_DATES.finalistAnnouncement, icon: '🏆', color: 'from-blue-500 to-indigo-700' },
    { title: 'Festival and Awards', date: EVENT_DATES.festivalAndAwards, icon: '🎬', color: 'from-purple-500 to-pink-700' },
];

const shadowGlowStyle = {
    boxShadow: '0 0 15px rgba(129, 140, 248, 0.5), 0 0 30px rgba(129, 140, 248, 0.3)',
};

function useCountdown(target: Date) {
    const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const diff = target.getTime() - now;
            if (diff <= 0) {
                setLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);

    return left;
}

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** Single countdown unit: big number with label upper-right (per design). Animates when value changes. */
const CountdownUnit = memo(function CountdownUnit(
    { value, label, pad }: { value: number; label: string; pad: boolean }
) {
    const display = pad ? pad2(value) : `${value}`;
    return (
        <div className="inline-flex flex-row items-baseline min-w-0">
            <span
                key={`${label}-${value}`}
                className="animate-countdown-tick tabular-nums font-bold text-white drop-shadow-[0_0_20px_rgba(167,139,250,0.5)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none"
                style={{ fontVariantNumeric: 'tabular-nums' }}
            >
                {display}
            </span>
            <span className="ml-1.5 -translate-y-0.5 text-xs sm:text-sm font-normal text-purple-300/70 lowercase tracking-wide">
                {label}
            </span>
        </div>
    );
});

/** Countdown + event details. Isolated so only this subtree re-renders every second. */
const CountdownSection = memo(function CountdownSection() {
    const countdown = useCountdown(COUNTDOWN_TARGET);
    const units = useMemo(
        () => [
            { value: countdown.days, label: 'days', pad: false },
            { value: countdown.hours, label: 'hrs', pad: true },
            { value: countdown.minutes, label: 'min', pad: true },
            { value: countdown.seconds, label: 'sec', pad: true },
        ],
        [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]
    );

    return (
        <section className="flex flex-col items-center justify-center w-full py-8 md:py-10">
            <div
                className="flex flex-wrap items-baseline justify-center gap-4 md:gap-8"
                role="timer"
                aria-live="polite"
                aria-label={`Countdown: ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
            >
                {units.map((u, i) => (
                    <React.Fragment key={u.label}>
                        {i > 0 && (
                            <span
                                className="inline text-gray-400/50 text-xl md:text-2xl font-light leading-none select-none mx-0.5"
                                aria-hidden
                            >
                                ·
                            </span>
                        )}
                        <CountdownUnit value={u.value} label={u.label} pad={u.pad} />
                    </React.Fragment>
                ))}
            </div>
            <div className="mt-6 w-full max-w-md h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-lg text-white/85">
                <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-400 shrink-0" aria-hidden />
                    <span>{EVENT_DATES.festivalAndAwards}</span>
                </span>
                <span className="flex items-center gap-2">
                    <FaClock className="text-indigo-400 shrink-0" aria-hidden />
                    <span>10:00 AM – 8:00 PM (IST)</span>
                </span>
            </div>
        </section>
    );
});

const EventPage = () => {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        filmTitle: '',
        filmDuration: '',
        filmGenre: '',
        driverLink: '',
        agreeToTerms: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', { send_to: 'AW-17096022152/xRn6CKrZlucaEIixgtg_' });
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            (function (w: Window, d: Document, s: string, l: string, i: string) {
                const wl = w as any;
                wl[l] = wl[l] || [];
                wl[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                const f = d.getElementsByTagName(s)[0];
                const j = d.createElement(s) as HTMLScriptElement;
                const dl = l !== 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode?.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-P7RJCDB2');
            if ((window as any).gtag) {
                (window as any).gtag('event', 'conversion', { send_to: 'AW-17096022152/J8kWCP3PlucaEIixgtg_' });
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        return !!(
            formData.name &&
            formData.email &&
            formData.phone &&
            formData.filmTitle &&
            formData.filmDuration &&
            formData.filmGenre &&
            formData.driverLink &&
            formData.agreeToTerms
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            setError('Please fill all required fields');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/event-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    filmTitle: formData.filmTitle,
                    filmDuration: Number(formData.filmDuration),
                    filmGenre: formData.filmGenre,
                    driverLink: formData.driverLink || undefined,
                    agreeToTerms: formData.agreeToTerms,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            setShowRegistrationModal(false);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                filmTitle: '',
                filmDuration: '',
                filmGenre: '',
                driverLink: '',
                agreeToTerms: false,
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openRegistrationModal = () => setShowRegistrationModal(true);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
            {/* Success overlay */}
            {success && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 max-w-md text-center shadow-2xl">
                        <FaCheckCircle className="mx-auto text-green-400 text-5xl mb-4" />
                        <h2 className="text-2xl font-bold mb-3">Registration Successful!</h2>
                        <p className="mb-4">Thank you for registering for the ZynoFlix Short Film Festival 2026.</p>
                        <p className="mb-6">We&apos;ll send a confirmation email with further details. Our team will review your submission and get back to you soon.</p>
                        <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-lg"
                            onClick={() => setSuccess(false)}
                        >
                            Continue to Event Page
                        </button>
                    </div>
                </div>
            )}

            {/* Hero */}
            <section className="relative overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 bg-[url('/film-background.jpg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border-2 border-white/30">
                        <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                    </div>
                </div>
                <div className="relative z-10 px-4 py-12 md:py-20">
                    <h1 className="text-3xl md:text-5xl lg:text-4xl font-bold mb-3">
                        ZynoFlix Short Film Festival 2026
                    </h1>
                    <p className="text-white/90 text-base md:text-lg mb-2">
                        {EVENT_DATES.festivalAndAwards} • Virtual Event
                    </p>
                    <p className="text-white/80 italic mb-6">&ldquo;Celebrating Indie Filmmakers&rdquo;</p>
                    <button
                        className="bg-gradient-to-r w-full from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
                        onClick={openRegistrationModal}
                    >
                        <HiCalendar className="w-5 h-5" />
                        Register for Free
                    </button>
                  
                </div>
            </section>

            {/* Main content */}
            <div className="container mx-auto px-4 py-0">
                <CountdownSection />
                {/* About the Event */}
                <section className="mb-16">

                    <h2 className="text-2xl md:text-3xl font-bold mb-4">About the Event</h2>
                    <p className="text-white/80 max-w-3xl mb-8">
                        A virtual film festival featuring award-winning shorts, exclusive panels, live Q&A with directors, and networking sessions.
                    </p>
                    <div className="bg-gray rounded-2xl p-4 md:p-6 flex border border-gray-700 items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold mb-1">ZynoFlix Studios</h3>
                            <p className="text-white/70 text-sm">Leading OTT platform for indie films</p>
                        </div>
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 shrink-0">
                            + Follow <FaArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* Event Schedule */}
                <section className="mb-16">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold">Event Schedule</h2>
                        <Link href="#" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                            View all <FaArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {EVENT_SCHEDULE.map((item, i) => (
                            <div
                                key={i}
                                className="bg-gray-800/60 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800/80 transition"
                            >
                                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-700">
                                    <Image
                                        src={item.avatar}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold truncate">{item.name}</p>
                                    <p className="text-white/70 text-sm truncate">{item.role}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-medium">{item.time}</p>
                                    <p className="text-white/70 text-sm">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Event Timeline */}
                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Event Timeline
                    </h2>
                    <div className="md:hidden space-y-6 pl-8 relative">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 rounded-full" />
                        {TIMELINE_ITEMS.map((item, i) => (
                            <div key={i} className="relative">
                                <div
                                    className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-indigo-600 border-2 border-indigo-900 flex items-center justify-center z-10"
                                    style={shadowGlowStyle}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                </div>
                                <div className={`bg-gradient-to-br ${item.color} p-4 rounded-xl`}>
                                    <span className="text-xl mr-2">{item.icon}</span>
                                    <span className="font-bold">{item.title}</span>
                                    <p className="text-white/90 mt-1">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden md:block relative max-w-4xl mx-auto">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 rounded-full" />
                        {TIMELINE_ITEMS.map((item, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-8 mb-12 last:mb-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`} />
                                <div
                                    className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-indigo-900 flex items-center justify-center shrink-0 z-10"
                                    style={shadowGlowStyle}
                                >
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                </div>
                                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                                    <div className={`inline-block p-4 rounded-xl bg-gradient-to-br ${item.color}`}>
                                        <span className="text-xl mr-2">{item.icon}</span>
                                        <span className="font-bold">{item.title}</span>
                                        <p className="text-white/90 mt-1">{item.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <p className="text-indigo-300 mb-6">Mark your calendars for this exciting event!</p>
                        <button
                            onClick={openRegistrationModal}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transition hover:scale-105 shadow-xl inline-flex items-center gap-2"
                        >
                            Register for Free <FaArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>
            </div>

            {/* Registration Modal */}
            {showRegistrationModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Register for Film Festival</h2>
                            <button
                                className="text-gray-400 hover:text-white text-2xl leading-none"
                                onClick={() => setShowRegistrationModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <p className="mb-6 text-gray-400 text-sm">Fill out the form below to register your short film for the festival. Registration is free.</p>

                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="filmDuration" className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        id="filmDuration"
                                        name="filmDuration"
                                        min={5}
                                        max={30}
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
                            <div>
                                <label htmlFor="driverLink" className="block text-sm font-medium text-gray-300 mb-1">Google Drive Link</label>
                                <input
                                    type="url"
                                    id="driverLink"
                                    name="driverLink"
                                    value={formData.driverLink}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="mt-1 h-4 w-4 rounded border-gray-500 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="agreeToTerms" className="text-sm text-gray-400">
                                    I agree to the terms and conditions of the festival
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {loading ? 'Submitting...' : 'Register for Free'}
                                {!loading && <FaArrowRight className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventPage;
