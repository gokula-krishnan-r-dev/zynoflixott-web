"use client";

import dynamic from "next/dynamic";
import Head from "next/head";
import { NextSeo } from "next-seo";
import LanguageList from "@/components/shared/list-language";

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
        <title>ZynoflixOTT</title>
        <meta
          name="description"
          content="Watch and upload short films on ZynoflixOTT, the premier OTT platform for independent filmmakers."
        />
        <meta
          name="keywords"
          content="OTT, short films, independent films, streaming"
        />
        <meta name="author" content="ZynoflixOTT" />
        {/* add icon  */}
        <link rel="icon" href="/seo.png" sizes="any" />
        {/* <link rel="apple-touch-icon" href="/logo_sm.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://zynoflixott.com" />
        <meta property="og:title" content="ZynoflixOTT" />
        <meta
          property="og:description"
          content="Watch and upload short films on ZynoflixOTT, the premier OTT platform for independent filmmakers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zynoflixott.com" />
        <meta property="og:image" content="/logo_sm.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:site_name" content="ZynoflixOTT" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@zynoflix" />
        <meta name="twitter:creator" content="@zynoflix" />
        <meta name="twitter:title" content="ZynoflixOTT" />
        <meta
          name="twitter:description"
          content="Watch and upload short films on ZynoflixOTT, the premier OTT platform for independent filmmakers."
        />
        <meta name="twitter:image" content="/logo_sm.png" />
        <meta name="twitter:image:width" content="400" />
        <meta name="twitter:image:height" content="400" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="ZynoflixOTT" />
        <meta name="application-name" content="ZynoflixOTT" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        /> */}
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
