import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { rewriteJobWithGemini } from '@/lib/ingestion/gemini-rewriter';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';
    
    if (authHeader !== \Bearer \\) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, text } = await req.json();

    if (!url && !text) {
      return NextResponse.json({ error: "Valid URL or raw text required" }, { status: 400 });
    }

    let rawText = "";

    if (text) {
      rawText = text.replace(/\s+/g, ' ').trim().substring(0, 15000);
    } else {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(\Failed to fetch URL: \\);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      script, style, noscript, iframe, img, svg.remove();
      rawText = body.text().replace(/\s+/g, ' ').trim().substring(0, 15000);
    }

    const aiData = await rewriteJobWithGemini(rawText);

    return NextResponse.json({ success: true, data: aiData }, { status: 200 });

  } catch (error: any) {
    console.error("Auto-Fill Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}