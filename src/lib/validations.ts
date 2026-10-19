import { z } from "zod";

// ─── Auth Schemas ────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ─── Category Schemas ────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  type: z.enum(["income", "expense"]),
  icon: z.string().max(50).optional().default("📦"),
});

// ─── Transaction Schemas ─────────────────────────────────────

export const transactionSchema = z.object({
  type: z.enum(["credit", "debit"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  categoryId: z.coerce.number().int().positive("Please select a category"),
  description: z.string().max(500).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

// ─── Budget Schemas ──────────────────────────────────────────

export const budgetSchema = z.object({
  categoryId: z.coerce.number().int().positive("Please select a category"),
  amount: z.coerce.number().positive("Budget amount must be positive"),
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
});

// ─── Types ───────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
