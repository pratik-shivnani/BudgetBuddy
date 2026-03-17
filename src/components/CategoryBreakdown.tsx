"use client";

import { useMemo } from "react";
import { Transaction } from "@/lib/types";
import { CATEGORIES } from "@/data/categories";
import { formatCurrency } from "@/lib/utils";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface Props {
  transactions: Transaction[];
}

export default function CategoryBreakdown({ transactions }: Props) {
  const breakdown = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const expenses = transactions.filter(
      (t) =>
        t.type === "expense" &&
        isWithinInterval(new Date(t.date), { start, end })
    );

    const totals: Record<string, number> = {};
    let grandTotal = 0;
    for (const t of expenses) {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
      grandTotal += t.amount;
    }

    return Object.entries(totals)
      .map(([catId, total]) => {
        const cat = CATEGORIES.find((c) => c.id === catId);
        return {
          id: catId,
          label: cat?.label || catId,
          color: cat?.color || "#6b7280",
          total,
          percent: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  if (breakdown.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-center">
        <p className="text-sm text-muted-foreground">
          No spending data for this month yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold">This Month by Category</h3>
      <div className="space-y-3">
        {breakdown.map((item) => (
          <div key={item.id}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(item.total)}
                </span>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {item.percent.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
