"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Gift,
  ChevronDown,
  ChevronUp,
  Mail,
  ExternalLink,
  Shield,
  Award,
  CreditCard,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionSection = ({
  title,
  children,
  icon,
  defaultOpen = false,
}: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-4 rounded-xl overflow-hidden bg-[rgba(25,28,51,0.5)] backdrop-blur-sm border border-[#292c41]/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left bg-[rgba(25,28,51,0.8)] hover:bg-[rgba(25,28,51,1)] transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-[#7b61ff] shrink-0">{icon}</div>}
          <h2 className="text-base sm:text-lg font-bold text-white">{title}</h2>
        </div>
        <div className="text-white shrink-0">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 sm:p-6 text-gray-200 text-sm sm:text-base border-t border-[#292c41]/50">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const IncentiveCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="flex gap-4 p-4 sm:p-5 rounded-xl bg-[rgba(25,28,51,0.5)] backdrop-blur-sm border border-[#292c41]/50 hover:border-[#7b61ff]/40 transition-colors"
  >
    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#7b61ff]/20 flex items-center justify-center text-[#7b61ff]">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  </motion.div>
);

const BrandAmbassadorTermsPage = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-16 sm:pt-24 bg-gradient-to-br from-[#1a0733] via-[#2c1157] to-[#1a0733]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero + CTA */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7b61ff]/20 text-[#a78bfa] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            College Student Program
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Brand Ambassador
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b61ff] to-[#a78bfa]">
              Terms & Benefits
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Official terms, incentives, and policies for the ZynoFlix OTT College Brand Ambassador Program. Eligibility is limited to current college students.
          </p>
          <Link
            href="/signup/student-ambassador"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7b61ff] hover:bg-[#6b51ee] text-white font-semibold transition-colors shadow-lg shadow-[#7b61ff]/25"
          >
            Register as Brand Ambassador
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Eligibility note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm text-center"
        >
          <strong>Note:</strong> The Brand Ambassador program is open only to current college students. Verification may be required.
        </motion.div>

        {/* Benefits / Incentives */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#7b61ff]" />
            Benefits & Incentives
          </h2>
          <div className="grid gap-4 sm:grid-cols-1">
            <IncentiveCard
              index={0}
              icon={<CreditCard className="w-5 h-5" />}
              title="Complimentary ZynoFlix OTT Subscription"
              description="Free ZynoFlix OTT subscription for 3 months—unlimited access to premium short films and member-only content."
            />
            <IncentiveCard
              index={1}
              icon={<Award className="w-5 h-5" />}
              title="Official Brand Ambassador Tag & ID"
              description="Recognition as an official ZynoFlix OTT Brand Ambassador with an ID card and digital badge for your profile and socials."
            />
            <IncentiveCard
              index={2}
              icon={<GraduationCap className="w-5 h-5" />}
              title="Certificate Delivered to Your College"
              description="A formal certificate from Infopod Media Entertainment Pvt. Ltd. delivered to your college, enhancing your resume and placements."
            />
            <IncentiveCard
              index={3}
              icon={<Briefcase className="w-5 h-5" />}
              title="Job Offer from ZynoFlix OTT"
              description="Eligibility for job offers from ZynoFlix OTT based on performance and company requirements during and after the program."
            />
            <IncentiveCard
              index={4}
              icon={<Sparkles className="w-5 h-5" />}
              title="Monthly Earning from Referrals"
              description="Earn based on subscription referral count—potential monthly earnings ranging from ₹5,000 to ₹50,000, subject to verification and program rules."
            />
            <IncentiveCard
              index={5}
              icon={<Award className="w-5 h-5" />}
              title="Event Head – Short Film Festival"
              description="Opportunity to serve as Event Head for short film festivals; 50% revenue share as per agreed terms for conducted events."
            />
            <IncentiveCard
              index={6}
              icon={<GraduationCap className="w-5 h-5" />}
              title="Higher Education Support"
              description="Access to higher education–related offers and support as part of the program, subject to availability and eligibility."
            />
          </div>
        </motion.section>

        {/* Refund Policy */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#7b61ff]" />
            Refund Policy (Brand Ambassador)
          </h2>
          <AccordionSection
            title="Refund Policy"
            icon={<FileText size={20} />}
            defaultOpen={true}
          >
            <p className="mb-4">
              Refunds in relation to the Brand Ambassador program (including any registration or program fee, if applicable) are governed by the following terms. ZynoFlix OTT and Infopod Media Entertainment Pvt. Ltd. ("the Company") aim to maintain clarity and fairness while protecting the Company's interests.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Refund requests must be submitted in writing to the official email within the timeframe specified at the time of payment, if any. Late requests may not be entertained.</li>
              <li>Eligibility for refund is at the sole discretion of the Company. Not all fees are refundable; program-specific terms communicated at registration apply.</li>
              <li>Refunds, if approved, will be processed through the original payment method or as decided by the Company, and may take up to 30 business days from approval.</li>
              <li>Once incentives, certificates, or benefits have been issued or partially availed, no refund of any related fee will be provided.</li>
              <li>The Company reserves the right to modify this refund policy. Continued participation in the program constitutes acceptance of the prevailing policy.</li>
            </ul>
            <p className="text-gray-400 text-sm">
              For refund-related queries, use the contact details provided at the end of this page.
            </p>
          </AccordionSection>
        </section>

        {/* Terms & Conditions */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#7b61ff]" />
            Terms & Conditions (Brand Ambassador)
          </h2>

          <AccordionSection title="1. Program Eligibility" icon={<Shield size={20} />}>
            <ul className="list-disc pl-5 space-y-2">
              <li>Only current college students (any degree, any year) are eligible. The Company may require proof of enrollment.</li>
              <li>Participants must comply with all program guidelines, branding rules, and applicable laws. Violation may result in immediate termination without any obligation to provide benefits or refunds.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="2. Incentives & Benefits" icon={<Gift size={20} />}>
            <ul className="list-disc pl-5 space-y-2">
              <li>All benefits and incentives are subject to verification, program rules, and availability. The Company reserves the right to alter, suspend, or discontinue any benefit with reasonable notice where feasible.</li>
              <li>Earnings from referrals are subject to verification of genuine, non-fraudulent signups. Fake or duplicate signups will be disqualified and may lead to termination and forfeiture of earnings.</li>
              <li>Event Head role and revenue share are subject to separate agreements and Company approval. 50% share is as per agreed terms only.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="3. Conduct & Brand Usage" icon={<Shield size={20} />}>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ambassadors must use ZynoFlix OTT branding and promotional content only as permitted. Unauthorized use of trademarks or misleading claims is prohibited.</li>
              <li>Professional and lawful conduct is required. The Company may terminate participation for misconduct, breach of terms, or any reason it deems fit, without liability.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="4. Limitation of Liability" icon={<Shield size={20} />}>
            <ul className="list-disc pl-5 space-y-2">
              <li>To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental, or consequential damages arising from participation in the program.</li>
              <li>Job offers, higher education offers, and monetary earnings are subject to separate terms and are not guaranteed. The Company makes no representation regarding specific outcomes.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="5. Amendments" icon={<FileText size={20} />}>
            <p>
              ZynoFlix OTT reserves the right to modify these Terms and Conditions, the Refund Policy, and program benefits at any time. Continued participation after changes constitutes acceptance. Material changes may be communicated via email or platform notice where practicable.
            </p>
          </AccordionSection>
        </section>

        {/* Footnote + Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-xl bg-[rgba(25,28,51,0.6)] backdrop-blur-sm border border-[#292c41]/50 p-6 sm:p-8"
        >
          <p className="text-gray-300 text-sm mb-6">
            <span className="text-white font-medium">Terms and Conditions applied*.</span> By registering as a Brand Ambassador or participating in the program, you agree to the Refund Policy and Terms & Conditions stated on this page, as may be updated from time to time.
          </p>
          <div className="border-t border-[#292c41]/50 pt-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#7b61ff]" />
              For further information
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Use our email or contact form for queries, refund requests, or program-related support:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">Email:</span>{" "}
                <a
                  href="mailto:infozynoflixott@gmail.com"
                  className="text-[#7b61ff] hover:text-[#a78bfa] underline"
                >
                  infozynoflixott@gmail.com
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-[#7b61ff] hover:text-[#a78bfa] underline"
                >
                  Contact form
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center text-gray-400 text-sm flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/" className="text-[#7b61ff] hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/terms-condition" className="text-[#7b61ff] hover:text-white transition-colors">
            General Terms
          </Link>
          <Link href="/refund-policy" className="text-[#7b61ff] hover:text-white transition-colors">
            Refund Policy
          </Link>
          <Link
            href="/signup/student-ambassador"
            className="text-[#7b61ff] hover:text-white font-medium transition-colors"
          >
            Register as Ambassador
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandAmbassadorTermsPage;
