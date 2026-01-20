"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Loader2, HeartHandshake, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import GiftButtonGroup from './GiftButtonGroup';
import { Button } from '@/components/ui/button';
import { authId, isLogin } from '@/lib/user';

type GiftPaymentContainerProps = {
    videoId: string;
    creatorId: string;
    creatorName?: string;
    className?: string;
    variant?: 'mobile' | 'desktop';
};

export default function GiftPaymentContainer({
    videoId,
    creatorId,
    creatorName = 'Creator',
    className,
    variant = 'desktop'
}: GiftPaymentContainerProps) {
    const router = useRouter();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [hasRazorpay, setHasRazorpay] = useState(false);
    const isMobile = variant === 'mobile';

    // Load Razorpay script
    useEffect(() => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
            setHasRazorpay(true);
            return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
            // Script exists, wait for it to load
            if ((existingScript as HTMLScriptElement).onload) {
                setHasRazorpay(true);
            } else {
                (existingScript as HTMLScriptElement).onload = () => {
                    setHasRazorpay(true);
                };
            }
            return;
        }

        // Create script only if it doesn't exist
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setHasRazorpay(true);
        script.onerror = () => {
            console.error('Failed to load Razorpay script');
        };
        
        // Add script to body safely
        if (document.body) {
            document.body.appendChild(script);
        } else {
            // Wait for body to be available
            document.addEventListener('DOMContentLoaded', () => {
                if (document.body) {
                    document.body.appendChild(script);
                }
            });
        }

        // No cleanup needed - keep script loaded for future use
    }, []);

    const handlePayment = async (amount: number) => {

        // Check if iOS device
        const isIOS = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) || /iPhone|iPad|iPod|Mac/.test(navigator.platform);
        if (isIOS) {
            toast.info('iOS payments are not supported yet. Coming soon!');
            return;
        }
        if (!amount) {
            toast.info('Please select a gift amount');
            return;
        }

        if (!videoId || !creatorId) {
            toast.error('Missing video or creator information');
            return;
        }

        // Check if user is logged in
        if (!isLogin) {
            console.log('isLogin', isLogin);
            toast.warning('Please login to send a gift');
            router.push('/login');
            return;
        }

        try {
            setLoading(true);

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
                key: process.env.RAZORPAY_KEY_ID || 'rzp_test_HJG5Rtuy8Xh2NB',
                amount: amount * 100, // Convert to smallest currency unit (cents)
                currency: 'USD',
                name: 'Zynoflix',
                description: `Gift for ${creatorName}`,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // Verify payment on server
                        const verifyResponse = await axios.post('/api/payment/verify-payment', {
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            amount: selectedAmount,
                            videoId,
                            creatorId
                        }, {
                            headers: {
                                userId: authId || ''
                            }
                        });

                        if (verifyResponse.data.success) {
                            setPaymentComplete(true);
                            toast.success('Gift sent successfully!');

                            // Reset after delay
                            setTimeout(() => {
                                setSelectedAmount(null);
                                setPaymentComplete(false);
                            }, 5000);
                        } else {
                            toast.error('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment verification failed. Please contact support.');
                    } finally {
                        setLoading(false);
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
        }
    };

    if (isMobile) {
        return (
            <div className={cn("w-full", className)}>
                <AnimatePresence mode="wait">
                    {paymentComplete ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg p-2.5 flex flex-col items-center"
                        >
                            <div className="rounded-full bg-green-500/20 p-2 mb-2">
                                <HeartHandshake className="h-4 w-4 text-green-400" />
                            </div>
                            <h3 className="text-center text-xs font-semibold text-white mb-0.5">Thank You!</h3>
                            <p className="text-center text-[10px] text-gray-300 leading-tight">
                                Gift sent to {creatorName?.length > 15 ? creatorName.substring(0, 15) + '...' : creatorName}
                            </p>
                        </motion.div>
                    ) : (
                        <div
                            key="gift"
                            className="w-full"
                        >
                            <GiftButtonGroup 
                                onClick={handlePayment}
                                videoId={videoId}
                                creatorId={creatorId}
                                selectedAmount={selectedAmount}
                                loading={loading}
                                variant="mobile"
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Desktop version
    return (
        <div className={cn("mx-auto lg:max-w-3xl max-w-full bg-purple-900 px-0 py-1 rounded-full", className)}>
            <AnimatePresence mode="wait">
                {paymentComplete ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl lg:p-6 p-1 flex flex-col items-center"
                    >
                        <div className="rounded-full bg-green-500/20 p-4 mb-4">
                            <HeartHandshake className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-center text-xl font-medium text-white mb-2">Thank You for Your Support!</h3>
                        <p className="text-center text-gray-300 mb-4">
                            Your gift of ${selectedAmount} has been sent to {creatorName}
                        </p>
                        <Button
                            variant="outline"
                            className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                            View Your Gifts <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="gift"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-r  from-[rgba(30,32,51,0.8)] to-[rgba(41,44,65,0.8)] rounded-xl lg:p-6 p-1 border border-indigo-900/30"
                    >
                        <div className="text-center lg:mb-6 mb-1">
                            <h3 className="text-xl font-medium text-white">Support {creatorName} with a Gift</h3>
                            <p className="text-sm text-gray-400 mt-1">Choose an amount to send as a gift</p>
                        </div>

                        <GiftButtonGroup
                            onClick={handlePayment}
                            videoId={videoId}
                            creatorId={creatorId}
                            // onSelect={setSelectedAmount}
                            selectedAmount={selectedAmount}
                            loading={loading}
                        />

                        <div className="lg:mt-6 mt-1 flex justify-center">
                            <Button
                                onClick={() => handlePayment(selectedAmount || 0)}
                                disabled={loading || !selectedAmount || !hasRazorpay}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-2 h-12 text-base"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <Gift className="h-5 w-5 mr-2" />
                                )}
                                {selectedAmount ? `Send $${selectedAmount} Gift` : 'Select Amount'}
                            </Button>
                        </div>

                        <p className="text-xs text-center text-gray-500 lg:mt-4 mt-1">
                            Your support helps creators continue making great content
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 