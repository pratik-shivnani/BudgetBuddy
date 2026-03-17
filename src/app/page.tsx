"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import { Transaction } from "@/lib/types";
import { loadTransactions, saveTransactions } from "@/lib/storage";
import { generateInsights } from "@/lib/insights";
import { SAMPLE_TRANSACTIONS } from "@/data/sampleData";
import { formatCurrency } from "@/lib/utils";
import TransactionInput from "@/components/TransactionInput";
import TransactionList from "@/components/TransactionList";
import InsightCard from "@/components/InsightCard";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    let loaded = loadTransactions();
    if (loaded.length === 0) {
      saveTransactions(SAMPLE_TRANSACTIONS);
      loaded = SAMPLE_TRANSACTIONS;
    }
    setTransactions(loaded);
  }, []);

  const insights = useMemo(() => generateInsights(transactions), [transactions]);

  const stats = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const thisMonth = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start, end })
    );

    const totalSpent = thisMonth
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSaved = thisMonth
      .filter((t) => t.type === "saving")
      .reduce((sum, t) => sum + t.amount, 0);

    const txnCount = thisMonth.length;

    return { totalSpent, totalSaved, txnCount };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your spending overview for this month
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <DollarSign className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spent this month</p>
              <p className="text-xl font-bold tabular-nums">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <PiggyBank className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saved this month</p>
              <p className="text-xl font-bold tabular-nums">
                {formatCurrency(stats.totalSaved)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-bold tabular-nums">
                {stats.txnCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights + Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Actionable Insights</h2>
          <InsightCard insights={insights} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold">Spending Breakdown</h2>
          <CategoryBreakdown transactions={transactions} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Recent Transactions</h2>
        <TransactionList
          transactions={transactions.slice(0, 5)}
          onTransactionsChanged={setTransactions}
        />
      </div>

      <TransactionInput onTransactionAdded={setTransactions} />
    </div>
  );
}
