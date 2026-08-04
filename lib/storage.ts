import { Budget, Expense, Transaction, UserProfile } from "./types";

const BUDGETS_KEY = "expense-tracker.budgets.v1";
const EXPENSES_KEY = "expense-tracker.expenses.v1";
const PROFILE_KEY = "expense-tracker.profile.v1";
const TRANSACTIONS_KEY = "expense-tracker.transactions.v1";

function isoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function seedBudgets(): Budget[] {
  return [
    { id: "b-shopping", name: "Shopping", emoji: "🛍️", amount: 2300, createdAt: isoDate(30) },
    { id: "b-homedecor", name: "Home Decor", emoji: "🏠", amount: 3800, createdAt: isoDate(28) },
    { id: "b-garden", name: "Garden", emoji: "🌴", amount: 1500, createdAt: isoDate(20) },
    { id: "b-car", name: "Car", emoji: "🚗", amount: 2500, createdAt: isoDate(15) },
    { id: "b-youtube", name: "Youtube", emoji: "📺", amount: 5000, createdAt: isoDate(10) },
  ];
}

function seedExpenses(): Expense[] {
  return [
    { id: crypto.randomUUID(), budgetId: "b-shopping", name: "New shoes", amount: 150, date: isoDate(3) },

    { id: crypto.randomUUID(), budgetId: "b-homedecor", name: "Sofa", amount: 2400, date: isoDate(25) },
    { id: crypto.randomUUID(), budgetId: "b-homedecor", name: "Wall art", amount: 500, date: isoDate(12) },
    { id: crypto.randomUUID(), budgetId: "b-homedecor", name: "Curtains", amount: 400, date: isoDate(5) },

    { id: crypto.randomUUID(), budgetId: "b-garden", name: "Plants", amount: 90, date: isoDate(9) },
    { id: crypto.randomUUID(), budgetId: "b-garden", name: "Hose", amount: 70, date: isoDate(4) },

    { id: crypto.randomUUID(), budgetId: "b-car", name: "Oil change", amount: 120, date: isoDate(6) },

    { id: crypto.randomUUID(), budgetId: "b-youtube", name: "Ring light", amount: 700, date: isoDate(18) },
    { id: crypto.randomUUID(), budgetId: "b-youtube", name: "Editing software", amount: 400, date: isoDate(2) },
  ];
}

export function loadBudgets(): Budget[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BUDGETS_KEY);
    if (!raw) {
      const seeded = seedBudgets();
      window.localStorage.setItem(BUDGETS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as Budget[];
  } catch {
    return [];
  }
}

export function saveBudgets(budgets: Budget[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      const seeded = seedExpenses();
      window.localStorage.setItem(EXPENSES_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      const profile = defaultProfile();
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }
    return { ...defaultProfile(), ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function defaultProfile(): UserProfile {
  return {
    fullName: "Game Play",
    email: "gameplay@example.com",
    bio: "Budgeting with calm confidence.",
    theme: "light",
    country: "India",
    currency: "INR",
    profileImage: "",
  };
}
