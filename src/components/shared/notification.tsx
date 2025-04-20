"use client";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}
const getNotifications = async () => {
  try {
    const response = await axios.get("/notification");
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

const NotificationBell = () => {
  const [notificatinData, setNotificationData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotifications();
      setNotificationData(data);
    };
    fetchData();
  }, []);

  const mapNotificationData = (notificationData: any[]): any[] => {
    return notificationData?.map((item) => ({
      name: item?.title,
      description: item?.message,
      time: timeAgoString(item.createdAt),
      icon: item?.user?.profilePic,
      color: "#00C9A7",
    }));
  };
  const notifications = mapNotificationData(notificatinData);

  return (
    <Popover>
      <PopoverTrigger>
        <button>
          <Bell size={24} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-full rounded-3xl mr-6 w-[400px]">
        <AnimatedListDemo notifications={notifications} />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;

import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import axios from "@/lib/axios";
import Image from "next/image";
import { timeAgoString } from "@/lib/time";

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto mt-4 w-full h-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white border",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <Image
            src={icon}
            width={40}
            height={40}
            className="rounded-full w-10 h-10"
            alt="profile"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListDemo({ notifications }: any) {
  return (
    <div className="relative space-y-3 flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden overflow-y-scroll  bg-background p-2">
      {/* <AnimatedList> */}
      {notifications.length === 0 && (
        <div className="flex items-center justify-center h-full text-lg text-gray-500">
          No Notifications
        </div>
      )}
      <ScrollArea className="h-[400px]">
        {notifications.map((item: any, idx: number) => (
          <Notification {...item} key={idx} />
        ))}
      </ScrollArea>
      {/* </AnimatedList> */}
    </div>
  );
}
