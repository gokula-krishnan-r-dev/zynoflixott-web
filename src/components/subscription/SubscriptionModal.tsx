'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Play, Loader2, Shield, Zap, Video } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { authId, isLogin } from '@/lib/user';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  videoTitle?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  videoTitle
}) => {
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const router = useRouter();

  const subscriptionPrice = 500; // ₹500
  const subscriptionFeatures = [
    {
      icon: <Video className="w-5 h-5" />,
      text: 'Unlimited video streaming'
    },
    {
      icon: <Crown className="w-5 h-5" />,
      text: 'Access to premium content'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: 'Ad-free viewing experience'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: 'HD quality streaming'
    },
    {
      icon: <Play className="w-5 h-5" />,
      text: 'Watch anytime, anywhere'
    }
  ];

  // Load Razorpay script
  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      // Script exists, wait for it to load
      if ((existingScript as HTMLScriptElement).onload) {
        setRazorpayLoaded(true);
      } else {
        (existingScript as HTMLScriptElement).onload = () => {
          setRazorpayLoaded(true);
        };
      }
      return;
    }

    // Only create script if modal is open and Razorpay not loaded
    if (isOpen && !razorpayLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        toast.error('Failed to load payment gateway. Please refresh the page.');
      };
      
      // Add script to body
      if (document.body) {
        document.body.appendChild(script);
      } else {
        // Wait for body to be available
        document.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(script);
        });
      }

      // No cleanup needed - keep script loaded for future use
      return;
    }
  }, [isOpen, razorpayLoaded]);

  const handleSubscribe = async () => {
    // Check if user is logged in
    if (!isLogin || !authId) {
      toast.warning('Please login to subscribe');
      router.push('/login');
      return;
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      toast.error('Payment gateway is loading. Please wait...');
      return;
    }

    try {
      setLoading(true);

      // Create subscription order
      const response = await axios.post('/api/subscription/create-order', {
        amount: subscriptionPrice,
        currency: 'INR'
      }, {
        headers: {
          userId: authId
        }
      });

      if (!response.data.success || !response.data.order) {
        throw new Error('Failed to create subscription order');
      }

      const { order } = response.data;

      // Configure Razorpay options
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_HJG5Rtuy8Xh2NB';
      const options = {
        key: razorpayKey,
        amount: subscriptionPrice * 100, // Convert to paise
        currency: 'INR',
        name: 'ZynoflixOTT',
        description: 'Premium Subscription - Unlimited Video Access',
        order_id: order.id,
        handler: async function (paymentResponse: any) {
          try {
            setLoading(true);

            // Verify payment
            const verifyResponse = await axios.post('/api/subscription/verify-payment', {
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              amount: subscriptionPrice
            }, {
              headers: {
                userId: authId
              }
            });

            if (verifyResponse.data.success) {
              toast.success('Subscription activated successfully! 🎉');
              onSuccess?.();
              onClose();
              // Refresh the page to update subscription status
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.error || 'Payment verification failed. Please contact support.');
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
          color: '#7c3aed'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.response?.data?.error || 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal - Compact Design */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-xl shadow-2xl border border-purple-500/20 pointer-events-auto overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>

              {/* Content */}
              <div className="p-6">
                {/* Header - Compact */}
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 mb-3">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Unlock Premium
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {videoTitle ? `Watch "${videoTitle.length > 30 ? videoTitle.substring(0, 30) + '...' : videoTitle}"` : 'Get unlimited access'}
                  </p>
                </div>

                {/* Pricing - Compact */}
                <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg p-4 mb-5 border border-purple-500/30">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl font-bold text-white">₹{subscriptionPrice}</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  <p className="text-center text-gray-400 text-xs mt-1">
                    Cancel anytime
                  </p>
                </div>

                {/* Features - Compact Grid */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {subscriptionFeatures.slice(0, 4).map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
                        {React.cloneElement(feature.icon, { className: "w-3.5 h-3.5" })}
                      </div>
                      <span className="text-gray-200 text-xs">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Subscribe Button - Compact */}
                <button
                  onClick={handleSubscribe}
                  disabled={loading || !razorpayLoaded}
                  className={cn(
                    "w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200",
                    "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
                    "text-white shadow-lg shadow-purple-500/50",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>Subscribe - ₹{subscriptionPrice}</span>
                    </>
                  )}
                </button>

                {/* Trust Badge - Compact */}
                <p className="text-center text-gray-500 text-xs mt-3">
                  🔒 Secure payment by Razorpay
                </p>
              </div>

              {/* Decorative Elements - Smaller */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
