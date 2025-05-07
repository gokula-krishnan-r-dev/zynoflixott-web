"use client";
import { isLogin } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NotificationBell from "../shared/notification";
import SearchComponnets from "../shared/search-components";
import { SheetMobile } from "./mobile-drawer";
import { Bell, Menu, Search, Upload, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(isLogin);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loggedIn === null) {
    return (
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#1a0733] to-[#2c1157] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Backdrop blur and gradient overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${scrolled ? 'bg-[#1a0733]/80 backdrop-blur-md shadow-lg shadow-black/10' : 'bg-gradient-to-b from-[#1a0733] to-transparent'}`}></div>

      <nav className="relative px-3 sm:px-6 lg:px-12 py-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-9 flex items-center"
            >
              <Image
                width={120}
                height={35}
                src="/logo/logo.png"
                className="h-24 w-auto"
                alt="ZynoFlix Logo"
              />
            </motion.div>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search a video"
                className="w-full bg-[rgba(25,28,51,0.5)] backdrop-blur-sm text-white rounded-full px-4 py-2 pl-10 text-sm border border-[#292c41]/50 focus:border-[#7b61ff] outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Mobile: Search Toggle and Menu */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 mr-2 text-white rounded-full hover:bg-[#292c41]/50"
            >
              <Search className="w-5 h-5" />
            </button>
            <SheetMobile />
          </div>

          {/* Mobile: Search Input (conditionally shown) */}
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-16 left-3 right-3 bg-[#1a0733] border border-[#292c41]/50 rounded-lg p-3 shadow-xl z-50"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search a video"
                  className="w-full bg-[rgba(25,28,51,0.5)] backdrop-blur-sm text-white rounded-full px-4 py-2 pl-10 text-sm"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </motion.div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/profile" className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${loggedIn ? 'bg-[#7b61ff] hover:bg-[#6c52ee] text-white' : 'text-gray-200 hover:text-white'}`}>
              Profile
            </Link>

            <Link href="/explore" className="px-4 py-2 text-sm font-medium text-white bg-[#7b61ff] hover:bg-[#6c52ee] rounded-full transition-all duration-300">
              Explore
            </Link>

            <Link href="/video-upload" className="px-4 py-2 text-sm font-medium text-white bg-[#292c41]/70 hover:bg-[#292c41] rounded-full transition-all duration-300 flex items-center">
              <Upload className="w-4 h-4 mr-1" /> Upload a Video
            </Link>

            <Link href="/chat" className="p-2 text-white bg-[#292c41]/70 hover:bg-[#292c41] rounded-full transition-all duration-300">
              <MessageSquare className="w-5 h-5" />
            </Link>

            {loggedIn && (
              <div className="p-2 text-white bg-[#292c41]/70 hover:bg-[#292c41] rounded-full transition-all duration-300">
                <Bell className="w-5 h-5" />
              </div>
            )}

            {!loggedIn && (
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-[#ff4d6d] hover:bg-[#ff3a5f] rounded-full transition-all duration-300">
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile search backdrop */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSearchOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
