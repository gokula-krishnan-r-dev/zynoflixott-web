"use client";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ProfileImageUpload from "@/components/ui/profile-image-upload";

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface StudentAmbassadorFormData {
  full_name: string;
  email: string;
  password: string;
  college_name: string;
  age: number | string;
  contact_number: string;
  profilePic?: File | string;
}

const StudentAmbassadorForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentAmbassadorFormData>({
    full_name: "",
    email: "",
    password: "",
    college_name: "",
    age: "",
    contact_number: "",
    profilePic: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      toast.error('Failed to load Razorpay. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "age") {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value) : "",
      });
    } else if (name === "contact_number") {
      // Only allow digits, remove any non-digit characters
      const processedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: processedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profilePic: e.target.files[0],
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.full_name?.trim()) newErrors.full_name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password?.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.college_name?.trim())
      newErrors.college_name = "College name is required";
    if (!formData.age) newErrors.age = "Age is required";
    else if (isNaN(Number(formData.age)) || Number(formData.age) < 1)
      newErrors.age = "Please enter a valid age";
    if (!formData.contact_number?.trim()) newErrors.contact_number = "Contact number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.contact_number.replace(/\s+/g, '')))
      newErrors.contact_number = "Please enter a valid 10-digit mobile number";
    if (!formData.profilePic) newErrors.profilePic = "Profile photo is required";

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
    submissionData.append("full_name", formData.full_name);
    submissionData.append("email", formData.email);
    submissionData.append("password", formData.password);
    submissionData.append("college_name", formData.college_name);
    submissionData.append("age", formData.age.toString());
    submissionData.append("contact_number", formData.contact_number);
    submissionData.append("userType", "student_ambassador");
    if (formData.profilePic instanceof File) {
      submissionData.append("profilePic", formData.profilePic);
    }

    try {
      const response = await axios.post(
        "/auth/student-ambassador/signup",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setRegistrationData(response.data);
        setShowPayment(true);
        toast.success("Registration successful! Please complete payment.");
      } else {
        toast.error("Error creating profile");
      }
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error(
        `Error creating profile. ${error.response?.data?.error || error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate registration data
      if (!registrationData || !registrationData.userId) {
        toast.error("Registration data is missing. Please register again.");
        setShowPayment(false);
        return;
      }

      if (!razorpayLoaded || !window.Razorpay) {
        toast.error("Payment gateway is loading. Please wait...");
        setIsSubmitting(false);
        return;
      }

      console.log("Creating Razorpay order for userId:", registrationData.userId);

      // Create Razorpay order
      const orderResponse = await axios.post("/auth/student-ambassador/create-order", {
        userId: registrationData.userId,
        amount: 100,
      });

      if (!orderResponse.data.success || !orderResponse.data.orderId) {
        const errorMsg = orderResponse.data.error || "Failed to create payment order";
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      const { orderId, amount, key } = orderResponse.data;

      // Use key from API or fallback to environment variable or test key
      const razorpayKey = key || 
                         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 
                         'rzp_test_S6AcB6I8TQuoVM'; // Test key fallback
      
      if (!razorpayKey) {
        toast.error("Payment gateway configuration error. Please contact support.");
        setIsSubmitting(false);
        return;
      }

      // Razorpay options
      const options = {
        key: razorpayKey,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'ZynoFlix OTT',
        description: 'Student Brand Ambassador Registration Fee',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post("/auth/student-ambassador/verify-payment", {
              userId: registrationData.userId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              // Store auth data
              localStorage.setItem("accessToken", verifyResponse.data.accessToken);
              localStorage.setItem("userId", registrationData.userId);
              localStorage.setItem("isLogin", "true");
              localStorage.setItem("userRole", "user");
              if (verifyResponse.data.user?.userType) {
                localStorage.setItem("userType", verifyResponse.data.user.userType);
              }
              toast.success("Payment successful! Registration completed.");
              window.location.href = "/profile";
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error: any) {
            console.error("Error verifying payment:", error);
            toast.error(error.response?.data?.error || "Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: registrationData.user?.full_name || '',
          email: registrationData.user?.email || '',
        },
        theme: {
          color: '#10b981', // Green color matching the button
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            toast.info("Payment cancelled");
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || "Please try again"}`);
        setIsSubmitting(false);
      });
      
      razorpay.open();
    } catch (error: any) {
      console.error("Error processing payment:", error);
      const errorMessage = error.response?.data?.error || error.message || "Payment failed";
      const errorCode = error.response?.data?.code;
      
      // Handle specific error codes
      if (errorCode === "USER_NOT_FOUND") {
        toast.error("User not found. Please register again.");
        setShowPayment(false);
      } else if (errorCode === "INVALID_USER_TYPE") {
        toast.error("Invalid user type. Please contact support.");
      } else if (errorCode === "PAYMENT_ALREADY_COMPLETED") {
        toast.success("Payment already completed. Redirecting to profile...");
        setTimeout(() => {
          window.location.href = "/profile";
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
      setIsSubmitting(false);
    }
  };

  if (showPayment) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg border border-gray-700 rounded-xl shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Complete Your Registration
          </h2>
          <p className="text-gray-400 text-sm">
            Pay the registration fee to activate your Student Brand Ambassador account
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200 text-sm">Registration Fee</span>
            <span className="text-3xl font-bold text-white">₹100</span>
          </div>
          <div className="border-t border-green-500 pt-3 mt-3">
            <div className="flex items-center text-green-100 text-xs">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure payment powered by Razorpay
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRazorpayPayment}
            disabled={isSubmitting || !razorpayLoaded}
            className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : !razorpayLoaded ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Payment Gateway...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
                Pay ₹100 with Razorpay
              </>
            )}
          </button>

          <button
            onClick={() => setShowPayment(false)}
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 ease-in-out"
          >
            Back to Form
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your payment is secure and encrypted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="mb-4">
        <label htmlFor="full_name" className="block mb-2 font-bold text-white">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          placeholder="Enter your full name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-white focus:outline-none focus:border-blue-500"
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 font-bold text-white">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-white focus:outline-none focus:border-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 font-bold text-white">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password (min 6 characters)"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-white focus:outline-none focus:border-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="college_name" className="block mb-2 font-bold text-white">
          College Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="college_name"
          placeholder="Enter your college name"
          name="college_name"
          value={formData.college_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-white focus:outline-none focus:border-blue-500"
        />
        {errors.college_name && (
          <p className="text-red-500 text-sm mt-1">{errors.college_name}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="age" className="block mb-2 font-bold text-white">
          Age <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="age"
          placeholder="Enter your age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="1"
          max="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-white focus:outline-none focus:border-blue-500"
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="contact_number" className="block mb-2 font-bold text-white">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="contact_number"
          placeholder="Enter your 10-digit mobile number"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          maxLength={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-white focus:outline-none focus:border-blue-500"
        />
        {errors.contact_number && (
          <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="profilePic" className="block mb-2 font-bold text-white">
          Profile Photo <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-white focus:outline-none focus:border-blue-500"
        />
        {errors.profilePic && (
          <p className="text-red-500 text-sm mt-1">{errors.profilePic}</p>
        )}
        {formData.profilePic && formData.profilePic instanceof File && (
          <p className="text-green-400 text-sm mt-1">
            File selected: {formData.profilePic.name}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 ease-in-out disabled:opacity-50"
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
          "Register as Student Brand Ambassador"
        )}
      </button>
    </form>
  );
};

export default StudentAmbassadorForm;
