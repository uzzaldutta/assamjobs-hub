import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, created_at')
      .eq('category', 'BANNED_KEYWORD')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json({ keywords: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { keyword, password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';
    
    if (password !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (!keyword || keyword.trim() === '') {
      return NextResponse.json({ error: "Keyword required" }, { status: 400 });
    }

    const cleanKeyword = keyword.trim().toLowerCase();

    // 1. Insert the keyword into jobs table as BANNED_KEYWORD
    const { data: inserted, error: insertError } = await supabase
      .from('jobs')
      .insert({
        id: `banned_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        title: cleanKeyword,
        category: 'BANNED_KEYWORD',
        organization: 'SYSTEM',
        job_type: 'PRIVATE',
        scraped_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Find and delete all existing jobs containing this keyword (excluding SYSTEM categories just in case)
    const { data: spamJobs, error: searchError } = await supabase
      .from('jobs')
      .select('id')
      .neq('category', 'BANNED_KEYWORD')
      .ilike('title', `%${cleanKeyword}%`);
      
    if (searchError) throw searchError;

    let deletedCount = 0;
    if (spamJobs && spamJobs.length > 0) {
      const idsToDelete = spamJobs.map(j => j.id);
      
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .in('id', idsToDelete);
        
      if (deleteError) throw deleteError;
      deletedCount = idsToDelete.length;
    }

    revalidatePath('/');
    return NextResponse.json({ 
      success: true, 
      keyword: inserted,
      deletedCount 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const password = request.headers.get('Authorization')?.replace('Bearer ', '');
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('category', 'BANNED_KEYWORD');

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
