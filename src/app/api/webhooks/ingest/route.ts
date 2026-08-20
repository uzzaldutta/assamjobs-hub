import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // In production, use a secure secret stored in .env
    const INGEST_SECRET = process.env.INGEST_SECRET || "super-secret-key-123";
    
    if (authHeader !== `Bearer ${INGEST_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const incomingItems = Array.isArray(data) ? data : [data];
    let insertedCount = 0;

    const records = incomingItems.map(item => ({
      id: `scraped_${Date.now()}_${Math.random()}`,
      title: item.title || 'Untitled',
      organization: item.organization || item.department || 'Unknown',
      job_type: item.job_type || item.type || 'GOVERNMENT',
      category: item.category || 'ASSAM_STATE',
      vacancies: item.vacancies || item.value || null,
      district: item.district || item.location || 'All Assam',
      qualification: item.qualification || null,
      age_limit: item.age_limit || null,
      application_fee: item.application_fee || null,
      selection_process: item.selection_process || null,
      last_date: item.last_date || item.lastDate || null,
      official_pdf_url: item.official_pdf_url || item.officialUrl || null,
      apply_url: item.apply_url || item.applyUrl || null,
      unique_description: item.unique_description || null,
      unique_description_assamese: item.unique_description_assamese || null,
      scraped_at: new Date().toISOString()
    }));

    if (records.length > 0) {
      const { error } = await supabase
        .from('jobs')
        .insert(records);

      if (error) throw error;
      insertedCount = records.length;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${incomingItems.length} items. Inserted: ${insertedCount}` 
    });

  } catch (error) {
    console.error("Ingest Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
