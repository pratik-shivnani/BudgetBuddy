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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Transaction } from "@/lib/types";
import { getMonthlyTotals } from "@/lib/insights";
import { CATEGORIES } from "@/data/categories";
import { formatCurrency } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
}

type ChartView = "bar" | "pie" | "trend";

export default function SpendingChart({ transactions }: Props) {
  const [view, setView] = useState<ChartView>("bar");
  const [months, setMonths] = useState(6);

  const monthlyData = useMemo(
    () => getMonthlyTotals(transactions, months),
    [transactions, months]
  );

  const currentMonthData = useMemo(() => {
    const current = monthlyData[monthlyData.length - 1];
    if (!current) return [];
    return Object.entries(current.byCategory)
      .filter(([, val]) => val > 0)
      .map(([catId, val]) => {
        const cat = CATEGORIES.find((c) => c.id === catId);
        return {
          name: cat?.label || catId,
          value: val,
          color: cat?.color || "#6b7280",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthlyData]);

  const topCategories = useMemo(() => {
    const catTotals: Record<string, number> = {};
    for (const m of monthlyData) {
      for (const [catId, val] of Object.entries(m.byCategory)) {
        catTotals[catId] = (catTotals[catId] || 0) + val;
      }
    }
    return Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([catId]) => CATEGORIES.find((c) => c.id === catId))
      .filter(Boolean);
  }, [monthlyData]);

  const barData = useMemo(() => {
    return monthlyData.map((m) => {
      const entry: Record<string, string | number> = { month: m.month };
      for (const cat of topCategories) {
        if (cat) {
          entry[cat.label] = m.byCategory[cat.id as keyof typeof m.byCategory] || 0;
        }
      }
      return entry;
    });
  }, [monthlyData, topCategories]);

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

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["bar", "pie", "trend"] as ChartView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              view === v
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {v === "bar" ? "By Category" : v === "pie" ? "Breakdown" : "Trend"}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
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
        {view === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {topCategories.map((cat) =>
                cat ? (
                  <Bar
                    key={cat.id}
                    dataKey={cat.label}
                    stackId="a"
                    fill={cat.color}
                    radius={[2, 2, 0, 0]}
                  />
                ) : null
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {view === "pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentMonthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {currentMonthData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {view === "trend" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Spending"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
