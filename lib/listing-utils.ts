import { getSupabaseClient } from './db';

// Liste des colonnes connues qui n'existent pas dans la table annonces
const KNOWN_MISSING_COLUMNS = [
  'balcon', 
  'terrasse', 
  'jardin', 
  'parking', 
  'ascenseur', 
  'charges_details',
  'nb_chambres',
  'nb_pieces',
  'nb_salles_bain',
  'nb_salles_eau',
  'nb_wc',
  'nb_etages',
  'etage',
  'annee_construction',
  'exposition',
  'cave',
  'grenier',
  'loyer_ref_majore',
  'complement_loyer',
  'encadrement_des_loyers',
  'etat_des_lieux',
  'honoraires_locataire',
  'depot_garantie',
  'consos',
  'emissions'
];

// Cache pour les colonnes existantes
let existingColumnsCache: string[] | null = null;

// Fonction pour récupérer les colonnes existantes dans la table annonces
async function getExistingColumns() {
  if (existingColumnsCache) {
    return existingColumnsCache;
  }
  
  const supabase = getSupabaseClient();
  
  try {
    // Récupérer la définition de la table annonces
    const { data, error } = await supabase
      .from('annonces')
      .select()
      .limit(1);
    
    if (error) {
      console.error('Error fetching table definition:', error);
      return [];
    }
    
    // Si nous avons des données, extraire les noms des colonnes
    if (data && data.length > 0) {
      existingColumnsCache = Object.keys(data[0]);
      return existingColumnsCache;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting existing columns:', error);
    return [];
  }
}

// Fonction pour convertir les valeurs "Oui"/"Non" en booléens
function convertOuiNonToBoolean(data: any): any {
  const result = { ...data };
  
  // Liste des champs qui sont probablement des booléens
  const potentialBooleanFields = [
    'publie', 'vendu', 'loue', 'exclusivite', 'coup_de_coeur',
    'meuble', 'copropriete', 'interphone', 'digicode', 'gardien',
    'piscine', 'tennis', 'cheminee', 'climatisation', 'fibre_optique',
    'cuisine_equipee', 'cuisine_amenagee', 'double_vitrage', 'volets_roulants',
    'volets_electriques', 'alarme', 'porte_blindee', 'videophone'
  ];
  
  // Parcourir tous les champs et convertir les valeurs "Oui"/"Non" en booléens
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    // Si c'est un champ potentiellement booléen ou si la valeur est "Oui" ou "Non"
    if (
      potentialBooleanFields.includes(key) || 
      value === 'Oui' || 
      value === 'Non' ||
      value === 'oui' ||
      value === 'non'
    ) {
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        if (lowerValue === 'oui') {
          console.log(`Converting field ${key} from "Oui" to true`);
          result[key] = true;
        } else if (lowerValue === 'non') {
          console.log(`Converting field ${key} from "Non" to false`);
          result[key] = false;
        }
      }
    }
  });
  
  return result;
}

// Fonction pour mettre à jour une annonce existante avec gestion des colonnes manquantes
export async function updateListingFixed(id: number, data: any) {
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
    
    // Convertir les valeurs "Oui"/"Non" en booléens
    let processedData = convertOuiNonToBoolean(data);
    
    // Filtrer les données pour ne conserver que les colonnes existantes
    const filteredData = { ...processedData };
    
    // Supprimer d'abord les colonnes connues comme manquantes
    KNOWN_MISSING_COLUMNS.forEach(column => {
      if (filteredData.hasOwnProperty(column)) {
        console.log(`Removing non-existent column ${column} from update data`);
        delete filteredData[column];
      }
    });
    
    // Récupérer les colonnes existantes et filtrer les données
    try {
      const existingColumns = await getExistingColumns();
      
      if (existingColumns.length > 0) {
        // Filtrer les données pour ne conserver que les colonnes existantes
        Object.keys(filteredData).forEach(key => {
          if (!existingColumns.includes(key)) {
            console.log(`Removing unknown column ${key} from update data`);
            delete filteredData[key];
          }
        });
      }
    } catch (columnsError) {
      console.error('Error filtering columns:', columnsError);
      // Continuer avec les colonnes connues déjà filtrées
    }
    
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
    
    // La fonctionnalité d'export CSV via FTP a été désactivée pour améliorer les performances
    
    return result;
  } catch (error) {
    console.error(`Error in updateListingFixed(${id}):`, error);
    throw error;
  }
}
