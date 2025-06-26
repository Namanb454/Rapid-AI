'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('failed');
      return;
    }

    async function fetchSession() {
      try {
        const response = await fetch(`/api/checkout-session?session_id=${sessionId}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const session = data.session;

        if (session.status === 'complete' && session.payment_status === 'paid') {
          if (!session.metadata || !session.metadata.userId || !session.metadata.credits) {
            console.error('Missing metadata in checkout session', session.metadata);
            setStatus('failed');
            return;
          }

          const userId = session.metadata.userId;
          const purchasedCredits = parseInt(session.metadata.credits, 10);

          // Check if this specific payment (session.id) has already been recorded in payment_history table
          const { data: existingCreditLog, error: fetchCreditLogError } = await supabase
            .from('payment_history')
            .select('id')
            .eq('stripe_payment_id', session.id)
            .maybeSingle();

          if (fetchCreditLogError) {
            throw fetchCreditLogError;
          }

          if (!existingCreditLog) {
            // Record the payment as a transaction log in the payment_history table
            const { error: insertCreditError } = await supabase
              .from('payment_history')
              .insert({
                user_id: userId,
                amount: purchasedCredits,
                stripe_payment_id: session.id,
              });

            if (insertCreditError) throw insertCreditError;

            // Update the total_credits in the profiles table
            const { data: profile, error: fetchProfileError } = await supabase
              .from('profiles')
              .select('total_credits')
              .eq('id', userId)
              .maybeSingle() as { data: { total_credits: number } | null; error: any };

            if (fetchProfileError) {
              throw fetchProfileError;
            }

            let newTotalCredits = purchasedCredits;
            if (profile) {
              newTotalCredits = profile.total_credits + purchasedCredits;
            }

            const { error: updateProfileError } = await supabase
              .from('profiles')
              .upsert({
                id: userId,
                total_credits: newTotalCredits,
              }, { onConflict: 'id' }) as { error: any };

            if (updateProfileError) throw updateProfileError;
          }

          setStatus('succeeded');
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error fetching checkout session:', error);
        setStatus('failed');
      }
    }

    fetchSession();
  }, [searchParams, router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        {status === 'loading' && (
          <div className="text-blue-600">Verifying your payment...</div>
        )}
        {status === 'succeeded' && (
          <div className="text-green-600">Payment successful! Redirecting to your dashboard...</div>
        )}
        {status === 'failed' && (
          <div className="text-red-600">Payment failed. Please try again or contact support.</div>
        )}
      </div>
    </div>
  );
} 