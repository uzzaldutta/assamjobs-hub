import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    error: 'Action Disabled: Smart Dedup permanently deletes canonical records, bypasses job_provenance/content_hash, and destroys audit history. Use the Content Studio workflow instead.' 
  }, { status: 403 });
}
