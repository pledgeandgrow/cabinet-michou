import { NextResponse } from "next/server";
import { addAnnoncePhoto, setAnnoncePrincipalPhoto, deleteAnnoncePhoto } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Ajouter une nouvelle photo
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier les données requises
    if (!data.annonce_id || !data.url || !data.nom) {
      return NextResponse.json(
        { error: "Données incomplètes" },
        { status: 400 }
      );
    }
    
    // Utiliser le nom de fichier comme paramètre string
    // Si c'est une URL Cloudinary, on utilise l'URL complète
    const result = await addAnnoncePhoto(
      Number(data.annonce_id),
      data.nom, // Utiliser le nom du fichier
      data.principale || false // Paramètre boolean pour indiquer si c'est la photo principale
    );
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de la photo" },
      { status: 500 }
    );
  }
}

// Mettre à jour une photo (définir comme principale)
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier les données requises
    if (!data.photo_id || !data.annonce_id) {
      return NextResponse.json(
        { error: "Données incomplètes" },
        { status: 400 }
      );
    }
    
    const result = await setAnnoncePrincipalPhoto(Number(data.annonce_id), Number(data.photo_id));
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la photo:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la photo" },
      { status: 500 }
    );
  }
}

// Supprimer une photo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('id');
    
    if (!photoId) {
      return NextResponse.json(
        { error: "ID de photo manquant" },
        { status: 400 }
      );
    }
    
    const result = await deleteAnnoncePhoto(Number(photoId));
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Erreur lors de la suppression de la photo:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la photo" },
      { status: 500 }
    );
  }
}
