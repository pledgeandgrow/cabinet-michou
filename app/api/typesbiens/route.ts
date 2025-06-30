import { getTypeBiens } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
	const typebiens = await getTypeBiens();

	

	return NextResponse.json(typebiens);
  } catch (error) {
	console.error('Database Error:', error);
	return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
