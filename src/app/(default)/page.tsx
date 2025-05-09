"use client";

import dynamic from "next/dynamic";
import Head from "next/head";
import LanguageList from "@/components/shared/list-language";
import BannerCarousel from "@/components/shared/banner-carousel";
import DirectorsCarousel from "@/components/shared/directors-carousel";

const CategoryList = dynamic(
  () => import("@/components/shared/category-list"),
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
        <link rel="icon" href="/seo.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://zynoflixott.com/" />
      </Head>

      <div className="w-full">
        <BannerCarousel />

        {/* Main categories for mobile view */}
        <div className="sm:hidden mt-3 mb-3">
          <CategoryList
            title={"TRENDING"}
            desc={"Popular movies right now"}
            langage={"All"}
            sectionType="trending"
          />

          <CategoryList
            title={"COMING SOON"}
            desc={"New releases"}
            langage={"All"}
            sectionType="coming-soon"
          />

          <CategoryList
            title={"MY LIST"}
            desc={"Your saved films"}
            langage={"All"}
            sectionType="my-list"
          />

          <CategoryList
            title={"TV SHOWS"}
            desc={"Series & Shows"}
            langage={"All"}
            sectionType="tv-shows"
          />
        </div>

        <section className="lg:px-8 px-0 space-y-6 pt-0 lg:pt-12 py-2">
          {/* Desktop view sections */}
          <div className="px-4 space-y-4">
            <ListProduction url={"director"} title={"DIRECTORS LIVE"} />
            <ListProduction
              url={"production"}
              title={"PRODUCTION COMPANIES LIVE"}
            />
          </div>

          <CategoryList title={"SHORT FILMS"} desc={"TOP-RATED SHORT FILMS"} langage={"Tamil"} />
          <LanguageList />

          {/* Indian Languages */}
          <div className="">
            {/* <h2 className="text-2xl font-bold mb-8">INDIAN LANGUAGE SHORT FILMS</h2> */}

            <CategoryList langage={"Hindi"}
              title={"HINDI SHORT FILMS"}
              desc={"BEST HINDI FILMS"}
            />

            <CategoryList langage={"Tamil"}
              title={"TAMIL SHORT FILMS"}
              desc={"POPULAR TAMIL FILMS"}
            />

            <CategoryList langage={"Telugu"}
              title={"TELUGU SHORT FILMS"}
              desc={"BEST TELUGU FILMS"}
            />

            <CategoryList langage={"Malayalam"}
              title={"MALAYALAM SHORT FILMS"}
              desc={"BEST MALAYALAM FILMS"}
            />


            {/* here */}
            <CategoryList langage={"Kannada"}
              title={"KANNADA SHORT FILMS"}
              desc={"FAMOUS KANNADA FILMS"}
            />

            <CategoryList langage={"Bengali"}
              title={"BENGALI SHORT FILMS"}
              desc={"BEST BENGALI FILMS"}
            />

            <CategoryList langage={"Marathi"}
              title={"MARATHI SHORT FILMS"}
              desc={"BEST MARATHI FILMS"}
            />

            <CategoryList langage={"Punjabi"}
              title={"PUNJABI SHORT FILMS"}
              desc={"TRENDING PUNJABI FILMS"}
            />

            <CategoryList langage={"Gujarati"}
              title={"GUJARATI SHORT FILMS"}
              desc={"POPULAR GUJARATI FILMS"}
            />

            <CategoryList langage={"Odia"}
              title={"ODIA SHORT FILMS"}
              desc={"FEATURED ODIA FILMS"}
            />

            <CategoryList langage={"Urdu"}
              title={"URDU SHORT FILMS"}
              desc={"ACCLAIMED URDU FILMS"}
            />
          </div>

          {/* Global Languages */}
          <div className="">
            {/* <h2 className="text-2xl font-bold mb-8">GLOBAL LANGUAGE SHORT FILMS</h2> */}

            <CategoryList langage={"English"}
              title={"ENGLISH SHORT FILMS"}
              desc={"BEST ENGLISH FILMS"}
            />

            <CategoryList langage={"Spanish"}
              title={"SPANISH SHORT FILMS"}
              desc={"TRENDING SPANISH FILMS"}
            />

            <CategoryList langage={"French"}
              title={"FRENCH SHORT FILMS"}
              desc={"ARTISTIC FRENCH FILMS"}
            />

            <CategoryList langage={"German"}
              title={"GERMAN SHORT FILMS"}
              desc={"ACCLAIMED GERMAN FILMS"}
            />

            <CategoryList langage={"Italian"}
              title={"ITALIAN SHORT FILMS"}
              desc={"FEATURED ITALIAN FILMS"}
            />

            <CategoryList langage={"Portuguese"}
              title={"PORTUGUESE SHORT FILMS"}
              desc={"POPULAR PORTUGUESE FILMS"}
            />

            <CategoryList langage={"Russian"}
              title={"RUSSIAN SHORT FILMS"}
              desc={"OUTSTANDING RUSSIAN FILMS"}
            />

            <CategoryList langage={"Japanese"}
              title={"JAPANESE SHORT FILMS"}
              desc={"EXCEPTIONAL JAPANESE FILMS"}
            />

            <CategoryList langage={"Chinese"}
              title={"CHINESE SHORT FILMS"}
              desc={"CAPTIVATING CHINESE FILMS"}
            />

            <CategoryList langage={"Arabic"}
              title={"ARABIC SHORT FILMS"}
              desc={"REMARKABLE ARABIC FILMS"}
            />

            <CategoryList langage={"Korean"}
              title={"KOREAN SHORT FILMS"}
              desc={"TRENDING KOREAN FILMS"}
            />
          </div>

          {/* All languages */}
          <CategoryList langage={"All"}
            title={"ALL SHORT FILMS"}
            desc={"EXPLORE ALL SHORT FILMS"}
          />

          {/* Directors section */}
          <div className="lg:px-4 px-2">
            <DirectorsCarousel displayCount={3} showViewAll={true} />
          </div>

        </section>
      </div>
    </main>
  );
}
const directors = [
  {
    id: 1,
    name: "MR. RAM",
    image: "https://m.media-amazon.com/images/M/MV5BZTcxZmM4NmYtZjZlYy00YTlhLWFiNTYtODUzMmRiNWU2NTUzXkEyXkFqcGdeQXVyNDI3NjU1NzQ@._V1_.jpg",
    company: "ANIMAL PICTURES",
    upcomingFilm: "NEW FILM SUPERMINT COMING SOON",
    path: "/profile/rajamouli"
  },
  {
    id: 2,
    name: "MR. KASHYAP",
    image: "https://img.etimg.com/thumb/msid-98546103,width-650,height-488,imgsize-44978,,resizemode-75/anurag-kashyap.jpg",
    company: "ANIMAL PICTURES",
    upcomingFilm: "NEW FILM KENNEDY COMING SOON",
    path: "/profile/kashyap"
  },
  {
    id: 3,
    name: "MR. NOLAN",
    image: "https://variety.com/wp-content/uploads/2023/07/Christopher-Nolan.jpg",
    company: "ANIMAL PICTURES",
    upcomingFilm: "NEW FILM PROJECT COMING SOON",
    path: "/profile/nolan"
  },
  {
    id: 4,
    name: "MR. CHAZELLE",
    image: "https://variety.com/wp-content/uploads/2022/12/damien-chazelle.jpg",
    company: "ANIMAL PICTURES",
    upcomingFilm: "NEW FILM CONCEPT COMING SOON",
    path: "/profile/chazelle"
  },
  {
    id: 5,
    name: "MR. RATNAM",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Mani_Ratnam_at_IONIC_Rare_Ragas_by_Amaan_Ali_Khan_%26_Ayaan_Ali_Khan.jpg",
    company: "ANIMAL PICTURES",
    upcomingFilm: "NEW FILM PONNIYIN SELVAN 3 COMING SOON",
    path: "/profile/ratnam"
  },
];