import axios from "@/lib/axios";
import Image from "next/image";
import React from "react";
import { useQuery } from "react-query";
import Loading from "../ui/loading";
import { cn } from "@/lib/utils";
import { useChat } from "../provider/ChatProvider";
import Link from "next/link";
import { userId } from "@/lib/user";
import { DoorClosed } from "lucide-react";

const fetchChat = async () => {
  const response = await axios.get("/chat/");
  if (response.status === 200) {
    console.log("Network response was not ok");
  }
  return response.data;
};

const Sidebar = () => {
  const { roomId, isOpen, setIsOpen } = useChat();
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError, refetch } = useQuery("chat", () =>
    fetchChat()
  );

  const {
    data: user,
    isLoading: loading,
    isError: error,
  } = useQuery("user", async () => {
    const response = await axios.get("/auth/user/" + userId);
    return response.data.user;
  });

  if (isLoading && loading)
    return (
      <Loading className="flex items-center w-full justify-center h-screen" />
    );

  if (isError) return <div>Error fetching messages</div>;

  return (
    <>
      <div className="absolute block lg:hidden top-24 text-white z-50 left-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 rounded-xl bg-gray-600  py-2"
        >
          <DoorClosed />
        </button>
      </div>
      <div
        className={cn(
          "flex-col py-8 relative pl-6 pr-2  text-white flex",
          isOpen ? "w-full lg:w-auto" : "lg:block hidden"
        )}
      >
        <div className="flex flex-row items-center w-full">
          <button className="flex justify-between items-center w-full hover:bg-gray-800 rounded-xl p-0">
            <div className="flex items-center w-full">
              <Image
                alt="logo"
                src={user?.profilePic}
                width={32}
                className="h-8 w-8 rounded-full"
                height={32}
              />

              <div className="ml-2 text-sm font-semibold">
                {user?.full_name}
              </div>
            </div>
            <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
              2
            </div>
          </button>
        </div>
        <div className="flex flex-col mt-8">
          <div className="flex flex-row items-center gap-2 text-xs">
            <span className="font-bold">Message</span>
            <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
              {data?.length}
            </div>
          </div>
          <div className="">
            <div className="max-w-md mx-auto">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative mt-3">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  type="search"
                  id="default-search"
                  className="block w-full py-2 px-4 ps-10 text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>

          <div className="">
            {data?.filter((chat: any) => {
              return chat.name.toLowerCase().includes(search.toLowerCase());
            }).length === 0 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                No chat found
              </div>
            )}
          </div>
          <div className="flex flex-col  space-y-1 mt-4 -mx-2 h-[500px] overflow-y-auto">
            {data
              ?.filter((chat: any) => {
                return chat.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((chat: any) => (
                <Link
                  href={`/chat/${chat.roomId}`}
                  key={chat.roomId}
                  className={cn(
                    "flex flex-row items-center duration-300 hover:bg-gray-800 rounded-xl p-2",
                    roomId === chat.roomId ? "bg-gray-800" : ""
                  )}
                >
                  <div className="flex items-center uppercase justify-center h-8 w-8 bg-indigo-200 rounded-full">
                    {chat.name[0]}
                  </div>
                  <div className="ml-2 text-sm capitalize font-semibold">
                    {chat.name}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
