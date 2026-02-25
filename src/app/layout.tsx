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
import { GoogleAnalytics } from '@next/third-parties/google'; 

const inter = Inter({ subsets: ["latin"] });

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
        {/* FIXED: Correct GTM script syntax and URL */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com;
          })(window,document,'script','dataLayer','GTM-TS6RTR54');`}
        </Script>
      </head>
      <body className={inter.className}>
        {/* FIXED: Correct GTM Noscript path for verification */}
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

        {/* Third Party Scripts Loaded After Content */}
        <GoogleAnalytics gaId="G-3T38F16FTX" />
        
        <Script id="fb-sdk-init" strategy="afterInteractive">
          {`window.fbAsyncInit = function() {
            FB.init({ appId: '1635424287121165', xfbml: true, version: 'v23.0' });
            FB.AppEvents.logPageView();
          };`}
        </Script>
        <Script 
          src="https://connect.facebook.net/en_US/sdk.js" 
          strategy="afterInteractive" 
          crossOrigin="anonymous" 
        />

        <Script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="y/Hp6qltaCCSITbY89/pqg" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}
