'use client';

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Crown, Calendar, XCircle, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { authId, isLogin, userId } from '@/lib/user';
import { useRouter } from 'next/navigation';
import { getSubscriptionStatus } from '@/lib/subscription';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  user?: any; // Optional - will fetch from API if not provided
  onUpdate?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch subscription status from API (primary source)
  const { 
    data: subscriptionData, 
    isLoading: subscriptionLoading,
    refetch: refetchSubscription 
  } = useQuery(
    ['subscription-status', userId],
    async () => {
      if (!userId) return null;
      const response = await axios.get('https://zynoflixott.com/api/subscription/check', {
        headers: {
          userId: userId
        }
      });
      return response.data;
    },
    {
      enabled: !!userId,
      refetchOnWindowFocus: true,
      staleTime: 0,
      retry: 2
    }
  );

  // Use API data if available, otherwise fallback to user prop
  const subscription = subscriptionData?.subscription || user?.subscription;
  const hasActiveSubscription = subscriptionData?.hasSubscription || false;
  const subscriptionStatus = getSubscriptionStatus(subscription);

  const handleCancelSubscription = async () => {
    if (!isLogin || !authId) {
      toast.warning('Please login to manage subscription');
      router.push('/login');
      return;
    }

    // Confirm cancellation
    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? You will lose access to premium content immediately.'
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        'https://zynoflixott.com/api/subscription/cancel',
        {},
        {
          headers: {
            userId: authId
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (response.data.success) {
        toast.success('Subscription canceled successfully. Access to premium content has been revoked.');
        
        // Clear any subscription flags
        localStorage.removeItem('subscriptionActive');
        localStorage.removeItem('subscriptionActivatedAt');
        
        // Refetch subscription status
        await refetchSubscription();
        
        // Call update callback
        onUpdate?.();
        
        // Refresh page after a moment to update UI
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(response.data.error || 'Failed to cancel subscription');
      }
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to cancel subscription';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (subscriptionLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 shadow-xl border border-gray-700/50"
      >
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          <span className="text-gray-400">Loading subscription status...</span>
        </div>
      </motion.div>
    );
  }

  // No active subscription
  if (!hasActiveSubscription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 shadow-xl border border-gray-700/50"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
            <Crown className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">No Active Subscription</h3>
            <p className="text-sm text-gray-400">Subscribe to unlock premium features</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/video/697c890f006a91300abc58c8')}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all"
        >
          View Subscription Plans
        </button>
      </motion.div>
    );
  }

  // Get subscription details from API data or user prop
  const endDate = subscription?.endDate 
    ? new Date(subscription.endDate) 
    : null;
  const startDate = subscription?.startDate 
    ? new Date(subscription.startDate) 
    : null;
  const daysRemaining = endDate 
    ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 shadow-xl border border-purple-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Premium Subscription</h3>
            <p className="text-sm text-gray-400 capitalize">{subscription?.plan || 'premium'} plan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetchSubscription()}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
            title="Refresh subscription status"
          >
            <RefreshCw className={cn(
              "w-4 h-4 text-gray-400",
              subscriptionLoading && "animate-spin"
            )} />
          </button>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            subscriptionStatus.isActive 
              ? "bg-green-500/20 text-green-400" 
              : "bg-gray-700/50 text-gray-400"
          )}>
            {subscriptionStatus.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="space-y-3 mb-4">
        {subscription?.startMonth && subscription?.startTime && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">
              Started: {subscription.startMonth} {startDate?.getDate()}, {startDate?.getFullYear()} at {subscription.startTime}
            </span>
          </div>
        )}
        
        {endDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">
              {subscriptionStatus.isActive 
                ? `Expires in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`
                : 'Subscription expired'
              }
            </span>
          </div>
        )}
        
        {endDate && (
          <div className="text-xs text-gray-400">
            End date: {endDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        )}

        {subscription?.amount && (
          <div className="text-xs text-gray-400">
            Amount paid: ₹{subscription.amount}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </motion.div>
      )}

      {/* Cancel Button */}
      <button
        onClick={handleCancelSubscription}
        disabled={loading || !subscriptionStatus.isActive}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200",
          "bg-red-600/20 hover:bg-red-600/30 border border-red-500/30",
          "text-red-400 hover:text-red-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Canceling...</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            <span>Cancel Subscription</span>
          </>
        )}
      </button>

      {/* Info Message */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Canceling will immediately revoke access to premium content
      </p>
    </motion.div>
  );
};

export default SubscriptionCard;
