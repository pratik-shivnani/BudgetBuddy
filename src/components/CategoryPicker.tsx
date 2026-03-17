"use client";

import { X } from "lucide-react";
import { CategoryId } from "@/lib/types";
import { CATEGORIES } from "@/data/categories";

interface Props {
  currentCategory: CategoryId;
  onSelect: (categoryId: CategoryId) => void;
  onClose: () => void;
}

export default function CategoryPicker({ currentCategory, onSelect, onClose }: Props) {
  const selectable = CATEGORIES.filter((c) => c.id !== "uncategorized");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Choose a category</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {selectable.map((cat) => {
            const isActive = cat.id === currentCategory;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                  style={{ backgroundColor: cat.color + "20", color: cat.color }}
                >
                  {cat.label[0]}
                </div>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
