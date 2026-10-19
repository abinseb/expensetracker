"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/src/lib/auth/password";
import { createSession, destroySession } from "@/src/lib/auth/session";
import { getUserByEmail, createUser } from "@/src/lib/db/queries";
import { loginSchema, registerSchema } from "@/src/lib/validations";

export type AuthState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const user = await getUserByEmail(validated.data.email);
  if (!user) {
    return { message: "Invalid email or password" };
  }

  const valid = await verifyPassword(validated.data.password, user.password_hash);
  if (!valid) {
    return { message: "Invalid email or password" };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = registerSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existing = await getUserByEmail(validated.data.email);
  if (existing) {
    return { message: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(validated.data.password);
  const user = await createUser(
    validated.data.name,
    validated.data.email,
    passwordHash
  );

  if (!user) {
    return { message: "Failed to create account. Please try again." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
