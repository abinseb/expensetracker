"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/src/lib/auth/session";
import {
  getCategories as dbGetCategories,
  createCategory as dbCreateCategory,
  deleteCategory as dbDeleteCategory,
} from "@/src/lib/db/queries";
import { categorySchema } from "@/src/lib/validations";

export type CategoryState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
} | undefined;

export async function addCategoryAction(
  _prevState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  const session = await getSession();
  if (!session) return { message: "Unauthorized" };

  const raw = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    icon: (formData.get("icon") as string) || "📦",
  };

  const validated = categorySchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await dbCreateCategory(
      session.userId,
      validated.data.name,
      validated.data.type,
      validated.data.icon
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { message: "A category with this name already exists" };
    }
    return { message: "Failed to create category" };
  }

  revalidatePath("/categories");
  return { success: true, message: "Category created!" };
}

export async function deleteCategoryAction(categoryId: number): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const deleted = await dbDeleteCategory(categoryId, session.userId);
  if (!deleted) return { success: false, message: "Category not found" };

  revalidatePath("/categories");
  return { success: true, message: "Category deleted" };
}

export async function fetchCategories() {
  const session = await getSession();
  if (!session) return [];
  return dbGetCategories(session.userId);
}
