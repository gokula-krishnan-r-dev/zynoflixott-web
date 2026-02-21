import React from "react";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/provider/AuthProvider";
import Footer from "@/components/shared/footer";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // 1. Added missing import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZynoflixOTT - Premier Platform for Short Films & Independent Filmmakers",
  description: "Discover, watch and upload high-quality short films on ZynoflixOTT. The leading OTT platform for independent filmmakers featuring curated content in multiple languages.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  keywords: "OTT, short films, independent films, streaming",
  authors: [{ name: "ZynoflixOTT" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo_sm.png" }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Fixed GTM Noscript URL */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com"
            height="0" width="0" style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TS6RTR54');`}
        </Script>

        {/* Ahrefs Analytics */}
        <Script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="y/Hp6qltaCCSITbY89/pqg" 
          strategy="lazyOnload" 
        />

        <Header />
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
