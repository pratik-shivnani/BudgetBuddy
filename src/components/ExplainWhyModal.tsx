"use client";

import { X, Brain, Tag } from "lucide-react";
import { Transaction } from "@/lib/types";
import { getCategoryById } from "@/data/categories";
import { formatCurrency } from "@/lib/utils";

interface Props {
  transaction: Transaction;
  onClose: () => void;
  onRecategorize?: () => void;
}

export default function ExplainWhyModal({ transaction, onClose, onRecategorize }: Props) {
  const category = getCategoryById(transaction.category);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Why this category?</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground mb-1">Original input</p>
          <p className="text-sm font-medium">&ldquo;{transaction.rawText}&rdquo;</p>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: category.color + "20", color: category.color }}
          >
            <span className="text-lg font-bold">{category.label[0]}</span>
          </div>
          <div>
            <p className="font-medium">{category.label}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(transaction.amount)} · {transaction.type}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-sm font-medium mb-2 text-primary">Reasoning</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {transaction.explanation}
          </p>
        </div>

        {onRecategorize && (
          <button
            onClick={onRecategorize}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Tag className="h-4 w-4" />
            Change Category
          </button>
        )}
      </div>
    </div>
  );
}
