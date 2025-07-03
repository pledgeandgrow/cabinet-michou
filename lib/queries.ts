import { getSupabaseClient } from '@/lib/db';

interface AnnonceRow {
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
    const supabase = getSupabaseClient();
    
    console.log('Fetching all annonces with their main photo');
    
    // Utiliser une requête SQL via Supabase
    const { data: annonces, error } = await supabase
      .from('annonces')
      .select(`
        *,
        typebien (
          nom
        ),
        annonces_photos (
          id,
          nom,
          principale
        )
      `)
      .eq('publie', 1)
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Error fetching annonces:', error);
      return [];
    }
    
    console.log(`Found ${annonces.length} annonces`);
    
    // Transformer les données pour correspondre à l'ancien format
    return annonces.map((annonce: any) => {
      // Récupérer le nom de la photo principale, en cherchant d'abord une photo marquée comme principale
      let photoNom = '';
      
      if (annonce.annonces_photos && Array.isArray(annonce.annonces_photos) && annonce.annonces_photos.length > 0) {
        // Chercher d'abord une photo marquée comme principale
        const photoPrincipale = annonce.annonces_photos.find((photo: any) => photo.principale === true);
        
        // Si aucune photo principale n'est trouvée, prendre la première photo disponible
        photoNom = photoPrincipale ? photoPrincipale.nom : annonce.annonces_photos[0]?.nom || '';
      }
      
      console.log(`Annonce ${annonce.id} photo: ${photoNom}`);
      
      return {
        ...annonce,
        typeLogement: annonce.typebien?.nom || '',
        photo: photoNom // URL Cloudinary directe
      };
    });
  } catch (error) {
    console.error('Error fetching annonces:', error);
    return [];
  }
}

