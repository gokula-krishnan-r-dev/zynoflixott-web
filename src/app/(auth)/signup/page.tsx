import SignupForm from "@/components/form/signup-form";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="">
      <div className="min-h-screen bg-black text-gray-900 flex justify-center relative">
        {/* <video
          loop
          className="absolute z-20 inset-0 w-full h-full object-cover object-center bg-black opacity-70"
          autoPlay
          muted
          controls={false}
          preload="none"
        >
          <source src="/bg/bg-login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
         <div className="hero-bg-gradient "></div>
        <div className="max-w-screen-xl z-50 m-0 sm:m-10 rounded-3xl flex justify-center flex-1 ">
          <div className="lg:w-1/2 xl:w-5/12 p-6  rounded-3xl  sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl text-white font-extrabold">
                Sign up
              </h1>
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center">
                  <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                    <div className=" p-2 rounded-full">
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Sign Up with Google</span>
                  </button>
                  <Link
                    href={"/signup/production"}
                    className="w-full mt-4 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  >
                    <span className="ml-4">Production Company Signup</span>
                  </Link>
                </div>
                <div className="my-12 text-gray-100 text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-100 tracking-wide font-medium  transform translate-y-1/2">
                    Or sign up with e-mail
                  </div>
                </div>
                <div className="mx-auto max-w-xs">
                  <SignupForm mode="signup" />

                  <p className="mt-6 text-xs text-gray-100 text-center">
                    I agree to abide by templatanas
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Terms of Service
                    </a>
                    and its
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
                <div className="flex mt-3 text-sm justify-center text-gray-100 text-center items-center">
                  <span>already Have an account ? </span>
                  <a href="/login" className="text-indigo-400 ml-2">
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
              }}
            ></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default page;
