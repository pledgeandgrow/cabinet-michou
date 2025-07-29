import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export function getSupabaseClient() {
  const cookieStore = cookies();
  return createClient(cookieStore);
}

export async function getAllActualites() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('actualites')
    .select('*')
    .order('id', { ascending: false });
    
  if (error) {
    console.error('Error fetching actualites:', error);
    throw error;
  }
  
  return data;
}

export async function insertActualite(data: { titre: string, contenu: string, lien?: string, publie?: boolean }) {
  const supabase = getSupabaseClient();
  const { data: result, error } = await supabase
    .from('actualites')
    .insert([data])
    .select();
    
  if (error) {
    console.error('Error inserting actualite:', error);
    throw error;
  }
  
  return result;
}

// Alias pour la fonction insertActualite pour compatibilité avec les routes API
export const createActualite = insertActualite;

export async function updateActualite(
  id: number,
  data: { titre?: string, contenu?: string, lien?: string, publie?: boolean }
) {
  const supabase = getSupabaseClient();
  const { data: result, error } = await supabase
    .from('actualites')
    .update(data)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating actualite:', error);
    throw error;
  }
  
  return result;
}

export async function deleteActualite(id: number) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('actualites')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting actualite:', error);
    throw error;
  }
  
  return { success: true };
}

export async function getTypeBiens() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('typebien')
    .select('*');
    
  if (error) {
    console.error('Error fetching typebien:', error);
    throw error;
  }
  
  return data;
}

export async function getTypeTransactions() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('transaction')
    .select('*');
    
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  return data;
}

