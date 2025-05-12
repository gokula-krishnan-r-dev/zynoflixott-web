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
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl/Cmd + '+'/'-' shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Prevent zooming with Ctrl/Cmd + mouse wheel
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
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
