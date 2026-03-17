"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { parseNaturalInput } from "@/lib/parser";
import { categorize } from "@/lib/categorizer";
import { addTransaction, generateId } from "@/lib/storage";
import { Transaction } from "@/lib/types";

const PLACEHOLDERS = [
  "Spent $45 at Trader Joe's yesterday...",
  "Netflix subscription $15.99...",
  "Lunch at Chipotle $12...",
  "Saved $200 to emergency fund...",
  "Uber ride to airport $35...",
  "Received salary $3500...",
  "Coffee at Starbucks $6.50...",
];

interface Props {
  onTransactionAdded: (transactions: Transaction[]) => void;
}

export default function TransactionInput({ onTransactionAdded }: Props) {
  const [text, setText] = useState("");
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(
        PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const parsed = parseNaturalInput(text.trim());
    const { category, explanation } = categorize(parsed);

    const transaction: Transaction = {
      id: generateId(),
      rawText: text.trim(),
      amount: parsed.amount || 0,
      type: parsed.type,
      category,
      date: parsed.date.toISOString(),
      explanation,
      createdAt: new Date().toISOString(),
    };

    const updated = addTransaction(transaction);
    onTransactionAdded(updated);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Type a transaction naturally — amount, merchant, and date are auto-detected
        </p>
      </form>
    </div>
  );
}
