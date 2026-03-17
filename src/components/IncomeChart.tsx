"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/lib/types";
import { getMonthlyIncome } from "@/lib/insights";
import { CATEGORIES } from "@/data/categories";
import { formatCurrency } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
}

export default function IncomeChart({ transactions }: Props) {
  const [months, setMonths] = useState(6);

  const monthlyData = useMemo(
    () => getMonthlyIncome(transactions, months),
    [transactions, months]
  );

  const incomeCategories = useMemo(() => {
    const catTotals: Record<string, number> = {};
    for (const m of monthlyData) {
      for (const [catId, val] of Object.entries(m.byCategory)) {
        catTotals[catId] = (catTotals[catId] || 0) + val;
      }
    }
    return Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([catId]) => CATEGORIES.find((c) => c.id === catId))
      .filter(Boolean);
  }, [monthlyData]);

  const barData = useMemo(() => {
    return monthlyData.map((m) => {
      const entry: Record<string, string | number> = { month: m.month, income: m.income };
      for (const cat of incomeCategories) {
        if (cat) {
          entry[cat.label] = m.byCategory[cat.id as keyof typeof m.byCategory] || 0;
        }
      }
      return entry;
    });
  }, [monthlyData, incomeCategories]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-emerald-500 tabular-nums">
            {formatCurrency(totalIncome)}
          </span>
          <span className="text-sm text-muted-foreground">
            total over {months} months
          </span>
        </div>
        <div className="flex gap-1">
          {[3, 6, 12].map((n) => (
            <button
              key={n}
              onClick={() => setMonths(n)}
              className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                months === n
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}M
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {incomeCategories.length > 0 ? (
              incomeCategories.map((cat) =>
                cat ? (
                  <Bar
                    key={cat.id}
                    dataKey={cat.label}
                    stackId="a"
                    fill={cat.color}
                    radius={[2, 2, 0, 0]}
                  />
                ) : null
              )
            ) : (
              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
