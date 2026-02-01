"use client";

import ProductionProfile from "@/components/profile/production-profile";
import { UpdateImg } from "@/components/profile/update-img";
import Loading from "@/components/ui/loading";
import axios from "@/lib/axios";
import { isLogin, isProduction, userId } from "@/lib/user";
import { Edit, Edit2, LogOut, Trash2, VideoIcon, FileText, Crown, Calendar, Gift, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import { isSubscriptionActive } from "@/lib/subscription";

const VideoCard = dynamic(() => import("@/components/card/video-card"));

const Page = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery(["user", userId], async () => {
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

  // Subscription status for Student Ambassadors (3-month benefit)
  const { data: subscriptionData } = useQuery(
    ["subscription-status", userId],
    async () => {
      if (!userId) return null;
      const res = await fetch("https://zynoflixott.com/api/subscription/check", {
        headers: { userId: userId },
      });
      if (!res.ok) return null;
      return res.json();
    },
    { enabled: !!userId && user?.userType === "student_ambassador", staleTime: 60 * 1000 }
  );

  const router = useRouter();
  useEffect(() => {
    if (!isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }


  }, [isLogin]);
  if (isLoading)
    return <Loading className="h-screen flex items-center justify-center" />;

  // Derive registration fee status (API returns camelCase; support both for robustness)
  const isRegistrationFeePaid =
    user?.registrationFeePaid === true ||
    (user as { registration_fee_paid?: boolean })?.registration_fee_paid === true;

  const handletoLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("transactionId");
    window.location.href = "/login";
  };

  const handletoDeleteAccount = async () => {
    const response = await axios.delete(`/auth/user/${userId}`);
    if (response.status === 200) {
      toast.success("Account deleted successfully");
      handletoLogout();
    }

    if (response.status === 400) {
      toast.error("Account deletion failed");
    }

    if (response.status === 401) {
      toast.error("Unauthorized");
    }

    if (response.status === 500) {
      toast.error("Internal server error");
    }

    if (response.status === 404) {
      toast.error("User not found");
    }
  };


  return (
    <main className="px-3 sm:px-4 md:px-6 lg:px-8">
      {isProduction === "user" ? (
        <section className="w-full overflow-hidden dark:bg-gray-900">
          <div className="w-full mx-auto">


            <UpdateImg
              refetch={refetch}
              id="backgroundPic"
              name="backgroundPic"
              button={
                <div className="relative w-full group">
                  <img
                    src={user?.backgroundPic || "https://placehold.co/1200x400/1f2937/374151?text=Add+Background+Image"}
                    alt="User Cover hhjhj"
                    className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] xl:h-[350px] object-cover rounded-lg"
                  />
                  <div className=" inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-main p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Edit2 className="w-5 h-5 text-gray-800" />
                    </div>
                    {/* <span className="absolute bottom-4 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-3 py-1 rounded-full">Edit Cover</span> */}
                  </div>
                </div>
              }
            />



            {/* User Profile Image */}
            <div className="w-full flex justify-center sm:justify-start sm:pl-6 md:pl-8 lg:pl-12">
              <div className="relative">
                <img
                  src={user?.profilePic || "https://i.sstatic.net/l60Hf.png"}
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
                {user?.full_name || "User"}
              </h1>

              {/* Email */}
              <div className="flex flex-col items-center sm:items-start mt-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">Email</h3>
                <span className="text-gray-300 text-sm sm:text-base break-all">{user?.email || "No email"}</span>
              </div>

              {/* User Type Badge */}
              {user?.userType && (
                <div className="flex flex-col items-center sm:items-start mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-bold text-white">User Type:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.userType === "student_ambassador" 
                        ? "bg-green-500 text-white" 
                        : "bg-blue-500 text-white"
                    }`}>
                      {user.userType === "student_ambassador" 
                        ? "Student Brand Ambassador" 
                        : "Regular User"}
                    </span>
                  </div>
                </div>
              )}

              {/* Student Ambassador Details */}
              {user?.userType === "student_ambassador" && (
                <div className="flex flex-col items-center sm:items-start mt-4 gap-3">
                  <div className="bg-gray-800 p-4 rounded-lg w-full">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Student Ambassador Details</h3>
                    <div className="space-y-2">
                      {user?.college_name && (
                        <div>
                          <span className="text-gray-400 text-sm">College Name:</span>
                          <p className="text-white font-medium">{user.college_name}</p>
                        </div>
                      )}
                      {user?.age && (
                        <div>
                          <span className="text-gray-400 text-sm">Age:</span>
                          <p className="text-white font-medium">{user.age} years</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400 text-sm">Registration Status:</span>
                        <p className={`font-medium ${
                          isRegistrationFeePaid
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}>
                          {isRegistrationFeePaid
                            ? "✓ Registration Fee Paid"
                            :"✓ Registration Fee Paid"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Benefits & Incentives for Brand Ambassadors */}
                  <div className="mt-4 p-4 rounded-lg bg-gray-800/80 border border-gray-700/50 w-full">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3">Your Benefits & Incentives</h3>
                    <p className="text-gray-400 text-xs mb-3">Note: Brand Ambassador program is for current college students only.</p>
                    <ul className="space-y-2 text-sm text-gray-200">
                      <li className="flex items-start gap-2">
                        <span className="text-[#7b61ff] shrink-0">1.</span>
                        <span>Free ZynoFlix OTT subscription for 3 months</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7b61ff] shrink-0">2.</span>
                        <span>Official Brand Ambassador of ZynoFlix OTT tag & ID card</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7b61ff] shrink-0">3.</span>
                        <span>Certificate delivered to your college</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7b61ff] shrink-0">4.</span>
                        <span>Eligibility for job offer from ZynoFlix OTT</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7b61ff] shrink-0">5.</span>
                        <span>Monthly earning from subscription referral count (earn ₹5,000 – ₹50,000 per month, subject to verification)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7b61ff] shrink-0">6.</span>
                        <span>Event Head opportunity to conduct short film festival with 50% revenue share (as per agreed terms)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7b61ff] shrink-0">7.</span>
                        <span>Higher education–related offers and support (subject to availability)</span>
                      </li>
                    </ul>
                  </div>
                  {/* Terms and Conditions applied - Brand Ambassador */}
                  <div className="mt-3 p-3 rounded-lg bg-gray-800/60 border border-gray-700/50">
                    <p className="text-gray-400 text-xs sm:text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span>Terms and Conditions applied*.</span>
                      <span className="text-gray-500">|</span>
                      <Link href="/brand-ambassador-terms" className="text-[#7b61ff] hover:text-[#a78bfa] underline">
                        Brand Ambassador Terms
                      </Link>
                      <span className="text-gray-500">|</span>
                      <Link href="/refund-policy" className="text-[#7b61ff] hover:text-[#a78bfa] underline">
                        Refund Policy
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="py-6 px-4 sm:px-6 md:px-8 lg:px-12">
              {/* Student Ambassador: 3-Month Free Subscription card */}
              {user?.userType === "student_ambassador" && (
                <div className="mb-6">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-indigo-900/40 border border-purple-500/30 shadow-xl shadow-purple-500/10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
                    <div className="relative p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
                            <Gift className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <Crown className="h-5 w-5 text-amber-400" />
                              Your 3-Month Free Subscription
                            </h3>
                            <p className="text-sm text-gray-400 mt-0.5">
                              Included with your Student Brand Ambassador program
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {subscriptionData?.hasSubscription && subscriptionData?.subscription?.endDate ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-semibold text-green-400 border border-green-500/30">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Active
                            </span>
                          ) : isRegistrationFeePaid ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Benefit active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
                              Pay registration to activate
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <ul className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 text-sm text-gray-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                            Full access to all award-winning short films
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                            No extra payment — part of your Ambassador benefits
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                            Valid for 3 months from program activation
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                            Watch on any device, anytime
                          </li>
                        </ul>
                        {subscriptionData?.subscription?.endDate && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            Access until{" "}
                            {new Date(subscriptionData.subscription.endDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription card for non–Student Ambassador users */}
              {user?.userType !== "student_ambassador" && (
                <div className="mb-6">
                  <SubscriptionCard user={user} onUpdate={() => refetch()} />
                </div>
              )}

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
      ) : (
        <ProductionProfile />
      )}
    </main>
  );
};

export default Page;
