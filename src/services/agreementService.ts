import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface AgreementVehicle {
    id: number;
    plate: string;
    vehicle_type?: string;
    owner_name?: string;
}

export interface Agreement {
    id: number;
    name: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    parking_discount: number;
    washing_discount: number;
    is_active: boolean;
    vehicles: AgreementVehicle[];
}

export interface CreateAgreementRequest {
    name: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    parking_discount: number;
    washing_discount: number;
}

class AgreementService {
    async getAgreements(skip: number = 0, limit: number = 100): Promise<Agreement[]> {
        const response = await axios.get<Agreement[]>(`${API_URL}/agreements/`, {
            params: { skip, limit }
        });
        return response.data;
    }

    async createAgreement(agreement: CreateAgreementRequest): Promise<Agreement> {
        const response = await axios.post<Agreement>(`${API_URL}/agreements/`, agreement);
        return response.data;
    }

    async getAgreement(id: number): Promise<Agreement> {
        const response = await axios.get<Agreement>(`${API_URL}/agreements/${id}`);
        return response.data;
    }
}

export const agreementService = new AgreementService();
