code = """
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (token !== "admin_secure_session_token_123") {
    throw new Error("Unauthorized");
  }
}

export async function createSignedUploadUrl(fileName: string) {
  await verifyAdmin();
  
  const timestamp = new Date().getTime();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filePath = `uploads/${timestamp}_${sanitizedFileName}`;

  // Use service role to generate signed upload URL since admin_token is not a supabase auth token
  const { data, error } = await supabase.storage
    .from("materials")
    .createSignedUploadUrl(filePath);

  if (error) {
    console.error("Signed URL Error:", error);
    throw new Error(error.message);
  }

  // data.signedUrl is the URL the client can PUT the file to
  // data.path is the relative path we will store in the DB
  return { signedUrl: data.signedUrl, path: filePath };
}

export async function saveMaterialAction(payload: any) {
  await verifyAdmin();

  const { data, error } = await supabase
    .from("prep_materials")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("Save material error:", error);
    throw new Error(error.message);
  }

  return { success: true, id: data.id };
}

export async function updateMaterialStatusAction(id: string, status: string) {
  await verifyAdmin();

  const { error } = await supabase
    .from("prep_materials")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function bulkUpdateMaterialStatusAction(ids: string[], status: string) {
  await verifyAdmin();

  const { data, error } = await supabase
    .from("prep_materials")
    .update({ status, updated_at: new Date().toISOString() })
    .in("id", ids)
    .select("id");

  if (error) throw new Error(error.message);
  return { success: true, count: data?.length || 0 };
}
"""
import os
os.makedirs("src/app/admin/studio/materials", exist_ok=True)
with open("src/app/admin/studio/materials/actions.ts", "w", encoding="utf-8") as f:
    f.write(code)
