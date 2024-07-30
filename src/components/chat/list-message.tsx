import React, { use, useEffect } from "react";
import { useQuery } from "react-query";
import { useChat } from "../provider/ChatProvider";
import axios from "@/lib/axios";

const fetchChat = async (roomId: string) => {
  const response = await axios.get("/message/" + roomId);
  if (response.status === 200) {
    console.log("Network response was not ok");
  }
  return response.data;
};

const MessageList = () => {
  const { roomId, socket } = useChat();
  const { data, isLoading, isError, refetch } = useQuery(
    ["message", roomId],
    () => fetchChat(roomId)
  );
  useEffect(() => {
    if (!socket) return;
    socket.on("message-from-server", (data: any) => {
      refetch();
    });
  }, [socket]);
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching messages</div>;

  return (
    <div>
      <div className="text-white px-4 py-3">
        {data.map((message: any) => (
          <div key={message._id}>
            <p>{message.content}</p>
            <p>{message.sender}</p>
            <p>{message.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
