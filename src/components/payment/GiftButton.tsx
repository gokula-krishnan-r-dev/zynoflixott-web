"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Gift, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import axios from 'axios';

declare global {
    interface Window {
        Razorpay: any;
    }
}

type GiftOption = {
    amount: number;
    displayAmount: string;
    label?: string;
}

type GiftButtonProps = {
    videoId: string;
    creatorId: string;
    className?: string;
    variant?: 'mobile' | 'desktop';
    onSuccess?: () => void;
};

export default function GiftButton({
    videoId,
    creatorId,
    className,
    variant = 'desktop',
    onSuccess
}: GiftButtonProps) {
    const router = useRouter();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const isMobile = variant === 'mobile';

    const giftOptions: GiftOption[] = [
        { amount: 13, displayAmount: '$13' },
        { amount: 118, displayAmount: '$118' },
        { amount: 295, displayAmount: '$295' }
    ];

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async (amount: number) => {
        if (!videoId || !creatorId) {
            toast.error('Missing video or creator information');
            return;
        }

        try {
            setLoading(true);
            setSelectedAmount(amount);

            // Create order on server
            const response = await axios.post('/api/payment/create-order', {
                amount: amount * 100, // Convert to smallest currency unit (cents)
                videoId,
                creatorId,
                currency: 'USD',
                paymentType: 'gift'
            });

            const { order } = response.data;

            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                toast.error('Payment gateway is not loaded. Please try again.');
                setLoading(false);
                return;
            }

            // Configure Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount * 100, // Convert to smallest currency unit (cents)
                currency: 'USD',
                name: 'Zynoflix',
                description: `Gift for creator`,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // Verify payment on server
                        const verifyResponse = await axios.post('/api/payment/verify-payment', {
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            amount,
                            videoId,
                            creatorId
                        });

                        if (verifyResponse.data.success) {
                            toast.success('Gift sent successfully!');
                            setShowOptions(false);
                            if (onSuccess) onSuccess();
                        } else {
                            toast.error('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment verification failed. Please contact support.');
                    } finally {
                        setLoading(false);
                        setSelectedAmount(null);
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#7b61ff',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setSelectedAmount(null);
                    }
                }
            };

            // Initialize Razorpay
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to process payment. Please try again.');
            setLoading(false);
            setSelectedAmount(null);
        }
    };

    // Mobile version (dropdown style gift options)
    if (isMobile) {
        return (
            <div className={cn("relative", className)}>
                <Button
                    onClick={() => setShowOptions(!showOptions)}
                    className={cn(
                        "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium",
                        showOptions && "bg-gradient-to-r from-purple-700 to-indigo-700"
                    )}
                >
                    <Gift className="w-4 h-4 mr-2" />
                    Gift
                </Button>

                {showOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700 overflow-hidden"
                    >
                        {giftOptions.map((option) => (
                            <motion.button
                                key={option.amount}
                                whileHover={{ backgroundColor: 'rgba(123, 97, 255, 0.2)' }}
                                onClick={() => handlePayment(option.amount)}
                                disabled={loading}
                                className={cn(
                                    "w-full px-4 py-3 text-left flex items-center justify-between transition-colors",
                                    selectedAmount === option.amount ? "bg-indigo-900/40" : ""
                                )}
                            >
                                <span className="font-medium text-white">{option.displayAmount}</span>
                                {loading && selectedAmount === option.amount ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                ) : selectedAmount === option.amount ? (
                                    <Check className="h-4 w-4 text-green-400" />
                                ) : null}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </div>
        );
    }

    // Desktop version (inline gift options)
    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {giftOptions.map((option) => (
                <Button
                    key={option.amount}
                    onClick={() => handlePayment(option.amount)}
                    disabled={loading}
                    className={cn(
                        "relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium min-w-20",
                        selectedAmount === option.amount && "ring-2 ring-white"
                    )}
                >
                    {loading && selectedAmount === option.amount ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Gift className="w-4 h-4 mr-2" />
                    )}
                    {option.displayAmount}

                    {/* Subtle pulsing effect for selected amount */}
                    {selectedAmount === option.amount && (
                        <motion.span
                            className="absolute inset-0 bg-white/20 rounded-md"
                            animate={{ opacity: [0, 0.2, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </Button>
            ))}
        </div>
    );
} 