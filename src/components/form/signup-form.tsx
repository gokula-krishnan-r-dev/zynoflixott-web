"use client";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import OtpModal from "@/components/otp/OtpModal";

interface FormData {
  full_name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  contact?: string;
  logo?: File | string;
}

interface Props {
  mode: "login" | "signup";
}

const SignupForm: React.FC<Props> = ({ mode }) => {
  const initialFormData: FormData = {
    full_name: mode === "signup" ? "" : undefined,
    email: "",
    password: "",
    confirmPassword: mode === "signup" ? "" : undefined,
    contact: mode === "signup" ? "" : undefined,
    logo: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormData>({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "8783478347",
    logo: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // OTP verification states
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");
  const [sentOtp, setSentOtp] = useState<string>("");

  useEffect(() => {
    setFormData(initialFormData);
  }, [mode]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        logo: e.target.files[0],
      });
    }
  };
  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email address";
  };

  const validatePassword = (password: string): string => {
    if (!password.trim()) return "Password is required";
    return password.length >= 6 ? "" : "Password must be at least 6 characters";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword?: string
  ): string => {
    if (mode === "signup" && !confirmPassword?.trim()) return "Confirm password is required";
    return password === confirmPassword ? "" : "Passwords do not match";
  };


  const validateFullName = (fullName?: string): string => {
    if (mode === "signup" && !fullName?.trim()) return "Full name is required";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field on change
    if (name === "email") {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "password") {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
      if (mode === "signup" && formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value, formData.confirmPassword)
        }));
      }
    } else if (name === "confirmPassword") {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.password, value)
      }));

    } else if (name === "full_name") {
      setErrors(prev => ({ ...prev, full_name: validateFullName(value) }));
    }
  };

  const sendOtpToEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.full_name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      // Store the OTP for verification (in production you would not send back the OTP)
      setSentOtp(data.otp);
      setShowOtpModal(true);
      toast.success('Verification code sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
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
      await submitForm();
    }
  };

  const submitForm = async () => {
    try {
      setLoading(true);

      // Handle different submission formats based on mode
      if (mode === "login") {
        // For login, send as JSON
        const loginData = {
          email: formData.email,
          password: formData.password
        };

        // Log request if in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Submitting login with data:', loginData);
        }

        // Set request config for JSON
        const requestConfig = {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        };

        // Make the API request with JSON data
        const response = await axios.post(`/auth/${mode}`, loginData, requestConfig);

        handleAuthResponse(response);
      } else {
        // For signup, use FormData (for file uploads)
        const formDataValues = new FormData();

        // Conditionally add fields only if they exist
        if (formData.full_name) {
          formDataValues.append("full_name", formData.full_name);
        }

        formDataValues.append("email", formData.email);
        formDataValues.append("password", formData.password);

        // Handle the logo file properly
        if (formData.logo) {
          // If it's already a File object
          if (formData.logo instanceof File) {
            formDataValues.append("logo", formData.logo);
          }
          // If it's a string URL from previous upload
          else if (typeof formData.logo === 'string' && formData.logo.trim() !== '') {
            // The server would need to handle this case
            formDataValues.append("logoUrl", formData.logo);
          }
        }

        // Log request if in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Submitting signup with data:', Object.fromEntries(formDataValues.entries()));
        }

        // Set request config for FormData
        const requestConfig = {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        };

        // Make the API request with FormData
        const response = await axios.post(`/auth/${mode}`, formDataValues, requestConfig);

        handleAuthResponse(response);
      }
    } catch (error: any) {
      // Handle request errors
      console.error("Form submission error:", error);

      // Extract error message from response if available
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle the authentication response
  const handleAuthResponse = (response: any) => {
    // Handle server validation errors
    if (response.data.code === 401) {
      toast.error("Invalid password provided for login");
      return;
    }

    if (response.data.error === "User already exists") {
      toast.error(
        "User already exists with the provided email. Please login instead."
      );
      return;
    }

    if (response.data.error === "User not found") {
      toast.error("User not found or invalid password provided for login");
      return;
    }

    // Store auth data securely
    try {
      // Store auth tokens and user info
      const { accessToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", user._id);
      localStorage.setItem(
        "userRole",
        response.data.isProduction || (user.userType === "student_ambassador" ? "user" : "user")
      );
      if (user.userType) {
        localStorage.setItem("userType", user.userType);
      }
      localStorage.setItem("isLogin", "true");

      // Success notification
      toast.success(`${mode === "login" ? "Login" : "Signup"} successful!`);

      // Redirect to home page
      window.location.href = "/";
    } catch (storageError) {
      console.error("Failed to save auth data to local storage:", storageError);
      toast.error("Failed to save login information. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullNameError = validateFullName(formData.full_name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError =
      mode === "signup"
        ? validateConfirmPassword(formData.password, formData.confirmPassword)
        : "";

    if (fullNameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        full_name: fullNameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      contact: "",
      full_name: "",
    });

    // if (mode === "signup") {
    //   // For signup, send OTP first
    //   await sendOtpToEmail();
    // } else {
    // For login, directly submit the form
    await submitForm();
    // }
  };

  const handleResendOtp = async () => {
    await sendOtpToEmail();
  };

  const handleCloseOtpModal = () => {
    if (!isVerifyingOtp) {
      setShowOtpModal(false);
    }
  };

  return (
    <div className="w-full text-white max-w-md mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        {mode === "signup" && (
          <div className="mb-4">
            <label className="block text-sm mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full px-8 py-4 rounded-lg font-medium border-2 bg-transparent ${errors.full_name ? "border-red-500" : "border-gray-200"
                } placeholder-gray-500 text-sm focus:outline-none`}
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-2">{errors.full_name}</p>
            )}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-8 py-4 rounded-lg font-medium bg-transparent border-2 ${errors.email ? "border-red-500" : "border-gray-200"
              } text-sm focus:outline-none`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-8 py-4 rounded-lg font-medium bg-transparent border-2 ${errors.password ? "border-red-500" : "border-gray-200"
              } text-sm focus:outline-none mt-1`}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-2">{errors.password}</p>
          )}
        </div>
        {mode === "signup" && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full px-8 py-4 rounded-lg font-medium border-2 bg-transparent ${errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  } text-sm focus:outline-none mt-1`}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="logo" className="block text-sm mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl  bg-transparent  focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full px-8 py-4 rounded-lg font-medium border-2 bg-transparent ${errors.contact ? "border-red-500" : "border-gray-200"
                  } text-sm focus:outline-none mt-1`}
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
              {errors.contact && (
                <p className="text-red-500 text-xs mt-2">{errors.contact}</p>
              )}
            </div> */}
          </>
        )}
        <button
          className="mt-5 tracking-wide bg-main font-semibold bg-main text-black w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="w-6 h-6 animate-spin"
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
          ) : (
            <>
              <svg
                className="w-6 h-6 -ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy={7} r={4} />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-3">
                {mode === "login" ? "Login to Zynoflixott" : "Sign Up"}
              </span>
            </>
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
        onResendOtp={handleResendOtp}
        email={formData.email}
      />
    </div>
  );
};

export default SignupForm;
