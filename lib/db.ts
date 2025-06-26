import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { createAndUploadAnnonceCSV } from './ftp';

export async function createConnection() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'mysql-pledgeandgrow.alwaysdata.net',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || '419773',
    password: process.env.DB_PASSWORD || 'Pledgedatamysql2025!',
    database: process.env.DB_NAME || 'pledgeandgrow_cabinet-michou',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };
  
  try {
    return await mysql.createConnection(connectionConfig);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
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
  const results = await query<RowDataPacket[]>({
    query: "SELECT * FROM actualites ORDER BY id DESC",
  })
  return results
}

export async function insertActualite(titre: string, contenu: string, lien: string, publie: boolean) {
  const results = await query<RowDataPacket[]>({
    query: "INSERT INTO actualites (titre, contenu, lien, publie) VALUES (?, ?, ?, ?)",
    values: [titre, contenu, lien, publie]
  });
  return results;
}

export async function updateActualite(
  id: number,
  titre: string,
  contenu: string,
  lien: string,
  publie: boolean
) {
  const results = await query<RowDataPacket[]>({
    query:
      'UPDATE actualites SET titre = ?, contenu = ?, lien = ?, publie = ? WHERE id = ?',
    values: [titre, contenu, lien, publie, id],
  });
  return results;
}


export async function deleteActualite(id: number) {
  const results = await query<RowDataPacket[]>({
    query: "DELETE FROM actualites WHERE id = ?",
    values: [id]
  });
  return results;
}
export async function getTypeBiens() {
  const results = await query<RowDataPacket[]>({
    query: "SELECT * from typebien"
   
  });
  return results;
}
export async function getTypeTransactions() {
  const results = await query<RowDataPacket[]>({
    query: "SELECT * from transaction"
   
  });
  return results;
}

