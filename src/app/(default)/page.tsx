"use client";

import { Suspense, lazy } from "react";
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


            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2">
              {/* Events */}
              <button onClick={() => window.location.href = '/event'} className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg hover:shadow-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-medium text-sm">Events</span>
              </button>

              {/* Film Call */}
              <button onClick={() => window.location.href = '/sell-shortfilm'} className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-pink-600 to-red-600 rounded-lg hover:shadow-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-medium text-sm">Sell Short Film</span>
              </button>

              {/* Monetization */}
              <button onClick={() => window.location.href = '/monetization'} className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg hover:shadow-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-medium text-sm">Monetization</span>
              </button>

              {/* Explore */}
              <button onClick={() => window.location.href = '/explore'} className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg hover:shadow-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-white font-medium text-sm">Explore</span>
              </button>

              {/* Live Streaming */}
              <button onClick={() => window.location.href = '/live-stream'} className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg hover:shadow-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-medium text-sm">Live Streaming</span>
              </button>

              {/* Advertisement */}
              <button onClick={() => window.location.href = '/advertisement'} className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg hover:shadow-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="text-white font-medium text-sm">Advertisement</span>
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

