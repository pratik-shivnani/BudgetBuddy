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
  LineChart,
  Line,
  Legend,
  ReferenceLine,
} from "recharts";
import { Transaction } from "@/lib/types";
import { getMonthlySavingsNet } from "@/lib/insights";
import { formatCurrency } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
}

type SavingsView = "net" | "comparison";

export default function SavingsTrendChart({ transactions }: Props) {
  const [view, setView] = useState<SavingsView>("net");
  const [months, setMonths] = useState(6);

  const data = useMemo(
    () => getMonthlySavingsNet(transactions, months),
    [transactions, months]
  );

  const currentMonth = data[data.length - 1];
  const prevMonth = data.length > 1 ? data[data.length - 2] : null;
  const netChange = prevMonth && prevMonth.net !== 0
    ? ((currentMonth.net - prevMonth.net) / Math.abs(prevMonth.net)) * 100
    : 0;

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
        {(["net", "comparison"] as SavingsView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              view === v
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {v === "net" ? "Net Savings" : "Income vs Spending"}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          {currentMonth && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold tabular-nums ${currentMonth.net >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {currentMonth.net >= 0 ? "+" : ""}{formatCurrency(currentMonth.net)}
              </span>
              <span className="text-xs text-muted-foreground">this month</span>
              {Math.abs(netChange) > 1 && (
                <span className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${
                  netChange > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {netChange > 0 ? "+" : ""}{netChange.toFixed(0)}%
                </span>
              )}
            </div>
          )}
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
      </div>

      <div className="h-72">
        {view === "net" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="net"
                name="Net Savings"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {view === "comparison" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Spending" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
