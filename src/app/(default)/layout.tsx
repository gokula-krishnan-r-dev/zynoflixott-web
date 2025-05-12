"use client";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = React.useState(() => new QueryClient());

  // Prevent zoom with keyboard shortcuts and mouse wheel
  useEffect(() => {
    // Add or update viewport meta tag
    const updateViewportMeta = () => {
      let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta') as HTMLMetaElement;
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    };

    // Handle key zoom
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
        e.preventDefault();
      }
    };

    // Handle wheel zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Handle pinch zoom
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Run once after mount
    updateViewportMeta();

    // Add listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="bg-background-dark text-white">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </div>
    </>
  );
}
