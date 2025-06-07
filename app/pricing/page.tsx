'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import PricingPlan from '@/components/PricingPlan';
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const pricingPlans = [
  {
    name: "Basic",
    price: 10,
    credits: 5,
    description: "Perfect for trying out our service",
    features: [
      "5 video generations",
      "Basic support",
      "Standard quality"
    ],
    price_id: "price_1RVxxGRpIUfdSJVVD421AGmz",
    product_id: "prod_SQpcTE1mmhzHJ3"
  },
  {
    name: "Standard",
    price: 20,
    credits: 10,
    description: "Ideal for growing businesses and content teams",
    features: [
      "10 video generations",
      "Priority support",
      "High quality"
    ],
    popular: true,
    price_id: "price_1RVyKPRpIUfdSJVVaPuAZume",
    product_id: "prod_SQq0Ni2aPutK38"
  },
  {
    name: "Pro",
    price: 30,
    credits: 15,
    description: "For professional content creators",
    features: [
      "15 video generations",
      "24/7 support",
      "Premium quality"
    ],
    price_id: "price_1RVyKdRpIUfdSJVV88LujbZ4",
    product_id: "prod_SQq0SGohju9Iu6"
  }
];

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (plan: typeof pricingPlans[0]) => {
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
          credits: plan.credits,
          userId: user.id,
          priceId: plan.price_id,
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

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingPlan
              key={plan.name}
              title={plan.name}
              price={plan.price.toString()}
              description={plan.description}
              features={plan.features}
              popular={plan.popular || false}
              onSelectPlan={() => handlePurchase(plan)}
              buttonText={loading === plan.name ? "Redirecting..." : "Purchase"}
              disabled={loading !== null}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
} 