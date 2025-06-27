import { NextResponse } from "next/server";
import { getListing, deleteListing, getAnnoncePhotos } from '@/lib/db'

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Récupérer les détails de l'annonce
    const listing = await getListing(id);
    
    if (!listing) {
      return NextResponse.json(
        { error: "Annonce non trouvée" },
        { status: 404 }
      );
    }
    
    // Récupérer les photos de l'annonce
    const photos = await getAnnoncePhotos(id);
    
    // Ajouter les photos à l'annonce
    const listingWithPhotos = {
      ...listing,
      photos
    };
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(listingWithPhotos, { headers });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'annonce:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'annonce" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Vérifier si l'annonce existe
    const listing = await getListing(id);
    if (!listing) {
      return NextResponse.json(
        { error: "Annonce non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer l'annonce
    await deleteListing(Number(id));

    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'annonce" },
      { status: 500 }
    );
  }
}
