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
      for (const record of records) {
        // Check for duplicates (By title/org OR by apply_url/pdf_url to prevent cross-site duplicates)
        let isDuplicate = false;
        
        // 1. Check title and organization
        const { data: existingTitle, error: searchError } = await supabase
          .from('jobs')
          .select('id')
          .eq('title', record.title)
          .eq('organization', record.organization)
          .limit(1);
          
        if (existingTitle && existingTitle.length > 0) {
          isDuplicate = true;
        }

        // 2. Check apply_url to prevent cross-website duplicates
        if (!isDuplicate && record.apply_url && record.apply_url.length > 10) {
          const { data: existingUrl } = await supabase
            .from('jobs')
            .select('id')
            .eq('apply_url', record.apply_url)
            .limit(1);
          if (existingUrl && existingUrl.length > 0) {
            isDuplicate = true;
            console.log(`Cross-site duplicate found by apply_url: ${record.apply_url}`);
          }
        }
        
        // 3. Check official_pdf_url
        if (!isDuplicate && record.official_pdf_url && record.official_pdf_url.length > 10) {
          const { data: existingPdf } = await supabase
            .from('jobs')
            .select('id')
            .eq('official_pdf_url', record.official_pdf_url)
            .limit(1);
          if (existingPdf && existingPdf.length > 0) {
            isDuplicate = true;
            console.log(`Cross-site duplicate found by pdf_url: ${record.official_pdf_url}`);
          }
        }

        if (isDuplicate) {
          console.log(`Duplicate found for: ${record.title}. Skipping.`);
          continue;
        }

        // Insert new record
        const { error: insertError } = await supabase
          .from('jobs')
          .insert([record]);

        if (insertError) {
          console.error("Error inserting record:", insertError);
        } else {
          insertedCount++;
        }
      }
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
