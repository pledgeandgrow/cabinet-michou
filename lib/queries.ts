import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface AnnonceRow extends RowDataPacket {
  id: number;
  nom: string;
  reference: string;
  prix: number;
  surface: number;
  pieces: number;
  chambres: number;
  typeLogement: string;
  transaction_id: number;
  chauffage: string;
  bilan_conso_id: string;
  bilan_emission_id: string;
  description: string;
  ville: string;
  cp: string;
  photo: string;
  [key: string]: any;
}

// Récupérer toutes les annonces avec leur photo principale
export async function getAllAnnonces() {
  try {
    const annonces = await query<AnnonceRow[]>({
      query: `
        SELECT a.*, t.nom as typeLogement, p.nom as photo 
        FROM annonces a 
        LEFT JOIN typebien t ON a.typebien_id = t.id 
        INNER JOIN annonces_photos p ON p.annonce_id = a.id
        WHERE a.publie = ? AND p.principale = ?
        ORDER BY RAND()
      `,
      values: [1, 1]
    });

    return annonces;
  } catch (error) {
    console.error('Error fetching annonces:', error);
    return [];
  }
}

// Récupérer une annonce par son ID
export async function getAnnonceById(id: string) {
  try {
    const annonces = await query({
      query: `
        SELECT a.*, 
               t.nom as typeLogement, 
               tr.nom as transaction, 
               c.nom as chauffage, 
               cu.nom as cuisine, 
               bc.nom as dpe_conso, 
               be.nom as dpe_emission, 
               h.nom as honoraires, 
               ch.nom as nom_charges 
        FROM annonces a 
        LEFT JOIN typebien t ON a.typebien_id = t.id 
        LEFT JOIN transaction tr ON a.transaction_id = tr.id
        LEFT JOIN chauffage c ON a.chauffage_id = c.id
        LEFT JOIN cuisine cu ON a.cuisine_id = cu.id
        LEFT JOIN honoraires h ON a.honoraires_id = h.id
        LEFT JOIN charges ch ON a.charges_id = ch.id
        LEFT JOIN bilan_conso bc ON a.bilan_conso_id = bc.id
        LEFT JOIN bilan_emission be ON a.bilan_emission_id = be.id
        LEFT JOIN sous_typebien st ON a.sous_typebien_id = st.id
        WHERE a.id = ?
      `,
      values: [id]
    });

    if (!annonces || annonces.length === 0) {
      return null;
    }

    return annonces[0];
  } catch (error) {
    console.error('Error fetching annonce:', error);
    return null;
  }
}

// Fonction pour récupérer les photos d'une annonce
export async function getAnnoncePhotos(annonceId: string | number) {
  const photos = await query({
    query: `
      SELECT id, nom as url
      FROM annonces_photos
      WHERE annonce_id = ?
      ORDER BY principale DESC
    `,
    values: [annonceId],
  });

  return photos.map((photo: any) => ({
    id: photo.id,
    url: `https://cabinet-michou.com/uploads/annonces/${annonceId}/${photo.url}`
  }));
}

// Récupérer les annonces de location
export async function getLocationAnnonces() {
  try {
    const annonces = await query({
      query: `
        SELECT a.*, t.nom as typeLogement, p.nom as photo 
        FROM annonces a 
        LEFT JOIN typebien t ON a.typebien_id = t.id 
        INNER JOIN annonces_photos p ON p.annonce_id = a.id
        WHERE a.publie = ? AND p.principale = ? AND a.transaction_id = ?
        ORDER BY a.id DESC
      `,
      values: [1, 1, 1]
    });

    return annonces;
  } catch (error) {
    console.error('Error fetching location annonces:', error);
    return [];
  }
}

// Récupérer les annonces de vente
export async function getVenteAnnonces() {
  try {
    const annonces = await query({
      query: `
        SELECT a.*, t.nom as typeLogement, p.nom as photo 
        FROM annonces a 
        LEFT JOIN typebien t ON a.typebien_id = t.id 
        INNER JOIN annonces_photos p ON p.annonce_id = a.id
        WHERE a.publie = ? AND p.principale = ? AND a.transaction_id = ?
        ORDER BY a.id DESC
      `,
      values: [1, 1, 2]
    });

    return annonces;
  } catch (error) {
    console.error('Error fetching vente annonces:', error);
    return [];
  }
}
