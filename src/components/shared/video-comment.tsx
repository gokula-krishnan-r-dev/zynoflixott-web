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
import { Send, MessageCircle } from "lucide-react";

const VideoComment = ({ videoId }: any) => {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handletoSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (isLogin) {
      toast.warning(
        "You need to login to add comment. Please login to add comment"
      );
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
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
        toast.error("Failed to add comment. Please try again later");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-xl overflow-hidden bg-[#1a0733] p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 relative mb-4">
            <MessageCircle className="text-purple-400 w-full h-full animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="text-center py-8 text-gray-400">
      <p>Could not load comments. Please try again later.</p>
    </div>
  );

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#2c1157] to-[#3c1973] rounded-t-xl p-4 lg:p-5">
        <div className="flex items-center gap-3">
          <MessageCircle className="text-white h-5 w-5 lg:h-6 lg:w-6" />
          <h2 className="text-lg lg:text-xl font-bold text-white">
            Comments ({comment.length})
          </h2>
        </div>
      </div>

      <div className="bg-[#1a0733] lg:p-6 p-4 rounded-b-xl">
        {/* Comment input field */}
        <div className="relative mb-6">
          <div className="flex items-start gap-3">
            <div className="hidden lg:block">
              <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center overflow-hidden">
                {isLogin ? (
                  <span className="text-white font-bold">G</span>
                ) : (
                  <Image
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    src="/logo/logo.png"
                    alt="User"
                  />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-[#191c33] rounded-xl overflow-hidden mb-2 border border-[#292c41] focus-within:border-purple-500 transition-colors">
                <textarea
                  value={content}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handletoSubmit();
                    }
                  }}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Join the conversation..."
                  className="w-full bg-transparent text-white p-3 lg:p-4 min-h-[80px] lg:min-h-[100px] outline-none resize-none text-sm lg:text-base placeholder:text-gray-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handletoSubmit}
                  disabled={isSubmitting || !content.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#7b61ff] hover:bg-[#6c52ee] disabled:bg-[#3c3562] disabled:cursor-not-allowed text-white rounded-full transition-colors text-sm font-medium"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments list */}
        {comment.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 lg:py-12 text-center">
            <MessageCircle className="text-purple-400 h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-white text-lg font-medium mb-1">No comments yet</h3>
            <p className="text-gray-400 text-sm">Be the first to share your thoughts</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] lg:max-h-[500px] pr-4 -mr-4">
            <div className="space-y-4">
              {comment.map((comment: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#191c33] rounded-xl p-4 border border-[#292c41] animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        src={comment?.user?.profilePic || "/logo/logo.png"}
                        alt={comment.user?.full_name || "User"}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-medium text-white">
                          {comment.user?.full_name || "Anonymous User"}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {timeAgoString(new Date(comment.createdAt))}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm lg:text-base">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default VideoComment;