export async function insertListing({
  prix_hors_honoraires,
  prix_avec_honoraires,
  prix_m2,
  honoraires_id,
  honoraires_acheteur,
  copro,
  lots,
  quote_part,
  procedure_syndic,
  detail_procedure,
  adresse,
  quartier,
  transaction_id,
  typebien_id,
  sous_typebien_id,
  reference,
  date_dispo,
}: {
  prix_hors_honoraires: number
  prix_avec_honoraires: number
  prix_m2: number
  honoraires_id: number
  honoraires_acheteur: number
  copro: boolean
  lots: number
  quote_part: number
  procedure_syndic: boolean
  detail_procedure: string
  adresse: string
  quartier: string
  transaction_id: number
  typebien_id: number
  sous_typebien_id: number
  reference: string
  date_dispo: string
}) {
  const results = await query<RowDataPacket[]>({
    query: `INSERT INTO annonces (
      prix_hors_honoraires,
      prix_avec_honoraires,
      prix_m2,
      honoraires_id,
      honoraires_acheteur,
      copro,
      lots,
      quote_part,
      procedure_syndic,
      detail_procedure,
      adresse,
      quartier,
      transaction_id,
      typebien_id,
      sous_typebien_id,
      reference,
      date_dispo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    values: [
      prix_hors_honoraires,
      prix_avec_honoraires,
      prix_m2,
      honoraires_id,
      honoraires_acheteur,
      copro,
      lots,
      quote_part,
      procedure_syndic,
      detail_procedure,
      adresse,
      quartier,
      transaction_id,
      typebien_id,
      sous_typebien_id,
      reference,
      date_dispo,
    ],
  })
  return results
}

export async function getListings() {
  const results = await query<RowDataPacket[]>({
    query: `
      SELECT l.*, t.nom as transaction_nom, tb.nom as typebien_nom 
      FROM annonces l
      LEFT JOIN transaction t ON l.transaction_id = t.id
      LEFT JOIN typebien tb ON l.typebien_id = tb.id
      ORDER BY l.id DESC
    `,
  })
  
  // Formater les données pour l'affichage dans le frontend
  const formattedResults = results.map(annonce => {
    return {
      ...annonce,
      // S'assurer que le prix est correctement formaté
      prix: annonce.prix || "N/C",
      prix_avec_honoraires: annonce.prix_avec_honoraires || annonce.prix || "N/C",
      // Utiliser directement le champ cp pour le code postal
      code_postal: annonce.cp || "N/A",
      // S'assurer que la ville est une chaîne de caractères
      ville: annonce.ville ? String(annonce.ville) : "N/A",
      // Convertir publie en booléen
      publie: annonce.publie === 1
    };
  });
  
  return formattedResults
}

export async function getListing(id: number) {
  const results = await query<RowDataPacket[]>({
    query: `
      SELECT l.*, t.nom as transaction_nom, tb.nom as typebien_nom 
      FROM annonces l
      LEFT JOIN transaction t ON l.transaction_id = t.id
      LEFT JOIN typebien tb ON l.typebien_id = tb.id
      WHERE l.id = ?
    `,
    values: [id],
  })
  return results[0]
}

export async function updateListing(
  id: number,
  {
    publie,
    prix_hors_honoraires,
    prix_avec_honoraires,
    prix_m2,
    honoraires_id,
    honoraires_acheteur,
    copro,
    lots,
    quote_part,
    procedure_syndic,
    detail_procedure,
    adresse,
    quartier,
    transaction_id,
    typebien_id,
    surface,
    sous_typebien_id,
    reference,
    date_dispo,
  }: {
    publie : boolean,
    prix_hors_honoraires: number
    prix_avec_honoraires: number
    prix_m2: number
    honoraires_id: number
    honoraires_acheteur: number
    copro: boolean
    lots: number
    quote_part: number
    procedure_syndic: boolean
    detail_procedure: string
    adresse: string
    quartier: string
    transaction_id: number
    typebien_id: number
    surface : string
    sous_typebien_id: number
    reference: string
    date_dispo: string
  },
) {
  const results = await query<RowDataPacket[]>({
    query: `
      UPDATE annonces 
      SET publie = ?,
          prix_hors_honoraires = ?,
          prix_avec_honoraires = ?,
          prix_m2 = ?,
          honoraires_id = ?,
          honoraires_acheteur = ?,
          copro = ?,
          lots = ?,
          quote_part = ?,
          procedure_syndic = ?,
          detail_procedure = ?,
          adresse = ?,
          quartier = ?,
          transaction_id = ?,
          typebien_id = ?,
          sous_typebien_id = ?,
          reference = ?,
          surface = ?,
          date_dispo = ?
      WHERE id = ?
    `,
    values: [
      publie,
      prix_hors_honoraires,
      prix_avec_honoraires,
      prix_m2,
      honoraires_id,
      honoraires_acheteur,
      copro,
      lots,
      quote_part,
      procedure_syndic,
      detail_procedure,
      adresse,
      quartier,
      transaction_id,
      typebien_id,
      sous_typebien_id,
      reference,
      surface ,
      date_dispo,
      id,
    ],
  })
  return results
}

export async function deleteListing(id: number) {
  const results = await query<RowDataPacket[]>({
    query: "DELETE FROM annonces WHERE id = ?",
    values: [id],
  })
  return results
}

export async function toggleAnnoncePublie(id: number) {
  // D'abord, récupérer l'état actuel de publication
  const annonce = await query<RowDataPacket[]>({
    query: "SELECT publie FROM annonces WHERE id = ?",
    values: [id],
  })
  
  if (!annonce || annonce.length === 0) {
    throw new Error("Annonce non trouvée")
  }
  
  // Inverser l'état de publication
  const newPublieState = annonce[0].publie === 1 ? 0 : 1
  
  // Mettre à jour la base de données
  const results = await query<RowDataPacket[]>({
    query: "UPDATE annonces SET publie = ? WHERE id = ?",
    values: [newPublieState, id],
  })
  
  return { success: true, publie: newPublieState === 1 }
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
  console.log("Sanitized data:", sanitizedData)

  // Validate required fields
  

  // Get the column names and values dynamically
  const columns = Object.keys(sanitizedData)
  const values = Object.values(sanitizedData)

  const results = await query<RowDataPacket[]>({
    query: `
      INSERT INTO annonces (
        ${columns.join(', ')}
      ) VALUES (
        ${columns.map(() => '?').join(', ')}
      )
    `,
    values: values,
  })
  
  // Récupérer l'ID de l'annonce insérée
  // @ts-ignore - MySQL2 retourne insertId mais TypeScript ne le reconnaît pas dans le type RowDataPacket[]
  const insertId = results.insertId || (results as any).insertId;
  
  if (insertId) {
    try {
      // Récupérer les détails complets de l'annonce nouvellement créée
      const annonceDetails = await getListing(insertId);
      
      // Créer et envoyer le fichier CSV au serveur FTP
      await createAndUploadAnnonceCSV(annonceDetails);
      
      console.log(`CSV file for annonce ${insertId} created and uploaded to FTP server`);
    } catch (error) {
      console.error(`Error creating/uploading CSV for annonce ${insertId}:`, error);
      // Ne pas échouer l'insertion si l'envoi FTP échoue
    }
  }

  return results
}


