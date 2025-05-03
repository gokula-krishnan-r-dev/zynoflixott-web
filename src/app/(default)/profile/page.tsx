"use client";

import { UpdateImg } from "@/components/profile/update-img";
import Loading from "@/components/ui/loading";
import axios from "@/lib/axios";
import { isLogin, isProduction, userId } from "@/lib/user";
import { Edit, Edit2, LogOut, Trash2, VideoIcon } from "lucide-react";
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

  const handletoDeleteAccount = async () => {
    handletoLogout();
  };
  return (
    <main className="px-3 sm:px-4 md:px-6 lg:px-8">
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
                  className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] xl:h-[350px] object-cover"
                />
              }
            />

            {/* User Profile Image */}
            <div className="w-full flex justify-center sm:justify-start sm:pl-6 md:pl-8 lg:pl-12">
              <div className="relative">
                <img
                  src={user.profilePic}
                  alt="User Profile"
                  className="rounded-full object-cover 
                    w-24 h-24 
                    sm:w-28 sm:h-28 
                    md:w-32 md:h-32 
                    lg:w-36 lg:h-36 
                    xl:w-40 xl:h-40
                    outline outline-2 outline-offset-2 outline-yellow-500 shadow-xl 
                    relative -mt-12 sm:-mt-14 md:-mt-16 lg:-mt-20 xl:-mt-24"
                />
                <UpdateImg
                  refetch={refetch}
                  id="profilePic"
                  name="profilePic"
                  button={
                    <button className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1 cursor-pointer">
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </button>
                  }
                />
              </div>
            </div>

            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 mx-auto flex flex-col gap-3 md:gap-4 mt-4 sm:mt-6">
              {/* Logout button on top right */}
              <div className="flex justify-end">
                <button
                  onClick={handletoLogout}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
              
              {/* Follower count */}
              <div className="flex justify-center sm:justify-start">
                <div className="text-xl sm:text-2xl md:text-3xl text-gray-100 dark:text-gray-400">
                  {follower?.count || 0} Followers
                </div>
              </div>
              
              {/* FullName */}
              <h1 className="text-center sm:text-left text-white font-bold text-2xl sm:text-3xl md:text-4xl">
                {user.full_name}
              </h1>
              
              {/* About */}
              <p className="w-full text-gray-400 text-sm sm:text-md text-pretty text-center sm:text-left">
                {user.description || "No description provided"}
              </p>
              
              {/* Email */}
              <div className="flex flex-col items-center sm:items-start mt-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">Email</h3>
                <span className="text-gray-300 text-sm sm:text-base break-all">{user.email}</span>
              </div>
            </div>

            <div className="py-6 px-4 sm:px-6 md:px-8 lg:px-12">
              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <button className="flex items-center bg-green-500 hover:bg-green-600 text-black rounded-xl px-4 py-2 sm:px-6 sm:py-3 gap-2 transition-colors">
                  <VideoIcon className="w-5 h-5" />
                  My Videos
                </button>

                {/* //logout */}
                <button
                  onClick={handletoLogout}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl gap-2 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>

                <button
                  onClick={handletoDeleteAccount}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl gap-2 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              </div>

              {userVideos?.length === 0 && (
                <div className="flex items-center justify-center text-white text-xl sm:text-2xl font-bold mt-8">
                  No Videos Uploaded
                </div>
              )}

              {/* Video grid */}
              <div className="grid pt-8 gap-3 sm:gap-4 md:gap-5 lg:gap-6 
                grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
