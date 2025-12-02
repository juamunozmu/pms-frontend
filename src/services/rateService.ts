import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Rate {
    id: number;
    vehicle_type: string;
    rate_type: string;
    price: number;
    description?: string;
    is_active: boolean;
}

export interface CreateRateRequest {
    vehicle_type: string;
    rate_type: string;
    price: number;
    description?: string;
    is_active: boolean;
}

class RateService {
    async getRates(): Promise<Rate[]> {
        const response = await axios.get<Rate[]>(`${API_URL}/parking/rates`);
        return response.data;
    }

    async createRate(rate: CreateRateRequest): Promise<Rate> {
        const response = await axios.post<Rate>(`${API_URL}/parking/rates`, rate);
        return response.data;
    }

    async updateRate(id: number, rate: CreateRateRequest): Promise<Rate> {
        const response = await axios.put<Rate>(`${API_URL}/parking/rates/${id}`, rate);
        return response.data;
    }

    async deleteRate(id: number): Promise<void> {
        await axios.delete(`${API_URL}/parking/rates/${id}`);
    }
}

export const rateService = new RateService();
