"use client";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ProductionCompanyFormData {
  name: string;
  founderName?: string;
  about?: string;
  email: string;
  contactNumber?: string;
  password?: string;
  logo?: File;
}

const ProductionForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductionCompanyFormData>({
    name: "",
    founderName: "",
    about: "",
    email: "",
    contactNumber: "",
    password: "",
    logo: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        logo: e.target.files[0],
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.logo) newErrors.logo = "Logo is required";
    // Add more validation rules as needed
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof ProductionCompanyFormData]) {
        submissionData.append(
          key,
          formData[key as keyof ProductionCompanyFormData] as any
        );
      }
    });

    try {
      const response = await axios.post(
        "/auth/production/signup",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.status, "Network");

      if (response.status === 201) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        toast.success("Company created successfully");
        router.push("/");
      } else {
        toast.error("Error creating company");
      }

      // Reset form data and errors
      setFormData({
        name: "",
        founderName: "",
        about: "",
        email: "",
        contactNumber: "",
        password: "",
        logo: undefined,
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating company:", error);
      // toast.error("Error creating company");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-bold">
          Name of Company:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter Company Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300  bg-transparent rounded-xl focus:outline-none focus:border-blue-500"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="founderName" className="block mb-2 font-bold">
          Founder Name:
        </label>
        <input
          type="text"
          id="founderName"
          placeholder="Enter Founder Name"
          name="founderName"
          value={formData.founderName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="about" className="block mb-2 font-bold">
          Few Words About Your Company:
        </label>
        <textarea
          placeholder="Enter a few words about your company"
          rows={6}
          id="about"
          name="about"
          value={formData.about}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 font-bold">
          Email ID:
        </label>
        <input
          type="email"
          placeholder="Enter Email ID"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="contactNumber" className="block mb-2 font-bold">
          Contact Number:
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          placeholder="Enter Contact Number"
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 font-bold">
          Password:
        </label>
        <input
          placeholder="Enter Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="logo" className="block mb-2 font-bold">
          Logo:
        </label>
        <input
          type="file"
          placeholder="Upload Logo"
          id="logo"
          name="logo"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl   bg-transparent  focus:outline-none focus:border-blue-500"
        />
        {formData.logo && (
          <div className="flex items-center justify-center">
            <img
              src={formData.logo ? URL.createObjectURL(formData.logo) : ""}
              className="w-44 h-44 object-cover border rounded-2xl mt-2"
            />
          </div>
        )}

        {errors.logo && <p className="text-red-500">{errors.logo}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-500"
      >
        Submit
      </button>
    </form>
  );
};

export default ProductionForm;
