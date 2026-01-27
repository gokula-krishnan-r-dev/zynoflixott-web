"use client";

import { Suspense, lazy, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

// Skeleton loaders
import BannerSkeleton from "@/components/skeletons/BannerSkeleton";
import CategorySkeleton from "@/components/skeletons/CategorySkeleton";
import LanguageSkeleton from "@/components/skeletons/LanguageSkeleton";
import DirectorsSkeleton from "@/components/skeletons/DirectorsSkeleton";
import ProductionSkeleton from "@/components/skeletons/ProductionSkeleton";


// Dynamic imports with lazy loading
const LanguageList = dynamic(() => import("@/components/shared/list-language"), {
  ssr: false,
  loading: () => <LanguageSkeleton />
});

const BannerCarousel = dynamic(() => import("@/components/shared/banner-carousel"), {
  ssr: false,
  loading: () => <BannerSkeleton />
});

const DirectorsCarousel = dynamic(() => import("@/components/shared/directors-carousel"), {
  ssr: false,
  loading: () => <DirectorsSkeleton />
});

const CategoryList = dynamic(
  () => import("@/components/shared/category-list"),
  {
    ssr: false,
    loading: () => <CategorySkeleton />
  }
);

const ListProduction = dynamic(
  () => import("@/components/shared/list-production"),
  {
    ssr: false,
    loading: () => <ProductionSkeleton />
  }
);

export default function Home() {
  const [showMoreServices, setShowMoreServices] = useState(false);

  return (
    <main className="min-h-screen bg-body">
      <Head>
        <title>ZynoflixOTT - Premier Platform for Short Films & Independent Filmmakers</title>
        <meta
          name="description"
          content="Discover, watch and upload high-quality short films on ZynoflixOTT. The leading OTT platform for independent filmmakers featuring curated content in multiple languages including Tamil, English, and Kannada."
        />
        <meta
          name="keywords"
          content="ZynoflixOTT, short films, independent filmmakers, Tamil, English, Kannada, OTT platform, curated content"
        />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="ZynoflixOTT" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zynoflixott.com/" />
        <meta property="og:title" content="ZynoflixOTT - Premier Platform for Short Films & Independent Filmmakers" />
        <meta property="og:description" content="Discover, watch and upload high-quality short films on ZynoflixOTT. The leading OTT platform for independent filmmakers featuring curated content in multiple languages including Tamil, English, and Kannada." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:site_name" content="ZynoflixOTT" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@zynoflixott" />
        <meta name="twitter:title" content="ZynoflixOTT - Premier Platform for Short Films & Independent Filmmakers" />
        <meta name="twitter:description" content="Discover, watch and upload high-quality short films on ZynoflixOTT. The leading OTT platform for independent filmmakers featuring curated content in multiple languages including Tamil, English, and Kannada." />
        <meta name="twitter:image" content="/og-image.jpg" />
        <link rel="icon" href="/logo_sm.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://zynoflixott.com/" />
      </Head>

      <div className="w-full">
        <Suspense fallback={<BannerSkeleton />}>
          <BannerCarousel />
        </Suspense>

        {/* Main categories for mobile view */}
        <div className="sm:hidden mt-3 mb-3">
          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList
              title={"TRENDING"}
              desc={"Popular movies right now"}
              langage={"All"}
              sectionType="trending"
            />
          </Suspense>

          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList
              title={"COMING SOON"}
              desc={"New releases"}
              langage={"All"}
              sectionType="coming-soon"
            />
          </Suspense>

          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList
              title={"MY LIST"}
              desc={"Your saved films"}
              langage={"All"}
              sectionType="my-list"
            />
          </Suspense>

          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList
              title={"TV SHOWS"}
              desc={"Series & Shows"}
              langage={"All"}
              sectionType="tv-shows"
            />
          </Suspense>
        </div>

        <section className="lg:px-8 px-0 space-y-6 pt-0 lg:pt-12 py-2">
          {/* Desktop view sections */}
          <div className="px-4 space-y-4">
            <Suspense fallback={<ProductionSkeleton />}>
              <ListProduction url={"director"} title={"DIRECTORS LIVE"} />
            </Suspense>
            <Suspense fallback={<ProductionSkeleton />}>
              <ListProduction
                url={"production"}
                title={"PRODUCTION COMPANIES LIVE"}
              />
            </Suspense>
          </div>

          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList title={"SHORT FILMS"} desc={"TOP-RATED SHORT FILMS"} langage={"Tamil"} />
          </Suspense>

          <Suspense fallback={<LanguageSkeleton />}>
            <LanguageList />
          </Suspense>

          {/* Indian Languages */}
          <div className="">
            {/* <h2 className="text-2xl font-bold mb-8">INDIAN LANGUAGE SHORT FILMS</h2> */}

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Hindi"}
                title={"HINDI SHORT FILMS"}
                desc={"BEST HINDI FILMS"}
              />
            </Suspense>


            {/* Services Grid - Minimal Mobile Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3 px-3 sm:px-4 py-3">
              {/* Sell Short Film */}
              <button 
                onClick={() => window.location.href = '/sell-shortfilm-contact'} 
                className="group flex flex-col items-center justify-center px-4 py-3 bg-gradient-to-br from-purple-600/90 to-indigo-700/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-purple-500/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 4h-2v2h-4V4H8v2H6V4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h14v10zm-5-8l-5 3 5 3v-6z" opacity="0.95"/>
                  </svg>
                </div>
                <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">Sell Short Film</span>
              </button>

              {/* Monetization */}
              <button 
                onClick={() => window.location.href = '/monetization'} 
                className="group flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-blue-500/20 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <text x="12" y="17" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" fontFamily="Arial, sans-serif">₹</text>
                  </svg>
                </div>
                <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">Monetization</span>
              </button>

              {/* Live Streaming */}
              <button 
                onClick={() => window.location.href = '/live-streams'} 
                className="group flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-purple-600/90 to-cyan-600/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-purple-500/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">Live Streaming</span>
              </button>

              {/* Student Ambassador */}
              <button 
                onClick={() => window.location.href = '/signup/student-ambassador'} 
                className="group flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-red-600/90 to-orange-500/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-red-500/20 hover:border-orange-400/40 hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    <circle cx="18" cy="8" r="2.5" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">Student Ambassador</span>
              </button>

              {/* Events */}
              <button 
                onClick={() => window.location.href = '/event'} 
                className="group flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-purple-600/90 to-indigo-700/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-purple-500/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">Events</span>
              </button>

              {/* Film Production */}
              <button 
                onClick={() => window.location.href = '/production'} 
                className="group flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-blue-500/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">Film Production</span>
              </button>

              {/* Advertisement - unlocked via See more */}
              {showMoreServices && (
                <button
                  onClick={() => window.location.href = "/advertisement"}
                  className="group flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-yellow-500/90 to-amber-500/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-yellow-500/20 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">Advertisement</span>
                </button>
              )}

              {/* See more / See less */}
              <button
                onClick={() => setShowMoreServices((prev) => !prev)}
                className="group flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-slate-600/90 to-slate-700/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-500/30 hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-500/20 active:scale-95 transition-all duration-200 min-h-[85px] sm:min-h-[95px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-200">
                  {showMoreServices ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                <span className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight">
                  {showMoreServices ? "See less" : "See more"}
                </span>
              </button>
            </div>


            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Tamil"}
                title={"TAMIL SHORT FILMS"}
                desc={"POPULAR TAMIL FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Telugu"}
                title={"TELUGU SHORT FILMS"}
                desc={"BEST TELUGU FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Malayalam"}
                title={"MALAYALAM SHORT FILMS"}
                desc={"BEST MALAYALAM FILMS"}
              />
            </Suspense>

            {/* <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Kannada"}
                title={"KANNADA SHORT FILMS"}
                desc={"FAMOUS KANNADA FILMS"}
              />
            </Suspense> */}

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Bengali"}
                title={"BENGALI SHORT FILMS"}
                desc={"BEST BENGALI FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Marathi"}
                title={"MARATHI SHORT FILMS"}
                desc={"BEST MARATHI FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Punjabi"}
                title={"PUNJABI SHORT FILMS"}
                desc={"TRENDING PUNJABI FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Gujarati"}
                title={"GUJARATI SHORT FILMS"}
                desc={"POPULAR GUJARATI FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Odia"}
                title={"ODIA SHORT FILMS"}
                desc={"FEATURED ODIA FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Urdu"}
                title={"URDU SHORT FILMS"}
                desc={"ACCLAIMED URDU FILMS"}
              />
            </Suspense>
          </div>

          {/* Global Languages */}
          <div className="">
            {/* <h2 className="text-2xl font-bold mb-8">GLOBAL LANGUAGE SHORT FILMS</h2> */}

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"English"}
                title={"ENGLISH SHORT FILMS"}
                desc={"BEST ENGLISH FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Spanish"}
                title={"SPANISH SHORT FILMS"}
                desc={"TRENDING SPANISH FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"French"}
                title={"FRENCH SHORT FILMS"}
                desc={"ARTISTIC FRENCH FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"German"}
                title={"GERMAN SHORT FILMS"}
                desc={"ACCLAIMED GERMAN FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Italian"}
                title={"ITALIAN SHORT FILMS"}
                desc={"FEATURED ITALIAN FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Portuguese"}
                title={"PORTUGUESE SHORT FILMS"}
                desc={"POPULAR PORTUGUESE FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Russian"}
                title={"RUSSIAN SHORT FILMS"}
                desc={"OUTSTANDING RUSSIAN FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Japanese"}
                title={"JAPANESE SHORT FILMS"}
                desc={"EXCEPTIONAL JAPANESE FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Chinese"}
                title={"CHINESE SHORT FILMS"}
                desc={"CAPTIVATING CHINESE FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Arabic"}
                title={"ARABIC SHORT FILMS"}
                desc={"REMARKABLE ARABIC FILMS"}
              />
            </Suspense>

            <Suspense fallback={<CategorySkeleton />}>
              <CategoryList langage={"Korean"}
                title={"KOREAN SHORT FILMS"}
                desc={"TRENDING KOREAN FILMS"}
              />
            </Suspense>
          </div>

          {/* All languages */}
          <Suspense fallback={<CategorySkeleton />}>
            <CategoryList langage={"All"}
              title={"ALL SHORT FILMS"}
              desc={"EXPLORE ALL SHORT FILMS"}
            />
          </Suspense>

          {/* Directors section */}
          <div className="lg:px-4 px-2">
            <Suspense fallback={<DirectorsSkeleton />}>
              <DirectorsCarousel displayCount={3} showViewAll={true} />
            </Suspense>
          </div>

        </section>
      </div>
    </main>
  );
}

