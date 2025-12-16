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
  profile_type: string;
  createdAt: string;
  updatedAt: string;
}

// Define the function to fetch production companies
const getProductionCompanies = async (url: string) => {
  const response = await axios.get(`/auth/${url}/user`);
  return response.data.productionCompany;
};

// Define the main component to list production companies
const ListProduction = ({ url, title }: any) => {
  const {
    data: productionCompanies,
    error,
    isLoading,
  } = useQuery<ProductionCompany[], Error>(["productionCompanies", url], () =>
    getProductionCompanies(url)
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
      <h1 className="lg:text-xl text-base font-semibold mb-6">{title}</h1>
      {url === "production" ? (
        <div className="w-full">
          <Carousel className="w-full max-w-[91vw] basis-12 lg:max-w-[94vw]">
            <CarouselContent className="z-10 gap-3 ml-1">
              {productionCompanies &&
                productionCompanies?.map((company: any) => (
                  <CarouselItem
                    className=" bg-[#0f101e] rounded-2xl border-[#ffffff1f] flex items-center justify-center px-6 lg:px-4 py-4 lg:py-4  border  basis-auto"
                    key={company._id}
                  >
                    <Link href={"/production/" + company._id} className="">
                      <div className="flex  items-center gap-2 lg:gap-8 ">
                        <div className=" relative w-max z-20">
                          <div className="bg-red-500 w-4 h-4 rounded-full z-50 absolute -top-1 lg:top-1 right-1 lg:right-2 animate-dot-pulse" style={{
                            animation: "dot-pulse 2s infinite ease-in-out",
                          }}>
                            <style jsx>{`
                              @keyframes dot-pulse {
                                0% {
                                  transform: scale(1);
                                  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                                }
                                70% {
                                  transform: scale(1.1);
                                  box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
                                }
                                100% {
                                  transform: scale(1);
                                  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                                }
                              }
                            `}</style>
                          </div>
                          <img
                            width={180}
                            height={180}
                            src={company.logo.split('?')[0]}
                            className="hover:scale-105 transition-transform lg:w-24 w-12 h-12 lg:h-24 rounded-full object-cover object-center duration-300 ease-in-out"
                            alt={`${company.name} Logo`}
                          />
                        </div>
                        <div className="">
                          <p className="flex items-center gap-2">
                            <svg
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#2600ff"
                              className="animate-pulse-live"
                              style={{
                                animation: "pulse-live 1.5s infinite ease-in-out",
                              }}
                            >
                              <style jsx>{`
                                @keyframes pulse-live {
                                  0% {
                                    opacity: 1;
                                    transform: scale(1);
                                  }
                                  50% {
                                    opacity: 0.7;
                                    transform: scale(1.05);
                                  }
                                  100% {
                                    opacity: 1;
                                    transform: scale(1);
                                  }
                                }
                              `}</style>
                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <title>ic_fluent_live_24_filled</title>{" "}
                                <desc>Created with Sketch.</desc>{" "}
                                <g
                                  id="🔍-Product-Icons"
                                  stroke="none"
                                  stroke-width="1"
                                  fill="none"
                                  fill-rule="evenodd"
                                >
                                  {" "}
                                  <g
                                    id="ic_fluent_live_24_filled"
                                    fill="#2600ff"
                                    fill-rule="nonzero"
                                  >
                                    {" "}
                                    <path
                                      d="M6.34277267,4.93867691 C6.73329697,5.3292012 6.73329697,5.96236618 6.34277267,6.35289047 C3.21757171,9.47809143 3.21757171,14.5450433 6.34277267,17.6702443 C6.73329697,18.0607686 6.73329697,18.6939336 6.34277267,19.0844579 C5.95224838,19.4749821 5.3190834,19.4749821 4.92855911,19.0844579 C1.02230957,15.1782083 1.02230957,8.84492646 4.92855911,4.93867691 C5.3190834,4.54815262 5.95224838,4.54815262 6.34277267,4.93867691 Z M19.0743401,4.93867691 C22.9805896,8.84492646 22.9805896,15.1782083 19.0743401,19.0844579 C18.6838158,19.4749821 18.0506508,19.4749821 17.6601265,19.0844579 C17.2696022,18.6939336 17.2696022,18.0607686 17.6601265,17.6702443 C20.7853275,14.5450433 20.7853275,9.47809143 17.6601265,6.35289047 C17.2696022,5.96236618 17.2696022,5.3292012 17.6601265,4.93867691 C18.0506508,4.54815262 18.6838158,4.54815262 19.0743401,4.93867691 Z M9.3094225,7.81205295 C9.69994679,8.20257725 9.69994679,8.83574222 9.3094225,9.22626652 C7.77845993,10.7572291 7.77845993,13.2394099 9.3094225,14.7703724 C9.69994679,15.1608967 9.69994679,15.7940617 9.3094225,16.184586 C8.91889821,16.5751103 8.28573323,16.5751103 7.89520894,16.184586 C5.58319778,13.8725748 5.58319778,10.1240641 7.89520894,7.81205295 C8.28573323,7.42152866 8.91889821,7.42152866 9.3094225,7.81205295 Z M16.267742,7.81205295 C18.5797531,10.1240641 18.5797531,13.8725748 16.267742,16.184586 C15.8772177,16.5751103 15.2440527,16.5751103 14.8535284,16.184586 C14.4630041,15.7940617 14.4630041,15.1608967 14.8535284,14.7703724 C16.384491,13.2394099 16.384491,10.7572291 14.8535284,9.22626652 C14.4630041,8.83574222 14.4630041,8.20257725 14.8535284,7.81205295 C15.2440527,7.42152866 15.8772177,7.42152866 16.267742,7.81205295 Z M12.0814755,10.5814755 C12.9099026,10.5814755 13.5814755,11.2530483 13.5814755,12.0814755 C13.5814755,12.9099026 12.9099026,13.5814755 12.0814755,13.5814755 C11.2530483,13.5814755 10.5814755,12.9099026 10.5814755,12.0814755 C10.5814755,11.2530483 11.2530483,10.5814755 12.0814755,10.5814755 Z"
                                      id="🎨-Color"
                                    >
                                      {" "}
                                    </path>{" "}
                                  </g>{" "}
                                </g>{" "}
                              </g>
                            </svg>
                            <span className="text-red-500 font-bold animate-live-text" style={{
                              animation: "live-text-blink 1.5s infinite alternate",
                            }}>
                              <style jsx>{`
                                @keyframes live-text-blink {
                                  0% {
                                    color: #ef4444;
                                    text-shadow: 0 0 0px rgba(239, 68, 68, 0.7);
                                  }
                                  100% {
                                    color: #f87171;
                                    text-shadow: 0 0 8px rgba(239, 68, 68, 0.9);
                                  }
                                }
                              `}</style>
                              LIVE
                            </span>
                          </p>
                          <h2 className="lg:text-xl lg:w-max w-full text-lg pl-2 font-bold mb-2">
                            {company.name}
                          </h2>
                          {/* <p className="text-[#92939e] lg:text-base text-xs  pl-2 mb-2">
                            Founder & CEO
                          </p> */}
                          <button className="bg-red-500  px-3 lg:px-6 py-1 lg:text-sm text-xs lg:py-3 rounded-xl">
                            Watching
                          </button>
                          {/* <SocialButtons
                          facebook={company?.socialMedia?.facebook}
                          twitter={company?.socialMedia?.twitter}
                          instagram={company?.socialMedia?.instagram}
                          youtube={company?.socialMedia?.youtube}
                        /> */}
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
      ) : (
        <div className="w-full">
          <Carousel className="w-full max-w-[91vw]  basis-12 lg:max-w-[94vw]">
            <CarouselContent className="z-10 gap-6 ml-1">
              {productionCompanies &&
                productionCompanies?.map((company: any) => (
                  <CarouselItem
                    className=" bg-[#0f101e] border-[#ffffff1f] px-4 flex items-center justify-center lg:px-8 py-4 lg:py-3 border rounded-3xl basis-auto"
                    key={company._id}
                  >
                    <Link href={"/production/" + company._id} className="">
                      <div className="flex flex-col items-center gap-2 lg:gap-8">
                        <div className=" relative w-max z-20">
                          <div className="bg-red-500 w-4 h-4 rounded-full z-50 absolute -top-1 lg:top-1 right-1 lg:right-2 animate-dot-pulse" style={{
                            animation: "dot-pulse 2s infinite ease-in-out",
                          }}>
                            <style jsx>{`
                              @keyframes dot-pulse {
                                0% {
                                  transform: scale(1);
                                  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                                }
                                70% {
                                  transform: scale(1.1);
                                  box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
                                }
                                100% {
                                  transform: scale(1);
                                  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                                }
                              }
                            `}</style>
                          </div>
                          <Image
                            width={180}
                            height={180}
                            src={company.logo}
                            className="hover:scale-105 transition-transform lg:w-24 w-12 h-12 lg:h-24 rounded-full object-cover object-center duration-300 ease-in-out"
                            alt={`${company.name} Logo`}
                          />
                        </div>
                        <div className="text-center">
                          <h2 className="lg:text-xl  w-full text-lg pl-2 font-bold mb-2">
                            {company.name}
                          </h2>
                          <p className="text-blue-500 lg:text-sm text-xs  pl-2">
                            DIRECTOR
                          </p>
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
      )}
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
    <div className="social-btn flex z-20 relative items-center gap-4">
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
