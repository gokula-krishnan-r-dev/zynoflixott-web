import Link from "next/link";
import React from "react";

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
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto p-4 py-6 lg:py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img
              src="/logo/logo.png"
              className="h-24 mr-3"
              alt="ZynoFlix Logo"
            />
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* Facebook Icon */}
              </svg>
            </a>
            <a href="#" className="hover:text-white">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* Twitter Icon */}
              </svg>
            </a>
            <a href="#" className="hover:text-white">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* GitHub Icon */}
              </svg>
            </a>
            <a href="#" className="hover:text-white">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* Dribbble Icon */}
              </svg>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          {footerData.map((section: FooterSection, index: number) => (
            <div key={index}>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.links.map((link: any, idx: any) => (
                  <li key={idx}>
                    <Link
                      target="_black"
                      href={link.href}
                      className="hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="my-6 border-gray-700" />
        <div className="flex justify-between items-center">
          <span className="text-sm">
            &copy; 2024{" "}
            <a href="/" className="hover:underline">
              ZynoFlixott™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
