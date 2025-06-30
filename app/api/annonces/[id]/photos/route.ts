import { type NextRequest, NextResponse } from "next/server";
import { getAnnoncePhotos, addAnnoncePhoto, deleteAnnoncePhoto, setAnnoncePrincipalPhoto } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Utiliser un répertoire temporaire compatible avec Vercel
const UPLOAD_DIR = process.env.NODE_ENV === 'production' 
  ? path.join(process.env.TEMP || process.env.TMP || '/tmp', 'uploads', 'annonces')
  : path.join(process.cwd(), "public", "uploads", "annonces");

export const dynamic = 'force-dynamic';

async function ensureUploadDir(annonceId: string) {
  const annonceDir = path.join(UPLOAD_DIR, annonceId);
  
  try {
    await mkdir(annonceDir, { recursive: true });
    return annonceDir;
  } catch (error) {
    console.error("Erreur lors de la création du répertoire:", error);
    // En cas d'échec, retourner quand même le chemin pour que le code continue
    // Les opérations d'écriture échoueront mais le code de Cloudinary fonctionnera
    return annonceDir;
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const annonceId = parseInt(params.id);
    
    if (isNaN(annonceId)) {
      return NextResponse.json({ error: "Invalid annonce ID" }, { status: 400 });
    }

    const photos = await getAnnoncePhotos(annonceId);
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json(photos, { headers });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const annonceId = parseInt(params.id);
    
    if (isNaN(annonceId)) {
      return NextResponse.json({ error: "Invalid annonce ID" }, { status: 400 });
    }

    const annonceDir = await ensureUploadDir(params.id);
    const formData = await request.formData();

    const existingPhotosJson = formData.get("existingPhotos") as string;
    const existingPhotos = existingPhotosJson ? JSON.parse(existingPhotosJson) : [];

    // Traiter les photos existantes
    const processedPhotoIds = new Set();
    
    // Mettre à jour la photo principale si nécessaire
    for (const photo of existingPhotos) {
      if (photo.principale && photo.id) {
        await setAnnoncePrincipalPhoto(annonceId, photo.id);
      }
      processedPhotoIds.add(photo.id);
    }
    
    // Récupérer toutes les photos actuelles pour supprimer celles qui ne sont plus dans la liste
    const currentPhotos = await getAnnoncePhotos(annonceId);
    for (const photo of currentPhotos) {
      if (!processedPhotoIds.has(photo.id)) {
        await deleteAnnoncePhoto(photo.id);
      }
    }

    // Traiter les nouveaux fichiers
    const files = formData.getAll("files") as File[];
    const fileInfos = formData.getAll("fileInfo").map((info) => JSON.parse(info as string));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileInfo = fileInfos[i];
      let filename = fileInfo.name;

      // En production ou si une URL Cloudinary est fournie, utiliser Cloudinary
      if (process.env.NODE_ENV === 'production' || fileInfo.cloudinary_url) {
        // Utiliser l'URL Cloudinary comme nom de fichier si disponible
        filename = fileInfo.cloudinary_url || fileInfo.name;
      } else {
        // En développement, enregistrer le fichier localement
        try {
          const timestamp = Date.now();
          const uniqueFilename = `${timestamp}-${fileInfo.name}`;

          const buffer = Buffer.from(await file.arrayBuffer());
          await writeFile(path.join(annonceDir, uniqueFilename), buffer);
          filename = uniqueFilename;
        } catch (error) {
          console.error("Erreur lors de l'écriture du fichier:", error);
          // En cas d'échec, utiliser simplement le nom du fichier
          filename = fileInfo.name;
        }
      }

      // Ajouter la photo à la base de données
      await addAnnoncePhoto(annonceId, filename, fileInfo.principale);
    }

    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error("Error saving photos:", error);
    return NextResponse.json({ error: "Failed to save photos" }, { status: 500 });
  }
}
