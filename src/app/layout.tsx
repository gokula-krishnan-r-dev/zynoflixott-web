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
      <body className={inter.className}>
        <Header />
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <Toaster richColors />
        <Footer />

        {/* Facebook SDK and Ahrefs remain */}
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
