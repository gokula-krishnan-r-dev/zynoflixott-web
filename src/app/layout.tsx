"use client";
import Header from "@/components/layout/header";
import "./globals.css";

import { Toaster, toast } from "sonner";
import { AuthProvider } from "@/components/provider/AuthProvider";
import Footer from "@/components/shared/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RYRQECYM7L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-RYRQECYM7L');
          `}
        </Script>
      </head>
      <body>
        <Header />
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
