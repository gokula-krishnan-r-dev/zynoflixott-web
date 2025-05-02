import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { languageD } from "@/constants/language";

const LanguageList = () => {
  return (
    <section>
      <div className="">
        <div className="pb-8">
          <h2 className="lg:text-xl text-base font-semibold uppercase">Languages</h2>
        </div>
        <Carousel className={cn("w-full  max-w-[91vw] lg:max-w-[94vw]")}>
          <CarouselContent className="ml-12">
            {languageD.map((lang: any) => (
              <CarouselItem
                className="z-10 basis-auto transition-transform relative transform"
                key={lang.code}
              >
                <div
                  className="p-3 cursor-pointer min-w-0 shrink-0 grow-0 px-4 flex items-center justify-center lg:px-4 py-4 lg:py-2 rounded-xl basis-auto hover:border-gray-400"
                  style={{
                    backgroundColor: lang.bgColor, // Dynamic background color
                    color: lang.textColor, // Dynamic text color
                  }}
                >
                  <h3 className="uppercase text-base font-bold">{lang.name}</h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12 text-black" />
          <CarouselNext className="mr-12 text-black" />
        </Carousel>
      </div>
    </section>
  );
};

export default LanguageList;
