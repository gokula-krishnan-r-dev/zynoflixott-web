# Zynoflix Gift Payment Integration

This document explains how to set up and use the gift payment functionality in Zynoflix using Razorpay payment gateway.

## Overview

The gift payment feature allows users to send monetary gifts to content creators through the Razorpay payment gateway. There are three predefined gift amounts: $13, $118, and $295.

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Razorpay Account Setup

1. Create a Razorpay account at [https://razorpay.com/](https://razorpay.com/)
2. Complete the onboarding process and obtain your API keys
3. Enable international payments if you want to accept payments in USD
4. Configure webhooks for better payment tracking (optional)

## Technical Implementation

### Components

- `GiftButton.tsx`: Simple gift button component
- `GiftButtonGroup.tsx`: Group of gift options with selection UI
- `GiftPaymentContainer.tsx`: Container component with payment flow logic

### API Routes

- `/api/payment/create-order`: Creates a new Razorpay order
- `/api/payment/verify-payment`: Verifies payment and processes the gift

### Database Collections

The implementation uses the following MongoDB collections:

- `paymentOrders`: Stores all payment orders
- `videoGifts`: Records gifts made to creators
- `creatorEarnings`: Tracks creator earnings from gifts

## Usage

### Basic Implementation

```tsx
import GiftPaymentContainer from "@/components/payment/GiftPaymentContainer";

export default function VideoPage({ video }) {
  return (
    <div>
      {/* Your video player and other components */}
      
      <GiftPaymentContainer 
        videoId={video._id} 
        creatorId={video.created_by_id}
        creatorName={video.creator_name}
      />
    </div>
  );
}
```

### Mobile Implementation

```tsx
<GiftPaymentContainer 
  videoId={video._id} 
  creatorId={video.created_by_id}
  creatorName={video.creator_name}
  variant="mobile"
  className="mt-3"
/>
```

## Payment Flow

1. User selects a gift amount
2. Client-side code creates a Razorpay order via API
3. Razorpay payment modal opens
4. User completes payment
5. Server verifies the payment
6. Gift is recorded and creator's earnings are updated
7. Success message is displayed to user

## Testing

For testing, use Razorpay test mode and these test card details:

- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name
- 3D Secure: Success

## Customization

You can customize the gift amounts by modifying the `giftOptions` array in the components.

## Production Considerations

Before going to production:

1. Ensure proper error handling and logging
2. Implement additional security measures
3. Set up webhooks for payment status updates
4. Consider adding a refund policy
5. Switch to Razorpay production credentials 