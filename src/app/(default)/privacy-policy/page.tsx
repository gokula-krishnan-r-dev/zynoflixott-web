"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const PolicySection = ({ title, children, icon }: SectionProps) => {
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

const PrivacyPolicy = () => {
  // Automatically open first section on mobile, all sections on desktop
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
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-[#7b61ff]" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Privacy Policy for ZynoFlix OTT
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
            Infopod Media Entertainment Private Limited ("we", "us", "our") is committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, use, store, and safeguard your information when you access or use ZynoFlix OTT ("the Platform").
          </p>
          <p className="text-gray-200 text-sm sm:text-base mt-3">
            Please read this Privacy Policy carefully. By using ZynoFlix OTT, you agree to the practices described herein.
          </p>
        </motion.div>

        <PolicySection
          title="1. Information We Collect"
          icon={<Lock size={20} />}
        >
          <h3 className="font-semibold text-white mb-2">a. Personal Data</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Name, email address, phone number, date of birth, gender.</li>
            <li>Profile picture and social media account details (if linked).</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">b. Account Information</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Login credentials (username, password) — Login ID: defg45@gmail.com, Password: abcd@.</li>
            <li>User preferences, viewing history, watchlists, feedback, and reviews.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">c. Content Data</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Videos uploaded, comments, reviews, and feedback.</li>
            <li>Content engagement metrics (views, likes, shares).</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">d. Device & Usage Data</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Device type, operating system, browser type.</li>
            <li>IP address, geolocation data, access time, and duration.</li>
            <li>Cookies and tracking technologies.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">e. Cookies & Similar Technologies</h3>
          <p>We utilize cookies, web beacons, and similar technologies to analyze traffic, personalize content, and improve user experience.</p>
        </PolicySection>

        <PolicySection
          title="2. Purposes of Data Collection & Use"
          icon={<Lock size={20} />}
        >
          <p className="mb-4">In accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and other applicable laws, we use your data for:</p>

          <ul className="space-y-2 mb-4">
            <li><span className="font-semibold text-white">Provision of services:</span> Streaming, content management, and user account functionalities.</li>
            <li><span className="font-semibold text-white">Personalization:</span> Content recommendations based on your preferences and viewing history.</li>
            <li><span className="font-semibold text-white">Communication:</span> Sending updates, notifications, and customer support responses.</li>
            <li><span className="font-semibold text-white">Legal & Regulatory Compliance:</span> Ensuring compliance with Indian laws such as the Information Technology Act, 2000, Copyright Act, 1957, and The Cinematograph Act, 1952.</li>
            <li><span className="font-semibold text-white">Security & Fraud Prevention:</span> Detecting and preventing unauthorized activities.</li>
            <li><span className="font-semibold text-white">Platform Improvement:</span> Analyzing usage patterns, fixing bugs, and enhancing features.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="3. Sharing Your Information"
          icon={<Lock size={20} />}
        >
          <h3 className="font-semibold text-white mb-2">a. Third Parties & Service Providers</h3>
          <p className="mb-4">We may share your data with trusted third-party vendors who perform services such as hosting, streaming, analytics, customer support, and platform maintenance, under strict confidentiality obligations.</p>

          <h3 className="font-semibold text-white mb-2">b. Legal Obligations</h3>
          <p className="mb-4">We may disclose your data if required by law, legal process, or government authority or to protect our rights, safety, and property.</p>

          <h3 className="font-semibold text-white mb-2">c. Business Transfers</h3>
          <p>In connection with mergers, acquisitions, or sale of assets, your data may be transferred as part of that process.</p>
        </PolicySection>

        <PolicySection
          title="4. Data Security & Retention"
          icon={<Shield size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>We adopt industry-standard security measures, including encryption, firewalls, and secure data storage, to protect your personal data from unauthorized access, alteration, disclosure, or destruction.</li>
            <li>Your data will be retained only as long as necessary to fulfill the purposes outlined in this policy or as legally mandated.</li>
            <li>You may request the deletion of your account or personal data by contacting us at <a href="mailto:infozynoflixott@gmail.com" className="text-[#7b61ff] hover:underline">infozynoflixott@gmail.com</a>.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="5. User Rights & Data Control"
          icon={<Lock size={20} />}
        >
          <p className="mb-4">In accordance with Indian laws, including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Personal Data Protection Bill, 2019 (pending enactment), you have:</p>

          <ul className="space-y-2 mb-4">
            <li><span className="font-semibold text-white">Right to access</span> your personal data held by us.</li>
            <li><span className="font-semibold text-white">Right to correction</span> or update inaccurate or incomplete data.</li>
            <li><span className="font-semibold text-white">Right to delete</span> or deactivate your data, subject to legal or operational obligations.</li>
            <li><span className="font-semibold text-white">Right to withdraw consent</span> for processing data for marketing or other purposes.</li>
            <li><span className="font-semibold text-white">Right to data portability</span> where applicable.</li>
          </ul>

          <p>To exercise these rights, or for any privacy concerns, please contact us at <a href="mailto:infozynoflixott@gmail.com" className="text-[#7b61ff] hover:underline">infozynoflixott@gmail.com</a>.</p>
        </PolicySection>

        <PolicySection
          title="6. Cookies & Tracking Technologies"
          icon={<Lock size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>We use cookies, web beacons, and similar technologies to enhance user experience, analyze usage patterns, and serve targeted content.</li>
            <li>You can configure your browser to reject cookies or alert you when cookies are set.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="7. Data Protection & Security Protocols"
          icon={<Shield size={20} />}
        >
          <h3 className="font-semibold text-white mb-2">a. Standards & Frameworks</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>We adhere to internationally recognized data protection standards, including ISO/IEC 27001 for information security management.</li>
            <li>Our security measures comply with Indian regulatory requirements, including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">b. Technical & Organizational Measures</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Encryption of personal data both at rest and in transit.</li>
            <li>Regular security audits and vulnerability assessments.</li>
            <li>Role-based access controls to restrict data access.</li>
            <li>Use of secure servers and firewalls to prevent unauthorized access.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">c. Cross-border Data Transfers</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your personal data may be transferred to servers located outside India for hosting and operational purposes.</li>
            <li>Any such transfer will be carried out in compliance with applicable Indian laws, including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
            <li>We ensure such transfers are protected by appropriate safeguards, such as standard contractual clauses or adequacy decisions, to maintain the confidentiality and security of your data.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="8. Children's Privacy"
          icon={<Shield size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>ZynoFlix OTT is not intended for children under 13 years of age. We do not knowingly collect or solicit personal data from children.</li>
            <li>If we discover that we have inadvertently collected data from a minor, we will delete it immediately.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="9. Data Breach & Incident Response"
          icon={<Shield size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>In the event of a data breach, we will notify affected users and relevant authorities in accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and applicable Indian laws.</li>
            <li>We will also undertake necessary remedial actions to mitigate harm and prevent future breaches.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="10. Changes to Privacy Policy"
          icon={<Lock size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>We reserve the right to update this Privacy Policy periodically to reflect changes in legal, technological, or operational requirements.</li>
            <li>Users will be notified of material changes via the platform or email.</li>
            <li>Continued use of ZynoFlix OTT after such updates constitutes acceptance of the revised policy.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="11. Governing Law & Jurisdiction"
          icon={<Lock size={20} />}
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>This Privacy Policy is governed by Indian law, including the Information Technology Act, 2000, and applicable amendments.</li>
            <li>Disputes arising under this policy shall be subject to the exclusive jurisdiction of courts in India.</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="12. Contact Details"
          icon={<ExternalLink size={20} />}
        >
          <p className="mb-4">For questions, concerns, or data access requests, contact us at:</p>

          <ul className="space-y-2">
            <li><span className="font-semibold text-white">Email:</span> <a href="mailto:infozynoflixott@gmail.com" className="text-[#7b61ff] hover:underline">infozynoflixott@gmail.com</a></li>
            <li><span className="font-semibold text-white">Phone:</span> 8270895609</li>
            <li><span className="font-semibold text-white">Registered Office:</span> Bangalore, India</li>
          </ul>
        </PolicySection>

        <PolicySection
          title="13. DMCA Policy"
          icon={<Shield size={20} />}
        >
          <p className="mb-4">Effective Date: 15 May 2025</p>

          <p className="mb-4">ZynoFlix OTT ("ZynoFlix") respects the intellectual property rights of others and expects users of the platform to do the same. It is our policy to respond to notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (DMCA).</p>

          <h3 className="font-semibold text-white mb-2">How to Submit a DMCA Takedown Notice</h3>
          <p className="mb-4">If you believe that your copyrighted work has been uploaded to ZynoFlix OTT without permission, you may submit a written notice to our designated copyright agent containing the following information:</p>

          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>A physical or electronic signature of the copyright owner or authorized agent.</li>
            <li>A description of the copyrighted work that you claim has been infringed.</li>
            <li>A description of the infringing material and its location on the platform (e.g., URL).</li>
            <li>Your contact information: name, address, phone number, and email address.</li>
            <li>A statement that you have a good-faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in the notice is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of the copyrighted work.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">DMCA Contact Information</h3>
          <p className="mb-4">Copyright Agent for ZynoFlix OTT:</p>
          <p className="mb-4">Email: <a href="mailto:infozynoflixott@gmail.com" className="text-[#7b61ff] hover:underline">infozynoflixott@gmail.com</a></p>

          <p className="mb-4">Please send your DMCA takedown notices to the above email address.</p>

          <h3 className="font-semibold text-white mb-2">Response to DMCA Notices</h3>
          <p className="mb-4">Upon receipt of a valid DMCA notice, ZynoFlix OTT will promptly remove or disable access to the infringing material and notify the user responsible for the content. If the user believes the content was removed or disabled erroneously, they may file a counter-notification, which will be reviewed in accordance with the DMCA procedures.</p>

          <h3 className="font-semibold text-white mb-2">Counter-Notification Procedure</h3>
          <p className="mb-4">If you believe your content was removed mistakenly and wish to restore it, you may submit a written counter-notification to our designated copyright agent, including:</p>

          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Your contact information.</li>
            <li>Identification of the material removed or disabled.</li>
            <li>A statement under penalty of perjury that you have a good-faith belief that the material was removed or disabled as a result of mistake or misidentification.</li>
            <li>A consent to jurisdiction and a statement that you will accept service of process.</li>
          </ul>

          <p>Note: This policy is for informational purposes and should be reviewed by legal counsel to ensure compliance with applicable laws and regulations.</p>
        </PolicySection>

        <PolicySection
          title="14. Legal Copyright Notice & Non-Disclosure Agreement"
          icon={<Lock size={20} />}
        >
          <h3 className="font-semibold text-white mb-2">1. Copyright & Intellectual Property Rights</h3>
          <p className="mb-4">ZynoFlix OTT ("the Platform") is a proprietary platform that facilitates short film uploaders ("Content Creators") to upload and stream short films ("Content") to viewers ("Users").</p>

          <p className="mb-4">All Content uploaded to the Platform remains the intellectual property of the respective Content Creators. ZynoFlix OTT does not claim ownership of any short films or Content uploaded by users.</p>

          <p className="mb-4">Unauthorized copying, reproduction, distribution, or use of any Content or the Platform's proprietary materials without explicit written permission is strictly prohibited. Any such infringement will be met with immediate legal action, including but not limited to, claims for damages, injunctive relief, and other remedies available under applicable law.</p>

          <h3 className="font-semibold text-white mb-2">2. No Ownership of Content</h3>
          <p className="mb-4">ZynoFlix OTT explicitly states that it does not own, control, or claim any rights over the uploaded short films or Content. The platform merely provides the infrastructure for uploaders to share their Content and for viewers to stream it.</p>

          <h3 className="font-semibold text-white mb-2">3. Prohibition of Copying and Unauthorized Use</h3>
          <p className="mb-4">Any attempt to copy, reproduce, distribute, or exploit Content from ZynoFlix OTT without prior written authorization from the Content Creator will be considered a violation of intellectual property rights and will be subject to legal action under applicable copyright laws, including the Copyright Act, 1976 (India), Digital Millennium Copyright Act (DMCA) (United States), or relevant local laws.</p>

          <h3 className="font-semibold text-white mb-2">4. Non-Disclosure Agreement (NDA)</h3>
          <p className="mb-4">To protect confidential information, all users, Content Creators, and partners agree to the following NDA terms:</p>

          <ul className="space-y-2 mb-4">
            <li><span className="font-semibold text-white">Definition of Confidential Information:</span> Any non-public, proprietary, or sensitive information exchanged during use of the Platform, including but not limited to Content details, user data, platform algorithms, business strategies, and other trade secrets.</li>
            <li><span className="font-semibold text-white">Obligation of Confidentiality:</span> Users agree not to disclose, share, or distribute any Confidential Information to third parties without prior written consent from ZynoFlix OTT or the Content Creator involved.</li>
            <li><span className="font-semibold text-white">Use of Confidential Information:</span> Confidential Information shall only be used for the purpose of using or engaging with the Platform and Content as intended.</li>
            <li><span className="font-semibold text-white">Duration:</span> The confidentiality obligations shall survive the termination of any agreement or use of the Platform for a period mandated by applicable laws.</li>
            <li><span className="font-semibold text-white">Legal Consequences:</span> Breach of this NDA may result in legal action, damages, and termination of access to the Platform.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">5. Legal Compliance & Enforcement</h3>
          <p className="mb-4">ZynoFlix OTT reserves the right to:</p>

          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Remove or disable access to any Content that infringes upon intellectual property rights or violates applicable laws.</li>
            <li>Take strict legal action against any individual or entity found copying, distributing, or using Content without authorization.</li>
            <li>Cooperate with legal authorities and rights holders in enforcement actions.</li>
          </ul>

          <h3 className="font-semibold text-white mb-2">6. Governing Law & Jurisdiction</h3>
          <p className="mb-4">This agreement shall be governed by and construed in accordance with the laws. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of courts.</p>

          <h3 className="font-semibold text-white mb-2">7. Acceptance</h3>
          <p>By using ZynoFlix OTT, you agree to comply with these terms. If you do not agree, please refrain from using the platform.</p>
        </PolicySection>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center text-gray-300 text-sm"
        >
          <p>By accessing or using ZynoFlix OTT, you acknowledge that you have read, understood, and agree to this Privacy Policy and consent to our collection, use, and disclosure of your information as described.</p>

          <div className="mt-8 flex items-center justify-center space-x-6">
            <Link href="/" className="text-[#7b61ff] hover:text-white transition-colors">
              Return to Home
            </Link>
            <Link href="/explore" className="text-[#7b61ff] hover:text-white transition-colors">
              Explore Content
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
