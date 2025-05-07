"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Check, Info, ChevronDown, ChevronUp, ExternalLink, Copyright, Shield } from "lucide-react";
import Link from "next/link";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const TermsSection = ({ title, children, icon }: SectionProps) => {
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

const TermsAndConditions = () => {
  // For automatically opening sections on desktop
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
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-[#7b61ff]" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            Effective Date: May 7, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[rgba(25,28,51,0.3)] backdrop-blur-sm p-4 sm:p-6 rounded-xl mb-8 border border-[#292c41]/50"
        >
          <p className="text-gray-200 text-sm sm:text-base">
            Welcome to ZynoFlix OTT, operated by Infopod Media Entertainment Private Limited ("the Company"). Please read these Terms and Conditions carefully before accessing or using our platform. By accessing or using ZynoFlix OTT, you agree to abide by these terms.
          </p>
        </motion.div>

        <TermsSection
          title="1. About ZynoFlix OTT"
          icon={<Info size={20} />}
        >
          <p className="mb-4">
            ZynoFlix OTT is a legally registered OTT platform under Infopod Media Entertainment Private Limited (Reg. No.: [Insert Registration Number], 2024). Our platform exclusively streams short films created by artists and filmmakers worldwide, focusing on originality, creativity, and cultural diversity. ZynoFlix OTT is committed to following all applicable laws and regulations in India pertaining to media, entertainment, copyright, and digital content.
          </p>
        </TermsSection>

        <TermsSection
          title="2. User Eligibility"
          icon={<Check size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>Users must be at least 18 years of age to access certain content. Minors should access age-appropriate content only.</li>
            <li>By using ZynoFlix OTT, you confirm you are legally eligible to view and upload content as per Indian laws.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="3. Content Upload & User Responsibilities"
          icon={<AlertTriangle size={20} />}
        >
          <h3 className="font-semibold text-white mb-2">a. Original Content Only</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>All users (artists, creators) uploading short films or any content to ZynoFlix OTT must upload original content they have created or hold the rights to.</li>
            <li>Uploading third-party or copyrighted content from other websites, platforms, or sources without proper authorization is strictly prohibited.</li>
            <li>The Company reserves the right to delete any infringing content and take legal action under the Copyright Act, 1957 and Information Technology Act, 2000.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">b. Copyright & Intellectual Property</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Users affirm that their uploaded content is original or legally licensed.</li>
            <li>Unauthorized use of copyrighted material will result in copyright strikes, content removal, and possible legal proceedings.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">c. Content Restrictions</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>No 18+, adult, vulgar, or obscene content is permitted.</li>
            <li>Content should be respectful, non-offensive, and suitable for a general audience.</li>
            <li>Content promoting violence, hatred, discrimination, or illegal activities is strictly prohibited.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">d. Building Careers</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>ZynoFlix OTT aims to serve as a platform for emerging artists and filmmakers to showcase their talent.</li>
            <li>Sensitive or inappropriate content that could harm the platform's reputation or violate community standards should be avoided.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="4. Rights and Ownership"
          icon={<Copyright size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>All rights to the platform and its content are owned by Infopod Media Entertainment Private Limited.</li>
            <li>Users retain rights to their uploaded content but grant the platform a non-exclusive license to display, distribute, and promote their videos within the platform.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="5. User Conduct & Responsibilities"
          icon={<AlertTriangle size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>Users agree not to upload or share content that is illegal, infringing, harmful, or violates any applicable law.</li>
            <li>Users shall not engage in activities that may disrupt or harm the platform or its users, including hacking, spamming, or distributing malware.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="6. Compliance with Laws"
          icon={<Shield size={20} />}
        >
          <p className="mb-4">ZynoFlix OTT complies with Indian laws, including but not limited to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</li>
            <li>Copyright Act, 1957</li>
            <li>The Cinematograph Act, 1952</li>
            <li>The Cinematography (Amendment) Bill, 2021</li>
            <li>The Indian Penal Code (IPC)</li>
          </ul>
          <p>Content that violates any applicable laws will be removed, and appropriate legal action will be taken against violators.</p>
        </TermsSection>

        <TermsSection
          title="7. Content Moderation & Removal"
          icon={<AlertTriangle size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>ZynoFlix OTT reserves the right to review, moderate, and remove any content that violates these Terms and Conditions or community standards.</li>
            <li>The platform may suspend or terminate user accounts involved in violations.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="8. Limitation of Liability"
          icon={<Shield size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>ZynoFlix OTT is not responsible for the accuracy, legality, or appropriateness of user-generated content.</li>
            <li>The platform disclaims any liability for damages arising from the use or inability to use the platform or its content.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="9. Privacy & Data Protection"
          icon={<Shield size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>Personal data collected by ZynoFlix OTT is handled in accordance with applicable privacy laws, including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
            <li>For details, refer to our <Link href="/privacy-policy" className="text-[#7b61ff] hover:underline">Privacy Policy</Link> accessible on the platform.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="10. Intellectual Property Rights & DMCA Policy"
          icon={<Copyright size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>ZynoFlix OTT respects intellectual property rights and adheres to the Digital Millennium Copyright Act (DMCA).</li>
            <li>If you believe your copyrighted work has been infringed, please contact us at <a href="mailto:infozynoflixott@gmail.com" className="text-[#7b61ff] hover:underline">infozynoflixott@gmail.com</a> with relevant details.</li>
          </ul>
        </TermsSection>

        <TermsSection
          title="11. Changes to the Terms & Conditions"
          icon={<Info size={20} />}
        >
          <p>ZynoFlix OTT reserves the right to modify these Terms and Conditions at any time. Changes will be notified on the platform, and continued use signifies acceptance of the updates.</p>
        </TermsSection>

        <TermsSection
          title="12. Contact Details"
          icon={<ExternalLink size={20} />}
        >
          <p className="mb-4">For any queries, complaints, or legal notices, contact us at:</p>

          <ul className="space-y-2">
            <li><span className="font-semibold text-white">Email:</span> <a href="mailto:infozynoflixott@gmail.com" className="text-[#7b61ff] hover:underline">infozynoflixott@gmail.com</a></li>
            <li><span className="font-semibold text-white">Phone:</span> 8270895609</li>
            <li><span className="font-semibold text-white">Registered Office:</span> Bangalore, India</li>
          </ul>
        </TermsSection>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center text-gray-300 text-sm"
        >
          <p>By using ZynoFlix OTT, you agree to abide by these Terms and Conditions.</p>

          <div className="mt-8 flex items-center justify-center space-x-6">
            <Link href="/" className="text-[#7b61ff] hover:text-white transition-colors">
              Return to Home
            </Link>
            <Link href="/privacy-policy" className="text-[#7b61ff] hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
