import React from "react";

const page = () => {
  return (
    <div>
      <div className="text-white px-2 pb-6 lg:px-24 pt-24 lg:pt-0 h-auto lg:h-screen flex items-center justify-center flex-col">
        <h1 className="text-white font-bold text-center text-xl lg:text-4xl">
          SPONSORSHIP
        </h1>
        <br />
        <div className=" text-xs lg:text-lg pb-6 text-gray-200">
          <h2>Sponsorship Opportunity for Your Project</h2>
          <p>
            We are currently offering sponsorship opportunities for talented
            filmmakers. With our sponsorship program, we will provide financial
            support of up to 50,000 per month. Each month, we will select two
            applications that meet our criteria.
          </p>
          <br />
          <p>
            We are particularly interested in projects that focus on script
            social messages, thrilling concepts, or full comedy videos. If your
            project falls within these categories and you're looking for
            financial backing, we encourage you to apply for our sponsorship
            program.
          </p>
        </div>
        <a
          className=" text-white bg-green-500 mt-7 rounded-xl bg-main px-6 lg:px-24 text-sm lg:text-lg font-bold py-2.5 lg:py-3"
          href="/contact-us"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default page;
