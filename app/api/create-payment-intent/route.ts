import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { SubscriptionService } from '@/lib/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: Request) {
  try {
    const { amount, planName, credits, userId, priceId } = await req.json();
    const supabase = await createClient();
    const subscriptionService = new SubscriptionService(supabase);

    // Check for active subscription
    const hasActive = await subscriptionService.hasActiveSubscription(userId);
    if (hasActive) {
      return NextResponse.json(
        { error: 'You already have an active subscription. Please wait until your current subscription expires before purchasing a new one.' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: userId,
        credits: credits,
        planName: planName,
        originalAmount: amount,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 