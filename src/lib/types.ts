export type TransactionType = "expense" | "saving";

export type CategoryId =
  | "groceries"
  | "travel"
  | "subscriptions"
  | "food"
  | "credit_cards"
  | "entertainment"
  | "utilities"
  | "shopping"
  | "income"
  | "savings"
  | "uncategorized";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  icon: string;
  keywords: string[];
  merchants: string[];
}

export interface Transaction {
  id: string;
  rawText: string;
  amount: number;
  type: TransactionType;
  category: CategoryId;
  date: string; // ISO date string
  explanation: string;
  createdAt: string;
}

export interface ParsedInput {
  amount: number | null;
  merchant: string | null;
  date: Date;
  type: TransactionType;
  rawText: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  changePercent: number;
  category: CategoryId;
  type: "increase" | "decrease" | "info";
}

export interface MonthlySpending {
  month: string; // "YYYY-MM"
  total: number;
  byCategory: Record<CategoryId, number>;
}
