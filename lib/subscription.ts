import { createClient } from '@/utils/supabase/client';
import { SubscriptionPlan, UserSubscription, CreditTransaction } from '@/types/subscription';
import { SupabaseClient } from '@supabase/supabase-js';

export class SubscriptionService {
    private supabase: SupabaseClient;

    constructor(supabaseClient?: SupabaseClient) {
        this.supabase = supabaseClient || createClient();
    }

    async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        const { data, error } = await this.supabase
            .from('subscription_plans')
            .select('*')
            .order('price', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getUserSubscription(userId: string): Promise<UserSubscription | null> {
        const { data, error } = await this.supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows returned
            throw error;
        }
        return data;
    }

    async hasActiveSubscription(userId: string): Promise<boolean> {
        const { data, error } = await this.supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .gt('end_date', new Date().toISOString())
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    }

    async createSubscription(userId: string, planId: string): Promise<UserSubscription> {
        // Check for active subscription
        const hasActive = await this.hasActiveSubscription(userId);
        if (hasActive) {
            throw new Error('You already have an active subscription. Please wait until your current subscription expires before purchasing a new one.');
        }

        // Get plan details
        const { data: plan, error: planError } = await this.supabase
            .from('subscription_plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (planError) throw planError;

        // Calculate end date
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.duration_months);

        // Create subscription
        const { data, error } = await this.supabase
            .from('user_subscriptions')
            .insert({
                user_id: userId,
                plan_id: planId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                credits_remaining: plan.credits_per_month,
                status: 'active'
            })
            .select()
            .single();

        if (error) throw error;

        // Create credit transaction
        await this.createCreditTransaction({
            user_id: userId,
            subscription_id: data.id,
            amount: plan.credits_per_month,
            type: 'credit',
            description: `Initial credits from ${plan.name} subscription`
        });

        return data;
    }

    async useCredits(userId: string, amount: number, description: string): Promise<boolean> {
        const subscription = await this.getUserSubscription(userId);
        if (!subscription) throw new Error('No active subscription found');

        if (subscription.credits_remaining < amount) {
            throw new Error('Insufficient credits');
        }

        // Update subscription credits
        const { error: updateError } = await this.supabase
            .from('user_subscriptions')
            .update({
                credits_remaining: subscription.credits_remaining - amount
            })
            .eq('id', subscription.id);

        if (updateError) throw updateError;

        // Create credit transaction
        await this.createCreditTransaction({
            user_id: userId,
            subscription_id: subscription.id,
            amount: -amount,
            type: 'debit',
            description
        });

        return true;
    }

    async createCreditTransaction(transaction: Omit<CreditTransaction, 'id' | 'created_at'>): Promise<void> {
        const { error } = await this.supabase
            .from('credit_transactions')
            .insert(transaction);

        if (error) throw error;
    }

    async getCreditTransactions(userId: string): Promise<CreditTransaction[]> {
        const { data, error } = await this.supabase
            .from('credit_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
} 