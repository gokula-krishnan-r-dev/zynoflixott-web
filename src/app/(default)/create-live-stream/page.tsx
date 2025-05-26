import { Metadata } from "next";
import LiveStreamForm from "@/components/form/live-stream-form";

export const metadata: Metadata = {
    title: "Create Live Stream | Zynoflix",
    description: "Create a live stream for your short film and share it with the world.",
};

export default function CreateLiveStreamPage() {
    return (
        <div className="pt-20 bg-[#0f0f1a]">
            <LiveStreamForm />
        </div>
    );
} 