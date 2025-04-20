"use client";
import React, { useEffect } from "react";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/provider/AuthProvider";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   // Disable text selection
  //   document.body.style.userSelect = "none";

  //   // Disable right-click context menu
  //   const handleContextMenu = (event: MouseEvent) => {
  //     event.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", handleContextMenu);

  //   return () => {
  //     // Clean up event listener and CSS rule
  //     document.body.style.userSelect = "";
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);

  return (
    <html lang="en">
      <Head>
        <title>ZynoflixOTT</title>
        <link rel="icon" href="/logo_seo.png" sizes="any" />
        <meta
          name="description"
          content="Watch and upload short films on ZynoflixOTT, the premier OTT platform for independent filmmakers."
        />
        <meta
          name="keywords"
          content="OTT, short films, independent films, streaming"
        />
        <meta name="author" content="ZynoflixOTT" />
      </Head>

      <body>
        <script
          src="//code.tidio.co/10qdqbeh4bzacrayxyrxave4vbbqqj6y.js"
          async
        ></script>
        <Header />
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
