"use client";
import React, { useEffect } from "react";
import "@vidstack/react/player/styles/base.css";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";
import { isMonthMembershipCompleted, timeAgoString } from "@/lib/time";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { userId } from "@/lib/user";
import { toast } from "sonner";
const ProfileVideo = dynamic(() => import("@/components/video/profile-video"), {
  ssr: false,
});

const VideoPlayer = dynamic(() => import("@/components/video/video-player"), {
  ssr: false,
});

export default function Page({ params }: { params: { videoId: string } }) {
  const ModeParams = useSearchParams();
  const mode = ModeParams.get("mode");

  const videoId = params.videoId;
  const {
    data: video,
    isLoading,
    error,
    refetch,
  } = useQuery("video", async () => {
    const response = await axios.get(`/video/${videoId}`);
    return response.data.video;
  });
  const { data: user, isLoading: userLoading } = useQuery(
    ["user", userId],
    async () => {
      const response = await axios.get(`/auth/user/${userId}`);
      const isMembership = isMonthMembershipCompleted(
        response.data.user.membershipId.createdAt
      );

      if (isMembership) {
        toast.warning(
          "You are watching a Promo video for watch full video subscription is required"
        );
      }

      return response.data.user;
    }
  );

  if (isLoading)
    return <Loading className="h-screen flex items-center justify-center" />;

  if (error) return <p>Error: </p>;

  const isMembership = isMonthMembershipCompleted(
    user?.membershipId?.createdAt || new Date(-1)
  );

  return (
    <main>
      <div className="">
        <VideoPlayer isMembership={isMembership} mode={mode} video={video} />
      </div>
      <div className="lg:p-6 p-3">
        <div className="w-full mt-4 flex lg:flex-row flex-col pb-3 justify-between items-start lg:items-center">
          <div className="w-3/4">
            <h3 className="lg:text-xl text-lg font-bold">{video.title}</h3>
            <div className="flex w-full gap-4 items-center">
              <p className="lg:text-sm text-xs font-medium text-gray-600">
                {video.views} Views
              </p>
              <span>|</span>
              <p className="lg:text-sm text-xs video-content-holder-dot font-medium text-gray-600">
                {timeAgoString(new Date(video.createdAt))}
              </p>
              <span>|</span>
              <h5 className="lg:text-sm text-xs video-content-holder-dot font-medium text-gray-600">
                {video.category}
              </h5>
              <span>|</span>
              <div className="lg:text-sm text-xs video-content-holder-dot font-medium text-gray-600">
                {video.certification}
              </div>
            </div>
          </div>
          <div className="lg:pt-0 pt-4 lg:pb-0 pb-4">
            <Link
              href={isMembership ? "/membership" : "/profile"}
              className="lg:text-base capitalize border px-4 py-1.5 rounded-full text-sm font-semibold"
            >
              {isMembership
                ? "Watch Full Film"
                : "you watching a orginal video"}
            </Link>
          </div>
        </div>
        <ProfileVideo
          refetch={refetch}
          userId={video.created_by_id}
          video={video}
          videoId={video?._id}
        />
      </div>
    </main>
  );
}
