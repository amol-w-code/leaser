export interface Budget {
  id: string;
  name: string;
  emoji: string;
  amount: number; // budget limit
  createdAt: string;
}

export interface Expense {
  id: string;
  budgetId: string;
  name: string;
  amount: number;
  date: string; // ISO date
}

export type TransactionKind = "debit" | "credit";

export const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Bills",
  "Health",
  "Education",
  "Other",
] as const;

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  kind: TransactionKind;
  date: string;
}

export interface BudgetWithStats extends Budget {
  spent: number;
  remaining: number;
  itemCount: number;
  percentUsed: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  theme: "light" | "dark" | "system";
  country: string;
  currency: string;
  profileImage: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AIInsight {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: "tip" | "warning" | "success" | "info";
}
