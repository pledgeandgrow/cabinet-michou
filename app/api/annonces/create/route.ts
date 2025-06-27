import { NextResponse } from "next/server";
import { createListing } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier les données minimales requises
    if (!data.reference || !data.transaction_id || !data.typebien_id) {
      return NextResponse.json(
        { error: "Données incomplètes pour créer une annonce" },
        { status: 400 }
      );
    }
    
    const result = await createListing(data);
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'annonce" },
      { status: 500 }
    );
  }
}
