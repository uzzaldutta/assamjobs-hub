import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';
    
    if (authHeader !== `Bearer ${correctPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const { error } = await supabase
      .from('hero_banners')
      .insert([data]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Banner POST Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create banner" }, { status: 500 });
  }
}
