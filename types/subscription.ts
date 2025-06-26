export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    credits_per_month: number;
    duration_months: number;
    is_annual: boolean;
    stripe_price_id: string;
    stripe_product_id: string;
    created_at: string;
    updated_at: string;
}

export interface UserSubscription {
    id: string;
    user_id: string;
    plan_id: string;
    start_date: string;
    end_date: string;
    credits_remaining: number;
    status: 'active' | 'expired' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface CreditTransaction {
    id: string;
    user_id: string;
    subscription_id: string;
    amount: number;
    type: 'purchase' | 'usage' | 'refund';
    description: string;
    created_at: string;
}

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type CreditTransactionType = 'purchase' | 'usage' | 'refund'; 