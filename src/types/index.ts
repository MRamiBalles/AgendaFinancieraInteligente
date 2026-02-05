export type Category = 'personal' | 'work' | 'finance' | 'travel' | 'other';
export type FinancialType = 'income' | 'expense' | 'none';

export interface PackingItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface Trip {
    id: string;
    title: string;
    startDate: string; // ISO string
    endDate: string; // ISO string
    budget: number;
    notes?: string;
    packingList: PackingItem[];
    color: string;
}

export interface FinancialEvent {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO string (YYYY-MM-DD)
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    category: Category;
    color: string;
    financials?: {
        type: FinancialType;
        amount: number;
    };
    remindMe: boolean;
    tripId?: string; // Optional link to a trip
    documentation?: string; // Notes/links for reservations
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
}
