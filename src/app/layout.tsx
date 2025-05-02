import React from "react";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/provider/AuthProvider";
import Footer from "@/components/shared/footer";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

// App Router metadata configuration
export const metadata = {
  title: "ZynoflixOTT",
  description: "Watch and upload short films on ZynoflixOTT, the premier OTT platform for independent filmmakers.",
  keywords: "OTT, short films, independent films, streaming",
  authors: { name: "ZynoflixOTT" },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo_sm.png" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          src="//code.tidio.co/10qdqbeh4bzacrayxyrxave4vbbqqj6y.js"
          async
        ></script>
          <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <Header />
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
