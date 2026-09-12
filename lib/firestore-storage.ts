import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  getDocs,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { Budget, Expense, Transaction, UserProfile } from "./types";

// ── Collection refs ───────────────────────────────

function budgetsCol(uid: string) {
  return collection(db, "users", uid, "budgets");
}
function expensesCol(uid: string) {
  return collection(db, "users", uid, "expenses");
}
function transactionsCol(uid: string) {
  return collection(db, "users", uid, "transactions");
}
function profileDoc(uid: string) {
  return doc(db, "users", uid, "meta", "profile");
}

// ── Budgets ───────────────────────────────────────

export function subscribeBudgets(
  uid: string,
  callback: (budgets: Budget[]) => void
): Unsubscribe {
  const q = query(budgetsCol(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const budgets = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Budget));
    callback(budgets);
  });
}

export async function saveBudgetToFirestore(uid: string, budget: Budget) {
  await setDoc(doc(budgetsCol(uid), budget.id), {
    name: budget.name,
    emoji: budget.emoji,
    amount: budget.amount,
    createdAt: budget.createdAt,
  });
}

export async function deleteBudgetFromFirestore(uid: string, budgetId: string) {
  // Delete budget document
  await deleteDoc(doc(budgetsCol(uid), budgetId));
  // Delete associated expenses
  const expSnap = await getDocs(expensesCol(uid));
  const batch = writeBatch(db);
  expSnap.docs
    .filter((d) => d.data().budgetId === budgetId)
    .forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

// ── Expenses ──────────────────────────────────────

export function subscribeExpenses(
  uid: string,
  callback: (expenses: Expense[]) => void
): Unsubscribe {
  const q = query(expensesCol(uid), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const expenses = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Expense));
    callback(expenses);
  });
}

export async function saveExpenseToFirestore(uid: string, expense: Expense) {
  await setDoc(doc(expensesCol(uid), expense.id), {
    budgetId: expense.budgetId,
    name: expense.name,
    amount: expense.amount,
    date: expense.date,
  });
}

export async function deleteExpenseFromFirestore(uid: string, expenseId: string) {
  await deleteDoc(doc(expensesCol(uid), expenseId));
}

// ── Transactions (Ledger) ─────────────────────────

export function subscribeTransactions(
  uid: string,
  callback: (transactions: Transaction[]) => void
): Unsubscribe {
  const q = query(transactionsCol(uid), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const txns = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Transaction));
    callback(txns);
  });
}

export async function saveTransactionToFirestore(uid: string, txn: Transaction) {
  await setDoc(doc(transactionsCol(uid), txn.id), {
    description: txn.description,
    amount: txn.amount,
    category: txn.category,
    kind: txn.kind,
    date: txn.date,
  });
}

export async function deleteTransactionFromFirestore(uid: string, txnId: string) {
  await deleteDoc(doc(transactionsCol(uid), txnId));
}

// ── Profile ───────────────────────────────────────

export async function loadProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(profileDoc(uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export function subscribeProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void
): Unsubscribe {
  return onSnapshot(profileDoc(uid), (snap) => {
    callback(snap.exists() ? (snap.data() as UserProfile) : null);
  });
}

export async function saveProfileToFirestore(uid: string, profile: UserProfile) {
  await setDoc(profileDoc(uid), profile);
}

// ── Seed demo data ────────────────────────────────

function isoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export async function seedFirestoreData(uid: string) {
  // Check if user already has data
  const budgetSnap = await getDocs(budgetsCol(uid));
  if (!budgetSnap.empty) return; // Already seeded

  const batch = writeBatch(db);

  const budgets: Budget[] = [
    { id: "b-shopping", name: "Shopping", emoji: "🛍️", amount: 2300, createdAt: isoDate(30) },
    { id: "b-homedecor", name: "Home Decor", emoji: "🏠", amount: 3800, createdAt: isoDate(28) },
    { id: "b-garden", name: "Garden", emoji: "🌴", amount: 1500, createdAt: isoDate(20) },
    { id: "b-car", name: "Car", emoji: "🚗", amount: 2500, createdAt: isoDate(15) },
    { id: "b-youtube", name: "Youtube", emoji: "📺", amount: 5000, createdAt: isoDate(10) },
  ];

  for (const b of budgets) {
    batch.set(doc(budgetsCol(uid), b.id), {
      name: b.name,
      emoji: b.emoji,
      amount: b.amount,
      createdAt: b.createdAt,
    });
  }

  const expenses: Omit<Expense, "id">[] = [
    { budgetId: "b-shopping", name: "New shoes", amount: 150, date: isoDate(3) },
    { budgetId: "b-homedecor", name: "Sofa", amount: 2400, date: isoDate(25) },
    { budgetId: "b-homedecor", name: "Wall art", amount: 500, date: isoDate(12) },
    { budgetId: "b-homedecor", name: "Curtains", amount: 400, date: isoDate(5) },
    { budgetId: "b-garden", name: "Plants", amount: 90, date: isoDate(9) },
    { budgetId: "b-garden", name: "Hose", amount: 70, date: isoDate(4) },
    { budgetId: "b-car", name: "Oil change", amount: 120, date: isoDate(6) },
    { budgetId: "b-youtube", name: "Ring light", amount: 700, date: isoDate(18) },
    { budgetId: "b-youtube", name: "Editing software", amount: 400, date: isoDate(2) },
  ];

  for (const e of expenses) {
    const id = crypto.randomUUID();
    batch.set(doc(expensesCol(uid), id), e);
  }

  await batch.commit();
}
