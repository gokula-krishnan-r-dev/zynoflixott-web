/**
 * Check if user has an active subscription
 * @param subscription - User subscription object
 * @returns boolean indicating if subscription is active
 */
export function isSubscriptionActive(subscription?: {
  status?: string;
  endDate?: Date | string;
}): boolean {
  if (!subscription) {
    return false;
  }

  // Check if status is active
  if (subscription.status !== 'active') {
    return false;
  }

  // Check if subscription hasn't expired
  if (subscription.endDate) {
    const endDate = typeof subscription.endDate === 'string' 
      ? new Date(subscription.endDate) 
      : subscription.endDate;
    
    if (endDate < new Date()) {
      return false;
    }
  }

  return true;
}

/**
 * Get subscription status message
 * @param subscription - User subscription object
 * @returns Status message
 */
export function getSubscriptionStatus(subscription?: {
  status?: string;
  endDate?: Date | string;
}): {
  isActive: boolean;
  message: string;
  daysRemaining?: number;
} {
  if (!subscription) {
    return {
      isActive: false,
      message: 'No active subscription'
    };
  }

  if (subscription.status !== 'active') {
    return {
      isActive: false,
      message: 'Subscription is not active'
    };
  }

  if (subscription.endDate) {
    const endDate = typeof subscription.endDate === 'string' 
      ? new Date(subscription.endDate) 
      : subscription.endDate;
    
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        isActive: false,
        message: 'Subscription has expired'
      };
    }

    return {
      isActive: true,
      message: `Subscription active`,
      daysRemaining: diffDays
    };
  }

  return {
    isActive: true,
    message: 'Subscription active'
  };
}
