import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { createAndUploadAnnonceCSV } from './ftp';
import { supabase } from './supabase';

export async function createConnection() {
  return await mysql.createConnection({
    host: 'mysql-michouuu.alwaysdata.net',
    port: 3306,
    user: '419773',
    password: 'Pledgedatamysql2025!',
    database: 'pledgeandgrow_cabinet-michou'
  });
}

export async function query<T extends RowDataPacket[]>({ 
  query, 
  values = [] 
}: { 
  query: string; 
  values?: any[] 
}): Promise<T> {
  const connection = await createConnection();
  try {
    const [results] = await connection.execute<T>(query, values);
    return results;
  } finally {
    connection.end();
  }
}

export async function getAllActualites() {
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
  
  try {
    // Essayer d'abord avec la fonction RPC
    const { data, error } = await supabase.rpc('get_listing_by_id', { listing_id: id });
    
    if (!error && data && data.length > 0) {
      // Formater le résultat pour l'affichage
      const listing = data[0];
      return {
        ...listing,
        // Convertir publie en booléen si nécessaire
        publie: typeof listing.publie === 'boolean' ? listing.publie : listing.publie === 1,
        // Formater les prix pour l'affichage
        prix_hors_honoraires: listing.prix_hors_honoraires ? Number(listing.prix_hors_honoraires) : null,
        prix_avec_honoraires: listing.prix_avec_honoraires ? Number(listing.prix_avec_honoraires) : null,
        prix_m2: listing.prix_m2 ? Number(listing.prix_m2) : null,
        honoraires_acheteur: listing.honoraires_acheteur ? Number(listing.honoraires_acheteur) : null
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
        cuisine (id, nom),
        bilan_conso (id, nom),
        bilan_emission (id, nom),
        honoraires (id, nom),
        charges (id, nom),
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
    
    // Formater le résultat pour correspondre au format attendu
    return {
      ...annonce,
      typeLogement: annonce.typebien?.nom || '',
      transaction: annonce.transaction?.nom || '',
      chauffage: annonce.chauffage?.nom || '',
      cuisine: annonce.cuisine?.nom || '',
      dpe_conso: annonce.bilan_conso?.nom || '',
      dpe_emission: annonce.bilan_emission?.nom || '',
      honoraires: annonce.honoraires?.nom || '',
      nom_charges: annonce.charges?.nom || '',
      sous_typebien: annonce.sous_typebien?.nom || ''
    };
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    return null;
  }
}

// Fonction pour récupérer les photos d'une annonce
export async function getAnnoncePhotos(annonceId: number) {
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
  
  try {
    console.log(`Adding photo to annonce ${annonceId}:`, { filename, principale });
    
    // Si la photo est principale, mettre à jour les autres photos pour qu'elles ne soient plus principales
    if (principale) {
      console.log(`Setting photo as principal for annonce ${annonceId}`);
      const { error: updateError } = await supabase
        .from('annonces_photos')
        .update({ principale: false })
        .eq('annonce_id', annonceId);
      
      if (updateError) {
        console.error(`Error updating photos for annonce ${annonceId}:`, updateError);
        throw updateError;
      }
    }
    
    // Préparer les données à insérer
    const photoData = {
      annonce_id: annonceId,
      nom: filename,
      principale: principale
    };
    
    console.log(`Inserting photo data:`, photoData);
    
    // Insérer la nouvelle photo
    const { data, error } = await supabase
      .from('annonces_photos')
      .insert([photoData])
      .select();
    
    if (error) {
      console.error(`Error adding photo for annonce ${annonceId}:`, error);
      throw error;
    }
    
    console.log(`Photo added successfully:`, data);
    
    // Vérifier que data est un tableau et qu'il contient au moins un élément
    if (!data || data.length === 0) {
      console.error(`No data returned after inserting photo for annonce ${annonceId}`);
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
  
  try {
    // Filtrer les colonnes qui n'existent pas dans la table annonces
    const columnsToExclude = ['balcon', 'terrasse', 'jardin', 'parking', 'ascenseur'];
    const filteredData = { ...data };
    
    columnsToExclude.forEach(column => {
      if (filteredData.hasOwnProperty(column)) {
        console.log(`Removing non-existent column ${column} from create data`);
        delete filteredData[column];
      }
    });
    
    // Insérer l'annonce
    const { data: result, error } = await supabase
      .from('annonces')
      .insert([filteredData])
      .select();
    
    if (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
    
    // Générer et envoyer le CSV si l'annonce est publiée
    if (data.publie && result && result.length > 0) {
      try {
        await createAndUploadAnnonceCSV(result[0].id);
      } catch (csvError) {
        console.error(`Error creating CSV for annonce ${result[0].id}:`, csvError);
        // Ne pas faire échouer la création de l'annonce si le CSV échoue
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in createListing:', error);
    throw error;
  }
}

// Fonction pour mettre à jour une annonce existante
export async function updateListing(id: number, data: any) {
  
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
    
    columnsToExclude.forEach(column => {
      if (filteredData.hasOwnProperty(column)) {
        console.log(`Removing non-existent column ${column} from update data`);
        delete filteredData[column];
      }
    });
    
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
    
    // Générer et envoyer le CSV si l'annonce est publiée et n'était pas publiée avant
    // ou si elle était déjà publiée et reste publiée (mise à jour)
    if (data.publie && result && result.length > 0) {
      try {
        await createAndUploadAnnonceCSV(id);
      } catch (csvError) {
        console.error(`Error creating CSV for annonce ${id}:`, csvError);
        // Ne pas faire échouer la mise à jour de l'annonce si le CSV échoue
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Error in updateListing(${id}):`, error);
    throw error;
  }
}

// Fonction pour supprimer une annonce
export async function deleteListing(id: number) {
  const results = await query<RowDataPacket[]>({
    query: "DELETE FROM annonces WHERE id = ?",
    values: [id],
  })
  return results
}


export async function insertAnnonce(data: any) {
  // Log the incoming data for debugging
  console.log("Raw data received:", data)

  // Ensure all values are either their value or null (not undefined)
  const sanitizedData = {
    // Existing fields
    reference: data.reference || null,
    transaction_id: data.transaction_id || null,
    typebien_id: data.typebien_id || null,
    prix_hors_honoraires: data.prix_hors_honoraires !== undefined ? data.prix_hors_honoraires : null,
    prix_avec_honoraires: data.prix_avec_honoraires !== undefined ? data.prix_avec_honoraires : null,
    prix_m2: data.prix_m2 !== undefined ? data.prix_m2 : null,
    honoraires_acheteur: data.honoraires_acheteur !== undefined ? data.honoraires_acheteur : null,
    copro: data.copro !== undefined ? data.copro : null,
    lots: data.lots !== undefined ? data.lots : null,
    ville: data.ville || null,
    description: data.description || null,
    date_dispo: data.date_dispo || null,

    // New fields
    sous_typebien_id: data.sous_typebien_id || null,
    adresse: data.adresse || null,
    quartier: data.quartier || null,
    situation_id: data.situation_id || null,
    orientation_sud: data.orientation_sud !== undefined ? data.orientation_sud : null,
    orientation_est: data.orientation_est !== undefined ? data.orientation_est : null,
    orientation_ouest: data.orientation_ouest !== undefined ? data.orientation_ouest : null,
    orientation_nord: data.orientation_nord !== undefined ? data.orientation_nord : null,
    depot_garantie: data.depot_garantie !== undefined ? data.depot_garantie : null,
    quote_part: data.quote_part !== undefined ? data.quote_part : null,
    procedure_syndic: data.procedure_syndic !== undefined ? data.procedure_syndic : null,
    detail_procedure: data.detail_procedure || null,
    nb_lits_doubles: data.nb_lits_doubles !== undefined ? data.nb_lits_doubles : null,
    nb_lits_simples: data.nb_lits_simples !== undefined ? data.nb_lits_simples : null,
    sdb: data.nb_sdb !== undefined ? data.nb_sdb : null,
    wc: data.nb_wc !== undefined ? data.nb_wc : null,
    surface: data.surface !== undefined ? data.surface : null,
    alarme: data.alarme !== undefined ? data.alarme : null,
    chauffage_id: data.chauffage_id || null,
    cable: data.cable !== undefined ? data.cable : null,
    piscine: data.piscine !== undefined ? data.piscine : null,
    entretien: data.entretien !== undefined ? data.entretien : null,
    cuisine: data.cuisine !== undefined ? data.cuisine : null,
    securite: data.securite !== undefined ? data.securite : null,
    historique: data.historique !== undefined ? data.historique : null,
    parking_inclus: data.parking_inclus !== undefined ? data.parking_inclus : null,
    version_dpe: data.dpe_id || null,
    emissions: data.emissions || null,
    publie: data.publie || null,
    coup_de_coeur: data.coup_de_coeur !== undefined ? data.coup_de_coeur : null,
    interphone: data.interphone !== undefined ? data.interphone : null,
    ascenseur: data.ascenseur !== undefined ? data.ascenseur : null,
    cave: data.cave !== undefined ? data.cave : null,
    bail: data.bail || null,
    nature_bail: data.nature_bail || null,
    bilan_emission_id: data.bilan_emission_id || null,
  }

  // Log the sanitized data
  await supabase.from("annonces").insert(sanitizedData)

  // Validate required fields
  
}


