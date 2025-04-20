"use client";
import { ChatProvider } from "@/components/provider/ChatProvider";
import dynamic from "next/dynamic";
import React from "react";

const Sidebar = dynamic(() => import("@/components/chat/sidebar"));
const ChatList = dynamic(() => import("@/components/chat/list-chat"));

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <ChatProvider roomId={params.slug}>
        <div className="pt-20">
          <div className="">
            {/* demo */}
            <div className="flex h-[94.5vh] antialiased text-gray-800">
              <div className="flex flex-row h-full w-full overflow-x-hidden">
                <Sidebar />
                <ChatList />
              </div>
            </div>
          </div>
        </div>
      </ChatProvider>
    </div>
  );
}
