import React from "react";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/provider/AuthProvider";
import Footer from "@/components/shared/footer";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZynoflixOTT - Premier Platform for Short Films & Independent Filmmakers",
  description: "Discover, watch and upload high-quality short films on ZynoflixOTT.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  keywords: "OTT, short films, independent films, streaming",
  authors: [{ name: "ZynoflixOTT" }], // Fixed authors format
  icons: {
    icon: ["/favicon.ico", "/logo_sm.png"],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* GTM Noscript (Must be first in body) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-P7RJCDB2"
            height="0" width="0" style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P7RJCDB2');`}
        </Script>

        {/* Facebook SDK */}
        <Script id="fb-sdk" strategy="afterInteractive">
          {`window.fbAsyncInit = function() {
            FB.init({ appId: '1635424287121165', xfbml: true, version: 'v23.0' });
            FB.AppEvents.logPageView();
          };`}
        </Script>
        <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-R92MZPEMQD" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R92MZPEMQD');`}
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
