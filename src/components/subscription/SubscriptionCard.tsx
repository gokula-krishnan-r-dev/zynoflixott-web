'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Calendar, XCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { authId, isLogin } from '@/lib/user';
import { useRouter } from 'next/navigation';
import { isSubscriptionActive, getSubscriptionStatus } from '@/lib/subscription';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  user: any;
  onUpdate?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const subscriptionStatus = getSubscriptionStatus(user?.subscription);
  const hasActiveSubscription = isSubscriptionActive(user?.subscription) || user?.isPremium;

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
          }
        }
      );

      if (response.data.success) {
        toast.success('Subscription canceled successfully. Access to premium content has been revoked.');
        onUpdate?.();
        
        // Clear any subscription flags
        localStorage.removeItem('subscriptionActive');
        localStorage.removeItem('subscriptionActivatedAt');
        
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
          onClick={() => router.push('/')}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all"
        >
          View Subscription Plans
        </button>
      </motion.div>
    );
  }

  const endDate = user?.subscription?.endDate 
    ? new Date(user.subscription.endDate) 
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
            <p className="text-sm text-gray-400 capitalize">{user?.subscription?.plan || 'premium'} plan</p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-semibold",
          subscriptionStatus.isActive 
            ? "bg-green-500/20 text-green-400" 
            : "bg-gray-700/50 text-gray-400"
        )}>
          {subscriptionStatus.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Subscription Details */}
      <div className="space-y-3 mb-4">
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
