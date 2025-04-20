"use client";
import ChatList from "@/components/chat/list-chat";
import { ChatProvider } from "@/components/provider/ChatProvider";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const fetchChat = async () => {
    const response = await axios.get("/chat/");
    if (response.status !== 200) {
      toast.error(response.data.error);
    }
    router.push("/chat/" + response?.data?.[0]?.roomId);
    return response.data;
  };
  const { data, isLoading, isError, refetch } = useQuery("chat", () => {
    fetchChat();
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching messages</div>;

  return (
    <div>
      <ChatProvider roomId="23">
        <div className="">
          <div className="">
            <ChatList />
          </div>
        </div>
      </ChatProvider>
    </div>
  );
};

export default Page;
