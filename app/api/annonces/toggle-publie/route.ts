import { NextResponse } from "next/server";
import { toggleListingPublication } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier les données requises
    if (!data.id) {
      return NextResponse.json(
        { error: "ID d'annonce manquant" },
        { status: 400 }
      );
    }
    
    const result = await toggleListingPublication(Number(data.id));
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Erreur lors du changement de statut de publication:", error);
    return NextResponse.json(
      { error: "Erreur lors du changement de statut de publication" },
      { status: 500 }
    );
  }
}
