"use server";

import { getSession } from "@/src/lib/auth/session";
import {
  getBalance,
  getMonthlySummary,
  getCategoryBreakdown,
  getDailySpending,
  getRecentTransactions,
  getMonthlyTrend,
} from "@/src/lib/db/queries";

export async function getDashboardData(year: number, month: number) {
  const session = await getSession();
  if (!session) return null;

  const [balance, summary, breakdown, daily, recent] = await Promise.all([
    getBalance(session.userId),
    getMonthlySummary(session.userId, year, month),
    getCategoryBreakdown(session.userId, year, month),
    getDailySpending(session.userId, year, month),
    getRecentTransactions(session.userId, 10),
  ]);

  return { balance, summary, breakdown, daily, recent };
}

export async function getReportData(months: number = 6) {
  const session = await getSession();
  if (!session) return null;

  const now = new Date();
  const [breakdown, trend] = await Promise.all([
    getCategoryBreakdown(session.userId, now.getFullYear(), now.getMonth() + 1),
    getMonthlyTrend(session.userId, months),
  ]);

  return { breakdown, trend };
}
