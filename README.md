# BudgetBuddy

AI-powered budget tracker with natural language input. Type transactions the way you think — BudgetBuddy auto-categorizes them and delivers actionable insights.

**Live:** [pratik-shivnani.github.io/BudgetBuddy](https://pratik-shivnani.github.io/BudgetBuddy/)

## Features

- **Natural Language Input** — Type "Spent $45 at Trader Joe's yesterday" and it extracts amount, merchant, date, and category automatically
- **Smart Categorization** — Rule-based engine with merchant matching and keyword scoring across 10 categories (Groceries, Travel, Subscriptions, Food & Dining, Credit Cards, Entertainment, Utilities, Shopping, Income, Savings)
- **"Explain Why" Transparency** — Every categorization comes with a reasoning chain you can inspect
- **Manual Override** — Assign or change categories anytime via the category picker
- **Dashboard** — Summary cards, month-over-month insights, and category breakdown at a glance
- **Analytics** — Spending by category (bar/pie/trend), income/intake chart, and savings trend with net savings and income-vs-spending toggles
- **Transactions** — Full list with month, category, and type filters
- **Dark Mode** — Toggle between light and dark themes
- **Offline-First** — All data stored in localStorage, no backend required

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Storage | localStorage |
| Deployment | GitHub Pages (static export) |

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Dashboard
│   ├── transactions/page.tsx   # Transaction list + filters
│   └── analytics/page.tsx      # Charts & visualizations
├── components/
│   ├── CategoryBreakdown.tsx   # Per-bucket breakdown with progress bars
│   ├── CategoryPicker.tsx      # Manual category assignment modal
│   ├── ExplainWhyModal.tsx     # Categorization reasoning modal
│   ├── IncomeChart.tsx         # Income/intake bar chart
│   ├── InsightCard.tsx         # Actionable MoM insight cards
│   ├── Navbar.tsx              # Navigation + theme toggle
│   ├── SavingsTrendChart.tsx   # Net savings & income-vs-spending charts
│   ├── SpendingChart.tsx       # Spending bar/pie/trend charts
│   ├── TransactionInput.tsx    # Natural language input bar
│   └── TransactionList.tsx     # Transaction list with actions
├── lib/
│   ├── categorizer.ts          # Rule-based categorization engine
│   ├── insights.ts             # MoM comparison & insight generation
│   ├── parser.ts               # Natural language transaction parser
│   ├── storage.ts              # localStorage CRUD helpers
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Formatting utilities
└── data/
    ├── categories.ts           # Category definitions + keyword maps
    └── sampleData.ts           # Sample transactions for first load
```

## License

ISC
