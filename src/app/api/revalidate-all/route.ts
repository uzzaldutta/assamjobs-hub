import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  // Removed broad revalidatePath in favor of Time-Based Revalidation (TTL)
  // Removed broad revalidatePath in favor of Time-Based Revalidation (TTL)
  // Removed broad revalidatePath in favor of Time-Based Revalidation (TTL)
  // Removed broad revalidatePath in favor of Time-Based Revalidation (TTL)
  // Removed broad revalidatePath in favor of Time-Based Revalidation (TTL)
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
