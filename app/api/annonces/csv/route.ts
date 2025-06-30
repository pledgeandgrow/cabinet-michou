import { NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as path from 'path';
import { Client } from 'basic-ftp';
import archiver from 'archiver';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getListing, getListings } from '@/lib/db';

// Types pour les annonces
interface Annonce {
  id: number;
  transaction_id: number; // 1 = Vente, 2 = Location (à mapper)
  typebien: string;
  reference: string;
  nom: string;
  surface: number;
  surface_terrain?: number;
  pieces?: number;
  chambres?: number;
  cp: string;
  ville: string;
  adresse: string;
  quartier?: string;
  prix_avec_honoraires: number;
  charges?: number;
  etage?: number;
  meuble?: boolean;
  construction?: number;
  ascenseur?: boolean;
  chauffage_id?: number;
  cuisine_id?: number;
  securite?: string;
  digicode?: boolean;
  interphone?: boolean;
  visite_virtuelle?: string;
  description?: string;
  se_loger?: boolean;
  publie?: boolean;
  honoraires_locataire?: number;
  honoraires_acheteur?: number;
}

interface AnnoncesPhotos {
  id: number;
  annonce_id: number;
  nom: string;
  principale: boolean;
}


export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { annonceId } = await request.json() as { annonceId?: number };
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    // Utiliser le répertoire temporaire du système (compatible avec Vercel)
    const tempDir = path.join(process.env.TEMP || process.env.TMP || '/tmp', 'seloger-export-' + Date.now());
    await mkdir(tempDir, { recursive: true });
    
    // Le fichier ZIP sera également créé dans ce répertoire temporaire
    const exportDir = tempDir;
    
    // Générer le fichier CSV
    let annonces: Annonce[] = [];
    if (annonceId) {
      // Si un ID d'annonce est spécifié, exporter uniquement cette annonce
      const annonce = await getListing(annonceId);
      if (annonce) annonces.push(annonce as Annonce);
    } else {
      // Sinon, exporter toutes les annonces publiées
      const allAnnonces = await getListings();
      annonces = allAnnonces.filter((a: Annonce) => a.publie);
    }
    
    if (annonces.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Aucune annonce à exporter" 
      }, { headers });
    }
    
    // Récupérer les photos des annonces
    const photos = await getPhotos(annonceId);
    
    // Générer le fichier CSV
    const csvPath = path.join(tempDir, 'Annonces.csv');
    const csvContent = generateSeLogerCSV(annonces, photos);
    fs.writeFileSync(csvPath, csvContent);
    
    // Créer le fichier de configuration
    const configPath = path.join(tempDir, 'Config.txt');
    const configContent = generateConfigFile();
    fs.writeFileSync(configPath, configContent);
    
    // Créer le fichier de configuration des photos
    const photosCfgPath = path.join(tempDir, 'Photos.cfg');
    const photosCfgContent = await generatePhotosCfgFile(annonces, photos);
    fs.writeFileSync(photosCfgPath, photosCfgContent);
    
    // Générer un nom de fichier unique avec timestamp
    const timestamp = new Date().getTime();
    const zipFilename = `SeLogerExport_${timestamp}.zip`;
    const zipPath = path.join(exportDir, zipFilename);
    
    // Créer le fichier ZIP
    await createZipArchive(tempDir, zipPath, ['Annonces.csv', 'Config.txt', 'Photos.cfg']);
    
    // Lire le contenu du fichier ZIP en mémoire
    const zipContent = fs.readFileSync(zipPath);
    
    // Nettoyer tous les fichiers temporaires y compris le ZIP
    cleanupTempFiles(tempDir);
    
    // Retourner directement le contenu du fichier ZIP avec les en-têtes appropriés
    return new NextResponse(zipContent, { 
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    );
  }
}

