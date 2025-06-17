"use client";
import { isLogin } from "@/lib/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Home, Compass, Upload, MessageSquare, User, LogIn, Film, DollarSign, LogOut, Megaphone, Calendar, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const menuItems = [
  { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  { label: "Profile", href: "/profile", icon: <User className="w-5 h-5" /> },
  { label: "Explore", href: "/explore", icon: <Compass className="w-5 h-5" /> },
  { label: "Upload a Video", href: "/video-upload", icon: <Upload className="w-5 h-5" /> },
  // { label: "Chat", href: "/chat", icon: <MessageSquare className="w-5 h-5" /> },
  {
    label: "Sell Shortfilms", href: "/sell-shortfilm-contact", icon: <Film className="w-5 h-5" />
  },
  //Monetization
  { label: "Monetization", href: "/monetization", icon: <DollarSign className="w-5 h-5" /> },
  //Event
  { label: "Event", href: "/event", icon: <Calendar className="w-5 h-5" /> },
  //Advertisement
  { label: "Advertisement", href: "/advertisement", icon: <Megaphone className="w-5 h-5" /> },
  //Live Stream
  { label: "My Live Streams", href: "/live-streams", icon: <Video className="w-5 h-5" /> },
  //PRODUCTION
  { label: "Film Production", href: "/production", icon: <Video className="w-5 h-5" /> },
];

export function SheetMobile() {
  const [open, setOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (open && e.target instanceof Element && !e.target.closest('.mobile-menu-container')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setLoggedIn(isLogin);
  }, []);

  if (loggedIn === null) {
    return null; // This will be handled by the parent component
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-white rounded-full hover:bg-[#292c41]/50 transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-gradient-to-b from-[#1a0733] to-[#2c1157] z-50 mobile-menu-container shadow-xl"
            >
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#292c41]/50">
                  <Link href="/" onClick={() => setOpen(false)}>
                    <Image
                      src="/logo/logo.png"
                      width={100}
                      height={30}
                      alt="ZynoFlix Logo"
                      className="lg:h-12 w-auto"
                    />
                  </Link>
                  <button
                    className="p-2 text-white rounded-full hover:bg-[#292c41]/50 transition-colors"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="py-4 px-2">
                  <ul className="space-y-1">
                    {menuItems.map((item, index) => {
                      // Skip login item if already logged in
                      if (item.label === "Login" && loggedIn) return null;
                      // Skip profile item if not logged in
                      if (item.label === "Profile" && !loggedIn) return null;

                      return (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-[#292c41]/50 transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            <span className="mr-3 text-[#7b61ff]">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        </motion.li>
                      );
                    })}
                    {!loggedIn && (
                      <motion.li onClick={() => setOpen(false)}
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.05 }}
                      >
                        <Link href="/login" className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-[#292c41]/50 transition-colors">
                          <span className="mr-3 text-[#7b61ff]"><LogIn className="w-5 h-5" /></span>
                          <span>Login</span>
                        </Link>
                      </motion.li>
                    )}


                    {loggedIn && (
                      <motion.li
                        key="logout"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.05 }}
                      >
                        <button
                          onClick={() => {
                            localStorage.removeItem("isLogin");
                            localStorage.removeItem("userRole");
                            setOpen(false);
                            window.location.href = "/login";

                          }}
                          className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-[#292c41]/50 transition-colors"
                        >
                          <span className="mr-3 text-[#7b61ff]"><LogOut className="w-5 h-5" /></span>
                          <span>Logout</span>
                        </button>
                      </motion.li>
                    )}



                  </ul>
                </div>

                {/* Footer */}
                <div className="mt-auto p-4 border-t border-[#292c41]/50 text-center text-xs text-gray-400">
                  <p>© {new Date().getFullYear()} ZynoFlix</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div >
  );
}
