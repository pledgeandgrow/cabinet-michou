import { NextResponse } from "next/server";
import { updateActualite } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier les données minimales requises
    if (!data.id) {
      return NextResponse.json(
        { error: "ID d'actualité manquant" },
        { status: 400 }
      );
    }
    
    const result = await updateActualite(Number(data.id), data);
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'actualité:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'actualité" },
      { status: 500 }
    );
  }
}
