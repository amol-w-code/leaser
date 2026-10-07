import { GoogleGenerativeAI } from "@google/generative-ai";
import { Budget, Expense, Transaction, BudgetWithStats } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export function isGeminiConfigured(): boolean {
  return API_KEY.length > 20;
}

// ── Build financial context for AI ────────────────

interface FinancialContext {
  budgets: BudgetWithStats[];
  expenses: Expense[];
  transactions: Transaction[];
  currency: string;
  monthLabel: string;
  totalBudget: number;
  totalSpend: number;
  monthIncome: number;
  monthExpenses: number;
  monthBalance: number;
  categoryTotals: { category: string; total: number }[];
}

function buildSystemPrompt(ctx: FinancialContext): string {
  const budgetSummary = ctx.budgets
    .map(
      (b) =>
        `• ${b.emoji} ${b.name}: Budget ${ctx.currency}${b.amount}, Spent ${ctx.currency}${b.spent} (${Math.round(b.percentUsed)}% used), ${b.remaining >= 0 ? `${ctx.currency}${b.remaining} remaining` : `${ctx.currency}${Math.abs(b.remaining)} OVER budget`}`
    )
    .join("\n");

  const catSummary = ctx.categoryTotals
    .map((c) => `• ${c.category}: ${ctx.currency}${c.total}`)
    .join("\n");

  const recentTxns = ctx.transactions
    .slice(0, 15)
    .map(
      (t) =>
        `• ${t.date} | ${t.kind === "credit" ? "+" : "-"}${ctx.currency}${t.amount} | ${t.category} | ${t.description}`
    )
    .join("\n");

  return `You are a friendly, expert personal finance advisor embedded in "Leaser", a personal finance tracking app. You have full access to the user's real financial data below. Provide actionable, personalized advice.

RULES:
- Be concise and conversational — use short paragraphs & bullet points
- Reference specific numbers from their data
- When giving advice, be encouraging, not judgmental
- Use emoji sparingly for warmth (1-2 per message max)
- Format with markdown: bold for emphasis, bullet lists for tips
- Currency is ${ctx.currency}
- If asked about something outside finance, politely redirect

CURRENT FINANCIAL DATA (${ctx.monthLabel}):

📊 BUDGETS OVERVIEW:
Total Budget: ${ctx.currency}${ctx.totalBudget}
Total Spent across budgets: ${ctx.currency}${ctx.totalSpend}
Number of budgets: ${ctx.budgets.length}

${budgetSummary || "No budgets set up yet."}

💰 LEDGER (${ctx.monthLabel}):
Income: ${ctx.currency}${ctx.monthIncome}
Expenses: ${ctx.currency}${ctx.monthExpenses}
Balance: ${ctx.currency}${ctx.monthBalance}

📂 SPENDING BY CATEGORY:
${catSummary || "No spending data yet."}

📋 RECENT TRANSACTIONS:
${recentTxns || "No recent transactions."}`;
}

// ── Chat with advisor ────────────────────────────

export async function chatWithAdvisor(
  userMessage: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  ctx: FinancialContext
): Promise<string> {
  const ai = getGenAI();
  if (!ai) throw new Error("Gemini API key not configured");

  const model = ai.getGenerativeModel({
    model: "gemini-3.8-flash",
    systemInstruction: buildSystemPrompt(ctx),
  });

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}

// ── Generate dashboard insights ──────────────────

export async function generateInsights(ctx: FinancialContext): Promise<string> {
  const ai = getGenAI();
  if (!ai) throw new Error("Gemini API key not configured");

  const model = ai.getGenerativeModel({ model: "gemini-3.8-flash" });

  const prompt = `${buildSystemPrompt(ctx)}

Based on the financial data above, generate EXACTLY 3 short, actionable financial insights. Each insight should be a JSON object in an array.

Rules:
- Each insight must reference specific numbers from the data
- Mix of types: at least one tip, one observation, and one warning/success
- Keep titles under 6 words, descriptions under 25 words
- Use relevant emoji for the icon field

Respond ONLY with a valid JSON array, no markdown fences:
[
  {"icon": "emoji", "title": "short title", "description": "brief actionable insight", "type": "tip|warning|success|info"}
]`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ── Suggest category for a description ───────────

export async function suggestCategory(
  description: string,
  categories: readonly string[]
): Promise<string | null> {
  const ai = getGenAI();
  if (!ai || !description.trim()) return null;

  const model = ai.getGenerativeModel({ model: "gemini-3.8-flash" });

  const prompt = `Given this transaction description: "${description}"

Choose the SINGLE most appropriate category from this list: ${categories.join(", ")}

Respond with ONLY the category name, nothing else. If unsure, respond with "Other".`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const match = categories.find(
      (c) => c.toLowerCase() === text.toLowerCase()
    );
    return match || null;
  } catch {
    return null;
  }
}
