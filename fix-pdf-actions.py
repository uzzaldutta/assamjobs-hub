code = """
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import pdfParse from "pdf-parse";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (token !== "admin_secure_session_token_123") {
    throw new Error("Unauthorized");
  }
}

export async function extractMaterialTextAction(materialId: string) {
  await verifyAdmin();

  // 1. Fetch material record
  const { data: material, error } = await supabase
    .from("prep_materials")
    .select("*")
    .eq("id", materialId)
    .single();

  if (error || !material) throw new Error("Material not found");
  if (!material.file_url) throw new Error("No file attached to this material.");

  // 2. Download file from Supabase Storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("materials")
    .download(material.file_url);

  if (downloadError || !fileData) {
    throw new Error("Failed to download file from storage.");
  }

  // 3. Parse PDF
  try {
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (!text || text.trim().length < 50) {
      throw new Error("OCR REQUIRED: Could not extract sufficient text from this PDF. It may be scanned or image-only.");
    }

    // 4. Simple chunking
    const paragraphs = text.split("\\n\\n").map((p: string) => p.trim()).filter((p: string) => p.length > 20);
    const chunks = [];
    let currentChunk = "";
    
    for (const p of paragraphs) {
      if ((currentChunk.length + p.length) > 1500) {
        chunks.push(currentChunk);
        currentChunk = p;
      } else {
        currentChunk += (currentChunk ? "\\n\\n" : "") + p;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    return {
      success: true,
      materialTitle: material.title,
      metadata: {
        exam_id: material.exam_id,
        subject_id: material.subject_id,
        topic_id: material.topic_id,
      },
      chunks,
      totalPages: pdfData.numpages || 0
    };
  } catch (e: any) {
    throw new Error("Failed to parse document: " + e.message);
  }
}
"""
with open("src/app/admin/studio/generator/pdfActions.ts", "w", encoding="utf-8") as f:
    f.write(code)
