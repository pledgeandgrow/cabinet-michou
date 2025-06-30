import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { annonceId } = await request.json();
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    // La fonctionnalité FTP a été désactivée pour améliorer les performances
    return NextResponse.json({ 
      success: false, 
      message: `La fonctionnalité d'export CSV via FTP a été désactivée pour améliorer les performances` 
    }, { headers });
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    );
  }
}
