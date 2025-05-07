import axios from "@/lib/axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchComponents = () => {
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle clicking outside search results
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current &&
        !(wrapperRef.current as HTMLElement).contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Debounce search function to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim()) {
        fetchSearch(search);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchValue([]);
      setOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.get(`/banner?query=${query}`);
      setSearchValue(data.video || []);
      setOpen(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchValue([]);
    setOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          value={search}
          onChange={handleInputChange}
          placeholder="Search a video"
          type="text"
          className="w-full bg-[rgba(25,28,51,0.5)] backdrop-blur-sm text-white rounded-full px-4 py-2 pl-10 text-sm border border-[#292c41]/50 focus:border-[#7b61ff] outline-none transition-all"
          onFocus={() => {
            if (search.trim()) {
              setOpen(true);
            }
          }}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-[#292c41]/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-30"
          >
            <div className="bg-[#1a0733] border border-[#292c41]/50 rounded-xl overflow-hidden shadow-xl">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-[#7b61ff] border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-400">Searching...</p>
                </div>
              ) : searchValue.length > 0 ? (
                <ScrollArea className="max-h-[70vh] sm:max-h-[400px]">
                  <div className="p-2">
                    {searchValue.map((video: any, index: number) => (
                      <Link
                        href={`/video/${video?._id}`}
                        key={video._id || index}
                        className="flex items-center gap-3 p-2 hover:bg-[#292c41]/30 rounded-lg transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex-shrink-0 w-16 h-9 relative rounded-md overflow-hidden bg-[#292c41]">
                          <Image
                            src={video.processedImages?.small?.path || video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-sm font-medium truncate">
                            {video.title}
                          </h3>
                          <p className="text-gray-400 text-xs truncate">
                            {video.category?.[0]?.split(",")[0] || video.category}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              ) : search.trim() ? (
                <div className="py-8 text-center px-4">
                  <p className="text-sm text-gray-400">No results found for "{search}"</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchComponents;
