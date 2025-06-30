import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Fonction pour obtenir le client Supabase
function getSupabaseClient() {
  const cookieStore = cookies();
  return createClient(cookieStore);
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
    const columnsToExclude = ['balcon', 'terrasse', 'jardin', 'parking', 'ascenseur', 'charges_details'];
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
    
    // La fonctionnalité d'export CSV via FTP a été désactivée pour améliorer les performances
    
    return result;
  } catch (error) {
    console.error(`Error in updateListing(${id}):`, error);
    throw error;
  }
}
