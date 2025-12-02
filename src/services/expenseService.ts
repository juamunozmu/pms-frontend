import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Expense {
    id: number;
    expense_type: string;
    amount: number;
    description?: string;
    expense_date: string;
    shift_id?: number;
    created_at: string;
    created_by: number;
}

export interface CreateExpenseRequest {
    expense_type: string;
    amount: number;
    description?: string;
    expense_date?: string;
    shift_id?: number;
}

class ExpenseService {
    async getExpenses(skip: number = 0, limit: number = 100): Promise<Expense[]> {
        const response = await axios.get<Expense[]>(`${API_URL}/expenses/`, {
            params: { skip, limit }
        });
        return response.data;
    }

    async createExpense(expense: CreateExpenseRequest): Promise<Expense> {
        const response = await axios.post<Expense>(`${API_URL}/expenses/`, expense);
        return response.data;
    }

    async deleteExpense(id: number): Promise<void> {
        await axios.delete(`${API_URL}/expenses/${id}`);
    }
}

export const expenseService = new ExpenseService();
