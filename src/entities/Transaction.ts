import { Category } from './Category';

export interface Transaction {
    id: string;
    amount: number;
    date: string;
    merchant: string;
    category?: Category;
  }
