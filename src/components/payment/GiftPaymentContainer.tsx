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
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setHasRazorpay(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async (amount: number) => {
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
                key: process.env.RAZORPAY_KEY_ID || 'rzp_test_sFWdQDykS3jwfU',
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
            <div className={cn("px-4 py-0", className)}>
                <AnimatePresence mode="wait">
                    {paymentComplete ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 flex flex-col items-center"
                        >
                            <div className="rounded-full bg-green-500/20 p-3 mb-3">
                                <HeartHandshake className="h-6 w-6 text-green-400" />
                            </div>
                            <h3 className="text-center text-lg font-medium text-white mb-1">Thank You!</h3>
                            <p className="text-center text-sm text-gray-300 mb-3">
                                Your gift has been sent to {creatorName}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="gift"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <GiftButtonGroup onClick={handlePayment}
                                videoId={videoId}
                                creatorId={creatorId}
                                // onSelect={setSelectedAmount}
                                selectedAmount={selectedAmount}
                                loading={loading}
                                variant="mobile"
                            />

                            {/* <Button
                                onClick={handlePayment}
                                disabled={loading || !selectedAmount || !hasRazorpay}
                                className="w-full max-w-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Gift className="h-4 w-4 mr-2" />
                                )}
                                {selectedAmount ? `Send $${selectedAmount} Gift` : 'Select Amount'}
                            </Button> */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Desktop version
    return (
        <div className={cn("mx-auto max-w-3xl", className)}>
            <AnimatePresence mode="wait">
                {paymentComplete ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 flex flex-col items-center"
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
                        className="bg-gradient-to-r from-[rgba(30,32,51,0.8)] to-[rgba(41,44,65,0.8)] rounded-xl p-6 border border-indigo-900/30"
                    >
                        <div className="text-center mb-6">
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

                        <div className="mt-6 flex justify-center">
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

                        <p className="text-xs text-center text-gray-500 mt-4">
                            Your support helps creators continue making great content
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 