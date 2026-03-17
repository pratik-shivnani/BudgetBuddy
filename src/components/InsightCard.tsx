"use client";

import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { Insight } from "@/lib/types";
import { getCategoryById } from "@/data/categories";

interface Props {
  insights: Insight[];
}

export default function InsightCard({ insights }: Props) {
  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Weekly Insight</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Add more transactions to unlock spending insights and trends.
        </p>
      </div>
    );
  }

  const primary = insights[0];

  return (
    <div className="space-y-3">
      {insights.slice(0, 3).map((insight) => {
        const cat = getCategoryById(insight.category);
        const Icon =
          insight.type === "increase"
            ? TrendingUp
            : insight.type === "decrease"
            ? TrendingDown
            : Info;
        const iconColor =
          insight.type === "increase"
            ? "text-red-500"
            : insight.type === "decrease"
            ? "text-emerald-500"
            : "text-primary";

        return (
          <div
            key={insight.id}
            className="rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/20"
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  insight.type === "increase"
                    ? "bg-red-500/10"
                    : insight.type === "decrease"
                    ? "bg-emerald-500/10"
                    : "bg-primary/10"
                }`}
              >
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-semibold">{insight.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
