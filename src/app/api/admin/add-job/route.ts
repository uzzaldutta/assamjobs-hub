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

    const newEntry = {
      id: `manual_${Date.now()}`,
      scraped_at: new Date().toISOString(),
      ...data,
    };

    const { error } = await supabase
      .from('jobs')
      .insert([newEntry]);

    if (error) throw error;

    return NextResponse.json({ success: true, entry: newEntry }, { status: 200 });

  } catch (error: any) {
    console.error("Admin POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
