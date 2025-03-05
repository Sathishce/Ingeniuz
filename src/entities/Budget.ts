import { Transaction } from './Transaction';

export interface Budget {
    categoryId: string;
    categoryName: string;
    amountBudgeted: number;
    amountSpent: number;
    color: string;
    categoryType: string;
    transactions: Transaction[];
  }
