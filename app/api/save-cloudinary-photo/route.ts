import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, addAnnoncePhoto } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to save Cloudinary photo');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { annonceId, cloudinary_url, principale } = body;

    if (!annonceId || !cloudinary_url) {
      console.error('Missing required fields:', { annonceId, cloudinary_url });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`Saving Cloudinary photo for annonce ${annonceId}:`, { cloudinary_url, principale });
    
    try {
      // Convertir annonceId en nombre et principale en booléen
      const annonce_id = Number(annonceId);
      // Gérer tous les cas possibles pour principale (nombre, booléen, string)
      const isPrincipal = principale === 1 || principale === '1' || principale === true || principale === 'true';
      
      console.log(`Converted parameters: annonceId=${annonceId}->${annonce_id}, principale=${principale}->${isPrincipal}`);
      
      // Utiliser la fonction addAnnoncePhoto qui a déjà été migrée vers Supabase
      const result = await addAnnoncePhoto(annonce_id, cloudinary_url, isPrincipal);
      
      console.log('Photo saved successfully:', result);

      // Ajouter des en-têtes pour désactiver la mise en cache
      const headers = {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
      
      // S'assurer que nous retournons des valeurs primitives et non des objets complexes
      return NextResponse.json({
        success: true,
        id: result.id,
        nom: result.nom,
        principale: result.principale
      }, { headers });
    } catch (dbError: any) {
      console.error('Database error when saving photo:', dbError);
      return NextResponse.json({ 
        error: "Database error when saving photo", 
        details: dbError.message || String(dbError),
        stack: dbError.stack
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error saving Cloudinary photo:", error);
    return NextResponse.json({ 
      error: "Failed to save photo", 
      details: error.message || String(error)
    }, { status: 500 });
  }
}
