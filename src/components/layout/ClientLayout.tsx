"use client";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, User, Film, DollarSign } from "lucide-react";

const MobileNavBar = () => {
  const pathname = usePathname();

  return (
    <div className="mobile-nav-bar sm:hidden">
      <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link href="/sell-shortfilm" className={`mobile-nav-item ${pathname === '/sell-shortfilm' ? 'active' : ''}`}>
        <Film size={20} />
        <span>Sell Shortfilms</span>
      </Link>
      <Link href="/monetization" className={`mobile-nav-item ${pathname.includes('/monetization') ? 'active' : ''}`}>
        <DollarSign size={20} />
        <span>Monetization</span>
      </Link>
      <Link href="/profile" className={`mobile-nav-item ${pathname === '/profile' ? 'active' : ''}`}>
        <User size={20} />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = React.useState(() => new QueryClient());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Disable text selection
    document.body.style.userSelect = "none";

    // Disable right-click context menu
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // Prevent copy operations
    const preventCopy = (event: ClipboardEvent | KeyboardEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).ctrlKey && (event as KeyboardEvent).key === "c") ||
        ((event as KeyboardEvent).metaKey && (event as KeyboardEvent).key === "c")
      ) {
        event.preventDefault();
      }
      if (event.type === "copy") {
        event.preventDefault();
      }
    };

    document.addEventListener("copy", preventCopy as EventListener);
    document.addEventListener("keydown", preventCopy as EventListener);

    setIsClient(true);

    return () => {
      // Clean up event listeners and CSS rule
      document.body.style.userSelect = "";
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", preventCopy as EventListener);
      document.removeEventListener("keydown", preventCopy as EventListener);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background-dark min-h-screen">
        {children}
        <MobileNavBar />
      </div>
    </QueryClientProvider>
  );
} 