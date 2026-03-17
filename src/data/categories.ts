import { Category } from "@/lib/types";

export const CATEGORIES: Category[] = [
  {
    id: "groceries",
    label: "Groceries",
    color: "#22c55e",
    icon: "ShoppingCart",
    keywords: ["grocery", "groceries", "supermarket", "produce", "organic", "vegetables", "fruits"],
    merchants: ["trader joe's", "whole foods", "costco", "walmart", "kroger", "safeway", "aldi", "target", "publix", "wegmans", "heb", "sprouts"],
  },
  {
    id: "food",
    label: "Food & Dining",
    color: "#f97316",
    icon: "UtensilsCrossed",
    keywords: ["restaurant", "dinner", "lunch", "breakfast", "takeout", "delivery", "coffee", "cafe", "pizza", "burger", "sushi", "food", "eat", "dining", "meal", "snack", "drink"],
    merchants: ["mcdonald's", "starbucks", "chipotle", "domino's", "subway", "panera", "chick-fil-a", "doordash", "uber eats", "grubhub", "pizza hut", "dunkin"],
  },
  {
    id: "travel",
    label: "Travel",
    color: "#3b82f6",
    icon: "Plane",
    keywords: ["flight", "hotel", "airbnb", "travel", "trip", "vacation", "booking", "airline", "rental car", "uber", "lyft", "taxi", "gas", "fuel", "parking", "toll"],
    merchants: ["united", "delta", "american airlines", "southwest", "marriott", "hilton", "airbnb", "booking.com", "expedia", "uber", "lyft", "shell", "chevron", "bp"],
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    color: "#8b5cf6",
    icon: "RefreshCw",
    keywords: ["subscription", "monthly", "annual", "membership", "premium", "plan", "streaming", "service"],
    merchants: ["netflix", "spotify", "hulu", "disney+", "hbo", "apple", "amazon prime", "youtube premium", "adobe", "microsoft", "google one", "dropbox", "chatgpt", "openai", "gym"],
  },
  {
    id: "credit_cards",
    label: "Credit Cards",
    color: "#ec4899",
    icon: "CreditCard",
    keywords: ["credit card", "card payment", "card bill", "minimum payment", "balance", "credit"],
    merchants: ["chase", "amex", "american express", "visa", "mastercard", "discover", "capital one", "citi"],
  },
  {
    id: "entertainment",
    label: "Entertainment",
    color: "#eab308",
    icon: "Gamepad2",
    keywords: ["movie", "concert", "game", "show", "theater", "museum", "park", "entertainment", "fun", "ticket", "event", "sports", "bar", "club"],
    merchants: ["amc", "regal", "ticketmaster", "stubhub", "steam", "playstation", "xbox", "nintendo"],
  },
  {
    id: "utilities",
    label: "Utilities",
    color: "#06b6d4",
    icon: "Zap",
    keywords: ["electric", "electricity", "water", "gas bill", "internet", "wifi", "phone", "mobile", "utility", "utilities", "bill", "rent", "mortgage", "insurance"],
    merchants: ["at&t", "verizon", "t-mobile", "comcast", "xfinity", "spectrum", "pgee", "con edison"],
  },
  {
    id: "shopping",
    label: "Shopping",
    color: "#f43f5e",
    icon: "ShoppingBag",
    keywords: ["clothes", "clothing", "shoes", "electronics", "amazon", "online", "shop", "shopping", "bought", "purchase", "order", "store"],
    merchants: ["amazon", "ebay", "etsy", "nike", "adidas", "zara", "h&m", "best buy", "apple store", "ikea"],
  },
  {
    id: "income",
    label: "Income",
    color: "#10b981",
    icon: "TrendingUp",
    keywords: ["salary", "paycheck", "income", "earned", "received", "freelance", "bonus", "refund", "reimbursement", "deposit", "transfer in"],
    merchants: [],
  },
  {
    id: "savings",
    label: "Savings",
    color: "#0ea5e9",
    icon: "PiggyBank",
    keywords: ["saved", "saving", "savings", "investment", "invest", "401k", "ira", "stocks", "bonds", "deposit", "emergency fund"],
    merchants: ["vanguard", "fidelity", "charles schwab", "robinhood", "wealthfront", "betterment"],
  },
  {
    id: "uncategorized",
    label: "Uncategorized",
    color: "#6b7280",
    icon: "HelpCircle",
    keywords: [],
    merchants: [],
  },
];

export function getCategoryById(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function getCategoryColor(id: string): string {
  return getCategoryById(id).color;
}
