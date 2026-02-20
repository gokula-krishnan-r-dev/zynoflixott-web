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
      <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RYRQECYM7L"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-RYRQECYM7L');
</script>
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
