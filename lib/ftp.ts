import * as fs from 'fs';
import * as path from 'path';
import * as ftp from 'basic-ftp';
import { format } from 'date-fns';

// Configuration FTP
const FTP_CONFIG = {
  host: process.env.FTP_HOST || 'transferts.seloger.com',
  port: parseInt(process.env.FTP_PORT || '990'),
  user: process.env.FTP_USER || 'PLEDGEANDGROW',
  password: process.env.FTP_PASSWORD || '1YL60thR',
  secure: process.env.FTP_SECURE === 'true'
  // Note: basic-ftp utilise le mode passif par défaut
};

// Fonction pour créer un fichier CSV à partir des données d'une annonce
export async function createAnnonceCSV(annonce: any): Promise<string> {
  // Créer un nom de fichier unique avec la date et l'ID de l'annonce
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
  const filename = `annonce_${annonce.id}_${timestamp}.csv`;
  const filepath = path.join(process.cwd(), 'tmp', filename);
  
  // S'assurer que le dossier tmp existe
  const dir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Préparer les en-têtes et les données pour le CSV selon le format SeLoger
  const headers = [
    'Identifiant agence',
    'Référence',
    'Type de transaction',
    'Type de bien',
    'Prix',
    'Surface',
    'Nombre de pièces',
    'Nombre de chambres',
    'Adresse',
    'Code postal',
    'Ville',
    'Description',
    'DPE',
    'GES',
    'Meublé',
    'Étage',
    'Ascenseur',
    'Balcon',
    'Terrasse',
    'Parking',
    'Date disponibilité'
  ];
  
  // Déterminer le type de transaction (Vente ou Location)
  let typeTransaction = '';
  if (annonce.transaction_nom) {
    typeTransaction = annonce.transaction_nom.toLowerCase().includes('vente') ? 'VENTE' : 'LOCATION';
  }
  
  // Formater la date de disponibilité si elle existe
  let dateDisponibilite = '';
  if (annonce.date_dispo) {
    try {
      dateDisponibilite = format(new Date(annonce.date_dispo), 'dd/MM/yyyy');
    } catch (e) {
      console.error('Erreur lors du formatage de la date de disponibilité:', e);
    }
  }
  
  // Formater les données de l'annonce selon le format SeLoger
  const data = [
    'PLEDGEANDGROW', // Identifiant agence fixe
    annonce.reference || '',
    typeTransaction,
    annonce.typebien_nom || '',
    annonce.prix_avec_honoraires || '',
    annonce.surface || '',
    annonce.pieces || '',
    annonce.chambres || '',
    annonce.adresse || '',
    annonce.cp || '',
    annonce.ville || '',
    annonce.description ? annonce.description.replace(/"/g, '""').replace(/\n/g, ' ') : '',
    annonce.dpe_conso || '',
    annonce.dpe_emission || '',
    annonce.meuble ? 'OUI' : 'NON',
    annonce.etage || '',
    annonce.ascenseur ? 'OUI' : 'NON',
    annonce.nb_balcons ? 'OUI' : 'NON',
    annonce.terrasse ? 'OUI' : 'NON',
    annonce.parking_inclus ? 'OUI' : 'NON',
    dateDisponibilite
  ];
  
  // Échapper les valeurs qui contiennent des virgules ou des guillemets
  const escapedData = data.map(value => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  });
  
  // Créer le contenu du CSV
  const csvContent = [
    headers.join(','),
    escapedData.join(',')
  ].join('\n');
  
  // Écrire le fichier
  fs.writeFileSync(filepath, csvContent);
  
  return filepath;
}

// Fonction pour envoyer un fichier au serveur FTP
export async function uploadFileToFTP(localFilePath: string, remoteDirectory: string = '/'): Promise<boolean> {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV === 'development';
  
  try {
    // Configuration de la connexion FTP avec SeLoger
    await client.access({
      host: FTP_CONFIG.host,
      port: FTP_CONFIG.port,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      secure: FTP_CONFIG.secure,
      secureOptions: {
        // Ignorer les erreurs de certificat si nécessaire
        rejectUnauthorized: false
      }
    });
    
    // Le mode passif est configuré automatiquement lors de l'accès
    // basic-ftp utilise le mode passif par défaut, donc pas besoin de l'activer explicitement
    
    console.log('Connexion FTP établie avec succès');
    
    // Naviguer vers le répertoire distant
    try {
      await client.ensureDir(remoteDirectory);
      console.log(`Répertoire distant ${remoteDirectory} accessible`);
    } catch (dirError) {
      console.warn(`Impossible d'accéder au répertoire ${remoteDirectory}, utilisation du répertoire racine:`, dirError);
      // En cas d'échec, on reste dans le répertoire racine
    }
    
    // Obtenir le nom du fichier à partir du chemin local
    const filename = path.basename(localFilePath);
    
    // Télécharger le fichier
    await client.uploadFrom(localFilePath, filename);
    
    console.log(`Fichier ${filename} envoyé avec succès au serveur FTP de SeLoger`);
    return true;
  } catch (err) {
    console.error('Erreur lors de l\'envoi du fichier au serveur FTP:', err);
    return false;
  } finally {
    client.close();
  }
}

// Fonction principale qui crée le CSV et l'envoie par FTP
export async function createAndUploadAnnonceCSV(annonce: any): Promise<boolean> {
  try {
    // Créer le fichier CSV
    const csvFilePath = await createAnnonceCSV(annonce);
    
    // Envoyer le fichier au serveur FTP
    const uploaded = await uploadFileToFTP(csvFilePath, '/annonces');
    
    // Supprimer le fichier temporaire
    if (fs.existsSync(csvFilePath)) {
      fs.unlinkSync(csvFilePath);
    }
    
    return uploaded;
  } catch (error) {
    console.error('Error creating and uploading CSV:', error);
    return false;
  }
}
