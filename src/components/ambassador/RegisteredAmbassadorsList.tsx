"use client";

import React from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

const DEFAULT_AVATAR = "https://i.sstatic.net/l60Hf.png";
const LIST_QUERY_KEY = "student-ambassadors-list";

/** Strip query string (e.g. Azure SAS token) so img src is a clean URL. */
function imageUrlWithoutQuery(url: string | undefined): string {
  if (!url || typeof url !== "string") return "";
  const i = url.indexOf("?");
  return i === -1 ? url : url.slice(0, i);
}

export interface AmbassadorListItem {
  _id: string;
  full_name: string;
  profilePic: string;
}

async function fetchAmbassadorsList(): Promise<AmbassadorListItem[]> {
  const { data } = await axios.get<{ ambassadors: AmbassadorListItem[] }>(
    "/auth/student-ambassador/list"
  );
  return data.ambassadors ?? [];
}

function AmbassadorRow({
  full_name,
  profilePic,
}: {
  full_name: string;
  profilePic: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/5 transition-colors shrink-0">
      <img
        src={imageUrlWithoutQuery(profilePic) || DEFAULT_AVATAR}
        alt=""
        className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
      />
      <span className="text-sm font-medium text-white truncate">
        {full_name || "Ambassador"}
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-2 px-2 shrink-0">
      <div className="w-9 h-9 rounded-full bg-white/10 shrink-0 animate-pulse" />
      <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
    </div>
  );
}

export function RegisteredAmbassadorsList() {
  const { data: ambassadors, isLoading, error } = useQuery({
    queryKey: [LIST_QUERY_KEY],
    queryFn: fetchAmbassadorsList,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (error || (!isLoading && (!ambassadors || ambassadors.length === 0))) {
    return null;
  }

  return (
    <div className="w-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <Users className="w-4 h-4 text-[#7b61ff]" />
        <h3 className="text-sm font-semibold text-white">
          Already Registered Student Ambassadors
        </h3>
      </div>
      <ScrollArea className="h-[200px] w-full">
        <div className="p-2 space-y-0">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          ) : (
            ambassadors?.map((a) => (
              <AmbassadorRow
                key={a._id}
                full_name={a.full_name}
                profilePic={a.profilePic}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
