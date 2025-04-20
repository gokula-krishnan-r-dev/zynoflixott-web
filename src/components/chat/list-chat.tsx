import axios from "@/lib/axios";
import React from "react";
import { useQuery } from "react-query";
import { useChat } from "../provider/ChatProvider";
import { userId } from "@/lib/user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { timeAgoString } from "@/lib/time";

const fetchChat = async (roomId: string) => {
  const response = await axios.get("/message/" + roomId);

  return response.data;
};

const ChatList = () => {
  const [content, setContent] = React.useState("");
  const { roomId, socket, isOpen } = useChat();
  const { data, isLoading, isError, refetch } = useQuery(
    ["message", roomId],
    () => fetchChat(roomId),
    {
      refetchInterval: 5000,
    }
  );

  const handletosendMesssgae = () => {
    const authId = userId;
    socket.emit("send-message", {
      content,
      roomId,
      sender: authId,
    });
    setContent("");
    refetch();
    refetch();
  };

  const isSender = "col-start-6";
  const isReceiver = "col-start-1";

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching messages</div>;

  return (
    <div
      className={cn(
        "flex-1 flex flex-col w-full p-6 relative bg-gray-900 rounded-3xl mx-6"
      )}
    >
      {data.length === 0 && (
        <div className="flex items-center justify-center absolute top-[40%] left-[45%]">
          <p className="text-white">No messages yet</p>
        </div>
      )}
      <ScrollArea
        className={cn("w-full h-[75vh]  mb-4", !isOpen ? "w-full" : "hidden")}
      >
        <div className="w-full">
          {data &&
            data?.map((message: any, index: number) => (
              <div
                key={index}
                className={cn(
                  "col-end-8 p-3 rounded-lg",
                  message.sender === userId ? isSender : isReceiver
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    message.sender === userId ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      <Image
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                        src={message?.userId?.profilePic}
                        alt="profile-pic"
                        width="30"
                        height="30"
                      />
                    </div>
                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                      <div>{message.content}</div>
                    </div>
                  </div>
                  <div className="text-white">
                    <p>{timeAgoString(message.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
      <div
        className={cn(
          "flex flex-row items-center h-16 rounded-xl bg-white w-full px-4",
          !isOpen ? "w-full lg:w-auto" : "lg:block hidden"
        )}
      >
        <div className="flex-grow ml-4">
          <div className="relative w-full">
            <input
              value={content}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handletosendMesssgae();
                }
              }}
              onChange={(e) => setContent(e.target.value)}
              type="text"
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
            />
          </div>
        </div>
        <div className="ml-4">
          <button
            onClick={handletosendMesssgae}
            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
          >
            <span>Send</span>
            <span className="ml-2">
              <svg
                className="w-4 h-4 transform rotate-45 -mt-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
