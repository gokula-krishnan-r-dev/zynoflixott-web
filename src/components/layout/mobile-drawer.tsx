"use client";
import { authId, isLogin } from "@/lib/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Home, Compass, Upload, User, LogIn, Film, DollarSign, LogOut, Megaphone, Video, Settings, Power, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Browse", href: "/explore", icon: Compass },
  { label: "Upload a Video", href: "/video-upload", icon: Upload },
  { label: "Sell Short Films", href: "/sell-shortfilm-contact", icon: Film },
  { label: "Monetization", href: "/monetization", icon: DollarSign },
  { label: "Advertise", href: "/advertisement", icon: Megaphone },
  { label: "Live Streams", href: "/live-streams", icon: Video },
  { label: "Film Production", href: "/production", icon: Video },
  { label: "Student Ambassador", href: "/signup/student-ambassador", icon: User },
];

export function SheetMobile() {
  const [open, setOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const pathname = usePathname();

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
  }, [isLogin]);

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
              className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-[#2c0e5a] z-50 mobile-menu-container shadow-xl"
            >
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pl-3 border-b border-[#292c41]/50">
                <Link href="/" onClick={() => setOpen(false)}>
                <Image
                      src="/logo/logo.png"
                      width={160}
                      height={60}
                      alt="ZynoFlix Logo"
                      className="lg:h-12 w-auto"
                    />
                  </Link>
                </div>

                {/* Menu Items */}
                <div className="flex-1 py-4 px-3">
                  <ul className="space-y-1">
                    {menuItems.map((item, index) => {
                      // Skip profile item if not logged in
                      if (item.label === "Profile" && !loggedIn) return null;
                      
                      const IconComponent = item.icon;
                      const isActive = pathname === item.href || 
                        (item.href !== "/" && pathname?.startsWith(item.href));
                      
                      return (
                        <motion.li
                          key={`${item.label}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-purple-600/80 to-purple-700/60 text-white shadow-lg"
                                : "text-white hover:bg-purple-800/20"
                            }`}
                            onClick={() => setOpen(false)}
                          >
                            <IconComponent 
                              className={`w-5 h-5 mr-3 ${
                                isActive ? "text-white" : "text-purple-300"
                              }`} 
                            />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </motion.li>
                      );
                    })}

                    {!loggedIn && (
                      <motion.li
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.03 }}
                      >
                        <Link
                          href="/login"
                          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                            pathname === "/login"
                              ? "bg-gradient-to-r from-purple-600/80 to-purple-700/60 text-white shadow-lg"
                              : "text-white hover:bg-purple-800/20"
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          <LogIn className={`w-5 h-5 mr-3 ${
                            pathname === "/login" ? "text-white" : "text-purple-300"
                          }`} />
                          <span className="font-medium">Login</span>
                        </Link>
                      </motion.li>
                    )}
                  </ul>
                </div>

                {/* Logout Button */}
                {loggedIn && (
                  <div className="mt-auto p-4 mb-16 border-t border-purple-800/30">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => {
                        localStorage.removeItem("isLogin");
                        localStorage.removeItem("userRole");
                        setOpen(false);
                        window.location.href = "/login";
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 bg-purple-900/40 hover:bg-purple-900/60 rounded-xl transition-all duration-200 group"
                    >
                      <Power className="w-5 h-5 mr-3 text-[#ff4d6d] group-hover:scale-110 transition-transform" />
                      <span className="text-white font-medium">Logout</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div >
  );
}
