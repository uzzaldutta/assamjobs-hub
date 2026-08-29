import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';
    
    if (authHeader !== `Bearer ${correctPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Strict System: Require 'vacancies' and 'last_date'
    const hasVacancies = data.vacancies && data.vacancies.trim() !== '' && data.vacancies.toLowerCase() !== 'not specified';
    const hasLastDate = data.last_date && data.last_date.trim() !== '' && data.last_date.toLowerCase() !== 'tbd';

    if (!hasVacancies && !hasLastDate) {
      return NextResponse.json({ 
        success: false, 
        error: "Strict Mode Active: You must provide a Number of Posts (Vacancies) OR a Last Date of Submission to add this feed." 
      }, { status: 400 });
    }

    const newEntry = {
      id: `manual_${Date.now()}`,
      scraped_at: new Date().toISOString(),
      ...data,
    };

    const { error } = await supabase
      .from('jobs')
      .insert([newEntry]);

    if (error) throw error;

    revalidatePath('/');
    return NextResponse.json({ success: true, entry: newEntry }, { status: 200 });

  } catch (error: any) {
    console.error("Admin POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
