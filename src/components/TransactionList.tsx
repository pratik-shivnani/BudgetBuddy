"use client";

import { useState } from "react";
import { Trash2, HelpCircle, Tag } from "lucide-react";
import { Transaction, CategoryId } from "@/lib/types";
import { getCategoryById } from "@/data/categories";
import { formatCurrency, formatDate } from "@/lib/utils";
import { deleteTransaction, updateTransaction } from "@/lib/storage";
import ExplainWhyModal from "./ExplainWhyModal";
import CategoryPicker from "./CategoryPicker";

interface Props {
  transactions: Transaction[];
  onTransactionsChanged: (transactions: Transaction[]) => void;
}

export default function TransactionList({ transactions, onTransactionsChanged }: Props) {
  const [explainTxn, setExplainTxn] = useState<Transaction | null>(null);
  const [recategorizeTxn, setRecategorizeTxn] = useState<Transaction | null>(null);

  const handleRecategorize = (categoryId: CategoryId) => {
    if (!recategorizeTxn) return;
    const catLabel = getCategoryById(categoryId).label;
    const updated = updateTransaction(recategorizeTxn.id, {
      category: categoryId,
      explanation: `Manually categorized as "${catLabel}" by user.`,
    });
    onTransactionsChanged(updated);
    setRecategorizeTxn(null);
  };

  const handleDelete = (id: string) => {
    const updated = deleteTransaction(id);
    onTransactionsChanged(updated);
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-2xl bg-muted/50 p-6">
          <span className="text-4xl">💸</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">No transactions yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start by typing a transaction in the input bar below. Try something like
          &ldquo;Spent $45 at Trader Joe&apos;s&rdquo;
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {transactions.map((txn) => {
          const cat = getCategoryById(txn.category);
          return (
            <div
              key={txn.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/30"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                style={{ backgroundColor: cat.color + "20", color: cat.color }}
              >
                {cat.label[0]}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{txn.rawText}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: cat.color + "15", color: cat.color }}
                  >
                    {cat.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(txn.date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    txn.type === "saving" ? "text-emerald-500" : ""
                  }`}
                >
                  {txn.type === "saving" ? "+" : "-"}
                  {formatCurrency(txn.amount)}
                </span>

                {txn.category === "uncategorized" && (
                  <button
                    onClick={() => setRecategorizeTxn(txn)}
                    className="ml-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    Assign Category
                  </button>
                )}

                <button
                  onClick={() => setRecategorizeTxn(txn)}
                  className="ml-1 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-primary group-hover:opacity-100"
                  title="Change category"
                >
                  <Tag className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setExplainTxn(txn)}
                  className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-primary group-hover:opacity-100"
                  title="Why this category?"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDelete(txn.id)}
                  className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {explainTxn && (
        <ExplainWhyModal
          transaction={explainTxn}
          onClose={() => setExplainTxn(null)}
          onRecategorize={() => {
            setRecategorizeTxn(explainTxn);
            setExplainTxn(null);
          }}
        />
      )}

      {recategorizeTxn && (
        <CategoryPicker
          currentCategory={recategorizeTxn.category}
          onSelect={handleRecategorize}
          onClose={() => setRecategorizeTxn(null)}
        />
      )}
    </>
  );
}
