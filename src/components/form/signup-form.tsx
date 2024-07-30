"use client";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface FormData {
  full_name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  contact?: string;
}

interface Props {
  mode: "login" | "signup";
}

const SignupForm: React.FC<Props> = ({ mode }) => {
  const navigate = useRouter();
  const initialFormData: FormData = {
    full_name: mode === "signup" ? "" : undefined,
    email: "",
    password: "",
    confirmPassword: mode === "signup" ? "" : undefined,
    contact: mode === "signup" ? "" : undefined,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormData>({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setFormData(initialFormData);
  }, [mode]);

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email address";
  };

  const validatePassword = (password: string): string => {
    return password.length >= 6 ? "" : "Password must be at least 6 characters";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword?: string
  ): string => {
    return password === confirmPassword ? "" : "Passwords do not match";
  };

  const validatePhone = (phone?: string): string => {
    const phoneRegex = /^\d{10}$/;
    return phone && phoneRegex.test(phone) ? "" : "Invalid phone number";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError =
      mode === "signup"
        ? validateConfirmPassword(formData.password, formData.confirmPassword)
        : "";
    const phoneError = mode === "signup" ? validatePhone(formData.contact) : "";

    if (emailError || passwordError || confirmPasswordError || phoneError) {
      setErrors({
        full_name: "",
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        contact: phoneError,
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
    setLoading(true);

    try {
      const response = await axios.post(`/auth/${mode}`, formData);
      console.log(response.data);

      if (response.data.code === 401) {
        toast.error("Invalid password provided for login");
        return;
      }
      if (response.data.error === "User already exists") {
        toast.error(
          "User already exists with the provided email so please login instead"
        );

        return;
      }

      console.log(response.data.errro);

      if (response.data.error === "User not found") {
        toast.error("User not found or invalid password provided for login");
        return;
      }

      try {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem(
          "userRole",
          response.data.isProduction ? "production" : "user"
        );
        localStorage.setItem("isLogin", "true");
      } catch (e) {
        toast.error("Failed to save access token to local storage");
      }

      toast.success(`${mode === "login" ? "Login" : "Signup"} form submitted`);
      window.location.href = "/";
    } catch (error) {
      console.error("Submission error", error);
      toast.error("Failed to submit form please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white max-w-md mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        {mode === "signup" && (
          <div className="mb-4">
            <input
              className={`w-full px-8 py-4 rounded-lg font-medium  border-2 bg-transparent ${
                errors.full_name ? "border-red-500" : "border-gray-200"
              } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-2">{errors.full_name}</p>
            )}
          </div>
        )}
        <div className="mb-4">
          <input
            className={`w-full px-8 py-4 rounded-lg font-medium  bg-transparent  border-2 ${
              errors.email ? "border-red-500" : "border-gray-200"
            } text-sm focus:outline-none `}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            className={`w-full px-8 py-4 rounded-lg font-medium bg-transparent  border-2 ${
              errors.password ? "border-red-500" : "border-gray-200"
            }  text-sm focus:outline-none  mt-5`}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-2">{errors.password}</p>
          )}
        </div>
        {mode === "signup" && (
          <>
            <div className="mb-4">
              <input
                className={`w-full px-8 py-4 rounded-lg font-medium  border-2 bg-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                }  text-sm focus:outline-none  mt-5`}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div className="mb-4">
              <input
                className={`w-full px-8 py-4 rounded-lg font-medium  border-2 bg-transparent ${
                  errors.contact ? "border-red-500" : "border-gray-200"
                }  text-sm focus:outline-none  mt-5`}
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              {errors.contact && (
                <p className="text-red-500 text-xs mt-2">{errors.contact}</p>
              )}
            </div>
          </>
        )}
        <button
          className="mt-5 tracking-wide font-semibold bg-green-500 text-black w-full py-4 rounded-lg hover:bg-green-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
                {mode === "login" ? "Login" : "Sign Up"}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