// Fonction pour générer le contenu CSV au format SeLoger
export function generateSeLogerCSV(
  annonces: Annonce[],
  annonces_photos: AnnoncesPhotos[]
): string {
  let csvContent = '';

  annonces.forEach((annonce) => {
    const fields = new Array(334).fill('""');

    // Champs obligatoires
    fields[0] = '"PLEDGEANDGROW"';
    fields[1] = `"${annonce.reference}"`;
    fields[2] = annonce.transaction_id === 1 ? '"Vente"' : '"Location"';
    fields[3] = `"${mapTypeBien(annonce.typebien)}"`;
    fields[4] = `"${annonce.cp}"`;
    fields[5] = `"${annonce.ville}"`;
    fields[6] = '"France"';
    fields[7] = `"${annonce.adresse}"`;
    fields[8] = `"${annonce.quartier || ''}"`;
    fields[10] = `"${annonce.prix_avec_honoraires}"`;
    fields[12] = '"OUI"';
    fields[13] = '"NON"';
    fields[14] = `"${annonce.honoraires_locataire || annonce.honoraires_acheteur || ''}"`;
    fields[15] = `"${annonce.surface}"`;
    fields[16] = `"${annonce.surface_terrain || ''}"`;
    fields[17] = `"${annonce.pieces || '0'}"`;
    fields[18] = `"${annonce.chambres || ''}"`;
    fields[19] = `"${annonce.nom}"`;
    fields[20] = `"${(annonce.description || '').replace(/"/g, "'").replace(/\n/g, '<BR>')}"`;
    fields[22] = `"${annonce.charges || ''}"`;
    fields[23] = `"${annonce.etage || ''}"`;
    fields[25] = `"${annonce.meuble ? 'OUI' : 'NON'}"`;
    fields[26] = `"${annonce.construction || ''}"`;
    fields[33] = `"${annonce.ascenseur ? 'OUI' : 'NON'}"`;
    fields[40] = `"${mapChauffage(annonce.chauffage_id)}"`;
    fields[44] = `"${mapCuisine(annonce.cuisine_id)}"`;
    fields[45] = `"${annonce.securite || ''}"`;
    fields[79] = `"${annonce.digicode ? 'OUI' : 'NON'}"`;
    fields[81] = `"${annonce.interphone ? 'OUI' : 'NON'}"`;
    fields[104] = `"${annonce.visite_virtuelle || ''}"`;
    fields[174] = `"${annonce.id}"`;
    fields[331] = `"${annonce.se_loger ? 'OUI' : 'NON'}"`;
    fields[333] = `"${annonce.publie ? 'OUI' : 'NON'}"`;

    // 📸 Ajout des photos (85 → 104)
    const photosAnnonce = annonces_photos
      .filter(p => p.annonce_id === annonce.id)
      .sort((a, b) => (a.principale === b.principale ? 0 : a.principale ? -1 : 1));

    for (let i = 0; i < Math.min(photosAnnonce.length, 20); i++) {
      fields[84 + i] = `"${photosAnnonce[i].nom}"`;
    }

    csvContent += fields.join(' !# ') + '\n';
  });

  return csvContent;
}

function mapChauffage(id?: number): string {
  const map: { [key: number]: string } = {
    1: 'Individuel',
    2: 'Collectif',
    3: 'Gaz',
    4: 'Électrique'
  };
  return id ? map[id] || '' : '';
}

function mapCuisine(id?: number): string {
  const map: { [key: number]: string } = {
    1: 'Américaine',
    2: 'Séparée',
    3: 'Coin cuisine',
  };
  return id ? map[id] || '' : '';
}

// Fonction pour mapper les types de biens de votre application aux types SeLoger
function mapTypeBien(typeBien: string): string {
  const mapping: Record<string, string> = {
    'Appartement': 'Appartement',
    'Maison': 'Maison/villa',
    'Studio': 'Appartement',
    'Terrain': 'Terrain',
    'Local commercial': 'Local',
    'Bureau': 'Bureaux',
    'Parking': 'Parking/box'
  };
  
  return mapping[typeBien] || 'Appartement';
}

// Fonction pour générer le fichier de configuration
function generateConfigFile(): string {
  // Format requis par SeLoger
  return `Version=4.12
Application=CabinetMichou/1.0.0
Devise=Euro`;
}

// Fonction pour récupérer les photos des annonces
async function getPhotos(annonceId?: number): Promise<AnnoncesPhotos[]> {
  try {
    const supabase = createClient(cookies());
    let query = supabase.from('annonces_photos').select('*');
    
    if (annonceId) {
      query = query.eq('annonce_id', annonceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      return [];
    }
    
    return data as AnnoncesPhotos[];
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    return [];
  }
}

// Fonction pour générer le fichier de configuration des photos
async function generatePhotosCfgFile(annonces: Annonce[], photos: AnnoncesPhotos[]): Promise<string> {
  // Uniquement 'Mode=URL' comme demandé
  return 'Mode=URL\n';
}

// Fonction pour créer une archive ZIP
async function createZipArchive(sourceDir: string, outputPath: string, files: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Niveau de compression maximum
    });
    
    output.on('close', () => resolve(true));
    archive.on('error', (err: Error) => reject(err));
    
    archive.pipe(output);
    
    // Ajouter les fichiers à l'archive
    files.forEach((file: string) => {
      archive.file(path.join(sourceDir, file), { name: file });
    });
    
    archive.finalize();
  });
}

// Fonction pour envoyer le fichier via FTP
async function sendToFTP(filePath: string): Promise<boolean> {
  const client = new Client();
  
  try {
    await client.access({
      host: process.env.FTP_HOST,
      port: parseInt(process.env.FTP_PORT || '990'),
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: process.env.FTP_SECURE === 'true',
      secureOptions: { rejectUnauthorized: false }
    });
    
    console.log('Connexion FTP établie');
    
    // Définir le mode passif si nécessaire
    if (process.env.FTP_PASSIVE === 'true') {
      // La bibliothèque basic-ftp gère automatiquement le mode passif
      // Pas besoin de configuration supplémentaire
    }
    
    // Envoyer le fichier
    await client.uploadFrom(filePath, path.basename(filePath));
    console.log('Fichier envoyé avec succès');
    
    return true;
  } catch (err) {
    console.error('Erreur lors de l\'envoi FTP:', err);
    throw err;
  } finally {
    client.close();
  }
}

// Fonction pour nettoyer les fichiers temporaires
function cleanupTempFiles(tempDir: string): void {
  try {
    // Supprimer récursivement le répertoire temporaire et son contenu
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        fs.unlinkSync(filePath);
      });
      
      // Supprimer le répertoire lui-même
      fs.rmdirSync(tempDir);
    }
  } catch (err) {
    console.error('Erreur lors du nettoyage des fichiers temporaires:', err);
  }
}