// Fonction pour récupérer toutes les annonces avec fallback si la fonction RPC n'est pas disponible
export async function getListings() {
  const supabase = getSupabaseClient();
  
  try {
    // Essayer d'abord avec la fonction RPC
    const { data, error } = await supabase.rpc('get_all_listings');
    if (!error) {
      // Formater les résultats pour l'affichage
      const formattedResults = data.map((listing: any) => ({
        ...listing,
        // Convertir publie en booléen si nécessaire
        publie: typeof listing.publie === 'boolean' ? listing.publie : listing.publie === 1,
        // Utiliser directement l'URL Cloudinary sans modification
        photo: listing.photo || null,
        // Formater les prix pour l'affichage
        prix_hors_honoraires: listing.prix_hors_honoraires ? Number(listing.prix_hors_honoraires) : null,
        prix_avec_honoraires: listing.prix_avec_honoraires ? Number(listing.prix_avec_honoraires) : null,
        prix_m2: listing.prix_m2 ? Number(listing.prix_m2) : null,
        honoraires_acheteur: listing.honoraires_acheteur ? Number(listing.honoraires_acheteur) : null
      }));
      
      return formattedResults;
    }
    
    // Fallback: utiliser une requête directe si la fonction RPC n'est pas disponible
    console.log('RPC get_all_listings not available, using fallback query');
    
    const { data: annonces, error: annonceError } = await supabase
      .from('annonces')
      .select(`
        *,
        typebien (id, nom),
        transaction (id, nom),
        annonces_photos (id, nom, principale)
      `)
      .order('id', { ascending: false });
    
    if (annonceError) {
      console.error('Error fetching annonces:', annonceError);
      throw annonceError;
    }
    
    // Formater les résultats pour correspondre au format attendu
    return annonces.map((annonce: any) => {
      // Trouver la photo principale
      const photosPrincipales = annonce.annonces_photos.filter((p: any) => p.principale);
      const photoPrincipale = photosPrincipales.length > 0 ? photosPrincipales[0].nom : 
                              annonce.annonces_photos.length > 0 ? annonce.annonces_photos[0].nom : null;
      
      return {
        ...annonce,
        typeLogement: annonce.typebien?.nom || '',
        transaction: annonce.transaction?.nom || '',
        // Utiliser directement l'URL Cloudinary sans modification
        photo: photoPrincipale || null
      };
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

// Fonction pour récupérer une annonce spécifique avec fallback si la fonction RPC n'est pas disponible
export async function getListing(id: number) {
  const supabase = getSupabaseClient();
  
  try {
    // Essayer d'abord avec la fonction RPC
    const { data, error } = await supabase.rpc('get_listing_by_id', { listing_id: id });
    
    if (!error && data && data.length > 0) {
      // Formater le résultat pour l'affichage
      const listing = data[0];
      
      // Logs détaillés pour déboguer le champ cuisine
      console.log('DEBUG CUISINE - Valeur brute:', listing.cuisine);
      console.log('DEBUG CUISINE - Type:', typeof listing.cuisine);
      console.log('DEBUG CUISINE - Valeur JSON stringifiée:', JSON.stringify(listing.cuisine));
      console.log('DEBUG CUISINE - Conversion Boolean():', Boolean(listing.cuisine));
      console.log('DEBUG CUISINE - Test === true:', listing.cuisine === true);
      console.log('DEBUG CUISINE - Test === 1:', listing.cuisine === 1);
      console.log('DEBUG CUISINE - Test === "true":', listing.cuisine === "true");
      console.log('DEBUG CUISINE - Test === "1":', listing.cuisine === "1");
      console.log('DEBUG CUISINE - Résultat de la conversion:', listing.cuisine === true || listing.cuisine === 1 || listing.cuisine === 'true' || listing.cuisine === '1');
      
      return {
        ...listing,
        // Convertir publie en booléen si nécessaire
        publie: typeof listing.publie === 'boolean' ? listing.publie : listing.publie === 1,
        // Convertir cuisine en booléen explicitement
        cuisine: listing.cuisine === true || listing.cuisine === 1 || listing.cuisine === 'true' || listing.cuisine === '1',
        // Formater les prix pour l'affichage
        prix_hors_honoraires: listing.prix_hors_honoraires ? Number(listing.prix_hors_honoraires) : null,
        prix_avec_honoraires: listing.prix_avec_honoraires ? Number(listing.prix_avec_honoraires) : null,
        prix_m2: listing.prix_m2 ? Number(listing.prix_m2) : null,
        honoraires_acheteur: listing.honoraires_acheteur ? Number(listing.honoraires_acheteur) : null,
        // Formater les charges pour l'affichage

        charges: listing.charges ? Number(listing.charges) : null,
        loyer_hors_charges: listing.loyer_hors_charges ? Number(listing.loyer_hors_charges) : null,
        complement_loyer: listing.complement_loyer ? Number(listing.complement_loyer) : null,
        loyer_avec_charges: listing.loyer_avec_charges ? Number(listing.loyer_avec_charges) : null
      };
    }
    
    // Fallback: utiliser une requête directe si la fonction RPC n'est pas disponible
    console.log('RPC get_listing_by_id not available, using fallback query');
    
    const { data: annonce, error: annonceError } = await supabase
      .from('annonces')
      .select(`
        *,
        typebien (id, nom),
        transaction (id, nom),
        chauffage (id, nom),
        cuisine_relation:cuisine (id, nom),
        bilan_conso (id, nom),
        bilan_emission (id, nom),
        honoraires (id, nom),
        charges_relation:charges (id, nom),
        sous_typebien (id, nom)
      `)
      .eq('id', id)
      .single();
    
    if (annonceError) {
      console.error(`Error fetching annonce ${id}:`, annonceError);
      return null;
    }
    
    if (!annonce) {
      return null;
    }
    
    
    // Logs détaillés pour déboguer le champ cuisine dans le fallback
    console.log('DEBUG FALLBACK CUISINE - Valeur brute:', annonce.cuisine);
    console.log('DEBUG FALLBACK CUISINE - Type:', typeof annonce.cuisine);
    console.log('DEBUG FALLBACK CUISINE - Valeur JSON stringifiée:', JSON.stringify(annonce.cuisine));
    console.log('DEBUG FALLBACK CUISINE - Conversion Boolean():', Boolean(annonce.cuisine));
    console.log('DEBUG FALLBACK CUISINE - Test === true:', annonce.cuisine === true);
    console.log('DEBUG FALLBACK CUISINE - Test === 1:', annonce.cuisine === 1);
    console.log('DEBUG FALLBACK CUISINE - Test === "true":', annonce.cuisine === "true");
    console.log('DEBUG FALLBACK CUISINE - Test === "1":', annonce.cuisine === "1");
    console.log('DEBUG FALLBACK CUISINE - Résultat de la conversion:', annonce.cuisine === true || annonce.cuisine === 1 || annonce.cuisine === 'true' || annonce.cuisine === '1');
    console.log('DEBUG FALLBACK CUISINE - Valeur de cuisine.nom:', annonce.cuisine?.nom);
    console.log('DEBUG FALLBACK CUISINE - Type de cuisine.nom:', typeof annonce.cuisine?.nom);
    
    // Formater le résultat pour correspondre au format attendu
    return {
      ...annonce,
      typeLogement: annonce.typebien?.nom || '',
      transaction: annonce.transaction?.nom || '',
      chauffage: annonce.chauffage?.nom || '',
      cuisine_type: annonce.cuisine_relation?.nom || '', // Utilisation de cuisine_relation au lieu de cuisine
      dpe_conso: annonce.bilan_conso?.nom || '',
      dpe_emission: annonce.bilan_emission?.nom || '',
      honoraires: annonce.honoraires?.nom || '',
      nom_charges: annonce.charges_relation?.nom || '',
      sous_typebien: annonce.sous_typebien?.nom || '',
      // Convertir cuisine en booléen explicitement
      cuisine: annonce.cuisine === true || annonce.cuisine === 1 || annonce.cuisine === 'true' || annonce.cuisine === '1',
      // S'assurer que les champs numériques sont correctement formatés
      // Utiliser le champ charges directement de la table annonces
      charges: annonce.charges !== null && annonce.charges !== undefined ? Number(annonce.charges) : null,
      loyer_hors_charges: annonce.loyer_hors_charges ? Number(annonce.loyer_hors_charges) : null,
      complement_loyer: annonce.complement_loyer ? Number(annonce.complement_loyer) : null,
      loyer_avec_charges: annonce.loyer_avec_charges ? Number(annonce.loyer_avec_charges) : null
    };
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    return null;
  }
}

// Fonction pour récupérer les photos d'une annonce
export async function getAnnoncePhotos(annonceId: number) {
  const supabase = getSupabaseClient();
  const timestamp = Date.now(); // Pour éviter le cache
  
  try {
    const { data: photos, error } = await supabase
      .from('annonces_photos')
      .select('id, nom, principale')
      .eq('annonce_id', annonceId)
      .order('principale', { ascending: false });
    
    if (error) {
      console.error(`Error fetching photos for annonce ${annonceId}:`, error);
      throw error;
    }
    
    console.log(`Found ${photos?.length || 0} photos for annonce ${annonceId}`);
    
    return photos.map((photo: any) => {
      // S'assurer que principale est toujours un nombre (0 ou 1)
      const principale = photo.principale === true ? 1 : photo.principale === false ? 0 : Number(photo.principale) || 0;
      
      // S'assurer que nom est toujours une chaîne de caractères
      let nomValue = '';
      if (typeof photo.nom === 'string') {
        nomValue = photo.nom;
      } else if (photo.nom && typeof photo.nom === 'object') {
        // Si c'est un objet, essayer de le convertir en chaîne
        try {
          nomValue = photo.nom.toString() || '';
          console.warn(`photo.nom est un objet pour photo ${photo.id}:`, photo.nom);
        } catch (e) {
          nomValue = '';
          console.error(`Erreur lors de la conversion de photo.nom en chaîne pour photo ${photo.id}:`, e);
        }
      }
      
      // Toutes les images sont des URLs Cloudinary, donc on utilise directement l'URL
      return {
        id: photo.id,
        principale: principale,
        url: nomValue || '/placeholder.svg?height=400&width=600'
      };
    });
  } catch (error) {
    console.error(`Error in getAnnoncePhotos(${annonceId}):`, error);
    throw error;
  }
}

// Fonction pour ajouter une photo à une annonce
export async function addAnnoncePhoto(annonceId: number, filename: string, principale: boolean = false) {
  const supabase = getSupabaseClient();
  
  try {
    // Vérifier et convertir les types de données
    const annonce_id = Number(annonceId);
    if (isNaN(annonce_id) || annonce_id <= 0) {
      throw new Error(`Invalid annonceId: ${annonceId}. Must be a positive number.`);
    }
    
    if (!filename || typeof filename !== 'string') {
      throw new Error(`Invalid filename: ${filename}. Must be a non-empty string.`);
    }
    
    // Convertir principale en booléen
    const isPrincipal = Boolean(principale);
    
    console.log(`Adding photo to annonce ${annonce_id}:`, { filename, isPrincipal });
    
    // Si la photo est principale, mettre à jour les autres photos pour qu'elles ne soient plus principales
    if (isPrincipal) {
      console.log(`Setting photo as principal for annonce ${annonce_id}`);
      const { error: updateError } = await supabase
        .from('annonces_photos')
        .update({ principale: false })
        .eq('annonce_id', annonce_id);
      
      if (updateError) {
        console.error(`Error updating photos for annonce ${annonce_id}:`, updateError);
        throw updateError;
      }
    }
    
    // Préparer les données à insérer
    const photoData = {
      annonce_id: annonce_id,
      nom: filename,
      principale: isPrincipal ? true : false
    };
    
    console.log(`Inserting photo data:`, photoData);
    
    // Insérer la nouvelle photo
    const { data, error } = await supabase
      .from('annonces_photos')
      .insert([photoData])
      .select();
    
    if (error) {
      console.error(`Error adding photo for annonce ${annonce_id}:`, error);
      throw error;
    }
    
    console.log(`Photo added successfully:`, data);
    
    // Vérifier que data est un tableau et qu'il contient au moins un élément
    if (!data || data.length === 0) {
      console.error(`No data returned after inserting photo for annonce ${annonce_id}`);
      throw new Error('No data returned after inserting photo');
    }
    
    return data[0]; // Retourner le premier élément du tableau
  } catch (error) {
    console.error(`Error in addAnnoncePhoto(${annonceId}, ${filename}):`, error);
    throw error;
  }
}

// Fonction pour supprimer une photo d'une annonce
export async function deleteAnnoncePhoto(photoId: number) {
  const supabase = getSupabaseClient();
  
  try {
    const { error } = await supabase
      .from('annonces_photos')
      .delete()
      .eq('id', photoId);
    
    if (error) {
      console.error(`Error deleting photo ${photoId}:`, error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error in deleteAnnoncePhoto(${photoId}):`, error);
    throw error;
  }
}

// Fonction pour définir une photo comme principale
export async function setAnnoncePrincipalPhoto(annonceId: number, photoId: number) {
  const supabase = getSupabaseClient();
  
  try {
    console.log(`Setting photo ${photoId} as principal for annonce ${annonceId}`);
    
    // D'abord, mettre toutes les photos de l'annonce comme non principales
    const { error: resetError } = await supabase
      .from('annonces_photos')
      .update({ principale: 0 }) // Utiliser 0 au lieu de false
      .eq('annonce_id', annonceId);
    
    if (resetError) {
      console.error(`Error resetting principal photos for annonce ${annonceId}:`, resetError);
      throw resetError;
    }
    
    // Ensuite, définir la photo sélectionnée comme principale
    const { error: updateError } = await supabase
      .from('annonces_photos')
      .update({ principale: 1 }) // Utiliser 1 au lieu de true
      .eq('id', photoId);
    
    if (updateError) {
      console.error(`Error setting photo ${photoId} as principal:`, updateError);
      throw updateError;
    }
    
    console.log(`Successfully set photo ${photoId} as principal for annonce ${annonceId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error in setAnnoncePrincipalPhoto(${annonceId}, ${photoId}):`, error);
    throw error;
  }
}

// Fonction pour créer une nouvelle annonce
export async function createListing(data: any) {
  const supabase = getSupabaseClient();
  
  try {
    // Filtrer les colonnes qui n'existent pas dans la table annonces
    const columnsToExclude = ['balcon', 'jardin'];
    const filteredData = { ...data };
    
    columnsToExclude.forEach(column => {
      if (filteredData.hasOwnProperty(column)) {
        console.log(`Removing non-existent column ${column} from create data`);
        delete filteredData[column];
      }
    });
    
    // S'assurer que les champs de contact sont bien traités comme des chaînes de caractères
    const stringFields = ['telephone_contact', 'nom_contact', 'email_contact'];
    stringFields.forEach(field => {
      if (filteredData.hasOwnProperty(field)) {
        if (filteredData[field] === undefined || filteredData[field] === '') {
          filteredData[field] = null;
          console.log(`Setting empty contact field ${field} to null in create`);
        } else {
          filteredData[field] = String(filteredData[field]);
          console.log(`Converting contact field ${field} to string in create: ${filteredData[field]}`);
        }
      }
    });
    
    // Log pour déboguer les champs de contact lors de la création
    console.log('Données de contact lors de la création:', JSON.stringify({
      telephone_contact: filteredData.telephone_contact,
      nom_contact: filteredData.nom_contact,
      email_contact: filteredData.email_contact
    }));
    
    // Insérer l'annonce
    const { data: result, error } = await supabase
      .from('annonces')
      .insert([filteredData])
      .select();
    
    if (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
    
    // Suppression de la génération et de l'envoi CSV via FTP
    
    return result;
  } catch (error) {
    console.error('Error in createListing:', error);
    throw error;
  }
}

// Fonction pour mettre à jour une annonce existante
export async function updateListing(id: number, data: any) {
  const supabase = getSupabaseClient();
  
  try {
    // Vérifier si l'annonce existe
    const { data: existingListing, error: checkError } = await supabase
      .from('annonces')
      .select('publie')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error(`Error checking listing ${id}:`, checkError);
      throw checkError;
    }
    
    // Filtrer les colonnes qui n'existent pas dans la table annonces
    const columnsToExclude = ['balcon', 'terrasse', 'jardin', 'parking', 'ascenseur'];
    const filteredData = { ...data };
    
    // Supprimer les colonnes qui n'existent pas dans la table
    columnsToExclude.forEach(column => {
      if (filteredData.hasOwnProperty(column)) {
        console.log(`Removing non-existent column ${column} from update data`);
        delete filteredData[column];
      }
    });
    
    // S'assurer que les champs numériques sont correctement convertis
    const numericFields = [
      'nb_pieces', 'nb_chambres', 'nb_sdb', 'nb_wc', 'etage',
      'surface', 'prix_hors_honoraires', 'prix_avec_honoraires',
      'prix_hors_charges', 'charges', 'prix_m2', 'lots', 'quote_part'
    ];
    
    numericFields.forEach(field => {
      if (filteredData.hasOwnProperty(field) && filteredData[field] !== null && filteredData[field] !== undefined) {
        // Convertir en nombre si c'est une chaîne non vide
        if (typeof filteredData[field] === 'string' && filteredData[field].trim() !== '') {
          filteredData[field] = Number(filteredData[field]);
        }
        // Si c'est une chaîne vide ou 'N/C', mettre à null
        else if (filteredData[field] === '' || filteredData[field] === 'N/C') {
          filteredData[field] = null;
        }
      }
    });
    
    // S'assurer que les champs de contact sont bien traités comme des chaînes de caractères
    const stringFields = ['telephone_contact', 'nom_contact', 'email_contact'];
    stringFields.forEach(field => {
      if (filteredData.hasOwnProperty(field)) {
        // S'assurer que c'est une chaîne de caractères ou null
        if (filteredData[field] === undefined || filteredData[field] === '') {
          filteredData[field] = null;
        } else {
          filteredData[field] = String(filteredData[field]);
        }
      }
    });
    
    // Convertir les booléens
    const booleanFields = [
      'publie', 'copro', 'procedure_syndic', 'cuisine', 'cave', 'sam', 'sejour', 
      'recent', 'refait', 'travaux', 'wc_separe', 'ascenseur', 'duplex', 'terrasse', 
      'alarme', 'cable', 'piscine', 'entretien', 'securite', 'historique', 
      'parking_inclus', 'lot_neuf', 'cheminee', 'vue', 'entree', 'parquet', 'placard', 
      'vis_a_vis', 'calme', 'congelateur', 'four', 'lave_vaisselle', 'micro_ondes', 
      'lave_linge', 'seche_linge', 'internet', 'equipement_bebe', 'telephone', 
      'proche_lac', 'proche_tennis', 'terrain_agricole', 'terrain_constructible', 
      'terrain_rue', 'terrain_viabilise'
    ];
    booleanFields.forEach(field => {
      if (filteredData.hasOwnProperty(field)) {
        if (filteredData[field] === '1' || filteredData[field] === 'true' || filteredData[field] === true) {
          filteredData[field] = true;
        } else if (filteredData[field] === '0' || filteredData[field] === 'false' || filteredData[field] === false) {
          filteredData[field] = false;
        }
      }
    });
    
    console.log('Filtered data to update:', filteredData);
    
    // Mettre à jour l'annonce
    const { data: result, error } = await supabase
      .from('annonces')
      .update(filteredData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating listing ${id}:`, error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error(`Error in updateListing(${id}):`, error);
    throw error;
  }
}

// Fonction pour supprimer une annonce
export async function deleteListing(id: number) {
  const supabase = getSupabaseClient();
  
  try {
    // Supprimer d'abord les photos associées
    const { error: photoError } = await supabase
      .from('annonces_photos')
      .delete()
      .eq('annonce_id', id);
    
    if (photoError) {
      console.error(`Error deleting photos for annonce ${id}:`, photoError);
      throw photoError;
    }
    
    // Supprimer l'annonce
    const { error } = await supabase
      .from('annonces')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting listing ${id}:`, error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error in deleteListing(${id}):`, error);
    throw error;
  }
}

// Fonction pour basculer l'état de publication d'une annonce
export async function toggleListingPublication(id: number) {
  const supabase = getSupabaseClient();
  
  try {
    // Récupérer l'état actuel de l'annonce
    const { data: listing, error: getError } = await supabase
      .from('annonces')
      .select('publie')
      .eq('id', id)
      .single();
    
    if (getError) {
      console.error(`Error getting listing ${id}:`, getError);
      throw getError;
    }
    
    const newPublieState = !listing.publie;
    
    // Mettre à jour l'état de publication
    const { data: result, error: updateError } = await supabase
      .from('annonces')
      .update({ publie: newPublieState })
      .eq('id', id)
      .select();
    
    if (updateError) {
      console.error(`Error updating listing ${id} publication:`, updateError);
      throw updateError;
    }
    
    // Suppression de la génération et de l'envoi CSV via FTP
    
    return result;
  } catch (error) {
    console.error(`Error in toggleListingPublication(${id}):`, error);
    throw error;
  }
}

// Fonction pour générer un fichier CSV pour une annonce - supprimée car non utilisée
// La fonctionnalité FTP a été supprimée pour améliorer les performances

// Fonction pour mettre à jour une annonce existante - version utilisée par l'API
export async function updateListingFixed(id: number, data: any) {
  // Utiliser la fonction updateListing existante
  return updateListing(id, data);
}
