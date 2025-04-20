"use client";

import { UpdateImg } from "@/components/profile/update-img";
import Loading from "@/components/ui/loading";
import axios from "@/lib/axios";
import { isLogin, isProduction, userId } from "@/lib/user";
import { Edit, Edit2, VideoIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";

const VideoCard = dynamic(() => import("@/components/card/video-card"));

const ProductionProfile = dynamic(
  () => import("@/components/profile/production-profile")
);

const Page = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery("user", async () => {
    const response = await axios.get(`/auth/user/${userId}`);
    return response.data.user;
  });
  const {
    data: userVideos,
    isLoading: videoLoading,
    error: videoError,
  } = useQuery("video", async () => {
    const response = await axios.get(`/profile/video`);
    return response.data.video;
  });

  const {
    data: follower,
    isLoading: followerLoading,
    refetch: refetchFollower,
  } = useQuery(["follower", userId], async () => {
    const response = await axios.get(`/followers`);
    return response.data;
  });
  const router = useRouter();
  useEffect(() => {
    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }
  }, []);
  if (isLoading)
    return <Loading className="h-screen flex items-center justify-center" />;
  const handletoLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("transactionId");

    router.push("/login");
  };
  return (
    <main className="px-8">
      {isProduction === "production" ? (
        <div className="">
          <ProductionProfile />
        </div>
      ) : (
        <section className="w-full overflow-hidden dark:bg-gray-900">
          <div className="w-full mx-auto">
            <UpdateImg
              refetch={refetch}
              id="backgroundPic"
              name="backgroundPic"
              button={
                <img
                  src={user?.backgroundPic}
                  alt="User Cover"
                  className="w-full xl:h-[20rem] object-cover lg:h-[22rem] md:h-[16rem] sm:h-[13rem] xs:h-[9.5rem]"
                />
              }
            />

            {/* User Profile Image */}
            <div className="w-full flex  justify-start pl-12">
              <div className="relative">
                <img
                  src={user.profilePic}
                  alt="User Profile"
                  className="rounded-full object-cover xl:w-[16rem] xl:h-[16rem] lg:w-[16rem] lg:h-[16rem] md:w-[12rem] md:h-[12rem] sm:w-[10rem] sm:h-[10rem] xs:w-[8rem] xs:h-[8rem] outline outline-2 outline-offset-2 outline-yellow-500 shadow-xl relative xl:bottom-[7rem] lg:bottom-[8rem] md:bottom-[6rem] sm:bottom-[5rem] xs:bottom-[4.3rem]"
                />
                <UpdateImg
                  refetch={refetch}
                  id="profilePic"
                  name="profilePic"
                  button={
                    <button className="absolute -top-20 -right-0 bg-gray-800 rounded-full p-1 cursor-pointer">
                      <Edit className="w-6 h-6 text-white " />
                    </button>
                  }
                />
              </div>
            </div>

            <div className="xl:w-[80%] lg:w-[90%] md:w-[94%] sm:w-[96%] xs:w-[92%] mx-auto flex flex-col gap-4 justify-center items-center relative xl:-top-[6rem] lg:-top-[6rem] md:-top-[4rem] sm:-top-[3rem] xs:-top-[2.2rem]">
              <button
                onClick={handletoLogout}
                className="absolute top-0 left-0 bg-blue-500 px-4 py-2 rounded-xl"
              >
                Logout
              </button>
              {/* add Follower Count  */}
              <div className="">
                <div className="text-3xl text-gray-100 dark:text-gray-400">
                  {follower?.count || 0} Followers
                </div>
              </div>
              {/* FullName */}
              <h1 className="text-center text-white font-bold text-4xl">
                {user.full_name}
              </h1>
              {/* About */}
              <p className="w-full text-gray-400 text-md text-pretty sm:text-center xs:text-justify">
                {user.description || "No description provided"}
              </p>
            </div>
            <div className="">
              {/* List and add email */}
              <div className="flex flex-col items-center px-12 py-0">
                <h3 className="text-xl font-bold text-white">Email</h3>
                {user.email}
              </div>
            </div>

            <div className="py-8 px-12">
              <button className="flex items-center bg-green-500 text-black rounded-xl px-6 py-3 gap-3">
                <VideoIcon className="w-6 h-6" />
                my Video
              </button>

              {userVideos?.length === 0 && (
                <div className="flex items-center justify-center text-white text-2xl font-bold mt-8">
                  No Videos Uploaded
                </div>
              )}

              <div className="grid pt-8  gap-6 grid-cols-5">
                {userVideos?.length > 0 &&
                  userVideos?.map((video: any, index: number) => (
                    <VideoCard
                      hiddenNew={true}
                      key={index}
                      index={index}
                      video={video}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Page;
