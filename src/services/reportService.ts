import axios from 'axios';

import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ReportService {
    async exportParkingHistory(startDate: string, endDate: string, format: 'csv' | 'excel' | 'pdf'): Promise<void> {
        const token = authService.getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Create a dedicated instance to avoid global interceptors
        const client = axios.create({
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        try {
            const response = await client.get('/reports/export/parking-history', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    format: format
                },
                responseType: 'blob'
            });

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const extension = format === 'excel' ? 'xlsx' : format;
            link.setAttribute('download', `parking_history_${startDate}_${endDate}.${extension}`);

            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('ReportService: Export failed', error.response?.status, error.response?.data);
            throw error;
        }
    }
}

export const reportService = new ReportService();
