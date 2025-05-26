import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch Live Stream | ZynoFlix",
    description: "Watch exclusive live stream premieres of movies and events on ZynoFlix",
};

export default function WatchLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-black h-full">
            {children}
        </div>
    );
} 