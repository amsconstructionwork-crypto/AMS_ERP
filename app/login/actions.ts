"use server";

import { redirect } from "next/navigation";
import { loginWithEnvCredentials, logout as authLogout } from "@/lib/auth";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const success = await loginWithEnvCredentials(password, username);

  if (success) {
    redirect("/");
  } else {
    return { error: "Invalid username or password." };
  }
}

export async function logoutAction() {
  await authLogout();
  redirect("/login");
}
