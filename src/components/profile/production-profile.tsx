"use client";
import { UpdateImg } from "@/components/profile/update-img";
import { SocialButtons } from "@/components/shared/list-production";
import Loading from "@/components/ui/loading";
import axios from "@/lib/axios";
import { Edit, MessageCircle, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useQuery } from "react-query";
import { userId } from "@/lib/user";
import { useRouter } from "next/navigation";
const fetchCategories = async (id: string) => {
  const response = await axios.get("/auth/production/user/" + id);
  if (response.status !== 200) {
    throw new Error("Error loading categories");
  }

  return response.data.productionCompany;
};

export default function ProductionProfile() {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery(["user", userId], () => fetchCategories(userId || ""));

  if (isLoading)
    return <Loading className="flex items-center h-screen justify-center" />;

  const handletoCreateRoom = async () => {
    const response = await axios.post("/room", {
      name: user?.fullName,
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
          <UpdateImg
            refetch={refetch}
            id="backgroundPic"
            name="backgroundPic"
            button={
              <Image
                width={1920}
                height={1080}
                title="Edit Background Image"
                src={user?.backgroundImage}
                alt="User Cover"
                className="w-full xl:h-[20rem] hover:cursor-pointer object-cover lg:h-[22rem] md:h-[16rem] sm:h-[13rem] xs:h-[9.5rem]"
              />
            }
          />

          {/* User Profile Image */}
          <div className="w-full flex  justify-start pl-12">
            <div className="relative">
              <Image
                width={1920}
                height={1080}
                src={user?.logo}
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
            <p className="w-full text-gray-400 text-md text-pretty sm:text-center xs:text-justify">
              {user?.about || "No description provided"}
            </p>

            <div className="">
              {/* add Chat Button */}

              <div className="flex items-center gap-4">
                <button
                  onClick={handletoCreateRoom}
                  className="bg-green-500 text-white flex items-center gap-3 px-4 py-2 rounded-xl"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chat
                </button>
                <DialogSocial
                  button={
                    <button className="bg-green-500 text-white flex items-center gap-3 px-4 py-2 rounded-xl">
                      {user?.socialMedia?.facebook ? (
                        <Edit className="w-6 h-6" />
                      ) : (
                        <Plus className="w-6 h-6" />
                      )}
                      {!user?.socialMedia?.facebook
                        ? "Add Social Media Links"
                        : "Edit A Social Media Link"}
                    </button>
                  }
                ></DialogSocial>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { toast } from "sonner";

export function DialogSocial({ button }: { button: React.ReactNode }) {
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleSubmit = async () => {
    setError(null); // Reset error state
    try {
      const response = await axios.put("/auth/production/user/", {
        socialMedia: {
          instagram,
          facebook,
          youtube,
          twitter,
        },
      });

      if (response.status === 200) {
        toast.success("Links submitted successfully");
        window.location.reload();
      }

      // Handle successful submission
      console.log("Links submitted successfully");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Add or update your social media links here. Click save when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instagram" className="text-right">
              Instagram
            </Label>
            <Input
              id="instagram"
              value={instagram}
              placeholder="https://www.instagram.com/username/"
              onChange={(e) => setInstagram(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="facebook" className="text-right">
              Facebook
            </Label>
            <Input
              id="facebook"
              placeholder="https://www.facebook.com/username/"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="youtube" className="text-right">
              YouTube
            </Label>
            <Input
              placeholder="https://www.youtube.com/channel/username/"
              id="youtube"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="twitter" className="text-right">
              Twitter
            </Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/username/"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
