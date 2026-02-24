import React from "react";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/provider/AuthProvider";
import Footer from "@/components/shared/footer";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'; // Recommended for self-hosting

const inter = Inter({ subsets: ["latin"] });

// 1. Move viewport to its own export (Standard for Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ZynoflixOTT - Premier Platform for Short Films & Independent Filmmakers",
  description: "Discover, watch and upload high-quality short films on ZynoflixOTT.",
  keywords: "OTT, short films, independent films, streaming",
  authors: [{ name: "ZynoflixOTT" }],
  icons: {
    icon: ["/favicon.ico", "/logo_sm.png"],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 1. GTM Script - Must be as high in <head> as possible */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com;
          })(window,document,'script','dataLayer','GTM-TS6RTR54');`}
        </Script>
      </head>
      <body className={inter.className}>
        {/* 2. GTM Noscript - Critical for verification crawlers */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Header />
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <Toaster richColors />
        <Footer />

        {/* 3. Load GA and FB below the fold to keep the VM responsive */}
        <GoogleAnalytics gaId="G-3T38F16FTX" />
        {/* Facebook SDK */}
        <Script id="fb-sdk" strategy="afterInteractive">
          {`window.fbAsyncInit = function() {
            FB.init({ appId: '1635424287121165', xfbml: true, version: 'v23.0' });
            FB.AppEvents.logPageView();
          };`}
        </Script>
        <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />

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
