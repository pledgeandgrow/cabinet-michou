import { getSupabaseClient } from '@/lib/db';

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

// Fonction pour récupérer les photos d'une annonce
export async function getAnnoncePhotos(annonceId: number | string) {
  try {
    const supabase = getSupabaseClient();
    const { data: photos, error } = await supabase
      .from('annonces_photos')
      .select('id, nom, principale, ordre')
      .eq('annonce_id', annonceId)
      .order('principale', { ascending: false })
      .order('ordre', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des photos:", error);
      return [];
    }

    return photos.map((photo: any) => {
      // S'assurer que nom est toujours une chaîne de caractères
      let photoUrl = '';
      if (typeof photo.nom === 'string') {
        photoUrl = photo.nom;
      } else if (photo.nom && typeof photo.nom === 'object') {
        // Si c'est un objet, essayer de le convertir en chaîne
        try {
          photoUrl = photo.nom.toString() || '';
          console.warn(`photo.nom est un objet pour photo ${photo.id}:`, photo.nom);
        } catch (e) {
          photoUrl = '';
          console.error(`Erreur lors de la conversion de photo.nom en chaîne pour photo ${photo.id}:`, e);
        }
      }
      
      // Toutes les photos sont des URLs Cloudinary
      return {
        id: photo.id,
        // Utiliser directement l'URL Cloudinary
        url: photoUrl || '/placeholder.svg?height=400&width=600',
        principale: photo.principale === 1,
        ordre: photo.ordre
      };
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des photos:", error);
    return [];
  }
}

// Fonction pour récupérer une annonce par son ID
export async function getAnnonceById(id: string | number) {
  try {
    const supabase = getSupabaseClient();
    
    // Essayer d'utiliser la fonction RPC get_listing_by_id si elle existe
    try {
      const { data: annonce, error } = await supabase
        .rpc('get_listing_by_id', { p_id: id });
      
      if (!error && annonce) {
        const photos = await getAnnoncePhotos(id);
        return { ...annonce, photos };
      }
    } catch (rpcError) {
      console.warn("Fonction RPC get_listing_by_id non disponible, utilisation d'une requête directe", rpcError);
    }
    
    // Fallback: requête directe si la fonction RPC n'est pas disponible
    const { data: annonce, error } = await supabase
      .from('annonces')
      .select(`
        *,
        typebien:typebien_id(nom),
        transaction:transaction_id(nom),
        chauffage:chauffage_id(nom),
        cuisine:cuisine_id(nom),
        bilan_conso:bilan_conso_id(nom),
        bilan_emission:bilan_emission_id(nom),
        honoraires:honoraires_id(nom),
        charges:charges_id(nom),
        sous_typebien:sous_typebien_id(nom)
      `)
      .eq('id', id)
      .single();
    
    if (error || !annonce) {
      console.error("Erreur lors de la récupération de l'annonce:", error);
      return null;
    }
    
    // Formater les données pour correspondre à l'interface Annonce
    const formattedAnnonce = {
      ...annonce,
      typeLogement: annonce.typebien?.nom || 'N/C',
      transaction: annonce.transaction?.nom || 'N/C',
      chauffage: annonce.chauffage?.nom || 'N/C',
      cuisine: annonce.cuisine?.nom || 'N/C',
      dpe_conso: annonce.bilan_conso?.nom || 'N/C',
      dpe_emission: annonce.bilan_emission?.nom || 'N/C',
      honoraires: annonce.honoraires?.nom || 'N/C',
      nom_charges: annonce.charges?.nom || 'N/C',
      sous_type: annonce.sous_typebien?.nom || 'N/C',
      date_creation_fr: new Date(annonce.date_creation).toLocaleDateString('fr-FR')
    };
    
    // Récupérer les photos
    const photos = await getAnnoncePhotos(id);
    
    return {
      ...formattedAnnonce,
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
    const supabase = getSupabaseClient();
    
    // Essayer d'utiliser la fonction RPC get_all_listings si elle existe
    try {
      const { data: annonces, error } = await supabase
        .rpc('get_all_listings', {
          p_transaction_id: transactionId,
          p_limit: limit,
          p_offset: offset,
          p_search: search,
          p_ville: ville,
          p_prix_min: prixMin,
          p_prix_max: prixMax,
          p_surface_min: surfaceMin,
          p_surface_max: surfaceMax,
          p_nb_pieces: nbPieces,
          p_typebien_id: typeLogementId
        });
      
      if (!error && annonces) {
        // Récupérer les photos principales pour toutes les annonces
        const annoncesWithPhotos = await Promise.all(
          annonces.map(async (annonce: any) => {
            const photos = await getAnnoncePhotos(annonce.id);
            return {
              ...annonce,
              photos: photos.filter((photo: any) => photo.principale).slice(0, 1)
            };
          })
        );
        
        return annoncesWithPhotos;
      }
    } catch (rpcError) {
      console.warn("Fonction RPC get_all_listings non disponible, utilisation d'une requête directe", rpcError);
    }
    
    // Fallback: requête directe si la fonction RPC n'est pas disponible
    let query = supabase
      .from('annonces')
      .select(`
        *,
        typebien:typebien_id(nom),
        transaction:transaction_id(nom),
        chauffage:chauffage_id(nom),
        cuisine:cuisine_id(nom),
        bilan_conso:bilan_conso_id(nom),
        bilan_emission:bilan_emission_id(nom),
        honoraires:honoraires_id(nom),
        charges:charges_id(nom),
        sous_typebien:sous_typebien_id(nom)
      `)
      .eq('publie', 1)
      .order('date_creation', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Appliquer les filtres
    if (transactionId) {
      query = query.eq('transaction_id', transactionId);
    }
    
    if (search) {
      query = query.or(`titre.ilike.%${search}%,description.ilike.%${search}%,ville.ilike.%${search}%`);
    }
    
    if (ville) {
      query = query.ilike('ville', `%${ville}%`);
    }
    
    if (prixMin) {
      query = query.gte('prix', prixMin);
    }
    
    if (prixMax) {
      query = query.lte('prix', prixMax);
    }
    
    if (surfaceMin) {
      query = query.gte('surface', surfaceMin);
    }
    
    if (surfaceMax) {
      query = query.lte('surface', surfaceMax);
    }
    
    if (nbPieces) {
      query = query.eq('nb_pieces', nbPieces);
    }
    
    if (typeLogementId) {
      query = query.eq('typebien_id', typeLogementId);
    }
    
    const { data: annonces, error } = await query;
    
    if (error) {
      console.error("Erreur lors de la récupération des annonces:", error);
      return [];
    }
    
    // Formater les données et récupérer les photos principales
    const annoncesWithPhotos = await Promise.all(
      annonces.map(async (annonce: any) => {
        const formattedAnnonce = {
          ...annonce,
          typeLogement: annonce.typebien?.nom || 'N/C',
          transaction: annonce.transaction?.nom || 'N/C',
          chauffage: annonce.chauffage?.nom || 'N/C',
          cuisine: annonce.cuisine?.nom || 'N/C',
          dpe_conso: annonce.bilan_conso?.nom || 'N/C',
          dpe_emission: annonce.bilan_emission?.nom || 'N/C',
          honoraires: annonce.honoraires?.nom || 'N/C',
          nom_charges: annonce.charges?.nom || 'N/C',
          sous_type: annonce.sous_typebien?.nom || 'N/C',
          date_creation_fr: new Date(annonce.date_creation).toLocaleDateString('fr-FR')
        };
        
        // Récupérer uniquement la photo principale
        const { data: photos } = await supabase
          .from('annonces_photos')
          .select('id, nom')
          .eq('annonce_id', annonce.id)
          .eq('principale', true)
          .limit(1);
        
        // S'assurer que photo.nom est toujours une chaîne de caractères
        let photoUrl = '';
        if (photos && photos.length > 0) {
          if (typeof photos[0].nom === 'string') {
            photoUrl = photos[0].nom;
          } else if (photos[0].nom && typeof photos[0].nom === 'object') {
            try {
              photoUrl = photos[0].nom.toString() || '';
              console.warn(`photo.nom est un objet pour photo ${photos[0].id}:`, photos[0].nom);
            } catch (e) {
              photoUrl = '';
              console.error(`Erreur lors de la conversion de photo.nom en chaîne pour photo ${photos[0].id}:`, e);
            }
          }
        }
        
        return {
          ...formattedAnnonce,
          photos: photos && photos.length > 0 ? [{
            id: photos[0].id,
            url: photoUrl || '/placeholder.svg?height=400&width=600', // Utiliser directement l'URL Cloudinary
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
    const supabase = getSupabaseClient();
    
    // Construire la requête avec les filtres
    let query = supabase
      .from('annonces')
      .select('id', { count: 'exact' })
      .eq('publie', 1);
    
    // Appliquer les filtres
    if (transactionId) {
      query = query.eq('transaction_id', transactionId);
    }
    
    if (search) {
      query = query.or(`titre.ilike.%${search}%,description.ilike.%${search}%,ville.ilike.%${search}%`);
    }
    
    if (ville) {
      query = query.ilike('ville', `%${ville}%`);
    }
    
    if (prixMin) {
      query = query.gte('prix', prixMin);
    }
    
    if (prixMax) {
      query = query.lte('prix', prixMax);
    }
    
    if (surfaceMin) {
      query = query.gte('surface', surfaceMin);
    }
    
    if (surfaceMax) {
      query = query.lte('surface', surfaceMax);
    }
    
    if (nbPieces) {
      query = query.eq('nb_pieces', nbPieces);
    }
    
    if (typeLogementId) {
      query = query.eq('typebien_id', typeLogementId);
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error("Erreur lors du comptage des annonces:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error counting annonces:', error);
    return 0;
  }
}

// Fonction pour récupérer les valeurs possibles pour les filtres
export async function getFilterOptions() {
  try {
    const supabase = getSupabaseClient();
    
    // Récupérer les types de logement
    const { data: typesLogement, error: typesError } = await supabase
      .from('typebien')
      .select('id, nom')
      .order('nom');
    
    if (typesError) {
      console.error("Erreur lors de la récupération des types de logement:", typesError);
      return null;
    }
    
    // Récupérer les types de transaction
    const { data: transactions, error: transactionsError } = await supabase
      .from('transaction')
      .select('id, nom')
      .order('nom');
    
    if (transactionsError) {
      console.error("Erreur lors de la récupération des types de transaction:", transactionsError);
      return null;
    }
    
    // Récupérer les villes distinctes
    const { data: villesData, error: villesError } = await supabase
      .from('annonces')
      .select('ville')
      .eq('publie', 1)
      .order('ville');
    
    if (villesError) {
      console.error("Erreur lors de la récupération des villes:", villesError);
      return null;
    }
    
    // Récupérer les valeurs min et max pour prix, surface et nb_pieces
    const { data: prixData, error: prixError } = await supabase
      .from('annonces')
      .select('prix')
      .eq('publie', 1)
      .order('prix', { ascending: true });
    
    if (prixError) {
      console.error("Erreur lors de la récupération des prix:", prixError);
      return null;
    }
    
    const { data: surfaceData, error: surfaceError } = await supabase
      .from('annonces')
      .select('surface')
      .eq('publie', 1)
      .order('surface', { ascending: true });
    
    if (surfaceError) {
      console.error("Erreur lors de la récupération des surfaces:", surfaceError);
      return null;
    }
    
    const { data: nbPiecesData, error: nbPiecesError } = await supabase
      .from('annonces')
      .select('nb_pieces')
      .eq('publie', 1)
      .order('nb_pieces', { ascending: true });
    
    if (nbPiecesError) {
      console.error("Erreur lors de la récupération des nombres de pièces:", nbPiecesError);
      return null;
    }
    
    // Extraire les valeurs distinctes de villes
    const villes = villesData ? [...new Set(villesData.map((v: any) => v.ville))] : [];
    
    // Calculer les min et max pour prix, surface et nb_pieces
    const prixMin = prixData && prixData.length > 0 ? Math.min(...prixData.map((p: any) => p.prix)) : 0;
    const prixMax = prixData && prixData.length > 0 ? Math.max(...prixData.map((p: any) => p.prix)) : 0;
    
    const surfaceMin = surfaceData && surfaceData.length > 0 ? Math.min(...surfaceData.map((s: any) => s.surface)) : 0;
    const surfaceMax = surfaceData && surfaceData.length > 0 ? Math.max(...surfaceData.map((s: any) => s.surface)) : 0;
    
    const nbPiecesMin = nbPiecesData && nbPiecesData.length > 0 ? Math.min(...nbPiecesData.map((n: any) => n.nb_pieces)) : 0;
    const nbPiecesMax = nbPiecesData && nbPiecesData.length > 0 ? Math.max(...nbPiecesData.map((n: any) => n.nb_pieces)) : 0;
    
    return {
      typesLogement,
      transactions,
      villes,
      prix: { min: prixMin, max: prixMax },
      surface: { min: surfaceMin, max: surfaceMax },
      nbPieces: { min: nbPiecesMin, max: nbPiecesMax }
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return null;
  }
}
