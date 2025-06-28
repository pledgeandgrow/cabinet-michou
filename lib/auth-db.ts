import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Fonction pour obtenir le client Supabase
export function getSupabaseClient() {
  const cookieStore = cookies();
  return createClient(cookieStore);
}

// Fonction pour récupérer un administrateur par son login
export async function getAdmin(login: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('admin')
    .select('*')
    .eq('login', login)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching admin:', error);
    throw error;
  }
  
  return data;
}

// Fonction pour récupérer tous les administrateurs
export async function getAllAdmins() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('admin')
    .select('*');
  
  if (error) {
    console.error('Error fetching all admins:', error);
    throw error;
  }
  
  return data;
}
