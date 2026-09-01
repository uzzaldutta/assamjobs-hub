"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_PASSWORD = "assamhub2026"; // In a real app, use env variables
const SECURE_TOKEN = "admin_secure_session_token_123";

// 1. Secure Authentication Action
export async function adminLogin(password: string) {
  if (password === ADMIN_PASSWORD) {
    (await cookies()).set("admin_token", SECURE_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 1 day
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function adminLogout() {
  (await cookies()).delete("admin_token");
  return { success: true };
}

// 2. Authorization Verification
async function verifyAuth() {
  const token = (await cookies()).get("admin_token");
  if (!token || token.value !== SECURE_TOKEN) {
    throw new Error("Unauthorized: Invalid or missing admin session.");
  }
}

// 3. Secured Database Mutations
export async function adminInsert(table: string, payload: any) {
  await verifyAuth();
  const { data, error } = await supabaseAdmin.from(table).insert(payload).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminDelete(table: string, matchCol: string, matchVal: string) {
  await verifyAuth();
  const { error } = await supabaseAdmin.from(table).delete().eq(matchCol, matchVal);
  if (error) throw new Error(error.message);
  return true;
}

export async function adminUpdate(table: string, payload: any, matchCol: string, matchVal: string) {
  await verifyAuth();
  const { data, error } = await supabaseAdmin.from(table).update(payload).eq(matchCol, matchVal).select();
  if (error) throw new Error(error.message);
  return data;
}
