"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/src/lib/auth/session";
import {
  getTransactions as dbGetTransactions,
  createTransaction as dbCreateTransaction,
  deleteTransaction as dbDeleteTransaction,
  type TransactionFilters,
} from "@/src/lib/db/queries";
import { transactionSchema } from "@/src/lib/validations";

export type TransactionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
} | undefined;

export async function addTransactionAction(
  _prevState: TransactionState,
  formData: FormData
): Promise<TransactionState> {
  const session = await getSession();
  if (!session) return { message: "Unauthorized" };

  const raw = {
    type: formData.get("type") as string,
    amount: formData.get("amount") as string,
    categoryId: formData.get("categoryId") as string,
    description: formData.get("description") as string,
    date: formData.get("date") as string,
  };

  const validated = transactionSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await dbCreateTransaction(
      session.userId,
      validated.data.categoryId,
      validated.data.type,
      validated.data.amount,
      validated.data.description,
      validated.data.date
    );
  } catch {
    return { message: "Failed to add transaction" };
  }

  revalidatePath("/transaction");
  revalidatePath("/dashboard");
  return { success: true, message: "Transaction added!" };
}

export async function deleteTransactionAction(transactionId: number): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const deleted = await dbDeleteTransaction(transactionId, session.userId);
  if (!deleted) return { success: false, message: "Transaction not found" };

  revalidatePath("/transaction");
  revalidatePath("/dashboard");
  return { success: true, message: "Transaction deleted" };
}

export async function fetchTransactions(filters?: {
  type?: "credit" | "debit";
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}) {
  const session = await getSession();
  if (!session) return [];

  const queryFilters: TransactionFilters = {
    userId: session.userId,
    ...filters,
  };

  return dbGetTransactions(queryFilters);
}
