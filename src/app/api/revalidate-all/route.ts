import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidatePath('/scholarships');
  revalidatePath('/results');
  revalidatePath('/admissions');
  revalidatePath('/admit-cards');
  revalidatePath('/');
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
