import axios from "@/lib/axios";
import { PathLink } from "@/lib/generate-aws-link";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import Link from "next/link";

const SearchComponnets = () => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>("");

  const fetchSearch = async (e: any) => {
    setSearch(e.target.value);
    setOpen(true);
    const { data } = await axios.get(`/banner?query=${e.target.value}`);

    setSearchValue(data.video);
  };
  console.log(searchValue, "data");
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div ref={wrapperRef} className="py-4 lg:block hidden h-20 w-60 ">
      <input
        onFocus={() => {
          fetchSearch({
            target: {
              value: "all",
            },
          });
        }}
        onChange={fetchSearch}
        placeholder="Search a video"
        type="text"
        className="border border-gray-600 text-white outline-none  bg-transparent w-full px-4 py-2 rounded-3xl"
      />

      {open && (
        <div className="w-96 mt-3">
          <ScrollArea className="h-96 w-96 bg-body rounded-3xl px-6 py-3 border border-gray-700">
            {searchValue &&
              searchValue.map((video: any) => (
                <Link
                  target="_blank"
                  href={`/video/${video?._id}`}
                  key={video.id}
                  className="py-4 flex items-center gap-8"
                >
                  <Image
                    width={100}
                    height={70}
                    src={PathLink(video.processedImages.small.path)}
                    alt=""
                    className="w-24 h-14 object-cover rounded-lg"
                  />
                  <div className="">
                    <h1 className="text-white text-sm font-semibold">
                      {video.title}
                    </h1>
                    <p className="text-white text-sm font-semibold">
                      {video.category}
                    </p>
                  </div>
                </Link>
              ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SearchComponnets;
