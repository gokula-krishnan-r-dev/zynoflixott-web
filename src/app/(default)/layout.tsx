"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <div className="bg-body text-white">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
}
