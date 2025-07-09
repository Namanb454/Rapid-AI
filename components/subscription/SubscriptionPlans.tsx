'use client';

import { useState, useEffect } from 'react';
import { SubscriptionPlan } from '@/types/subscription';
import { SubscriptionService } from '@/lib/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Info, Bug } from 'lucide-react';

export function SubscriptionPlans() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSubscription, setCurrentSubscription] = useState<any>(null);
    const { user } = useAuth();
    const { toast } = useToast();
    const subscriptionService = new SubscriptionService();

    useEffect(() => {
        loadPlans();
    }, [user]);

    const loadPlans = async () => {
        try {
            const [subscriptionPlans, userSubscription] = await Promise.all([
                subscriptionService.getSubscriptionPlans(),
                user ? subscriptionService.getUserSubscription(user.id) : Promise.resolve(null)
            ]);
            setPlans(subscriptionPlans);
            setCurrentSubscription(userSubscription);
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
            
            // Reload subscription data after successful purchase
            await loadPlans();
            
            const actionText = currentSubscription ? 'upgraded' : 'created';
            toast({
                title: 'Success',
                description: `Subscription ${actionText} successfully${currentSubscription ? ' - your remaining credits have been carried over!' : ''}`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create subscription',
                variant: 'destructive',
            });
        }
    };

    const handleDebugSync = async () => {
        if (!user) return;
        
        try {
            const result = await subscriptionService.debugSyncCredits(user.id);
            console.log('Debug sync result:', result);
            toast({
                title: 'Debug Complete',
                description: 'Check console for debug information',
            });
        } catch (error) {
            console.error('Debug sync error:', error);
            toast({
                title: 'Debug Error',
                description: 'Check console for error details',
                variant: 'destructive',
            });
        }
    };

    const monthlyPlans = plans.filter(plan => !plan.is_annual);
    const annualPlans = plans.filter(plan => plan.is_annual);

    // Find the current plan details if the user has a subscription
    const currentPlan = currentSubscription && plans.length > 0
        ? plans.find(p => p.id === currentSubscription.plan_id)
        : null;
    const currentIsAnnual = currentPlan ? currentPlan.is_annual : false;

    return (
        <div className="space-y-6" id="plans">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Subscription Plans</h2>
                <p className="text-muted-foreground">Select the plan that best fits your needs. You can upgrade or change your plan at any time.</p>
            </div>
            
            {currentSubscription && (
                <Alert className="bg-blue-950 border-blue-800 text-blue-200">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        You have an active subscription with {currentSubscription.credits_remaining} credits remaining. 
                        When you purchase a new plan, your remaining credits will be added to your new subscription, 
                        and your new plan's duration will start from today.
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="flex justify-center">
                <Button 
                    variant="outline" 
                    onClick={handleDebugSync}
                    className="gap-2"
                >
                    <Bug className="h-4 w-4" />
                    Debug Sync Credits
                </Button>
            </div>
            
            <Tabs defaultValue="monthly" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="annual">Annual</TabsTrigger>
                </TabsList>

                <TabsContent value="monthly">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {monthlyPlans.map((plan) => {
                            // If user has annual plan, disable monthly plan purchase
                            const disableMonthly = currentIsAnnual;
                            return (
                                <Card key={plan.id} className="flex flex-col bg-neutral-950 border-none shadow-md shadow-neutral-300 text-white">
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
                                            disabled={disableMonthly}
                                            title={disableMonthly ? 'You cannot purchase a monthly plan while on an annual plan.' : ''}
                                        >
                                            {disableMonthly ? 'Not Available' : (currentSubscription ? 'Upgrade Plan' : 'Subscribe')}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="annual">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {annualPlans.map((plan) => (
                            <Card key={plan.id} className="flex flex-col bg-neutral-950 border-none shadow-md shadow-neutral-300 text-white">
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
                                        {currentSubscription ? 'Upgrade Plan' : 'Subscribe'}
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