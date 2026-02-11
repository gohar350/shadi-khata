"use server";

import { db } from "@/lib/db";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function register(data: RegisterInput) {
  const validated = registerSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, email, password } = validated.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "Account created successfully" };
}

export async function login(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirect: false });
}
