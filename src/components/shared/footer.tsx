'use client'
import React, { useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the GoogleTranslate component with no SSR
const GoogleTranslate = dynamic(
  () => import('../GoogleTranslate'),
  { ssr: false }
);

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
      //event
      { label: "Event", href: "/event" },
      //advertisement
      { label: "Advertisement", href: "/advertisement" },
      {
        label: "Legal Policy",
        href: "/legal-policy",
      },
      { label: "Brand Ambassador Terms, Refund & Benefits", href: "/brand-ambassador-terms" },
    ],
  },
  {
    title: "OUR SERVICE",
    links: [
      { label: "Sell Videos", href: "https://www.zynoflix.com/upload-video" },
      { label: "Wanted Video", href: "https://www.zynoflix.com/wanted/video" },
      { label: "Sponsorship", href: "https://www.zynoflix.com/sponsorship" },
      { label: "Awards", href: "https://www.zynoflix.com/awards" },
      { label: "Student Ambassador", href: "/student-ambassador" },
    ],
  },
];

const Footer: React.FC = () => {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
                  <a className="hover:underline " href="/terms-condition">
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
                    href="/legal-policy"
                  >
                    Legal policy
                  </a>
                </li>
                <li>
                  <a
                    className="hover:underline"
                    href="/brand-ambassador-terms"
                  >
                    Brand Ambassador Terms, Refund & Benefits
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
                  <a
                    className="hover:underline"
                    href="/sell-shortfilm-contact"
                  >
                    Sell Shortfilms
                  </a>
                </li>

                <li>
                  <a className="hover:underline " href="/event"> Event
                  </a>
                </li>

                <li>
                  <a className="hover:underline " href="/advertisement">
                    Advertisement
                  </a>
                </li>

                <li>
                  <a className="hover:underline " href="/live-streams">
                    Live Stream
                  </a>
                </li>

                {/* production */}
                <li>
                  <a className="hover:underline " href="/production">
                    Film Production
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <GoogleTranslate />
        </div>
        <hr className="my-6   sm:mx-auto border-gray-700 lg:my-8" />
        <div className="flex justify-end  md:ml-auto gap-y-3 lg:gap-y-0 lg:flex-row flex-col md:mr-0 mx-auto items-center flex-shrink-0 space-x-0 lg:space-x-4">
          <a
            className="bg-background_body inline-flex py-3 px-5 rounded-xl items-center  hover:border-blue-500 duration-300 border-gray-400 border  focus:outline-none"
            href="https://play.google.com/store/apps/details?id=com.zynoflixott.app"
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
          <a href="https://apps.apple.com/us/app/zynoflix-ott/id6745213862" className="bg-background_body inline-flex py-3 px-5 rounded-xl items-center hover:border-blue-500 duration-300 border-gray-400 border focus:outline-none">
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
          </a>
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
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a
              href="https://youtube.com/@ZynoFlix"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="YouTube"
            >
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" className="w-5 h-5">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </div>
            </a>
            <a
              href="https://twitter.com/zynoflix?t=MreA7FFUWiNJJ9Jof7b8MQ&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="Twitter"
            >
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1DA1F2" className="w-5 h-5">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/company/zynoflix/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="LinkedIn"
            >
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2" className="w-5 h-5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
            </a>
            <a
              href="https://www.facebook.com/zynoflix?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="Facebook"
            >
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
            </a>
            <a
              href="https://instagram.com/zynoflix__?igshid=MzNlNGNkZWQ4Mg=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="Instagram"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-110 p-[2px]">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <defs>
                      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFDC80" />
                        <stop offset="50%" stopColor="#E1306C" />
                        <stop offset="100%" stopColor="#833AB4" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                      fill="url(#instagram-gradient)" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
