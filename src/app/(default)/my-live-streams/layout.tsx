import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Live Streams | Zynoflix",
    description: "Manage your live stream creations and view insights on your streaming performances.",
};

export default function MyLiveStreamsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
} 