"use client";
import { isLogin } from "@/lib/user";
import Link from "next/link";
import { useEffect, useState } from "react";
const menuItems = [
  { label: "Home", href: "#", isActive: true },
  { label: "Upload a Video", href: "/video-upload" },
  { label: "Chat", href: "/chat" },
  { label: "profile", href: "/profile" },
  { label: "Membership", href: "/membership" },
  { label: "Login", href: "/login" },
];

export function SheetMobile() {
  const [open, setOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setLoggedIn(isLogin);
  }, []);

  if (loggedIn === null) {
    return <div>Loading...</div>; // Placeholder to ensure server and client render the same initially
  }
  return (
    <div className="">
      <button onClick={() => setOpen(!open)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      {open && (
        <div className="fixed bg-body w-[60%] top-0 bottom-0 left-0 duration-500">
          <div className="px-1 relative flex-col w-full flex items-center justify-center py-4">
            <button
              className="absolute top-3 right-3"
              onClick={() => setOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <nav className=" px-0 lg:px-1 w-full py-2.5 dark:bg-gray-800">
              <div className="flex flex-wrap justify-between items-center w-full ">
                <div
                  className="justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                  id="mobile-menu-2"
                >
                  <Navigation items={menuItems} />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
import React from "react";

type MenuItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

type NavProps = {
  items: MenuItem[];
};

const Navigation: React.FC<NavProps> = ({ items }) => {
  return (
    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
      {items.map((item, index) => (
        <li key={index}>
          <a
            href={item.href}
            className={`block py-2 pr-4 pl-3 rounded ${
              item.isActive
                ? "text-white bg-primary-700 lg:bg-transparent lg:text-primary-700 dark:text-white"
                : "text-gray-700 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
            }`}
            aria-current={item.isActive ? "page" : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
