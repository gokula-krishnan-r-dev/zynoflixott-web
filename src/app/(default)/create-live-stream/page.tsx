import { Metadata } from "next";
import LiveStreamForm from "@/components/form/live-stream-form";
import { isLogin, userId } from "@/lib/user";
import Link from "next/dist/client/link";

export const metadata: Metadata = {
    title: "Create Live Stream | Zynoflix",
    description: "Create a live stream for your short film and share it with the world.",
};

export default function CreateLiveStreamPage() {
    // if (isLogin) {
    //     return (
    //         <div className="">
    //             <div className="flex flex-col items-center justify-center h-screen">
    //                 <h1 className="text-2xl font-bold">Please login to create a live stream</h1>
    //                 <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</Link>
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <div className="pt-20 bg-[#0f0f1a]">
            <LiveStreamForm />
        </div>
    );
} 