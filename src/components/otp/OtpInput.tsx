import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
    length?: number;
    onOtpSubmit: (otp: string) => void;
    isVerifying: boolean;
    error?: string;
    onResendOtp: () => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
    length = 6,
    onOtpSubmit,
    isVerifying,
    error,
    onResendOtp
}) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [canResend, setCanResend] = useState<boolean>(false);

    // Create countdown timer for resend button
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    // Handle resend click
    const handleResendClick = () => {
        if (canResend) {
            onResendOtp();
            setTimeLeft(60);
            setCanResend(false);
        }
    };

    useEffect(() => {
        // Pre-populate refs array
        inputRefs.current = Array(length)
            .fill(null)
            .map((_, i) => inputRefs.current[i] || null);

        // Focus the first input when component mounts
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [length]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Only accept numbers
        if (!/^\d*$/.test(value)) return;

        // Take the last character if multiple characters are pasted or typed
        const singleValue = value.substring(value.length - 1);

        // Update the OTP state
        const newOtp = [...otp];
        newOtp[index] = singleValue;
        setOtp(newOtp);

        // Auto-focus next input if current input is filled
        if (singleValue && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        // Submit OTP if all fields are filled
        if (newOtp.every(val => val) && newOtp.length === length) {
            onOtpSubmit(newOtp.join(''));
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');

        // Only accept numbers
        if (!/^\d*$/.test(pastedData)) return;

        // Fill the OTP fields with the pasted data
        const newOtp = [...otp];
        for (let i = 0; i < Math.min(length, pastedData.length); i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus the next empty field or the last field
        const nextEmptyIndex = newOtp.findIndex(val => !val);
        if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
            inputRefs.current[nextEmptyIndex]?.focus();
        } else if (inputRefs.current[length - 1]) {
            inputRefs.current[length - 1]?.focus();
        }

        // Submit OTP if all fields are filled
        if (newOtp.every(val => val) && newOtp.length === length) {
            onOtpSubmit(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }

        // Move to next input on right arrow
        if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        // Move to previous input on left arrow
        if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2 text-white">Verify Your Email</h2>
                <p className="text-gray-400 text-sm">
                    We've sent a verification code to your email. Enter the code below.
                </p>
            </div>

            <div className="flex space-x-2 sm:space-x-4 mb-6 justify-center">
                {Array.from({ length }, (_, index) => (
                    <input
                        key={index}
                        type="text"
                        ref={(el) => { inputRefs.current[index] = el; }}
                        value={otp[index] || ''}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        maxLength={1}
                        className={`w-12 h-14 sm:w-14 sm:h-16 border-2 ${error ? 'border-red-500' : 'border-gray-200'
                            } rounded-lg text-center text-xl font-bold bg-transparent text-white focus:border-main focus:outline-none transition-all`}
                        disabled={isVerifying}
                    />
                ))}
            </div>

            {error && (
                <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
            )}

            <div className="flex flex-col items-center space-y-3">
                <button
                    onClick={handleResendClick}
                    disabled={!canResend || isVerifying}
                    className={`text-sm ${canResend && !isVerifying ? 'text-main hover:underline' : 'text-gray-500'
                        }`}
                >
                    {canResend ? 'Resend Code' : `Resend code in ${timeLeft} seconds`}
                </button>

                <button
                    onClick={() => onOtpSubmit(otp.join(''))}
                    disabled={otp.some(val => !val) || isVerifying}
                    className={`w-full sm:w-72 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out focus:outline-none ${otp.some(val => !val) || isVerifying
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-main text-black hover:bg-yellow-400'
                        } flex items-center justify-center`}
                >
                    {isVerifying ? (
                        <>
                            <svg
                                className="w-5 h-5 mr-2 animate-spin"
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
                            Verifying...
                        </>
                    ) : (
                        'Verify & Continue'
                    )}
                </button>
            </div>
        </div>
    );
};

export default OTPInput; 