import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const correctPassword = process.env.ADMIN_PASSWORD || 'assamhub2026';

    if (authHeader !== `Bearer ${correctPassword}`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    revalidatePath('/');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
