import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: banners, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching banners:", error);
      // Return a fallback array so the frontend doesn't break if table isn't created yet
      return NextResponse.json([
        {
          id: 'fallback-1',
          headline: 'Find Your Next Opportunity in Assam',
          subtext: 'Get live Govt & Private job alerts, download premium study materials, and outsmart the competition.',
          cta_text: '',
          cta_link: '',
          gradient_from: 'from-blue-600',
          gradient_to: 'to-emerald-500',
          is_active: true
        }
      ]);
    }

    return NextResponse.json(banners || []);
  } catch (error) {
    console.error("Banners API Error:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
