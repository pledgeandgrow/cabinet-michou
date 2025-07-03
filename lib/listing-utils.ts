import { getSupabaseClient } from './db';

// Liste des colonnes connues qui n'existent pas dans la table annonces
const KNOWN_MISSING_COLUMNS = [
  // Ces colonnes sont utilisées dans le formulaire mais n'existent pas dans la base de données
  'balcon', 
  'jardin', 
  'charges_details',
  'titre',
  // Autres colonnes qui n'existent pas dans la base de données
  'annee_construction',
  'exposition',
  'grenier'
  // Note: 'terrasse', 'parking', 'ascenseur', 'cave' existent dans la base de données
  // d'après les logs et ne doivent pas être filtrées
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

// Fonction pour mapper les noms de champs du formulaire vers les noms de colonnes dans la base de données
function mapFormFieldsToDbColumns(data: any) {
  const mapping: Record<string, string> = {
    // Mapper les champs qui ont des noms différents dans le formulaire et la base de données
    'nb_pieces': 'pieces',
    'nb_chambres': 'chambres',
    'nb_sdb': 'sdb',
    'nb_wc': 'wc'
  };
  
  const result = { ...data };
  
  // Appliquer le mapping
  Object.entries(mapping).forEach(([formField, dbColumn]) => {
    if (result.hasOwnProperty(formField)) {
      console.log(`Mapping form field ${formField} to database column ${dbColumn}`);
      result[dbColumn] = result[formField];
      delete result[formField];
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
    
    // Mapper les noms de champs du formulaire vers les noms de colonnes dans la base de données
    let mappedData = mapFormFieldsToDbColumns(data);
    
    // Convertir les valeurs "Oui"/"Non" en booléens
    let processedData = convertOuiNonToBoolean(mappedData);
    
    // Filtrer les données pour ne conserver que les colonnes existantes
    let filteredData = { ...processedData };
    
    // Supprimer les colonnes connues comme manquantes
    KNOWN_MISSING_COLUMNS.forEach(column => {
      if (filteredData.hasOwnProperty(column)) {
        console.log(`Removing known missing column ${column} from update data`);
        delete filteredData[column];
      }
    });
    
    // S'assurer que les champs numériques sont correctement convertis
    const numericFields = [
      'pieces', 'chambres', 'sdb', 'sde', 'wc', 'etage',
      'surface', 'prix_hors_honoraires', 'prix_avec_honoraires',
      'prix_hors_charges', 'charges', 'prix_m2', 'lots', 'quote_part',
      'honoraires_acheteur', 'surface_terrain', 'surface_cave', 'surface_sejour', 
      'surface_salle_a_manger', 'nb_etages', 'nb_balcons', 'surface_balcons', 
      'nb_terrasses', 'nb_couverts', 'nb_lits_doubles', 'nb_lits_simples',
      // Ajouter tous les autres champs numériques possibles
      'honoraires_id', 'transaction_id', 'typebien_id', 'sous_typebien_id',
      'chauffage_id', 'cuisine_id', 'situation_id',
      // Note: bilan_conso_id et bilan_emission_id sont des lettres (A-G), pas des nombres
      'depot_garantie', 'loyer_base', 'loyer_m2', 'loyer_hors_charges', 'loyer_avec_charges',
      // Autres champs potentiellement numériques
      'latitude', 'longitude', 'valeur_achat', 'montant_rapport', 'chiffre_affaire', 'longueur_facade',
      // Champs qui étaient incorrectement traités comme booléens
      'box', 'parking'
    ];
    
    // Log pour déboguer
    console.log('Données avant conversion numérique:', JSON.stringify(filteredData));
    
    // Première passe: vérifier tous les champs pour détecter les chaînes vides
    Object.keys(filteredData).forEach(key => {
      // Vérifier si la valeur est une chaîne vide
      if (filteredData[key] === '') {
        console.log(`Champ avec chaîne vide détecté: ${key}, conversion en null`);
        filteredData[key] = null;
      }
    });
    
    // Deuxième passe: traiter spécifiquement les champs numériques
    numericFields.forEach(field => {
      if (filteredData.hasOwnProperty(field)) {
        // Si c'est null, undefined, une chaîne vide ou 'N/C', mettre à null
        if (filteredData[field] === null || 
            filteredData[field] === undefined || 
            filteredData[field] === '' || 
            filteredData[field] === 'N/C') {
          filteredData[field] = null;
          console.log(`Setting empty/null field ${field} to null`);
        }
        // Convertir en nombre si c'est une chaîne non vide
        else if (typeof filteredData[field] === 'string') {
          const trimmedValue = filteredData[field].trim();
          if (trimmedValue === '') {
            filteredData[field] = null;
            console.log(`Setting empty string field ${field} to null`);
          } else {
            try {
              const numValue = Number(trimmedValue);
              if (isNaN(numValue)) {
                console.log(`Warning: Field ${field} value "${trimmedValue}" cannot be converted to number, setting to null`);
                filteredData[field] = null;
              } else {
                filteredData[field] = numValue;
                console.log(`Converting field ${field} to number: ${filteredData[field]}`);
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              console.log(`Error converting field ${field} to number: ${errorMessage}, setting to null`);
              filteredData[field] = null;
            }
          }
        }
      }
    });
    
    // Log pour déboguer
    console.log('Données après conversion numérique:', JSON.stringify(filteredData));
    
    // Convertir les booléens
    const booleanFields = [
      'publie', 'copro', 'procedure_syndic', 'meuble', 'exclusivite', 'coup_de_coeur',
      'terrain_agricole', 'terrain_constructible', 'terrain_rue', 'terrain_viabilise',
      'wc_separe', 'cave', 'recent', 'refait', 'travaux', 'ascenseur',
      'duplex', 'alarme', 'cable', 'piscine', 'entretien', 'securite', 'historique',
      'parking_inclus', 'lot_neuf', 'cheminee', 'vue', 'entree', 'parquet', 'placard',
      'vis_a_vis', 'calme', 'congelateur', 'four', 'lave_vaisselle', 'micro_ondes',
      'lave_linge', 'seche_linge', 'internet', 'equipement_bebe', 'telephone',
      'proche_lac', 'proche_tennis', 'proche_pistes', 'gardien', 'climatisation',
      'handicapes', 'animaux', 'digicode', 'video', 'interphone',
      'orientation_sud', 'orientation_est', 'orientation_ouest', 'orientation_nord',
      'is_loyer_cc', 'is_loyer_ht', 'prix_masque', 'prix_ht', 'si_viager_vendu_libre',
      'immeuble_type_bureaux', 'se_loger', 'selection'
    ];
    
    // Log pour déboguer
    console.log('Données avant conversion booléenne:', JSON.stringify(filteredData));
    
    // Identifier les champs qui sont stockés comme smallint (0/1) plutôt que booléens
    const smallintBooleanFields = [
      'publie', 'copro', 'procedure_syndic', 'meuble', 'exclusivite', 'coup_de_coeur',
      'terrain_agricole', 'terrain_constructible', 'terrain_rue', 'terrain_viabilise',
      'wc_separe', 'cave', 'recent', 'refait', 'travaux', 'ascenseur',
      'duplex', 'alarme', 'cable', 'piscine', 'entretien', 'securite', 'historique',
      'parking_inclus', 'lot_neuf', 'cheminee', 'vue', 'entree', 'parquet', 'placard',
      'vis_a_vis', 'calme', 'congelateur', 'four', 'lave_vaisselle', 'micro_ondes',
      'lave_linge', 'seche_linge', 'internet', 'equipement_bebe', 'telephone',
      'proche_lac', 'proche_tennis', 'proche_pistes', 'gardien', 'climatisation',
      'handicapes', 'animaux', 'digicode', 'video', 'interphone',
      'orientation_sud', 'orientation_est', 'orientation_ouest', 'orientation_nord',
      'is_loyer_cc', 'is_loyer_ht', 'prix_masque', 'prix_ht', 'si_viager_vendu_libre',
      'immeuble_type_bureaux', 'se_loger', 'selection'
    ];
    
    booleanFields.forEach(field => {
      if (filteredData.hasOwnProperty(field)) {
        // Convertir les valeurs en smallint (0/1) ou booléens selon le champ
        if (filteredData[field] === '1' || 
            filteredData[field] === 'true' || 
            filteredData[field] === true || 
            filteredData[field] === 'Oui' || 
            filteredData[field] === 'oui') {
          // Convertir en 1 (smallint) pour les champs smallint, true pour les autres
          if (smallintBooleanFields.includes(field)) {
            filteredData[field] = 1;
            console.log(`Converting field ${field} to smallint 1`);
          } else {
            filteredData[field] = true;
            console.log(`Converting field ${field} to boolean true`);
          }
        } 
        else if (filteredData[field] === '0' || 
                 filteredData[field] === 'false' || 
                 filteredData[field] === false || 
                 filteredData[field] === 'Non' || 
                 filteredData[field] === 'non' || 
                 filteredData[field] === '') {
          // Convertir en 0 (smallint) pour les champs smallint, false pour les autres
          if (smallintBooleanFields.includes(field)) {
            filteredData[field] = 0;
            console.log(`Converting field ${field} to smallint 0`);
          } else {
            filteredData[field] = false;
            console.log(`Converting field ${field} to boolean false`);
          }
        }
        else if (filteredData[field] === null || filteredData[field] === undefined) {
          // Laisser null ou undefined tel quel
          console.log(`Field ${field} is null or undefined, leaving as is`);
        }
        else {
          // Pour toute autre valeur non reconnue, mettre à null
          console.log(`Warning: Field ${field} has unrecognized boolean value "${filteredData[field]}", setting to null`);
          filteredData[field] = null;
        }
      }
    });
    
    // Log pour déboguer
    console.log('Données après conversion booléenne:', JSON.stringify(filteredData));
    
    // Vérification finale pour s'assurer qu'aucun champ booléen n'est envoyé comme chaîne
    smallintBooleanFields.forEach(field => {
      if (filteredData.hasOwnProperty(field)) {
        // Si c'est une chaîne 'true' ou 'false', convertir en 1 ou 0
        if (filteredData[field] === 'true') {
          filteredData[field] = 1;
          console.log(`Vérification finale: Conversion de ${field} de 'true' à 1`);
        } else if (filteredData[field] === 'false') {
          filteredData[field] = 0;
          console.log(`Vérification finale: Conversion de ${field} de 'false' à 0`);
        } else if (filteredData[field] === true) {
          filteredData[field] = 1;
          console.log(`Vérification finale: Conversion de ${field} de true à 1`);
        } else if (filteredData[field] === false) {
          filteredData[field] = 0;
          console.log(`Vérification finale: Conversion de ${field} de false à 0`);
        }
      }
    });
    
    // Liste complète des colonnes de la table annonces (fournie par l'utilisateur)
    const knownColumns = [
      'id', 'transaction_id', 'typebien_id', 'sous_typebien_id', 'reference', 'date_dispo',
      'nom', 'surface', 'surface_terrain', 'terrain_agricole', 'terrain_constructible',
      'terrain_rue', 'terrain_viabilise', 'pieces', 'chambres', 'sdb', 'sde', 'wc',
      'wc_separe', 'cave', 'surface_cave', 'sam', 'sejour', 'surface_sejour',
      'salle_a_manger', 'surface_salle_a_manger', 'construction', 'recent', 'refait',
      'travaux', 'box', 'parking', 'etage', 'nb_etages', 'ascenseur', 'duplex',
      'nb_balcons', 'surface_balcons', 'terrasse', 'nb_terrasses', 'alarme',
      'chauffage_id', 'cable', 'piscine', 'entretien', 'cuisine', 'securite',
      'historique', 'parking_inclus', 'lot_neuf', 'cheminee', 'vue', 'entree',
      'parquet', 'placard', 'nb_couverts', 'nb_lits_doubles', 'nb_lits_simples',
      'vis_a_vis', 'calme', 'congelateur', 'four', 'lave_vaisselle', 'micro_ondes',
      'lave_linge', 'seche_linge', 'internet', 'equipement_bebe', 'telephone',
      'proche_lac', 'proche_tennis', 'proche_pistes', 'gardien', 'climatisation',
      'handicapes', 'animaux', 'digicode', 'video', 'interphone', 'cuisine_id',
      'situation_id', 'orientation_sud', 'orientation_est', 'orientation_ouest',
      'orientation_nord', 'bilan_conso_id', 'consos', 'version_dpe', 'bilan_emission_id',
      'emissions', 'exclusivite', 'coup_de_coeur', 'bail', 'nature_bail', 'duree_bail',
      'droit_au_bail', 'loyer_murs', 'is_loyer_cc', 'is_loyer_ht', 'loyer_hors_charges',
      'charges', 'complement_loyer', 'loyer_avec_charges', 'loyer_m2', 'loyer_base',
      'loyer_ref_majore', 'encadrement_des_loyers', 'charges_id', 'honoraires_locataire',
      'etat_des_lieux', 'depot_garantie', 'droit_entree', 'meuble', 'prix_masque',
      'prix_ht', 'prix_hors_honoraires', 'prix_avec_honoraires', 'prix_m2', 'honoraires_id',
      'honoraires_acheteur', 'copro', 'lots', 'quote_part', 'procedure_syndic',
      'detail_procedure', 'adresse', 'quartier', 'ligne', 'station', 'cp', 'ville',
      'cp_reel', 'ville_reel', 'arrondissement', 'pays', 'latitude', 'longitude',
      'description', 'panoramique', 'visite_virtuelle', 'valeur_achat', 'montant_rapport',
      'activites_commerciales', 'chiffre_affaire', 'longueur_facade', 'si_viager_vendu_libre',
      'immeuble_type_bureaux', 'commentaires', 'negociateur', 'se_loger', 'selection', 'publie',
      // Utiliser les noms corrects des colonnes dans la base de données
      // (pas de préfixe 'nb_' pour pieces, chambres, sdb, wc)
    ];
    
    // Filtrer les données pour ne conserver que les colonnes connues
    Object.keys(filteredData).forEach(key => {
      if (!knownColumns.includes(key)) {
        console.log(`Removing unknown column ${key} from update data`);
        delete filteredData[key];
      }
    });
    
    // Vérification finale pour s'assurer qu'aucune chaîne vide n'est envoyée pour les champs numériques
    numericFields.forEach(field => {
      if (filteredData.hasOwnProperty(field) && filteredData[field] === '') {
        console.log(`Final check: Setting empty string field ${field} to null`);
        filteredData[field] = null;
      }
    });
    
    // Essayer de récupérer les colonnes existantes de la base de données pour une vérification supplémentaire
    try {
      const existingColumns = await getExistingColumns();
      
      if (existingColumns.length > 0) {
        console.log('Columns from database:', existingColumns);
      }
    } catch (columnsError) {
      console.error('Error getting columns from database:', columnsError);
      // Continuer avec la liste prédéfinie des colonnes
    }
    
    console.log('Filtered data to update:', filteredData);
    
    // Vérification finale pour s'assurer qu'aucun champ numérique n'a de valeur problématique
    // Cette vérification est plus stricte et s'applique à TOUS les champs
    Object.keys(filteredData).forEach(key => {
      // Vérifier si la valeur est une chaîne vide ou contient uniquement des espaces
      if (typeof filteredData[key] === 'string') {
        if (filteredData[key].trim() === '') {
          console.log(`Vérification finale: Champ ${key} avec chaîne vide ou espaces, conversion en null`);
          filteredData[key] = null;
        }
      }
    });
    
    // Log détaillé de chaque champ numérique pour débogage
    console.log('Détail des champs numériques avant envoi:');
    numericFields.forEach(field => {
      if (filteredData.hasOwnProperty(field)) {
        console.log(`${field}: ${typeof filteredData[field]} = '${filteredData[field]}'`);
      }
    });
    
    // Créer une copie des données filtrées pour éviter les problèmes
    const cleanData = { ...filteredData };
    
    try {
      // Mettre à jour l'annonce
      const { data: result, error } = await supabase
        .from('annonces')
        .update(cleanData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`Error updating listing ${id}:`, error);
        throw error;
      }
      
      return result;
    } catch (error: unknown) {
      console.error(`Error updating listing ${id}:`, error);
      
      // Essayer d'identifier le champ problématique
      const errorMessage = error instanceof Error ? error.message : 
                         (typeof error === 'object' && error !== null && 'message' in error) ? 
                         (error as any).message : 'Unknown error';
      
      // Gérer l'erreur 'invalid input syntax for type double precision'
      if (errorMessage.includes('invalid input syntax for type double precision')) {
        console.error('Problème de conversion numérique détecté. Vérification des champs:');
        numericFields.forEach(field => {
          if (cleanData.hasOwnProperty(field)) {
            console.error(`${field}: ${typeof cleanData[field]} = '${cleanData[field]}'`);
          }
        });
        
        // Tentative de correction d'urgence - convertir tous les champs numériques en null
        console.error('Tentative de correction d\'urgence - conversion de tous les champs numériques en null');
        const emergencyData = { ...cleanData };
        numericFields.forEach(field => {
          if (emergencyData.hasOwnProperty(field) && typeof emergencyData[field] === 'string') {
            emergencyData[field] = null;
          }
        });
        
        // Nouvelle tentative avec les données corrigées
        try {
          console.error('Nouvelle tentative avec les données corrigées');
          const { data: emergencyResult, error: emergencyError } = await supabase
            .from('annonces')
            .update(emergencyData)
            .eq('id', id)
            .select();
            
          if (emergencyError) {
            console.error(`Erreur lors de la tentative de correction d'urgence:`, emergencyError);
            throw emergencyError;
          }
          
          return emergencyResult;
        } catch (emergencyError) {
          console.error(`Échec de la tentative de correction d'urgence:`, emergencyError);
          throw error; // Renvoyer l'erreur originale
        }
      }
      // Gérer l'erreur 'invalid input syntax for type smallint'
      else if (errorMessage.includes('invalid input syntax for type smallint')) {
        console.error('Problème de conversion smallint détecté. Vérification des champs booléens:');
        smallintBooleanFields.forEach(field => {
          if (cleanData.hasOwnProperty(field)) {
            console.error(`${field}: ${typeof cleanData[field]} = '${cleanData[field]}'`);
          }
        });
        
        // Tentative de correction d'urgence - convertir tous les champs booléens en 0/1
        console.error('Tentative de correction d\'urgence - conversion de tous les champs booléens en 0/1');
        const emergencyData = { ...cleanData };
        smallintBooleanFields.forEach(field => {
          if (emergencyData.hasOwnProperty(field)) {
            if (emergencyData[field] === 'true' || emergencyData[field] === true) {
              emergencyData[field] = 1;
            } else if (emergencyData[field] === 'false' || emergencyData[field] === false) {
              emergencyData[field] = 0;
            } else if (emergencyData[field] === '' || emergencyData[field] === null || emergencyData[field] === undefined) {
              emergencyData[field] = null;
            }
          }
        });
        
        // Nouvelle tentative avec les données corrigées
        try {
          console.error('Nouvelle tentative avec les données booléennes corrigées');
          const { data: emergencyResult, error: emergencyError } = await supabase
            .from('annonces')
            .update(emergencyData)
            .eq('id', id)
            .select();
            
          if (emergencyError) {
            console.error(`Erreur lors de la tentative de correction d'urgence:`, emergencyError);
            throw emergencyError;
          }
          
          return emergencyResult;
        } catch (emergencyError) {
          console.error(`Échec de la tentative de correction d'urgence:`, emergencyError);
          throw error; // Renvoyer l'erreur originale
        }
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorObj = error as { message: string };
        if (errorObj.message && errorObj.message.includes('invalid input syntax for type double precision')) {
          console.error('Problème de conversion numérique détecté. Vérification des champs:');
          numericFields.forEach(field => {
            if (cleanData.hasOwnProperty(field)) {
              console.error(`${field}: ${typeof cleanData[field]} = '${cleanData[field]}'`);
            }
          });
        }
      }
      
      throw error;
    }
    
  } catch (error) {
    console.error(`Error in updateListingFixed(${id}):`, error);
    throw error;
  }
  
  // La fonctionnalité d'export CSV via FTP a été désactivée pour améliorer les performances
}
