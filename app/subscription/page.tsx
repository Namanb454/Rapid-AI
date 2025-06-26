import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';

export default function SubscriptionPage() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <SubscriptionStatus />
            <SubscriptionPlans />
        </div>
    );
} 