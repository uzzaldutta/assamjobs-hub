"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function adminInsert(table: string, payload: any) {
  const { data, error } = await supabaseAdmin.from(table).insert(payload).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminDelete(table: string, matchCol: string, matchVal: string) {
  const { error } = await supabaseAdmin.from(table).delete().eq(matchCol, matchVal);
  if (error) throw new Error(error.message);
  return true;
}

export async function adminUpdate(table: string, payload: any, matchCol: string, matchVal: string) {
  const { data, error } = await supabaseAdmin.from(table).update(payload).eq(matchCol, matchVal).select();
  if (error) throw new Error(error.message);
  return data;
}
