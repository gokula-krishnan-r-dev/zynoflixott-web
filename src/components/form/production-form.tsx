"use client";
import axios from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import OtpModal from "@/components/otp/OtpModal";
import ProfileImageUpload from "@/components/ui/profile-image-upload";

interface ProductionCompanyFormData {
  name: string;
  founderName?: string;
  about?: string;
  email: string;
  contactNumber?: string;
  password?: string;
  profile_type: string;
  logo?: File;
}

const ProductionForm: React.FC<{ type: string }> = ({ type }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductionCompanyFormData>({
    name: "",
    founderName: "",
    about: "",
    email: "",
    contactNumber: "8783478347",
    profile_type: type,
    password: "",
    logo: undefined,
  });
  console.log(formData, "formData");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP verification states
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");
  const [sentOtp, setSentOtp] = useState<string>("");

  console.log(errors, "errors");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
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
    // if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.logo) newErrors.logo = "Logo is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.about) newErrors.about = "About is required";
    if (!formData.founderName)
      newErrors.founderName = "Founder Name is required";
    if (!formData.profile_type)
      newErrors.profile_type = "Profile Type is required";

    return newErrors;
  };

  const sendOtpToEmail = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.founderName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      // Store the OTP for verification
      setSentOtp(data.otp);
      setShowOtpModal(true);
      toast.success('Verification code sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (enteredOtp: string) => {
    try {
      setIsVerifyingOtp(true);
      setOtpError("");

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: enteredOtp,
          expectedOtp: sentOtp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpError(data.error || 'Invalid verification code');
        return false;
      }

      toast.success('Email verified successfully!');
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Failed to verify code. Please try again.');
      return false;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpSubmit = async (enteredOtp: string) => {
    const isVerified = await verifyOtp(enteredOtp);
    if (isVerified) {
      // Close the modal and proceed with form submission
      setShowOtpModal(false);
      await submitProductionForm();
    }
  };

  const handleCloseOtpModal = () => {
    if (!isVerifyingOtp) {
      setShowOtpModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Send OTP before proceeding with form submission
    await sendOtpToEmail();
  };

  const submitProductionForm = async () => {
    setIsSubmitting(true);

    const submissionData = new FormData();
    submissionData.append("name", formData.founderName as any)

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
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("userRole", "production");
        toast.success("Director profile created successfully");
        window.location.href = "/";
      } else {
        toast.error("Error creating profile");
      }

      // Reset form data and errors
      setFormData({
        name: "",
        founderName: "",
        about: "",
        profile_type: "",
        email: "",
        contactNumber: "",
        password: "",
        logo: undefined,
      });
      setErrors({});
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error(`Error creating profile. Please try again. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="mb-4">
          <label htmlFor="founderName" className="block mb-2 font-bold">
            {type === "production" ? "Production Company Name" : "Director Name"}
          </label>
          <input
            type="text"
            id="founderName"
            placeholder={type === "production" ? "Enter Production Company Name" : "Enter Director Name"}
            name="founderName"
            value={formData.founderName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
          />
          {errors.founderName && <p className="text-red-500">{errors.founderName}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="about" className="block mb-2 font-bold">
            Few Words About You:
          </label>
          <textarea
            placeholder="Enter a few words About you"
            rows={6}
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
          />
          {errors.about && <p className="text-red-500">{errors.about}</p>}
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
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="profile_type" className="block mb-2 font-bold">
            Profile Type:
          </label>
          <select
            id="profile_type"
            name="profile_type"
            defaultValue={formData.profile_type}
            value={formData.profile_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
          >
            <option value="production">Production</option>
            <option value="directors">Directors</option>
          </select>
          {errors.profile_type && <p className="text-red-500">{errors.profile_type}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="logo" className="block mb-2 font-bold">
            Profile Picture:
          </label>

          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
          />
          {errors.logo && <p className="text-red-500">{errors.logo}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-main text-black font-bold rounded-xl transition-all duration-300 ease-in-out"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-3 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0l4 4-4 4V5a7 7 0 100 14v-3l4 4-4 4v-2a8 8 0 01-8-8z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={handleCloseOtpModal}
        onOtpSubmit={handleOtpSubmit}
        isVerifying={isVerifyingOtp}
        error={otpError}
        onResendOtp={sendOtpToEmail}
        email={formData.email}
      />
    </>
  );
};

export default ProductionForm;
