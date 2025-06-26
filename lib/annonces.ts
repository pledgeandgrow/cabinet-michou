import { query } from '@/lib/db';

// Types pour le typage fort
export interface Annonce {
  id: number;
  titre: string;
  description: string;
  prix: number;
  surface: number;
  nb_pieces: number;
  nb_chambres: number;
  ville: string;
  code_postal: string;
  date_creation: string;
  date_creation_fr: string;
  publie: number;
  transaction: string;
  typeLogement: string;
  sous_type: string | null;
  chauffage: string | null;
  cuisine: string | null;
  dpe_conso: string | null;
  dpe_emission: string | null;
  honoraires: string | null;
  nom_charges: string | null;
  photos: Photo[];
}

export interface Photo {
  id: number;
  url: string;
  principale: boolean;
  ordre: number;
}

// Requête de base avec toutes les jointures
const BASE_ANNONCE_QUERY = `
  SELECT 
    a.*,
    t.nom as typeLogement,
    tr.nom as transaction,
    COALESCE(c.nom, 'N/C') as chauffage,
    COALESCE(cu.nom, 'N/C') as cuisine,
    COALESCE(bc.nom, 'N/C') as dpe_conso,
    COALESCE(be.nom, 'N/C') as dpe_emission,
    COALESCE(h.nom, 'N/C') as honoraires,
    COALESCE(ch.nom, 'N/C') as nom_charges,
    COALESCE(st.nom, 'N/C') as sous_type,
    DATE_FORMAT(a.date_creation, '%d/%m/%Y') as date_creation_fr
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
`;

// Fonction pour récupérer les photos d'une annonce
export async function getAnnoncePhotos(annonceId: number | string) {
  const photos = await query({
    query: `
      SELECT id, nom, principale, ordre
      FROM annonces_photos 
      WHERE annonce_id = ?
      ORDER BY principale DESC, ordre ASC
    `,
    values: [annonceId]
  });

  return photos.map((photo: any) => {
    // Vérifier si c'est une URL Cloudinary ou un nom de fichier local
    const isCloudinaryUrl = photo.nom.startsWith('http') || photo.nom.includes('cloudinary.com');
    
    return {
      id: photo.id,
      // Si c'est une URL Cloudinary, utiliser directement l'URL complète
      // Sinon, construire l'URL locale
      url: isCloudinaryUrl ? photo.nom : `/uploads/annonces/${annonceId}/${photo.nom}`,
      principale: photo.principale === 1,
      ordre: photo.ordre
    };
  });
}

// Fonction pour récupérer une annonce par son ID
export async function getAnnonceById(id: string | number) {
  try {
    const annonces = await query({
      query: `${BASE_ANNONCE_QUERY} WHERE a.id = ?`,
      values: [id]
    });

    if (!annonces || annonces.length === 0) {
      return null;
    }

    const annonce = annonces[0];
    const photos = await getAnnoncePhotos(id);

    return {
      ...annonce,
      photos
    };
  } catch (error) {
    console.error("Error fetching annonce:", error);
    return null;
  }
}

