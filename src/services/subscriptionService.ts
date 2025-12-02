import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Subscription {
    id: number;
    vehicle_plate: string;
    start_date: string;
    end_date: string;
    price: number;
    is_active: boolean;
    vehicle?: {
        plate: string;
        vehicle_type: string;
        owner_name?: string;
        owner_phone?: string;
    };
}

export interface CreateSubscriptionRequest {
    plate: string;
    vehicle_type: string;
    owner_name: string;
    owner_phone: string;
    monthly_fee: number;
    start_date: string;
    duration_days?: number;
    notes?: string;
}

class SubscriptionService {
    async getSubscriptions(skip: number = 0, limit: number = 100): Promise<Subscription[]> {
        const response = await axios.get<Subscription[]>(`${API_URL}/subscriptions/`, {
            params: { skip, limit }
        });
        return response.data;
    }

    async createSubscription(subscription: CreateSubscriptionRequest): Promise<Subscription> {
        const response = await axios.post<Subscription>(`${API_URL}/subscriptions/`, subscription);
        return response.data;
    }

    async checkSubscription(plate: string): Promise<Subscription | null> {
        try {
            const response = await axios.get<Subscription>(`${API_URL}/subscriptions/check/${plate}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

export const subscriptionService = new SubscriptionService();
