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

