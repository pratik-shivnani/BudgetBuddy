import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetBuddy - Smart Budget Tracker",
  description: "AI-powered budget tracker with natural language input",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6">{children}</main>
      </body>
    </html>
  );
}
