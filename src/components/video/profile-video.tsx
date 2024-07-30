import axios from "@/lib/axios";
import Image from "next/image";
import React from "react";
import { useQuery } from "react-query";
import { Ivideo } from "../types/video";
import { cn } from "@/lib/utils";

const ProfileVideo = ({
  videoId,
  video,
  refetch,
  userId,
}: {
  userId: string;
  videoId: string;
  video: Ivideo;
  refetch: any;
}) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery("user", async () => {
    const response = await axios.get(`/auth/user/${userId}`);
    return response.data.user;
  });

  const { data: follower, refetch: refetchF } = useQuery(
    ["follower", videoId],
    async () => {
      const response = await axios.get(`/followers/${videoId}`);
      return response.data.followers;
    }
  );

  const {
    data: like,
    refetch: refetchL,
    isLoading: likeLoading,
  } = useQuery(["like", videoId], async () => {
    const response = await axios.get(`/video/like/${videoId}`);
    return response.data.like;
  });

  console.log(follower?.[0]?.user_id, "follower");
  const router = useRouter();
  const handletoFollow = async () => {
    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }
    const response = await axios.post(
      `/follow/${userId}`,
      {
        videoId: videoId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    refetchF();
    if (response.status === 200) {
      toast.success("Followed");

      const response = await axios.post("/notification", {
        title: follower?.[0]?.user_id.includes(userId) ? "follow" : "unfollow",
        message: follower?.[0]?.user_id.includes(userId)
          ? "you are followed"
          : "you are unfollowed",
        receiver: video.created_by_id,
      });

      if (response.status === 201) {
        console.log("notification sent");
      }

      refetchF();
    }
  };

  const handletoLike = async () => {
    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }
    const response = await axios.post(`/video/like/${videoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    refetch();
    refetchL();
    refetchL();
    if (response.status === 200) {
      toast.success("Liked");
      refetch();
      refetchL();
      refetchL();
    }
    refetchL();
  };

  const isLike = like?.[0]?.user_id?.includes(authId);
  const likeCount = like?.[0]?.user_id?.length;

  return (
    <div>
      <div className="">
        <div className="flex justify-between lg:justify-start border-t border-b py-4 border-gray-600 items-center gap-4">
          <Link href={`/profile/${userId}`} className="flex items-center gap-3">
            <Image
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              src={user?.profilePic}
              alt=""
            />
            <div className="font-medium dark:text-white">
              <div>{user?.full_name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {follower?.[0]?.user_id.length} Followers
              </div>
            </div>
          </Link>
          <button
            onClick={handletoFollow}
            className={cn(
              "border-2 border-green-500 flex-shrink-0  lg:flex duration-300 justify-center gap-2 py-2 px-4 text-xs lg:text-base items-center rounded-full lg:rounded-xl  z-50 relative  font-semibold capitalize",
              follower?.[0]?.user_id.includes(authId)
                ? " bg-green-500 text-black"
                : "bg-transparent "
            )}
          >
            {follower?.[0]?.user_id.includes(authId) ? "Following" : "Follow"}
          </button>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handletoLike}
            className={cn(
              "  text-white  duration-100 border-2 border-green-500 text-lg flex items-center bg-transparent px-3 lg:px-6 py-2 rounded-xl gap-2",
              isLike && "bg-green-500 text-black"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className=" lg:w-6 fill-white w-4 h-4 lg:h-6"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <h2 className="text-sm lg:text-base font-semibold">{likeCount}</h2>
          </button>
          <DialogDShare />
        </div>

        <div className="mt-5 flex items-start lg:flex-row flex-col gap-6">
          <div className="text-subtext flex-1 flex-col bg-gray-900 px-6 py-3 rounded-xl lg:flex  ">
            <div className="flex items-center">
              <div className=" flex items-center">
                <h5 className="gap-2 flex items-center">
                  Total Duration :{" "}
                  <span>
                    {convertMinutesToReadableFormat(
                      video.duration as any,
                      false
                    )}
                  </span>
                </h5>
              </div>
            </div>
            <Description text={video.description} maxLength={200} />
            {/* <div className="text-base py-2 w-[90%] text-gray-300 lg:w-3/4 font-normal text-subtext">
              {video.description}
            </div> */}
          </div>
          <VideoComment videoId={video._id} />
        </div>
      </div>
    </div>
  );
};

export default ProfileVideo;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Facebook, LinkedinIcon, Mail, TwitterIcon } from "lucide-react";
import Link from "next/link";
import VideoComment from "../shared/video-comment";
import { toast } from "sonner";
import { authId, isLogin } from "@/lib/user";
import { useRouter } from "next/navigation";
import { convertMinutesToReadableFormat } from "@/lib/time";

export function DialogDShare() {
  const pageUrl = window.location.href;

  const socialMediaLinks = [
    {
      icon: <Facebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        pageUrl
      )}`,
      color: "bg-blue-600",
    },
    {
      icon: <TwitterIcon />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        pageUrl
      )}`,
      color: "bg-blue-400",
    },
    {
      icon: <LinkedinIcon />,
      url: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
        pageUrl
      )}`,
      color: "bg-blue-700",
    },
    {
      icon: <Mail />,
      url: `mailto:?subject=Check this out&body=${encodeURIComponent(pageUrl)}`,
      color: "bg-gray-600",
    },
    {
      icon: (
        <svg
          fill="#000000"
          height="50px"
          width="50px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 308 308"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g id="XMLID_468_">
              {" "}
              <path
                id="XMLID_469_"
                d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"
              ></path>{" "}
              <path
                id="XMLID_470_"
                d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"
              ></path>{" "}
            </g>{" "}
          </g>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(pageUrl)}`,
      color: "bg-green-500",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:bg-green-500 hover:text-black duration-300 border-2 border-green-500 text-white duration-100 text-lg flex items-center px-3 lg:px-6 py-2 rounded-xl gap-2 bg-background_item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="lg:w-6 w-4 h-4 lg:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            ></path>
          </svg>
          <h2 className="text-sm lg:text-base font-semibold">Share</h2>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            Share this page on your social media platforms.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-wrap gap-4">
          {socialMediaLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${link.color}`}
            >
              {link.icon}
            </Link>
          ))}
        </div>
        <DialogFooter className="mt-4">
          <Button type="button">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// components/Description.tsx
import { useState } from "react";

interface DescriptionProps {
  text: string;
  maxLength: number;
}

const Description: React.FC<DescriptionProps> = ({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldShowButton = text?.length > maxLength;
  const displayText = isExpanded
    ? text
    : text?.substring(0, maxLength) + (shouldShowButton ? "..." : "");

  return (
    <div className="text-base py-2 w-[90%] text-gray-300 lg:w-3/4 font-normal text-subtext">
      {displayText}
      {shouldShowButton && (
        <button onClick={toggleExpansion} className="ml-2 text-blue-500">
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
