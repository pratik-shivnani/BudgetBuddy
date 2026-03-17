import { ParsedInput, TransactionType } from "./types";

const SAVING_KEYWORDS = [
  "saved", "saving", "savings", "invested", "investment",
  "deposited", "deposit", "put away", "set aside",
  "earned", "salary", "paycheck", "income", "received",
  "freelance", "bonus", "refund", "reimbursement",
];

export function parseNaturalInput(text: string): ParsedInput {
  const lower = text.toLowerCase().trim();

  const amount = extractAmount(lower);
  const merchant = extractMerchant(text);
  const date = extractDate(lower);
  const type = detectType(lower);

  return { amount, merchant, date, type, rawText: text };
}

function extractAmount(text: string): number | null {
  // Match patterns like $45, $45.50, 45 dollars, 45.50, $1,200.50
  const patterns = [
    /\$\s?([\d,]+(?:\.\d{1,2})?)/,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:dollars|usd|bucks)/i,
    /(?:spent|paid|cost|bought|saved|earned|received|got|deposited|invested)\s+\$?([\d,]+(?:\.\d{1,2})?)/i,
    /\$?([\d,]+(?:\.\d{1,2})?)\s+(?:on|at|for|from|to)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(num) && num > 0) return num;
    }
  }

  // Fallback: find any standalone number
  const fallback = text.match(/\b(\d+(?:\.\d{1,2})?)\b/);
  if (fallback) {
    const num = parseFloat(fallback[1]);
    if (!isNaN(num) && num > 0 && num < 100000) return num;
  }

  return null;
}

function extractMerchant(text: string): string | null {
  // Match "at [merchant]" or "from [merchant]" or "to [merchant]"
  const patterns = [
    /(?:at|from|to)\s+([A-Z][a-zA-Z'\s&]+?)(?:\s+(?:for|on|yesterday|today|last|\d)|\.|,|$)/,
    /(?:at|from|to)\s+([a-zA-Z'\s&]{2,30}?)(?:\s+(?:for|on|yesterday|today|last|\d)|\.|,|$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const merchant = match[1].trim();
      if (merchant.length > 1 && merchant.length < 40) return merchant;
    }
  }

  return null;
}

function extractDate(text: string): Date {
  const now = new Date();
  const lower = text.toLowerCase();

  if (lower.includes("yesterday")) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return d;
  }

  if (lower.includes("today") || lower.includes("just now")) {
    return now;
  }

  const daysAgo = lower.match(/(\d+)\s*days?\s*ago/);
  if (daysAgo) {
    const d = new Date(now);
    d.setDate(d.getDate() - parseInt(daysAgo[1]));
    return d;
  }

  const weekday = lower.match(
    /last\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/
  );
  if (weekday) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const targetDay = days.indexOf(weekday[1]);
    const currentDay = now.getDay();
    let diff = currentDay - targetDay;
    if (diff <= 0) diff += 7;
    const d = new Date(now);
    d.setDate(d.getDate() - diff);
    return d;
  }

  if (lower.includes("last week")) {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }

  if (lower.includes("last month")) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return d;
  }

  // Try parsing explicit dates like "March 15", "3/15", "2024-03-15"
  const explicitDate = text.match(
    /(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/
  );
  if (explicitDate) {
    const month = parseInt(explicitDate[1]) - 1;
    const day = parseInt(explicitDate[2]);
    const year = explicitDate[3]
      ? parseInt(explicitDate[3]) < 100
        ? 2000 + parseInt(explicitDate[3])
        : parseInt(explicitDate[3])
      : now.getFullYear();
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  const monthShort = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];

  for (let i = 0; i < 12; i++) {
    const pattern = new RegExp(
      `(?:${monthNames[i]}|${monthShort[i]})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`,
      "i"
    );
    const match = lower.match(pattern);
    if (match) {
      const day = parseInt(match[1]);
      const year = match[2] ? parseInt(match[2]) : now.getFullYear();
      return new Date(year, i, day);
    }
  }

  return now;
}

function detectType(text: string): TransactionType {
  for (const keyword of SAVING_KEYWORDS) {
    if (text.includes(keyword)) return "saving";
  }
  return "expense";
}
