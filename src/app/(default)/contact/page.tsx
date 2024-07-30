"use client";
import React, { useState, FormEvent } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    comments: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("/api/contact", formData);
      setSuccessMessage("Form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone_no: "",
        comments: "",
      });
    } catch (error) {
      setErrorMessage("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex pt-24 justify-start flex-col items-center h-full md:h-max rounded-0 md:rounded-2xl mx-auto">
      <div className="md:w-3/4 p-6 md:p-10 lg:p-16 lowercase gap-8 flex flex-col">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold  sm:text-4xl text-white">
              Contact us
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              We'd love to talk about how we can help you.
            </p>
          </div>
        </div>
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {errorMessage}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="basic-details-form grid grid-cols-2 gap-6"
        >
          <input
            name="name"
            placeholder="Your name *"
            className="bg-gray-800 py-4 px-6 rounded-2xl text-white outline-none font-medium col-span-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="E-mail *"
            className="bg-gray-800 py-4 px-6 rounded-2xl text-white outline-none font-medium col-span-2"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone_no"
            placeholder="Phone Number *"
            className="bg-gray-800 py-4 px-6 rounded-2xl text-white outline-none font-medium col-span-2"
            type="number"
            value={formData.phone_no}
            onChange={handleChange}
            required
          />
          <textarea
            name="comments"
            placeholder="Message... *"
            className="col-span-2 text-start bg-gray-800 rounded-2xl text-white outline-none font-medium px-6 py-6 h-20 md:h-60"
            value={formData.comments}
            onChange={handleChange}
            required
          />
          <button
            className={`!bg-btn_bgcolor3 bg-green-500 rounded-xl capitalize col-span-2 h-[60px] ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
            role="button"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div className="disclaimer flex-col gap-2 font-medium flex justify-center mb-4">
          <p className="normal-case hidden">
            For more details reach us at{" "}
            <a className="text-[#646cff]" href="mailto:feedback@zynoflix.com">
              feedback@zynoflix.com
            </a>
          </p>
          <div className="flex flex-col md:flex-row p-4 rounded-lg border-[#B561F7] border-2">
            <div className="flex gap-2 pb-2 md:basis-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#646cff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx={12} cy={12} r={10} />
                <line x1={2} y1={12} x2={22} y2={12} />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <div className="flex flex-col gap-2">
                <p className="capitalize">
                  FUERO NETWORK TECHNOLOGIES PRIVATE LIMITED
                </p>
                <p className="normal-case">
                  No. 11/4, Pooja Garden, Kalapatti Main Rd,
                </p>
                <p className="normal-case"> Civil Aerodrome Post, </p>
                <p className="normal-case">Coimbatore, Tamil Nadu 641014 </p>
              </div>
            </div>
            <div className="flex md:justify-center gap-2 pb-2 md:basis-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#646cff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div className="flex flex-col gap-2">
                <a className="text-[#646cff]" href="mailto:ads@zynoflix.com">
                  ads@zynoflix.com
                </a>
                <a className="text-[#646cff]" href="mailto:info@zynoflix.com">
                  info@zynoflix.com
                </a>
                <a
                  className="text-[#646cff]"
                  href="mailto:feedback@zynoflix.com"
                >
                  feedback@zynoflix.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
