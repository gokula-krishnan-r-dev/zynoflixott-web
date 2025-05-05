"use client";

import dynamic from "next/dynamic";
import Head from "next/head";
import LanguageList from "@/components/shared/list-language";
import SEO from "@/lib/next-seo.config";

const CategoryList = dynamic(
  () => import("@/components/shared/category-list"),
  {
    ssr: false,
  }
);

const BannerCarousel = dynamic(
  () => import("@/components/shared/banner-carousel"),
  {
    ssr: false,
  }
);

const ListProduction = dynamic(
  () => import("@/components/shared/list-production"),
  {
    ssr: false,
  }
);

const AdsCard = dynamic(() => import("@/components/ads/ads-card"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex flex-col items-center">
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
        <link rel="icon" href="/seo.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://zynoflixott.com/" />
      </Head>

      <div className="w-full">
        <BannerCarousel />
        <section className="lg:px-8 px-4 space-y-12 pt-12 py-2">
          <ListProduction url={"director"} title={"DIRECTORS LIVE"} />
          <ListProduction
            url={"production"}
            title={"PRODUCTION COMPANIES LIVE"}
          />
          <CategoryList title={"SHORT FILMS"} desc={"TOP-RATED SHORT FILMS"} />
          <LanguageList />
          <CategoryList
            title={"TAMIL SHORT FILMS"}
            desc={"POPULAR TAMIL FILMS"}
          />
          <CategoryList
            title={"ENGLISH SHORT FILMS"}
            desc={"BEST ENGLISH FILMS"}
          />
          <CategoryList
            title={"KANNADA SHORT FILMS"}
            desc={"FAMOUS KANNADA FILMS"}
          />
          <AdsCard />
        </section>
      </div>
    </main>
  );
}