// Fonction pour récupérer les annonces avec filtres
export async function getAnnonces({
  transactionId = null as number | null,
  limit = 50,
  offset = 0,
  search = '',
  ville = '',
  prixMin = null,
  prixMax = null,
  surfaceMin = null,
  surfaceMax = null,
  nbPieces = null,
  typeLogementId = null
} = {}) {
  try {
    let conditions = ['a.publie = 1'];
    let values: any[] = [];

    if (transactionId) {
      conditions.push('a.transaction_id = ?');
      values.push(transactionId);
    }

    if (search) {
      conditions.push('(a.titre LIKE ? OR a.description LIKE ? OR a.ville LIKE ?)');
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (ville) {
      conditions.push('a.ville LIKE ?');
      values.push(`%${ville}%`);
    }

    if (prixMin) {
      conditions.push('a.prix >= ?');
      values.push(prixMin);
    }

    if (prixMax) {
      conditions.push('a.prix <= ?');
      values.push(prixMax);
    }

    if (surfaceMin) {
      conditions.push('a.surface >= ?');
      values.push(surfaceMin);
    }

    if (surfaceMax) {
      conditions.push('a.surface <= ?');
      values.push(surfaceMax);
    }

    if (nbPieces) {
      conditions.push('a.nb_pieces = ?');
      values.push(nbPieces);
    }

    if (typeLogementId) {
      conditions.push('a.typebien_id = ?');
      values.push(typeLogementId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Récupérer les annonces
    const annonces = await query({
      query: `
        ${BASE_ANNONCE_QUERY}
        ${whereClause}
        ORDER BY a.date_creation DESC
        LIMIT ? OFFSET ?
      `,
      values: [...values, limit, offset]
    });

    // Récupérer les photos principales pour toutes les annonces
    const annoncesWithPhotos = await Promise.all(
      annonces.map(async (annonce: any) => {
        const photos = await query({
          query: `
            SELECT id, nom
            FROM annonces_photos
            WHERE annonce_id = ? AND principale = 1
            LIMIT 1
          `,
          values: [annonce.id]
        });

        return {
          ...annonce,
          photos: photos.length > 0 ? [{
            id: photos[0].id,
            url: `/annonces/${annonce.id}/${photos[0].nom}`,
            principale: true,
            ordre: 1
          }] : []
        };
      })
    );

    return annoncesWithPhotos;
  } catch (error) {
    console.error('Error fetching annonces:', error);
    return [];
  }
}

// Fonction pour compter le nombre total d'annonces avec filtres
export async function countAnnonces({
  transactionId = null as number | null,
  search = '',
  ville = '',
  prixMin = null,
  prixMax = null,
  surfaceMin = null,
  surfaceMax = null,
  nbPieces = null,
  typeLogementId = null
} = {}) {
  try {
    let conditions = ['a.publie = 1'];
    let values: any[] = [];

    if (transactionId) {
      conditions.push('a.transaction_id = ?');
      values.push(transactionId);
    }

    if (search) {
      conditions.push('(a.titre LIKE ? OR a.description LIKE ? OR a.ville LIKE ?)');
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (ville) {
      conditions.push('a.ville LIKE ?');
      values.push(`%${ville}%`);
    }

    if (prixMin) {
      conditions.push('a.prix >= ?');
      values.push(prixMin);
    }

    if (prixMax) {
      conditions.push('a.prix <= ?');
      values.push(prixMax);
    }

    if (surfaceMin) {
      conditions.push('a.surface >= ?');
      values.push(surfaceMin);
    }

    if (surfaceMax) {
      conditions.push('a.surface <= ?');
      values.push(surfaceMax);
    }

    if (nbPieces) {
      conditions.push('a.nb_pieces = ?');
      values.push(nbPieces);
    }

    if (typeLogementId) {
      conditions.push('a.typebien_id = ?');
      values.push(typeLogementId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [result] = await query({
      query: `
        SELECT COUNT(*) as total
        FROM annonces a
        ${whereClause}
      `,
      values
    });

    return result.total;
  } catch (error) {
    console.error('Error counting annonces:', error);
    return 0;
  }
}

// Fonction pour récupérer les valeurs possibles pour les filtres
export async function getFilterOptions() {
  try {
    const [
      typesLogement,
      transactions,
      villes,
      prixRange,
      surfaceRange,
      nbPiecesRange
    ] = await Promise.all([
      query({
        query: 'SELECT id, nom FROM typebien ORDER BY nom'
      }),
      query({
        query: 'SELECT id, nom FROM transaction ORDER BY nom'
      }),
      query({
        query: 'SELECT DISTINCT ville FROM annonces WHERE publie = 1 ORDER BY ville'
      }),
      query({
        query: 'SELECT MIN(prix) as min, MAX(prix) as max FROM annonces WHERE publie = 1'
      }),
      query({
        query: 'SELECT MIN(surface) as min, MAX(surface) as max FROM annonces WHERE publie = 1'
      }),
      query({
        query: 'SELECT MIN(nb_pieces) as min, MAX(nb_pieces) as max FROM annonces WHERE publie = 1'
      })
    ]);

    return {
      typesLogement,
      transactions,
      villes: villes.map((v: any) => v.ville),
      prix: prixRange[0],
      surface: surfaceRange[0],
      nbPieces: nbPiecesRange[0]
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return null;
  }
}
