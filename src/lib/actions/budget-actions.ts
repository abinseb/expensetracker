"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/src/lib/auth/session";
import {
  getBudgets as dbGetBudgets,
  setBudget as dbSetBudget,
  deleteBudget as dbDeleteBudget,
} from "@/src/lib/db/queries";
import { budgetSchema } from "@/src/lib/validations";

export type BudgetState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
} | undefined;

export async function setBudgetAction(
  _prevState: BudgetState,
  formData: FormData
): Promise<BudgetState> {
  const session = await getSession();
  if (!session) return { message: "Unauthorized" };

  const raw = {
    categoryId: formData.get("categoryId") as string,
    amount: formData.get("amount") as string,
    year: formData.get("year") as string,
    month: formData.get("month") as string,
  };

  const validated = budgetSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await dbSetBudget(
      session.userId,
      validated.data.categoryId,
      validated.data.year,
      validated.data.month,
      validated.data.amount
    );
  } catch {
    return { message: "Failed to set budget" };
  }

  revalidatePath("/budget");
  return { success: true, message: "Budget saved!" };
}

export async function deleteBudgetAction(budgetId: number): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const deleted = await dbDeleteBudget(budgetId, session.userId);
  if (!deleted) return { success: false, message: "Budget not found" };

  revalidatePath("/budget");
  return { success: true, message: "Budget deleted" };
}

export async function fetchBudgets(year: number, month: number) {
  const session = await getSession();
  if (!session) return [];
  return dbGetBudgets(session.userId, year, month);
}
