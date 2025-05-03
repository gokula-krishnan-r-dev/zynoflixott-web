import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const footerData: FooterSection[] = [
  {
    title: "help",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/legal-policy" },
      { label: "refund policy", href: "/refund-policy" },
      { label: "copy right", href: "/copyrights" },
      {
        label: "Legal Policy",
        href: "/legal-policy",
      },
    ],
  },
  {
    title: "OUR SERVICE",
    links: [
      { label: "Sell Videos", href: "https://www.zynoflix.com/upload-video" },
      { label: "Wanted Video", href: "https://www.zynoflix.com/wanted/video" },
      { label: "Sponsorship", href: "https://www.zynoflix.com/sponsorship" },
      { label: "Awards", href: "https://www.zynoflix.com/awards" },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className=" bg-gray-900 lg:pb-0 pb-14 relative">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="space-y-5">
            <a className="flex w-full items-center mb-4 sm:mb-12" href="/">
              <img
                src="/logo/logo.png"
                className="h-24 mr-3"
                alt="Flowbite Logo"
              />
            </a>
            <div className="flex flex-col">
              <a
                className=" mb-7 text-white mt-7 text-center rounded-xl bg-main px-4 py-2"
                href="/video-upload"
              >
                Upload your video
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
            <div>
              <h2 className="mb-6 text-sm font-semibold  uppercase text-white">
                HELP
              </h2>
              <ul className=" text-gray-400 capitalize font-medium">
                <li className="">
                  <a className="hover:underline" href="/contact">
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    className="hover:underline"
                    href="https://zynoflix.com/faq"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="/about">
                    About us
                  </a>
                </li>
                <li className="">
                  <a
                    className="hover:underline"
                    href="https://zynoflix.com/location"
                  >
                    Location
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold  uppercase text-white">
                LEGAL
              </h2>
              <ul className=" text-gray-400 font-medium">
                <li className="">
                  <a className="hover:underline " href="/legal-policy">
                    Terms and Condition
                  </a>
                </li>
                <li>
                  <a className="hover:underline " href="/privacy-policy">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:underline " href="/refund-policy">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a className="hover:underline " href="/copyrights">
                    Copy Rights
                  </a>
                </li>
                <li>
                  <a
                    className="hover:underline"
                    href="https://zynoflix.com/founder"
                  >
                    Team
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold  uppercase text-white">
                OUR SERVICE
              </h2>
              <ul className=" text-gray-400 font-medium">
                {/* <li className="">
                  <a className="hover:underline" href="/upload-video">
                    Sell Videos
                  </a>
                </li>
                <li>
                  <a
                    className="hover:underline"
                    href="https://zynoflix.com/wanted/video"
                  >
                    Wanted Videos
                  </a>
                </li> */}
                {/* <li>
                  <a
                    className="hover:underline"
                    href="https://zynoflix.com/ticket/booking"
                  >
                    Live Streaming
                  </a>
                </li> */}
                <li>
                  {/* FILM CALL */}
                  <Button className="bg-main text-black">Film Call</Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="google_translate_element"> </div>
        <hr className="my-6   sm:mx-auto border-gray-700 lg:my-8" />
        <div className="flex justify-end  md:ml-auto gap-y-3 lg:gap-y-0 lg:flex-row flex-col md:mr-0 mx-auto items-center flex-shrink-0 space-x-0 lg:space-x-4">
          <a
            className="bg-background_body inline-flex py-3 px-5 rounded-xl items-center  hover:border-blue-500 duration-300 border-gray-400 border  focus:outline-none"
            href="https://play.google.com/store/apps/details?id=com.fueronetwork.zynoflix"
            target="_black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-6 h-6 text-gray-100"
              viewBox="0 0 512 512"
            >
              <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z" />
            </svg>
            <span className="ml-4 flex items-start flex-col leading-none">
              <span className="text-xs text-gray-300 mb-1">GET IT ON</span>
              <span className="title-font  text-gray-300 font-medium">
                Google Play
              </span>
            </span>
          </a>
          <button className="bg-background_body inline-flex py-3 px-5 rounded-xl items-center hover:border-blue-500 duration-300 border-gray-400 border focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-6 h-6 text-gray-100"
              viewBox="0 0 305 305"
            >
              <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z" />
              <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z" />
            </svg>
            <span className="ml-4 flex text-gray-300 items-start flex-col leading-none">
              <span className="text-xs text-gray-300 mb-1">
                Download on the
              </span>
              <span className="title-font text-gray-300 font-medium">
                App Store
              </span>
            </span>
          </button>
        </div>
        <hr className="my-6   sm:mx-auto border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm  sm:text-center text-gray-400">
            © 2024{" "}
            <a className="hover:underline" href="https://flowbite.com/">
              ZynoFlixOTT
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 text-white space-x-5 sm:justify-center sm:mt-0">
            <a
              href="https://youtube.com/@ZynoFlix"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png"
                alt="Youtube"
                className="rounded-full w-10 object-cover h-10 false "
              />
            </a>
            <a
              href="https://twitter.com/zynoflix?t=MreA7FFUWiNJJ9Jof7b8MQ&s=09"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png"
                alt="Twitter"
                className="rounded-full w-10 object-cover h-10 false "
              />
            </a>
            <a
              href="https://www.linkedin.com/company/zynoflix/"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png"
                alt="LinkedIn"
                className="rounded-full w-10 h-10 false "
              />
            </a>
            <a
              href="https://www.facebook.com/zynoflix?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://www.logo.wine/a/logo/Facebook/Facebook-f_Logo-Blue-Logo.wine.svg"
                alt="FaceBook"
                className="rounded-full w-10 object-cover h-10 p-[3px] "
              />
            </a>
            <a
              href="https://instagram.com/zynoflix__?igshid=MzNlNGNkZWQ4Mg=="
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png"
                alt="Instagram"
                className="rounded-full w-10 object-cover h-10 false "
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
