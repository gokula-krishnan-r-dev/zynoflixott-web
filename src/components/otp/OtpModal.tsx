import React from 'react';
import OTPInput from './OtpInput';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOtpSubmit: (otp: string) => void;
    isVerifying: boolean;
    error?: string;
    onResendOtp: () => void;
    email: string;
}

const OtpModal: React.FC<OtpModalProps> = ({
    isOpen,
    onClose,
    onOtpSubmit,
    isVerifying,
    error,
    onResendOtp,
    email
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Email Verification</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                        disabled={isVerifying}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                        We've sent a verification code to <span className="text-main font-semibold">{email}</span>.
                        Please check your inbox and enter the code below.
                    </p>
                </div>

                <OTPInput
                    onOtpSubmit={onOtpSubmit}
                    isVerifying={isVerifying}
                    error={error}
                    onResendOtp={onResendOtp}
                />
            </div>
        </div>
    );
};

export default OtpModal; 