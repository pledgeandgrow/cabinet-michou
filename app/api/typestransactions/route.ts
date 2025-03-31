import { getTypeBiens, getTypeTransactions } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
	const typetransactions= await getTypeTransactions();

	

	return NextResponse.json(typetransactions);
  } catch (error) {
	console.error('Database Error:', error);
	return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
