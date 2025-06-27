import { NextResponse } from "next/server";
import { getListing } from '@/lib/db';
import { createAndUploadAnnonceCSV } from '@/lib/ftp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { annonceId } = await request.json();
    
    if (!annonceId) {
      return NextResponse.json(
        { error: "ID d'annonce manquant" },
        { status: 400 }
      );
    }
    
    // Récupérer les détails de l'annonce
    const annonceDetails = await getListing(Number(annonceId));
    
    if (!annonceDetails) {
      return NextResponse.json(
        { error: "Annonce non trouvée" },
        { status: 404 }
      );
    }
    
    // Créer et envoyer le fichier CSV
    await createAndUploadAnnonceCSV(annonceDetails);
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json({ 
      success: true, 
      message: `CSV pour l'annonce ${annonceId} créé et envoyé au serveur FTP` 
    }, { headers });
  } catch (error) {
    console.error("Erreur lors de la création/envoi du CSV:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création/envoi du CSV" },
      { status: 500 }
    );
  }
}
