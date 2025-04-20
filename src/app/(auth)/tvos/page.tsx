"use client";
import { accessToken, userId } from "@/lib/user";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const Page: React.FC = () => {
  const router = useRouter();
  const inputRefs: any = useRef<(HTMLInputElement | any)[]>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const otpValue = otp.join("");

    try {
      const response = await fetch(
        "https://api.zynoflixott.com/api/auth/tvos/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otpValue, userId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        console.log("Verification successful:", data);
        router.push("/");
        // You can redirect or show a success message
      } else {
        setError(data.error || "Failed to verify OTP");
      }
    } catch (error) {
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your phone
            number.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el: any | null) => (inputRefs.current[index] = el)}
                value={digit}
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 mt-4">Verification successful!</p>
        )}
        <div className="text-sm text-slate-500 mt-4">
          its a one time otp verification , please do not share this otp with
          anyone if you did not receive the otp please click on try again to get
        </div>
      </div>
    </main>
  );
};

export default Page;
