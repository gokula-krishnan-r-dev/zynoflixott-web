import ProductionForm from "@/components/form/production-form";
import SignupForm from "@/components/form/signup-form";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="min-h-screen bg-black relative text-gray-900 flex justify-center">
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
        <div className="max-w-screen-xl z-50  m-0 sm:m-10 flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 text-white rounded-3xl p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold text-white">
                Sign up
              </h1>
              <div className="w-full mt-8">
                <div className="mx-auto max-w-xl">
                  <ProductionForm />
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by templatana
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

                  <div className="flex mt-3 text-sm justify-center text-gray-600 text-center items-center">
                    <span>Already have an account?</span>
                    <a href="/login">
                      <span className="ml-2 text-blue-500">Login</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
