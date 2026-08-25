import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';
    
    if (authHeader !== `Bearer ${correctPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const { error } = await supabase
      .from('hero_banners')
      .update(data)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Banner PUT Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';
    
    if (authHeader !== `Bearer ${correctPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Banner DELETE Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete banner" }, { status: 500 });
  }
}
