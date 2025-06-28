import { NextResponse } from "next/server";
import { getTypeBiens } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const typeBiens = await getTypeBiens();
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(typeBiens, { headers });
  } catch (error) {
    console.error("Erreur lors de la récupération des types de biens:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des types de biens" },
      { status: 500 }
    );
  }
}
