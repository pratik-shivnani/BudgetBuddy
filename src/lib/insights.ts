import { Transaction, Insight, CategoryId, MonthlySpending } from "./types";
import { getCategoryById } from "@/data/categories";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function getMonthlySpending(
  transactions: Transaction[],
  monthDate: Date
): MonthlySpending {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const month = format(monthDate, "yyyy-MM");

  const filtered = transactions.filter(
    (t) =>
      t.type === "expense" &&
      isWithinInterval(new Date(t.date), { start, end })
  );

  const byCategory: Record<string, number> = {};
  let total = 0;

  for (const t of filtered) {
    total += t.amount;
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  }

  return { month, total, byCategory: byCategory as Record<CategoryId, number> };
}

export function generateInsights(transactions: Transaction[]): Insight[] {
  const now = new Date();
  const currentMonth = getMonthlySpending(transactions, now);
  const lastMonth = getMonthlySpending(transactions, subMonths(now, 1));
  const insights: Insight[] = [];

  // Total spending MoM
  if (lastMonth.total > 0) {
    const change = ((currentMonth.total - lastMonth.total) / lastMonth.total) * 100;
    if (Math.abs(change) > 5) {
      insights.push({
        id: "total_mom",
        title: change > 0 ? "Spending is up" : "Spending is down",
        description: `Total spending ${change > 0 ? "rose" : "dropped"} ${Math.abs(change).toFixed(0)}% compared to last month ($${currentMonth.total.toFixed(0)} vs $${lastMonth.total.toFixed(0)}).`,
        changePercent: Math.round(change),
        category: "uncategorized",
        type: change > 0 ? "increase" : "decrease",
      });
    }
  }

  // Per-category MoM
  const allCategories = new Set([
    ...Object.keys(currentMonth.byCategory),
    ...Object.keys(lastMonth.byCategory),
  ]);

  for (const catId of allCategories) {
    if (catId === "uncategorized") continue;
    const curr = currentMonth.byCategory[catId as CategoryId] || 0;
    const prev = lastMonth.byCategory[catId as CategoryId] || 0;

    if (prev > 0) {
      const change = ((curr - prev) / prev) * 100;
      if (Math.abs(change) > 15) {
        const cat = getCategoryById(catId);
        insights.push({
          id: `cat_${catId}`,
          title: `${cat.label} spending ${change > 0 ? "rose" : "dropped"} ${Math.abs(change).toFixed(0)}%`,
          description: `${cat.label} went from $${prev.toFixed(0)} last month to $${curr.toFixed(0)} this month.`,
          changePercent: Math.round(change),
          category: catId as CategoryId,
          type: change > 0 ? "increase" : "decrease",
        });
      }
    } else if (curr > 50) {
      const cat = getCategoryById(catId);
      insights.push({
        id: `cat_new_${catId}`,
        title: `New ${cat.label} spending detected`,
        description: `You spent $${curr.toFixed(0)} on ${cat.label} this month with no spending last month.`,
        changePercent: 100,
        category: catId as CategoryId,
        type: "info",
      });
    }
  }

  // Top category
  const topCat = Object.entries(currentMonth.byCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];
  if (topCat && topCat[1] > 0) {
    const cat = getCategoryById(topCat[0]);
    const pct = ((topCat[1] / currentMonth.total) * 100).toFixed(0);
    insights.push({
      id: "top_category",
      title: `Top category: ${cat.label}`,
      description: `${cat.label} accounts for ${pct}% of your spending this month ($${topCat[1].toFixed(0)}).`,
      changePercent: 0,
      category: topCat[0] as CategoryId,
      type: "info",
    });
  }

  return insights;
}

export function getMonthlyTotals(
  transactions: Transaction[],
  monthCount: number = 6
): { month: string; total: number; byCategory: Record<string, number> }[] {
  const now = new Date();
  const results = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const spending = getMonthlySpending(transactions, date);
    results.push({
      month: format(date, "MMM yyyy"),
      total: spending.total,
      byCategory: spending.byCategory,
    });
  }

  return results;
}

export function getMonthlyIncome(
  transactions: Transaction[],
  monthCount: number = 6
): { month: string; income: number; byCategory: Record<string, number> }[] {
  const now = new Date();
  const results = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const filtered = transactions.filter(
      (t) =>
        t.type === "saving" &&
        isWithinInterval(new Date(t.date), { start, end })
    );

    const byCategory: Record<string, number> = {};
    let income = 0;
    for (const t of filtered) {
      income += t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }

    results.push({
      month: format(date, "MMM yyyy"),
      income,
      byCategory,
    });
  }

  return results;
}

export function getMonthlySavingsNet(
  transactions: Transaction[],
  monthCount: number = 6
): { month: string; income: number; spent: number; net: number }[] {
  const now = new Date();
  const results = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const monthTxns = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start, end })
    );

    const income = monthTxns
      .filter((t) => t.type === "saving")
      .reduce((s, t) => s + t.amount, 0);
    const spent = monthTxns
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    results.push({
      month: format(date, "MMM yyyy"),
      income,
      spent,
      net: income - spent,
    });
  }

  return results;
}
