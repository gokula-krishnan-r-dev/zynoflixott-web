"use client";
import { UpdateImg } from "@/components/profile/update-img";
import { SocialButtons } from "@/components/shared/list-production";
import Loading from "@/components/ui/loading";
import axios from "@/lib/axios";
import { Edit, Edit2, LogOut, MessageCircle, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useQuery } from "react-query";
import { userId } from "@/lib/user";
import { useRouter } from "next/navigation";
import { getBackgroundImage, getProfileImage } from "@/lib/utils";

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

  const handletoLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("transactionId");

    window.location.href = "/login";
  };
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


  const handletoDeleteAccount = async () => {
    const response = await axios.delete("/auth/production/user/" + userId);
    if (response.status === 200) {
      toast.success("Account deleted successfully");
    }
  };
  console.log(user?.logo, "user?.logo")
  return (
    <main>
      <section className="w-full overflow-hidden dark:bg-gray-900">
        <div className="w-full mx-auto">
          <UpdateImg
            refetch={refetch}
            id="backgroundPic"
            name="backgroundPic"
            button={
              <div className="relative w-full group">
                <img
                  src={getBackgroundImage(user?.backgroundPic, user?.name)}
                  alt="User Cover"
                  className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] xl:h-[350px] object-cover rounded-lg"
                />
                <div className=" absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <Edit2 className="w-5 h-5 text-gray-800" />
                  </div>
                  <span className="absolute bottom-4 text-white font-medium text-sm  group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-3 py-1 rounded-full">Edit Cover</span>
                </div>
              </div>
            }
          />

          {/* User Profile Image */}
          <div className="w-full flex justify-center sm:justify-start sm:pl-6 md:pl-8 lg:pl-12">
            <div className="relative">
              <Image
                width={200}
                height={200}
                src={getProfileImage(user?.logo, user?.name)}
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

            {/* FullName */}
            <h1 className="text-center sm:text-left text-white font-bold text-2xl sm:text-3xl md:text-4xl">
              {user?.name || "No name provided"}
            </h1>

            <div className="flex flex-col sm:flex-row items-center pt-2 gap-4 sm:gap-8">
              {/* Founder Name */}
              <div className="text-center sm:text-left">
                <h2 className="text-white font-bold text-lg sm:text-xl">
                  {user?.founderName || "No founder name provided"}
                </h2>
                {/* <p className="text-gray-400 text-sm sm:text-md">
                  Founder & CEO
                </p> */}
              </div>

              <div className="mt-2 sm:mt-0">
                <SocialButtons
                  facebook={user?.socialMedia?.facebook}
                  twitter={user?.socialMedia?.twitter}
                  instagram={user?.socialMedia?.instagram}
                  youtube={user?.socialMedia?.youtube}
                />
              </div>
            </div>

            {/* About */}
            <p className="w-full text-gray-400 text-sm sm:text-md text-pretty text-center sm:text-left mt-2">
              {user?.about || "No description provided"}
            </p>

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-6">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={handletoCreateRoom}
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>

                <DialogSocial
                  button={
                    <button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors">
                      {user?.socialMedia?.facebook ? (
                        <Edit className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      <span className="hidden sm:inline">
                        {!user?.socialMedia?.facebook
                          ? "Add Social Media Links"
                          : "Edit Social Media Links"}
                      </span>
                      <span className="sm:hidden">
                        {!user?.socialMedia?.facebook ? "Add Links" : "Edit Links"}
                      </span>
                    </button>
                  }
                />

                <button
                  onClick={handletoDeleteAccount}
                  className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Delete Account</span>
                  <span className="sm:hidden">Delete</span>
                </button>

                <button
                  onClick={handletoLogout}
                  className="md:hidden bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
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
      <DialogContent className="w-[90vw] max-w-[625px] sm:w-auto">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Add or update your social media links here. Click save when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="instagram" className="sm:text-right">
              Instagram
            </Label>
            <Input
              id="instagram"
              value={instagram}
              placeholder="https://www.instagram.com/username/"
              onChange={(e) => setInstagram(e.target.value)}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="facebook" className="sm:text-right">
              Facebook
            </Label>
            <Input
              id="facebook"
              placeholder="https://www.facebook.com/username/"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="youtube" className="sm:text-right">
              YouTube
            </Label>
            <Input
              placeholder="https://www.youtube.com/channel/username/"
              id="youtube"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="twitter" className="sm:text-right">
              Twitter
            </Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/username/"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="sm:col-span-3"
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
