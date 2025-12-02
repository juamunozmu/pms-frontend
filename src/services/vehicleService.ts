import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ActiveVehicle {
    id: number;
    vehicle_id: number;
    plate: string;
    vehicle_type: string;
    owner_name: string;
    owner_phone: string;
    brand?: string;
    model?: string;
    color?: string;
    entry_time: string;
    exit_time?: string;
    helmet_count: number;
    helmet_charge: number;
    total_cost?: number;
    payment_status?: string;
    notes?: string;
    duration_so_far?: string;
    duration_hours?: number;
}

export interface Vehicle {
    id: number;
    plate: string;
    vehicle_type: string;
    owner_name: string;
    owner_phone: string;
    brand: string;
    model: string;
    color: string;
    is_frequent: boolean;
    notes: string;
}

export interface EntryRequest {
    plate: string;
    vehicle_type: string;
    owner_name: string;
    owner_phone?: string;
    brand?: string;
    model?: string;
    color?: string;
    notes?: string;
    helmet_count?: number;
}

class VehicleService {
    async getActiveVehicles(): Promise<ActiveVehicle[]> {
        try {
            const response = await axios.get<{ message: string; count: number; records: ActiveVehicle[] }>(`${API_URL}/parking/active`);
            console.log('Active vehicles response:', response.data);
            return response.data.records || [];
        } catch (error) {
            console.error('Error fetching active vehicles:', error);
            return [];
        }
    }

    async getParkingRecords(statusFilter: 'all' | 'active' | 'completed' = 'all', limit: number = 50): Promise<ActiveVehicle[]> {
        try {
            const response = await axios.get<{ message: string; count: number; records: ActiveVehicle[] }>(
                `${API_URL}/parking/records`,
                { params: { status_filter: statusFilter, limit } }
            );
            return response.data.records || [];
        } catch (error) {
            console.error('Error fetching parking records:', error);
            return [];
        }
    }

    async getVehicleByPlate(plate: string): Promise<Vehicle | null> {
        try {
            const response = await axios.get<{ vehicle: Vehicle }>(`${API_URL}/parking/vehicle/${plate}`);
            return response.data.vehicle;
        } catch (error) {
            return null;
        }
    }

    async registerEntry(data: EntryRequest): Promise<any> {
        const response = await axios.post(`${API_URL}/parking/entry`, data);
        return response.data;
    }
}

export const vehicleService = new VehicleService();
