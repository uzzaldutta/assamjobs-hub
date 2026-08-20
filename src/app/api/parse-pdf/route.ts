import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Dynamically require inside the handler to prevent Next.js from throwing DOMMatrix errors during build/global evaluation
    const pdfParse = require('pdf-parse');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert Web File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const data = await pdfParse(buffer);
    
    // Return extracted text
    return NextResponse.json({ text: data.text });

  } catch (error: any) {
    console.error('PDF Parse Error:', error);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}
