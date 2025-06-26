'use client';

import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import PricingPlan from '@/components/PricingPlan';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Example from '@/components/Example';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { easeInOut, motion } from 'framer-motion';
import { FeatureData } from './data';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { createClient } from '@/utils/supabase/client';
import { SubscriptionService } from '@/lib/subscription';
import { SubscriptionPlan } from '@/types/subscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  const subscriptionService = new SubscriptionService();

  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
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

  const filteredPlans = subscriptionPlans.filter(plan => 
    billingCycle === 'monthly' ? !plan.is_annual : plan.is_annual
  );

  const handlePurchase = (plan: SubscriptionPlan) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedPlan(plan);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPlan || !user) return;

    setLoading(selectedPlan.name);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price * 100,
          planName: selectedPlan.name,
          credits: selectedPlan.credits_per_month,
          userId: user.id,
          priceId: selectedPlan.stripe_price_id,
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

  const containerVariants = {
    hidden: { y: 200, opacity: 0 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.3, // Delay between children
        duration: 0.6
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const featureVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between children
        duration: 0.1,
        ease: easeInOut,
      },
    },
  };

  const featureItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    transition: {
      ease: easeInOut, // apply to individual item animations too
      duration: 0.1,
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white bg-black">

        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          id="features" className="py-20 px-4 md:px-6 lg:px-8 overflow-hidden">

          <motion.div
            className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16">
              <motion.h2
                variants={itemVariants}
                className="max-w-xl rounded-3xl mx-auto text-3xl md:text-5xl font-extrabold mb-4 bggradient-to-r from-indigo-500  to-indigo-950">
                Powerful Features
              </motion.h2>

              <p className="text-xl text-neutral-300 mx-auto">
                Everything you need to create professional videos without design or video editing skills
              </p>
            </motion.div>

            <motion.div
              variants={featureVariants}
              initial="hidden"
              whileInView="show"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {FeatureData.map((item, index) => {
                return (
                  <motion.div
                    variants={featureItemVariants}
                    key={index}
                  >
                    <FeatureCard
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                    />
                  </motion.div>
                )
              })}

            </motion.div>
          </motion.div>
        </motion.section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Examples Section */}
        <Example />
        {/* Testimonials Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Hear from content creators who have transformed their video production with VideoGen
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="VideoGen has completely transformed my content creation workflow. What used to take days now takes minutes, and the quality is incredible!"
                author="Sarah Johnson"
                role="Content Creator"
                company="Tech Insights"
              />
              <TestimonialCard
                quote="As a marketing team of one, VideoGen has been a game-changer. I can now produce professional videos for our campaigns without hiring a production team."
                author="Michael Chen"
                role="Marketing Manager"
                company="StartupBoost"
              />
              <TestimonialCard
                quote="The editable narration feature is brilliant. I can maintain my brand voice while saving countless hours of production time."
                author="Jessica Williams"
                role="YouTube Creator"
                company="Learn With Jess"
              />
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Choose the plan that works best for your video creation needs
              </p>
            </div>

            <Tabs defaultValue="monthly" className="w-full" onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 rounded-full overflow-hidden">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual</TabsTrigger>
              </TabsList>

              <TabsContent value="monthly">
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredPlans.map((plan) => (
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
                      buttonText={loading === plan.name ? "Redirecting..." : "Get Started"}
                      disabled={loading !== null}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="annual">
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredPlans.map((plan) => (
                    <PricingPlan
                      key={plan.id}
                      title={plan.name}
                      price={plan.price.toString()}
                      description={plan.description}
                      features={[
                        `${plan.credits_per_month} video generations`,
                        plan.name === "Pro" ? "24/7 support" : "Priority support",
                        plan.name === "Pro" ? "Premium quality" : "High quality",
                        "Save 20% with annual billing"
                      ]}
                      popular={plan.name === "Pro"}
                      onSelectPlan={() => handlePurchase(plan)}
                      buttonText={loading === plan.name ? "Redirecting..." : "Get Started"}
                      disabled={loading !== null}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
      <Footer />
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              You are about to purchase {selectedPlan?.credits_per_month} credits for ${selectedPlan?.price}.
              You will be redirected to a secure payment page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPurchaseModal(false)}
              disabled={loading !== null}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPurchase}
              disabled={loading !== null}
            >
              {loading ? "Redirecting..." : "Proceed to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  );
}