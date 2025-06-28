import { getTypeBiens } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
	const typebiens = await supabase.from("typebien").select()

	

	return NextResponse.json(typebiens);
  } catch (error) {
	console.error('Database Error:', error);
	return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
