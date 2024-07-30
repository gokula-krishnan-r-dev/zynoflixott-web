"use client";
import axios from "@/lib/axios";
import React from "react";
import { useQuery } from "react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { FacebookIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";
import Link from "next/link";

// Define the interface for a production company
interface ProductionCompany {
  _id: string;
  name: string;
  founderName: string;
  about: string;
  email: string;
  contactNumber: string;
  logo: string;
  membership: string;
  isMembership: boolean;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the function to fetch production companies
const getProductionCompanies = async () => {
  const response = await axios.get("/auth/production/user");
  return response.data.productionCompany;
};

// Define the main component to list production companies
const ListProduction: React.FC = () => {
  const {
    data: productionCompanies,
    error,
    isLoading,
  } = useQuery<ProductionCompany[], Error>(
    "productionCompanies",
    getProductionCompanies
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="lg:text-3xl text-xl font-bold mb-6">
        Production Companies
      </h1>
      <div className="w-full">
        <Carousel className="w-full max-w-[91vw]  basis-12 lg:max-w-[94vw]">
          <CarouselContent className="z-10 gap-6">
            {productionCompanies &&
              productionCompanies?.map((company) => (
                <CarouselItem
                  className=" bg-[#0f101e] border-[#ffffff1f] px-2 lg:px-8 py-2 lg:py-4 border rounded-3xl basis-auto"
                  key={company._id}
                >
                  <Link href={"/production/" + company._id} className="">
                    <div className="flex items-center gap-8 ">
                      <div className=" relative w-full z-20">
                        <div className="bg-green-500 w-4 h-4 rounded-full z-50 absolute top-2 right-6" />
                        <Image
                          width={220}
                          height={220}
                          src={company.logo}
                          className="hover:scale-105 transition-transform lg:w-32 w-24 h-24 lg:h-32 rounded-full object-cover object-center duration-300 ease-in-out"
                          alt={`${company.name} Logo`}
                        />
                      </div>
                      <div className="">
                        <h2 className="lg:text-3xl text-lg pl-2 font-bold mb-2">
                          {company.name}
                        </h2>
                        <p className="text-[#92939e] lg:text-base text-xs  pl-2 mb-2">
                          Founder & CEO
                        </p>
                        <SocialButtons
                          facebook={company?.socialMedia?.facebook}
                          twitter={company?.socialMedia?.twitter}
                          instagram={company?.socialMedia?.instagram}
                          youtube={company?.socialMedia?.youtube}
                        />
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12 text-black" />
          <CarouselNext className="mr-12 text-black" />
        </Carousel>
      </div>
    </div>
  );
};

export default ListProduction;

// Define a type for the social media link data
interface SocialMediaLink {
  name: string;
  url: string;
  icon: JSX.Element;
}

export const SocialButtons = ({
  facebook,
  youtube,
  twitter,
  instagram,
}: any) => {
  // Array of social media links
  const socialLinks: SocialMediaLink[] = [
    {
      name: "facebook",
      url: facebook,
      icon: <FacebookIcon size={16} />,
    },
    {
      name: "Twitter",
      url: twitter, // Placeholder URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M10.0596 7.34522L15.8879 0.570312H14.5068L9.44607 6.45287L5.40411 0.570312H0.742188L6.85442 9.46578L0.742188 16.5703H2.12338L7.4676 10.3581L11.7362 16.5703H16.3981L10.0593 7.34522H10.0596ZM8.16787 9.54415L7.54857 8.65836L2.62104 1.61005H4.74248L8.71905 7.29827L9.33834 8.18405L14.5074 15.5779H12.386L8.16787 9.54449V9.54415Z"
            fill="currentColor"
          ></path>
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: youtube,

      icon: <YoutubeIcon size={16} />,
    },

    {
      name: "Instagram",
      url: instagram,
      icon: (
        <svg
          height="16"
          width="16"
          version="1.1"
          id="Layer_1"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g id="XMLID_504_">
              {" "}
              <path
                id="XMLID_505_"
                d="M38.52,0.012h222.978C282.682,0.012,300,17.336,300,38.52v222.978c0,21.178-17.318,38.49-38.502,38.49 H38.52c-21.184,0-38.52-17.313-38.52-38.49V38.52C0,17.336,17.336,0.012,38.52,0.012z M218.546,33.329 c-7.438,0-13.505,6.091-13.505,13.525v32.314c0,7.437,6.067,13.514,13.505,13.514h33.903c7.426,0,13.506-6.077,13.506-13.514 V46.854c0-7.434-6.08-13.525-13.506-13.525H218.546z M266.084,126.868h-26.396c2.503,8.175,3.86,16.796,3.86,25.759 c0,49.882-41.766,90.34-93.266,90.34c-51.487,0-93.254-40.458-93.254-90.34c0-8.963,1.37-17.584,3.861-25.759H33.35v126.732 c0,6.563,5.359,11.902,11.916,11.902h208.907c6.563,0,11.911-5.339,11.911-11.902V126.868z M150.283,90.978 c-33.26,0-60.24,26.128-60.24,58.388c0,32.227,26.98,58.375,60.24,58.375c33.278,0,60.259-26.148,60.259-58.375 C210.542,117.105,183.561,90.978,150.283,90.978z"
              ></path>{" "}
            </g>{" "}
          </g>
        </svg>
      ),
    },
  ];
  console.log(facebook, "facebook");

  return (
    <div className="social-btn flex z-50 relative items-center gap-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          className="border bg-white text-blue-500 p-1 lg:p-2 rounded-full"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};
