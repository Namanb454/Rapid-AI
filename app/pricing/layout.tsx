"use client"

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
} 