import { getAllActualites } from "@/lib/db"
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const actualites = await getAllActualites()
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(actualites, { headers })
  } catch (error) {
    console.error('Error fetching actualites:', error)
    return NextResponse.json({ error: 'Failed to fetch actualites' }, { status: 500 })
  }
}
