"use client";
import { UpdateImg } from "@/components/profile/update-img";
import { SocialButtons } from "@/components/shared/list-production";
import Loading from "@/components/ui/loading";
import axios from "@/lib/axios";
import { Edit, MessageCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useQuery } from "react-query";
import { isLogin, userId } from "@/lib/user";
import { useRouter } from "next/navigation";
const fetchCategories = async (id: string) => {
  const response = await axios.get("/auth/production/user/" + id);
  if (response.status !== 200) {
    throw new Error("Error loading categories");
  }

  return response.data.productionCompany;
};

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery("video", () => fetchCategories(params.slug));

  if (isLoading)
    return <Loading className="flex items-center h-screen justify-center" />;

  const handletoCreateRoom = async () => {
    const RoomName = window.prompt("Enter Room Name");
    if (!RoomName) {
      return;
    }

    const response = await axios.post("/room", {
      name: RoomName,
      userIds: [userId, user?._id],
    });

    if (response.status !== 201) {
      console.log("Error creating room");
    }

    console.log(response.data);

    // redirect to chat room
    router.push("/chat/" + response.data.roomId);
  };

  return (
    <main>
      <section className="w-full overflow-hidden dark:bg-gray-900">
        <div className="w-full mx-auto">
          <Image
            width={1920}
            height={1080}
            title="Edit Background Image"
            src={user?.backgroundImage}
            alt="User Cover"
            className="w-full xl:h-[20rem] hover:cursor-pointer object-cover lg:h-[22rem] md:h-[16rem] sm:h-[13rem] h-[15.5rem]"
          />

          {/* User Profile Image */}
          <div className="w-full flex lg:pt-0 pt-6  items-center justify-center lg:justify-start pl-2 lg:pl-12">
            <div className="relative">
              <Image
                width={1920}
                height={1080}
                src={user?.logo}
                alt="User Profile"
                className="rounded-full object-cover w-60  h-60 xl:w-[16rem] xl:h-[16rem] lg:w-[16rem] lg:h-[16rem] md:w-[12rem] md:h-[12rem] sm:w-[10rem] sm:h-[10rem] xs:w-[8rem] xs:h-[8rem] outline outline-2 outline-offset-2 outline-yellow-500 shadow-xl relative xl:bottom-[7rem] lg:bottom-[8rem] md:bottom-[6rem] sm:bottom-[5rem] xs:bottom-[4.3rem]"
              />
            </div>
          </div>
          <div className="xl:w-[80%] pt-6 lg:pt-0 lg:w-[90%] md:w-[94%] sm:w-[96%] xs:w-[92%] mx-auto flex flex-col gap-4 justify-center items-center relative xl:-top-[6rem] lg:-top-[6rem] md:-top-[4rem] sm:-top-[3rem] xs:-top-[2.2rem]">
            {/* FullName */}
            <h1 className="text-center text-white font-bold text-4xl">
              {user?.name || "No name provided"}
            </h1>
            <div className="flex items-center pt-2 gap-8">
              {/* Founder Name */}
              <div className="">
                {/* Founder Name  */}
                <h2 className="text-center text-white font-bold text-xl">
                  {user?.founderName || "No founder name provided"}
                </h2>
                <p className="text-center text-gray-400 text-md">
                  Founder & CEO
                </p>
              </div>
              <div className="">
                <SocialButtons
                  facebook={user?.socialMedia?.facebook}
                  twitter={user?.socialMedia?.twitter}
                  instagram={user?.socialMedia?.instagram}
                  youtube={user?.socialMedia?.youtube}
                />
              </div>
            </div>

            {/* About */}
            <p className="w-full px-8 lg:px-0 text-gray-400 text-md text-pretty sm:text-center xs:text-justify">
              {user?.about || "No description provided"}
            </p>

            <div className="pb-24">
              {/* add Chat Button */}

              <div className="flex items-center gap-4">
                {isLogin ? (
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-blue-500 text-white flex items-center gap-3 px-4 py-2 rounded-xl"
                  >
                    Login to Chat
                  </button>
                ) : (
                  <button
                    onClick={handletoCreateRoom}
                    className="bg-green-500 text-white flex items-center gap-3 px-4 py-2 rounded-xl"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Chat
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
