import { NextResponse } from "next/server";
import { createActualite } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier les données minimales requises
    if (!data.titre || !data.contenu) {
      return NextResponse.json(
        { error: "Titre et contenu requis" },
        { status: 400 }
      );
    }
    
    const result = await createActualite(data);
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Erreur lors de la création de l'actualité:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'actualité" },
      { status: 500 }
    );
  }
}
