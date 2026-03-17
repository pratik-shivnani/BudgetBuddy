import { CategoryId, ParsedInput } from "./types";
import { CATEGORIES } from "@/data/categories";

interface CategorizationResult {
  category: CategoryId;
  explanation: string;
}

export function categorize(input: ParsedInput): CategorizationResult {
  const text = input.rawText.toLowerCase();
  const merchant = input.merchant?.toLowerCase() || "";
  const reasons: string[] = [];

  // 1. Check merchant matches first (highest confidence)
  for (const cat of CATEGORIES) {
    if (cat.id === "uncategorized") continue;
    for (const m of cat.merchants) {
      if (merchant.includes(m) || text.includes(m)) {
        reasons.push(
          `Merchant "${input.merchant || m}" matches known ${cat.label} vendor "${m}".`
        );
        return {
          category: cat.id,
          explanation: buildExplanation(reasons, cat.label, input),
        };
      }
    }
  }

  // 2. Keyword matching with scoring
  const scores: Record<string, { score: number; matches: string[] }> = {};

  for (const cat of CATEGORIES) {
    if (cat.id === "uncategorized") continue;
    scores[cat.id] = { score: 0, matches: [] };

    for (const keyword of cat.keywords) {
      const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i");
      if (regex.test(text)) {
        scores[cat.id].score += 1;
        scores[cat.id].matches.push(keyword);
      }
    }
  }

  // Find best match
  let bestCat: CategoryId = "uncategorized";
  let bestScore = 0;
  let bestMatches: string[] = [];

  for (const [catId, data] of Object.entries(scores)) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestCat = catId as CategoryId;
      bestMatches = data.matches;
    }
  }

  if (bestScore > 0) {
    reasons.push(
      `Matched keywords: ${bestMatches.map((k) => `"${k}"`).join(", ")} → ${getCatLabel(bestCat)} category.`
    );

    if (input.amount) {
      reasons.push(`Transaction amount: $${input.amount.toFixed(2)}.`);
    }

    return {
      category: bestCat,
      explanation: buildExplanation(reasons, getCatLabel(bestCat), input),
    };
  }

  // 3. Amount-based heuristics
  if (input.amount) {
    if (input.amount < 20 && input.type === "expense") {
      reasons.push(
        `No keyword match found. Small transaction ($${input.amount.toFixed(2)}) defaulted to Food & Dining.`
      );
      return {
        category: "food",
        explanation: buildExplanation(reasons, "Food & Dining", input),
      };
    }
  }

  reasons.push(
    "No matching keywords or merchants found in the transaction description."
  );
  return {
    category: "uncategorized",
    explanation: buildExplanation(reasons, "Uncategorized", input),
  };
}

function buildExplanation(
  reasons: string[],
  categoryLabel: string,
  input: ParsedInput
): string {
  const parts = [`Classified as "${categoryLabel}".`];
  parts.push(...reasons);

  if (input.type === "saving") {
    parts.push("Detected saving/income keywords in the text.");
  }

  return parts.join(" ");
}

function getCatLabel(id: CategoryId): string {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat?.label || "Uncategorized";
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
