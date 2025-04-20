import React, { useState } from "react";
import Loading from "../ui/loading";
import axios from "@/lib/axios";
import { useQuery } from "react-query";
import { isLogin, userId } from "@/lib/user";
import { toast } from "sonner";
import { isMonthMembershipCompleted, timeAgoString } from "@/lib/time";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";

const VideoComment = ({ videoId }: any) => {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const {
    data: comment,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["comment", videoId],
    async () => {
      const response = await axios.get(`/comment/${videoId}`);
      return response.data.comments;
    },
    {
      refetchInterval: 5000,
    }
  );

  if (isLoading)
    return <Loading className="h-screen flex items-center justify-center" />;

  if (error) return <p>Error: </p>;

  const handletoSubmit = async () => {
    if (!content) {
      toast.error("Please enter comment");
    }

    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }

    const response = await axios.post(`/comment/${videoId}`, {
      content,
      videoId,
      userId,
    });

    if (response.status === 201) {
      toast.success("Comment added successfully");
      refetch();
      setContent("");
    } else {
      toast.error("Failed to add comment Please try again later");
    }

    refetch();
  };

  return (
    <div className="lg:flex-[0.7] flex-1 w-full">
      <div className="">
        <section className="bg-gray-900 rounded-3xl py-8 lg:py-16 antialiased">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-white">
                Discussion ({comment.length})
              </h2>
            </div>
            <div className="mb-6">
              <div className="py-2 px-4 mb-4  rounded-lg rounded-t-lg border bg-gray-800 border-gray-700">
                <label htmlFor="comment" className="sr-only">
                  Your comment
                </label>
                <textarea
                  value={content}
                  onKeyDown={(e) => e.key === "Enter" && handletoSubmit()}
                  onChange={(e) => setContent(e.target.value)}
                  id="comment"
                  rows={6}
                  className="px-0 w-full text-sm text-white border-0 focus:ring-0 focus:outline-none placeholder-gray-400 bg-gray-800"
                  placeholder="Write a comment..."
                />
              </div>
              <button
                onClick={handletoSubmit}
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-green-600 rounded-xl focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Post comment
              </button>
            </div>
            {comment.length === 0 && (
              <p className="text-white text-center">No comment yet</p>
            )}
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              {comment.map((comment: any, index: number) => (
                <article
                  key={index}
                  className="p-6 text-base mt-4 border border-gray-500 rounded-3xl bg-gray-900"
                >
                  <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <p className="inline-flex items-center mr-3 text-sm text-white font-semibold">
                        <Image
                          width={44}
                          height={44}
                          className="mr-2 rounded-full"
                          src={comment?.user?.profilePic || "/logo/logo.png"}
                          alt="Michael Gough"
                        />
                        {comment.user?.full_name || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-400">
                        <time dateTime="2022-02-08" title="February 8th, 2022">
                          {/* Feb. 8, 2022 */}
                          {timeAgoString(new Date(comment.createdAt))}
                        </time>
                      </p>
                    </div>
                  </footer>
                  <p className="text-gray-400">{comment.content}</p>
                </article>
              ))}
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VideoComment;
