'use client'

import { useAuth } from "@/context/auth-context"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import PricingPlan from '@/components/PricingPlan';
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { SubscriptionService } from '@/lib/subscription';
import { SubscriptionPlan } from '@/types/subscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const subscriptionService = new SubscriptionService()

  const [loading, setLoading] = useState<string | null>(null)
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    loadSubscriptionPlans();
  }, []);

  const loadSubscriptionPlans = async () => {
    try {
      const plans = await subscriptionService.getSubscriptionPlans();
      setSubscriptionPlans(plans);
    } catch (error) {
      console.error('Failed to load subscription plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    }
  };

  const monthlyPlans = subscriptionPlans.filter(plan => !plan.is_annual);
  const annualPlans = subscriptionPlans.filter(plan => plan.is_annual);

  const handlePurchase = async (plan: SubscriptionPlan) => {
    if (!user) {
      router.push('/login')
      return
    }

    setLoading(plan.name)
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.price * 100,
          planName: plan.name,
          credits: plan.credits_per_month,
          userId: user.id,
          priceId: plan.stripe_price_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to redirect to payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center bg-black w-full min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Simple, Transparent Pricing</h1>
          <p className="text-xl text-neutral-300 max-w-2xl">Choose the plan that works best for your video creation needs</p>
        </div>

        <Tabs defaultValue="monthly" className="w-full max-w-7xl" onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 rounded-full overflow-hidden">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <div className="grid md:grid-cols-3 gap-8">
              {monthlyPlans.map((plan) => (
                <PricingPlan
                  key={plan.id}
                  title={plan.name}
                  price={plan.price.toString()}
                  description={plan.description}
                  features={[
                    `${plan.credits_per_month} video generations`,
                    plan.name === "Pro" ? "24/7 support" : "Priority support",
                    plan.name === "Pro" ? "Premium quality" : "High quality"
                  ]}
                  popular={plan.name === "Pro"}
                  onSelectPlan={() => handlePurchase(plan)}
                  buttonText={loading === plan.name ? "Redirecting..." : "Purchase"}
                  disabled={loading !== null}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="annual">
            <div className="grid md:grid-cols-3 gap-8">
              {annualPlans.map((plan) => (
                <PricingPlan
                  key={plan.id}
                  title={plan.name}
                  price={(plan.price / 12).toFixed(2)}
                  description={plan.description}
                  features={[
                    `${plan.credits_per_month} video generations`,
                    plan.name === "Pro" ? "24/7 support" : "Priority support",
                    plan.name === "Pro" ? "Premium quality" : "High quality",
                    "Save 20% with annual billing"
                  ]}
                  popular={plan.name === "Pro"}
                  onSelectPlan={() => handlePurchase(plan)}
                  buttonText={loading === plan.name ? "Redirecting..." : "Purchase"}
                  disabled={loading !== null}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  )
} 