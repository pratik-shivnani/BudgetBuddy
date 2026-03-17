import { Transaction } from "./types";

const STORAGE_KEY = "budgetbuddy_transactions";

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Transaction): Transaction[] {
  const transactions = loadTransactions();
  transactions.unshift(transaction);
  saveTransactions(transactions);
  return transactions;
}

export function deleteTransaction(id: string): Transaction[] {
  const transactions = loadTransactions().filter((t) => t.id !== id);
  saveTransactions(transactions);
  return transactions;
}

export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction[] {
  const transactions = loadTransactions().map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  saveTransactions(transactions);
  return transactions;
}

export function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
