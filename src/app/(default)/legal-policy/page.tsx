"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Database,
  Clock,
  AlertTriangle,
  Copyright,
  Download,
  Shield,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck
} from "lucide-react";
import Link from "next/link";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const LegalSection = ({ title, children, icon }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 rounded-xl overflow-hidden bg-[rgba(25,28,51,0.5)] backdrop-blur-sm border border-[#292c41]/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left bg-[rgba(25,28,51,0.8)] hover:bg-[rgba(25,28,51,1)] transition-colors"
      >
        <div className="flex items-center">
          {icon && <div className="mr-3 text-[#7b61ff]">{icon}</div>}
          <h2 className="text-base sm:text-lg font-bold text-white">{title}</h2>
        </div>
        <div className="text-white">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 sm:p-6 text-gray-200 text-sm sm:text-base">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const LegalPolicy = () => {
  // For automatically opening first section
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen pt-16 sm:pt-24 bg-gradient-to-br from-[#1a0733] to-[#2c1157]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-[#7b61ff]/20 rounded-full mb-3 sm:mb-4">
            <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-[#7b61ff]" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Legal Policy
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            ZynoFlix OTT Platform Legal Guidelines and Compliance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[rgba(25,28,51,0.3)] backdrop-blur-sm p-4 sm:p-6 rounded-xl mb-8 border border-[#292c41]/50"
        >
          <p className="text-gray-200 text-sm sm:text-base">
            ZynoFlix OTT operates in compliance with all applicable Indian laws governing digital content and intellectual property. This legal policy outlines our practices regarding data collection, content requirements, and user responsibilities when using our platform.
          </p>
        </motion.div>

        {/* Section 1: Privacy Data Collection and Storage */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-[#7b61ff]/20 text-[#7b61ff] mr-3">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              1. Legal - Privacy Data Collection and Storage
            </h2>
          </div>

          <LegalSection
            title="Data Collection & Third-Party Content"
            icon={<Database size={20} />}
          >
            <p>
              ZynoFlix OTT does not collect or store videos hosted on third-party websites. All videos uploaded must be original or legally licensed content created by the users. The platform only handles videos uploaded directly by users on our platform. This is in accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </LegalSection>

          <LegalSection
            title="Video Duration & Content Type"
            icon={<Clock size={20} />}
          >
            <p>
              ZynoFlix OTT is a Shortfilms OTT platform exclusively for short films. All videos uploaded should be short films with a maximum duration of 30 minutes. Content exceeding this duration or not classified as short films will be deemed inappropriate and may be removed, as per the provisions of the Copyright Act, 1957, Sections 14 and 52, which govern the rights related to copyright duration and fair use.
            </p>
          </LegalSection>

          <LegalSection
            title="Legal Action & Copyright Strikes"
            icon={<AlertTriangle size={20} />}
          >
            <p>
              In case of copyright infringement or copyright strikes, the Company reserves the right to take legal action against the offending user, including removal of infringing content and reporting to authorities under the Copyright Act, 1957, and the Information Technology Act, 2000. The platform strictly adheres to the laws governing intellectual property rights and digital content.
            </p>
          </LegalSection>

          <LegalSection
            title="Ownership & Rights"
            icon={<Copyright size={20} />}
          >
            <p>
              If users wish to claim ownership of any short film, they must approach the original producers or rights holders directly. The platform does not claim ownership of the uploaded content but only facilitates its streaming, in accordance with the Indian Contract Act, 1872.
            </p>
          </LegalSection>

          <LegalSection
            title="Illegal Download & Upload"
            icon={<Download size={20} />}
          >
            <p>
              ZynoFlix OTT is not responsible for any illegal downloading of videos from third-party sites. Users who download videos illegally and upload them onto ZynoFlix OTT do so at their own risk. Legal action will be initiated against such users as per the Copyright Act, 1957, and the Information Technology Act, 2000.
            </p>
          </LegalSection>

          <LegalSection
            title="Repeated Uploads Across Platforms"
            icon={<AlertTriangle size={20} />}
          >
            <p>
              If a short film uploaded on ZynoFlix OTT is also hosted on other platforms, the Company will pursue legal action based on copyright laws, including takedown notices and legal proceedings, in accordance with the Copyright Act, 1957.
            </p>
          </LegalSection>

          <LegalSection
            title="User Responsibility & Platform Use"
            icon={<UserCheck size={20} />}
          >
            <p>
              Users are encouraged to upload their own short films after understanding these terms. Continued use of the platform signifies acceptance of these terms and compliance with applicable laws.
            </p>
          </LegalSection>
        </div>

        {/* Section 2: Intellectual Property & Audio/Video Downloading */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-[#7b61ff]/20 text-[#7b61ff] mr-3">
              <Copyright className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              2. Legal - Intellectual Property & Audio/Video Downloading
            </h2>
          </div>

          <LegalSection
            title="Intellectual Property Rights"
            icon={<Copyright size={20} />}
          >
            <p>
              All videos and audio content uploaded must be original or legally licensed. Users warrant that they possess all necessary rights to upload and distribute the content and that such uploads do not infringe upon any third-party rights, in compliance with the Copyright Act, 1957, and other relevant laws.
            </p>
          </LegalSection>

          <LegalSection
            title="Prohibition on Downloading Content"
            icon={<Download size={20} />}
          >
            <p>
              Users are strictly prohibited from downloading videos, audio, or any content from ZynoFlix OTT unless explicitly permitted by the platform or the content owner. Unauthorized downloading or distribution is illegal and will lead to legal consequences under the Copyright Act, 1957, and the Information Technology Act, 2000.
            </p>
          </LegalSection>

          <LegalSection
            title="Downloading Content from ZynoFlix OTT"
            icon={<AlertTriangle size={20} />}
          >
            <p>
              ZynoFlix OTT does not provide any features or services for downloading videos or audio content from the platform. All content is for streaming only within the platform's environment, in accordance with copyright laws.
            </p>
          </LegalSection>

          <LegalSection
            title="Copyright & License Violations"
            icon={<Shield size={20} />}
          >
            <p>
              Any attempt to download, copy, or distribute content without proper authorization violates copyright laws and these Terms and Conditions. Users found engaging in such activities may face suspension, legal action, and liability for damages, as per the provisions of the Copyright Act, 1957, and the Indian Penal Code, 1860.
            </p>
          </LegalSection>

          <LegalSection
            title="User Responsibility"
            icon={<UserCheck size={20} />}
          >
            <p>
              Users must respect intellectual property rights and only upload content they own or have proper licenses for. Attempting to unlawfully download or extract content from the platform is strictly prohibited and may result in legal action under relevant laws.
            </p>
          </LegalSection>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center text-gray-300 text-sm"
        >
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="text-[#7b61ff] hover:text-white transition-colors">
              Return to Home
            </Link>
            <Link href="/privacy-policy" className="text-[#7b61ff] hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-condition" className="text-[#7b61ff] hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPolicy;
