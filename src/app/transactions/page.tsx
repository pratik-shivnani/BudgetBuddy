"use client";

import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import { Transaction, CategoryId } from "@/lib/types";
import { loadTransactions, saveTransactions } from "@/lib/storage";
import { SAMPLE_TRANSACTIONS } from "@/data/sampleData";
import { CATEGORIES } from "@/data/categories";
import TransactionInput from "@/components/TransactionInput";
import TransactionList from "@/components/TransactionList";
import { format, subMonths } from "date-fns";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");

  useEffect(() => {
    let loaded = loadTransactions();
    if (loaded.length === 0) {
      saveTransactions(SAMPLE_TRANSACTIONS);
      loaded = SAMPLE_TRANSACTIONS;
    }
    setTransactions(loaded);
  }, []);

  const monthOptions = useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = subMonths(now, i);
      months.push(format(d, "yyyy-MM"));
    }
    return months;
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterMonth !== "all") {
        const txnMonth = format(new Date(t.date), "yyyy-MM");
        if (txnMonth !== filterMonth) return false;
      }
      return true;
    });
  }, [transactions, filterCategory, filterType, filterMonth]);

  const totalFiltered = useMemo(() => {
    return filtered.reduce((sum, t) => {
      return t.type === "expense" ? sum - t.amount : sum + t.amount;
    }, 0);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          All your transactions in one place
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All months</option>
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {format(new Date(m + "-01"), "MMMM yyyy")}
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All categories</option>
          {CATEGORIES.filter((c) => c.id !== "uncategorized").map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All types</option>
          <option value="expense">Expenses</option>
          <option value="saving">Savings/Income</option>
        </select>

        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <TransactionList
        transactions={filtered}
        onTransactionsChanged={setTransactions}
      />

      <TransactionInput onTransactionAdded={setTransactions} />
    </div>
  );
}
