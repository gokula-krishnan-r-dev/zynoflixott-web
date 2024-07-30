"use client";

import { BannerCarousel } from "@/components/shared/banner-carousel";
import dynamic from "next/dynamic";

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
    <main className="flex">
      <div className="">
        <BannerCarousel />
        <section className="lg:px-8 px-4 space-y-12 pt-12 py-2">
          <ListProduction />
          <CategoryList />
          <AdsCard />
        </section>
      </div>
    </main>
  );
}
