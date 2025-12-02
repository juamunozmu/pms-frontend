import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Shift {
    id: number;
    admin_id: number;
    start_time: string;
    end_time?: string;
    initial_cash: number;
    final_cash?: number;
    status: 'active' | 'closed';
}

export interface StartShiftRequest {
    initial_cash: number;
}

class ShiftService {
    async startShift(data: StartShiftRequest): Promise<Shift> {
        const response = await axios.post<Shift>(`${API_URL}/shifts/start`, data);
        return response.data;
    }

    async closeShift(): Promise<Shift> {
        const response = await axios.post<Shift>(`${API_URL}/shifts/close`);
        return response.data;
    }
}

export const shiftService = new ShiftService();
