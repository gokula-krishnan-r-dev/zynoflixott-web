import StudentAmbassadorForm from "@/components/form/student-ambassador-form";
import React from "react";

const page = () => {
  const isIOS = () => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent) ||
        (userAgent.includes('mac') && 'ontouchend' in document);
    }
    return false;
  };
  return (
    <div>
      <div className="min-h-screen bg-black  relative text-gray-900 flex justify-center">
        {isIOS() ? (
          <video
            loop
            className="absolute z-20 inset-0 w-full h-full object-cover object-center bg-black opacity-70 [.ios &]:hidden"
            autoPlay
            muted
            controls={false}
            preload="none"
            playsInline
          >
            <source src="/bg/bg-login-1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className=""></div>
        )}
        <div className="max-w-screen-xl z-30 m-0 sm:m-10 flex justify-center flex-1">
          
          <div className="w-full lg:w-11/12 xl:w-10/12 text-white rounded-3xl p-6 sm:p-12">
              {/* Registration Form */}
              <h1 className="text-2xl xl:text-3xl font-extrabold text-white mb-8 text-center">
                Student Brand Ambassador Registration
              </h1>

              <div className="w-full mt-8">
                <div className="mx-auto max-w-xl">
                  <StudentAmbassadorForm />
                  <p className="mt-6 text-xs text-gray-400 text-center">
                    I agree to abide by ZynoFlix OTT
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted ml-1"
                    >
                      Terms of Service
                    </a>
                    and its
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted ml-1"
                    >
                      Privacy Policy
                    </a>
                  </p>

                  <div className="flex mt-3 text-sm justify-center text-gray-400 text-center items-center">
                    <span>Already have an account?</span>
                    <a href="/login">
                      <span className="ml-2 text-blue-500 hover:text-blue-400">Login</span>
                    </a>
                  </div>
                </div>
              </div>
            <div className="pt-12 flex flex-col items-center">
            
              {/* Content Section */}
              <div className="w-full max-w-4xl mb-8 space-y-8">
                {/* Why Join Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Why Join the ZynoFlix College Ambassador Program?
                  </h2>
                  <div className="space-y-6 text-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">1. Get Unlimited Access</h3>
                      <p>Get unlimited access to premium short films, exclusive content, and member-only features throughout the program.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">2. Earn Cash Rewards & Incentives</h3>
                      <p className="mb-2">Ambassadors can earn money through:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Verified signups</li>
                        <li>App downloads</li>
                        <li>Content uploads</li>
                        <li>Campaign participation</li>
                        <li>Monthly top-performer bonuses</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">3. Official Internship Certificate</h3>
                      <p>Receive a recognized experience certificate from Infopod Media Entertainment Pvt. Ltd., empowering your resume and boosting your placements.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">4. OTT & Media Industry Exposure</h3>
                      <p>Gain real experience in India's booming OTT space. Learn how digital platforms function, how content marketing works, and how audiences engage with short films.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">5. Build Your Personal Skills</h3>
                      <p className="mb-2">Improve essential skills such as:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Social media marketing</li>
                        <li>Influencer growth</li>
                        <li>Public speaking</li>
                        <li>Leadership & teamwork</li>
                        <li>Event management</li>
                        <li>Campus promotion strategies</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">6. Social Media Growth</h3>
                      <p>Boost your online presence, expand your followers, and grow as a student influencer with ZynoFlix OTT branding.</p>
                    </div>
                  </div>
                </div>

                {/* What Does an Ambassador Do */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    🚀 What Does a ZynoFlix Brand Ambassador Do?
                  </h2>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-200">
                    <li>Promote ZynoFlix OTT within your college</li>
                    <li>Encourage friends and students to download and sign up</li>
                    <li>Share ZynoFlix content on Instagram, WhatsApp, YouTube, etc.</li>
                    <li>Conduct small events or awareness activities (optional)</li>
                    <li>Create reels, videos, and fun promotional content</li>
                    <li>Collect feedback from students</li>
                    <li>Help ZynoFlix grow in your campus</li>
                  </ul>
                </div>

                {/* Rewards & Perks */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    🎁 Rewards & Perks
                  </h2>
                  <div className="space-y-4 text-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Performance-Based Rewards</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>₹20 to ₹200 per verified signup</li>
                        <li>Monthly performance-based bonuses</li>
                        <li>Extra rewards for top ambassadors</li>
                        <li>Gift vouchers & ZynoFlix merchandise</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Completion Benefits</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Certificate of Excellence</li>
                        <li>Letter of Recommendation (for top performers)</li>
                        <li>Feature on ZynoFlix Social Media</li>
                        <li>Priority internship opportunities in Infopod Media Entertainment Pvt. Ltd.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    🏫 Eligibility Criteria
                  </h2>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-200">
                    <li>Must be a current college student (any degree, any year)</li>
                    <li>Strong interest in OTT, digital media, or marketing</li>
                    <li>Active on Instagram/YouTube/WhatsApp</li>
                    <li>Good communication skills</li>
                    <li>Self-motivated & creative mindset</li>
                  </ul>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    📜 Terms & Conditions
                  </h2>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-200 text-sm">
                    <li>Ambassadors must follow ZynoFlix OTT branding and promotion guidelines.</li>
                    <li>Incentives are given only for valid, verified user actions.</li>
                    <li>Fake, duplicate, or fraudulent signups will be disqualified.</li>
                    <li>Ambassadors must maintain professional conduct.</li>
                    <li>ZynoFlix OTT reserves full rights to modify or terminate the program.</li>
                    <li>Certificate will be issued only after successful completion of assigned tasks.</li>
                    <li>All activities must comply with Indian law & company policies.</li>
                    <li>Content created for ZynoFlix can be used for marketing with student consent.</li>
                  </ul>
                </div>

                {/* Why This Program Is Perfect */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    🔥 Why This Program Is Perfect for College Students
                  </h2>
                  <p className="text-gray-200 mb-3">
                    The ZynoFlix Ambassador Program helps students build a strong foundation in:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-200">
                    <li>OTT industry knowledge</li>
                    <li>Digital marketing</li>
                    <li>Influencer branding</li>
                    <li>Creative content production</li>
                    <li>Professional growth and networking</li>
                  </ul>
                  <p className="text-gray-200 mt-4">
                    Whether you're a creator, filmmaker, marketer, or just enthusiastic about OTT platforms, this program opens the door to exciting opportunities.
                  </p>
                </div>

                {/* How to Apply */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-500/30">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
                    📩 How to Apply
                  </h2>
                  <p className="text-gray-200 text-center mb-4">
                    Fill out the registration form below and our team will contact you with further steps.
                  </p>
                  <p className="text-white font-semibold text-center text-lg">
                    👉 Apply Now – Become a ZynoFlix OTT College Brand Ambassador
                  </p>
                </div>
              </div>

          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