// Récupérer une annonce par son ID
export async function getAnnonceById(id: string) {
  try {
    const supabase = getSupabaseClient();
    
    // Utiliser une requête avec jointures via Supabase
    const { data: annonces, error } = await supabase
      .from('annonces')
      .select(`
        *,
        typebien (nom),
        transaction (nom),
        chauffage (nom),
        cuisine (nom),
        bilan_conso (nom),
        bilan_emission (nom),
        honoraires (nom),
        charges (nom),
        sous_typebien (nom)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching annonce:', error);
      return null;
    }
    
    if (!annonces) {
      return null;
    }
    
    // Extraire les valeurs des objets pour éviter de passer des objets comme enfants React
    const typebienNom = typeof annonces.typebien === 'object' && annonces.typebien ? 
      (typeof annonces.typebien.nom === 'string' ? annonces.typebien.nom : '') : '';
    
    const transactionNom = typeof annonces.transaction === 'object' && annonces.transaction ? 
      (typeof annonces.transaction.nom === 'string' ? annonces.transaction.nom : '') : '';
    
    const chauffageNom = typeof annonces.chauffage === 'object' && annonces.chauffage ? 
      (typeof annonces.chauffage.nom === 'string' ? annonces.chauffage.nom : '') : '';
    
    const cuisineNom = typeof annonces.cuisine === 'object' && annonces.cuisine ? 
      (typeof annonces.cuisine.nom === 'string' ? annonces.cuisine.nom : '') : '';
    
    const bilanConsoNom = typeof annonces.bilan_conso === 'object' && annonces.bilan_conso ? 
      (typeof annonces.bilan_conso.nom === 'string' ? annonces.bilan_conso.nom : '') : '';
    
    const bilanEmissionNom = typeof annonces.bilan_emission === 'object' && annonces.bilan_emission ? 
      (typeof annonces.bilan_emission.nom === 'string' ? annonces.bilan_emission.nom : '') : '';
    
    const honorairesNom = typeof annonces.honoraires === 'object' && annonces.honoraires ? 
      (typeof annonces.honoraires.nom === 'string' ? annonces.honoraires.nom : '') : '';
    
    const chargesNom = typeof annonces.charges === 'object' && annonces.charges ? 
      (typeof annonces.charges.nom === 'string' ? annonces.charges.nom : '') : '';
    
    const sousTypebienNom = typeof annonces.sous_typebien === 'object' && annonces.sous_typebien ? 
      (typeof annonces.sous_typebien.nom === 'string' ? annonces.sous_typebien.nom : '') : '';
    
    // Créer un nouvel objet sans les propriétés objets
    const annonceClean = { ...annonces };
    delete annonceClean.typebien;
    delete annonceClean.transaction;
    delete annonceClean.chauffage;
    delete annonceClean.cuisine;
    delete annonceClean.bilan_conso;
    delete annonceClean.bilan_emission;
    delete annonceClean.honoraires;
    delete annonceClean.charges;
    delete annonceClean.sous_typebien;
    
    // Ajouter les propriétés extraites comme chaînes de caractères
    return {
      ...annonceClean,
      typeLogement: typebienNom,
      transaction: transactionNom,
      chauffage: chauffageNom,
      cuisine: cuisineNom,
      dpe_conso: bilanConsoNom,
      dpe_emission: bilanEmissionNom,
      honoraires: honorairesNom,
      sous_type: sousTypebienNom,
      // S'assurer que nom est une chaîne et non un objet
      nom: typeof annonceClean.nom === 'string' ? annonceClean.nom : String(annonceClean.nom || '')
    };
  } catch (error) {
    console.error('Error fetching annonce:', error);
    return null;
  }
}

// Fonction pour récupérer les photos d'une annonce
export async function getAnnoncePhotos(annonceId: string | number) {
  try {
    // Ajouter un timestamp pour éviter le cache
    const timestamp = Date.now();
    const supabase = getSupabaseClient();
    
    console.log(`Fetching photos for annonce ${annonceId}`);
    
    const { data: photos, error } = await supabase
      .from('annonces_photos')
      .select('id, nom, principale')
      .eq('annonce_id', annonceId)
      .order('principale', { ascending: false });
    
    if (error) {
      console.error(`Error fetching photos for annonce ${annonceId}:`, error);
      return [];
    }
    
    console.log(`Found ${photos.length} photos for annonce ${annonceId}`);
    
    // Transformer les photos pour ne retourner que id et url
    const transformedPhotos = photos.map((photo: any) => {
      // Vérifier si photo.nom existe
      if (!photo.nom) {
        console.error(`Invalid photo.nom for photo ${photo.id}:`, photo.nom);
        return {
          id: photo.id,
          url: '/placeholder.svg?height=400&width=600'
        };
      }
      
      // Traiter photo.nom selon son type
      let photoUrl = '';
      
      if (typeof photo.nom === 'string') {
        photoUrl = photo.nom;
      } else if (typeof photo.nom === 'object') {
        try {
          // Si c'est un objet, essayer de le convertir en chaîne
          photoUrl = String(photo.nom);
          console.warn(`photo.nom est un objet pour photo ${photo.id}, converti en: ${photoUrl}`);
        } catch (e) {
          photoUrl = '/placeholder.svg?height=400&width=600';
          console.error(`Erreur lors de la conversion de photo.nom en chaîne pour photo ${photo.id}:`, e);
        }
      }
      
      // Ajouter le paramètre de cache si nécessaire
      if (photoUrl && !photoUrl.includes('?')) {
        photoUrl = `${photoUrl}?t=${timestamp}`;
      }
      
      // Ne retourner que id et url, pas d'autres propriétés
      return {
        id: photo.id,
        url: photoUrl || '/placeholder.svg?height=400&width=600'
      };
    });
    
    console.log('Photos transformées:', JSON.stringify(transformedPhotos));
    return transformedPhotos;
  } catch (error) {
    console.error(`Error fetching photos for annonce ${annonceId}:`, error);
    return [];
  }
}

// Récupérer les annonces de location
export async function getLocationAnnonces() {
  try {
    const supabase = getSupabaseClient();
    
    const { data: annonces, error } = await supabase
      .from('annonces')
      .select(`
        *,
        typebien (nom),
        annonces_photos!inner (nom)
      `)
      .eq('publie', 1)
      .eq('transaction_id', 1)
      .eq('annonces_photos.principale', 1)
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Error fetching location annonces:', error);
      return [];
    }
    
    // Transformer les données pour correspondre à l'ancien format
    return annonces.map((annonce: any) => ({
      ...annonce,
      typeLogement: annonce.typebien?.nom || '',
      photo: annonce.annonces_photos[0]?.nom || ''
    }));
  } catch (error) {
    console.error('Error fetching location annonces:', error);
    return [];
  }
}

// Récupérer les annonces de vente
export async function getVenteAnnonces() {
  try {
    const supabase = getSupabaseClient();
    
    const { data: annonces, error } = await supabase
      .from('annonces')
      .select(`
        *,
        typebien (nom),
        annonces_photos!inner (nom)
      `)
      .eq('publie', 1)
      .eq('transaction_id', 2)
      .eq('annonces_photos.principale', 1)
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Error fetching vente annonces:', error);
      return [];
    }
    
    // Transformer les données pour correspondre à l'ancien format
    return annonces.map((annonce: any) => ({
      ...annonce,
      typeLogement: annonce.typebien?.nom || '',
      photo: annonce.annonces_photos[0]?.nom || ''
    }));
  } catch (error) {
    console.error('Error fetching vente annonces:', error);
    return [];
  }
}
