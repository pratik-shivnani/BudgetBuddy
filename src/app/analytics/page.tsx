"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { loadTransactions, saveTransactions } from "@/lib/storage";
import { SAMPLE_TRANSACTIONS } from "@/data/sampleData";
import SpendingChart from "@/components/SpendingChart";
import IncomeChart from "@/components/IncomeChart";
import SavingsTrendChart from "@/components/SavingsTrendChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import TransactionInput from "@/components/TransactionInput";

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    let loaded = loadTransactions();
    if (loaded.length === 0) {
      saveTransactions(SAMPLE_TRANSACTIONS);
      loaded = SAMPLE_TRANSACTIONS;
    }
    setTransactions(loaded);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Visualize your spending trends and patterns
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Spending Over Time</h2>
        <SpendingChart transactions={transactions} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Income / Intake</h2>
        <IncomeChart transactions={transactions} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Savings Trend</h2>
        <SavingsTrendChart transactions={transactions} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdown transactions={transactions} />
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold">Quick Stats</h3>
          <div className="space-y-4">
            {(() => {
              const expenses = transactions.filter((t) => t.type === "expense");
              const savings = transactions.filter((t) => t.type === "saving");
              const avgExpense = expenses.length > 0
                ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length
                : 0;
              const totalSaved = savings.reduce((s, t) => s + t.amount, 0);
              const totalSpent = expenses.reduce((s, t) => s + t.amount, 0);

              return (
                <>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Total transactions</span>
                    <span className="font-semibold">{transactions.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Avg. expense</span>
                    <span className="font-semibold">${avgExpense.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Total spent (all time)</span>
                    <span className="font-semibold text-red-500">${totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Total saved (all time)</span>
                    <span className="font-semibold text-emerald-500">${totalSaved.toFixed(2)}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <TransactionInput onTransactionAdded={setTransactions} />
    </div>
  );
}
