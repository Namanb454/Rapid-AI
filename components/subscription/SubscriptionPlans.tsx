'use client';

import { useState, useEffect } from 'react';
import { SubscriptionPlan } from '@/types/subscription';
import { SubscriptionService } from '@/lib/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';

export function SubscriptionPlans() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const { toast } = useToast();
    const subscriptionService = new SubscriptionService();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const subscriptionPlans = await subscriptionService.getSubscriptionPlans();
            setPlans(subscriptionPlans);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load subscription plans',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId: string) => {
        if (!user) {
            toast({
                title: 'Error',
                description: 'Please sign in to subscribe',
                variant: 'destructive',
            });
            return;
        }

        try {
            await subscriptionService.createSubscription(user.id, planId);
            toast({
                title: 'Success',
                description: 'Subscription created successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create subscription',
                variant: 'destructive',
            });
        }
    };

    const monthlyPlans = plans.filter(plan => !plan.is_annual);
    const annualPlans = plans.filter(plan => plan.is_annual);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
            
            <Tabs defaultValue="monthly" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="annual">Annual</TabsTrigger>
                </TabsList>

                <TabsContent value="monthly">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {monthlyPlans.map((plan) => (
                            <Card key={plan.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-3xl font-bold mb-4">${plan.price}/mo</div>
                                    <ul className="space-y-2">
                                        <li>{plan.credits_per_month} credits per month</li>
                                        <li>{plan.duration_months} month duration</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        className="w-full"
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        Subscribe
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="annual">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {annualPlans.map((plan) => (
                            <Card key={plan.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-3xl font-bold mb-4">${plan.price}/year</div>
                                    <ul className="space-y-2">
                                        <li>{plan.credits_per_month} credits per month</li>
                                        <li>{plan.duration_months} months duration</li>
                                        <li className="text-green-600 font-semibold">Save 20% with annual billing</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        className="w-full"
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        Subscribe
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 