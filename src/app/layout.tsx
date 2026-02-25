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
       

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId      : '1635424287121165',
                  xfbml      : true,
                  version    : 'v23.0'
                });
                FB.AppEvents.logPageView();
              };

              (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
            `
          }}
        />

        <script src="https://analytics.ahrefs.com/analytics.js" data-key="y/Hp6qltaCCSITbY89/pqg" async></script>
        <Header />
       

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
