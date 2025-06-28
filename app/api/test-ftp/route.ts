import { NextResponse } from "next/server";
import { createAnnonceCSV } from "@/lib/ftp";
import { getListing } from "@/lib/db";
import * as fs from 'fs';
import * as ftp from 'basic-ftp';

// Configuration FTP - Correspondant à FileZilla
const FTP_CONFIG = {
  host: 'transferts.seloger.com',
  port: 990,
  user: 'PLEDGEANDGROW',
  password: '1YL60thR',
  secure: true, // FTP implicite sur TLS
  secureOptions: {
    rejectUnauthorized: false // Ignorer les problèmes de certificat
  }
  // Note: basic-ftp utilise le mode passif par défaut
};

// Fonction simple pour tester la connexion FTP
async function testFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('Tentative de connexion FTP simple...');
    // Augmenter le timeout et configurer d'autres options
    client.ftp.socket.setTimeout(60000); // 60 secondes
    
    // Configurer des timeouts plus longs
    // Note: on ne peut pas configurer directement les options FTP de cette façon
    // On va plutôt les passer directement à la méthode access
    
    console.log('Configuration FTP complète:', {
      host: FTP_CONFIG.host,
      port: FTP_CONFIG.port,
      user: FTP_CONFIG.user,
      secure: true, // FTP implicite sur TLS
      rejectUnauthorized: false
    });
    
    // Utiliser exactement la même configuration que FileZilla - FTP implicite sur TLS
    await client.access({
      host: FTP_CONFIG.host,
      port: FTP_CONFIG.port,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      secure: true, // FTP implicite sur TLS
      secureOptions: { rejectUnauthorized: false }, // Ignorer les problèmes de certificat
      // La bibliothèque basic-ftp gère automatiquement le mode passif
    });
    
    console.log('Connexion réussie!');
    const currentDir = await client.pwd();
    console.log('Répertoire actuel:', currentDir);
    
    // Essayer de lister les fichiers
    try {
      const list = await client.list();
      console.log('Fichiers:', list.map(item => item.name));
      return { success: true, message: 'Connexion FTP réussie', currentDir, files: list };
    } catch (listError) {
      console.warn('Connexion réussie mais impossible de lister les fichiers:', listError);
      return { success: true, message: 'Connexion FTP réussie mais impossible de lister les fichiers', currentDir, files: [] };
    }
  } catch (error) {
    console.error('Erreur FTP:', error);
    
    // Essayer une connexion alternative sur le port 21 (FTP standard)
    try {
      console.log('Tentative alternative sur le port 21...');
      client.close();
      
      const altClient = new ftp.Client();
      altClient.ftp.verbose = true;
      altClient.ftp.socket.setTimeout(60000);
      
      // Pour le port 21, on essaie en mode FTP explicite (différent du mode implicite)
      await altClient.access({
        host: FTP_CONFIG.host,
        port: 21, // Port FTP standard
        user: FTP_CONFIG.user,
        password: FTP_CONFIG.password,
        secure: true, // FTP explicite sur TLS
        secureOptions: { rejectUnauthorized: false }
        // La bibliothèque basic-ftp gère automatiquement le mode passif
      });
      
      console.log('Connexion alternative réussie!');
      const currentDir = await altClient.pwd();
      const list = await altClient.list();
      altClient.close();
      
      return { success: true, message: 'Connexion FTP réussie via port 21', currentDir, files: list };
    } catch (altError) {
      console.error('Erreur FTP alternative:', altError);
      return { 
        success: false, 
        message: `Erreur: ${error instanceof Error ? error.message : String(error)}\nErreur alternative: ${altError instanceof Error ? altError.message : String(altError)}` 
      };
    }
  } finally {
    try { client.close(); } catch (e) { /* ignorer */ }
  }
}

// Fonction pour envoyer un fichier test
async function uploadTestFile(filePath: string) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return { success: false, message: `Le fichier ${filePath} n'existe pas` };
    }
    
    console.log('Tentative d\'envoi du fichier', filePath);
    await client.access({
      host: FTP_CONFIG.host,
      port: FTP_CONFIG.port,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      secure: true, // FTP implicite sur TLS
      secureOptions: { rejectUnauthorized: false }, // Ignorer les problèmes de certificat
    });
    
    // Naviguer vers le répertoire /annonces
    try {
      await client.ensureDir('/annonces');
      console.log('Répertoire /annonces accessible');
    } catch (dirError) {
      console.warn('Impossible d\'accéder au répertoire /annonces, utilisation du répertoire racine');
    }
    
    // Envoyer le fichier
    const filename = filePath.split('/').pop() || 'test.csv';
    await client.uploadFrom(filePath, filename);
    console.log('Fichier envoyé avec succès!');
    
    return { success: true, message: 'Fichier envoyé avec succès' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    return { success: false, message: `Erreur d'envoi: ${error instanceof Error ? error.message : String(error)}` };
  } finally {
    client.close();
  }
}

export async function GET(request: Request) {
  try {
    // Récupérer l'ID de l'annonce à partir des paramètres de requête
    const { searchParams } = new URL(request.url);
    const annonceId = searchParams.get("id");
    
    if (!annonceId) {
      return NextResponse.json({ 
        success: false, 
        message: "Veuillez fournir un ID d'annonce" 
      }, { status: 400 });
    }
    
    // Récupérer les détails de l'annonce
    const annonceDetails = await getListing(parseInt(annonceId));
    
    if (!annonceDetails) {
      return NextResponse.json({ 
        success: false, 
        message: `Aucune annonce trouvée avec l'ID ${annonceId}` 
      }, { status: 404 });
    }
    
    // 1. Test simple de connexion FTP
    console.log('Test de connexion FTP...');
    const ftpTest = await testFTP();
    
    if (!ftpTest.success) {
      return NextResponse.json({
        success: false,
        message: `Test de connexion FTP échoué: ${ftpTest.message}`,
        ftpConfig: {
          host: FTP_CONFIG.host,
          port: FTP_CONFIG.port,
          user: FTP_CONFIG.user
        }
      }, { status: 500 });
    }
    
    // 2. Créer le fichier CSV
    console.log('Création du fichier CSV...');
    const csvFilePath = await createAnnonceCSV(annonceDetails);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json({ 
        success: false, 
        message: `Le fichier CSV n'a pas été créé correctement` 
      }, { status: 500 });
    }
    
    // Lire le contenu du fichier CSV
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // 3. Envoyer le fichier
    console.log('Envoi du fichier CSV...');
    const uploadResult = await uploadTestFile(csvFilePath);
    
    // Supprimer le fichier temporaire
    try {
      if (fs.existsSync(csvFilePath)) {
        fs.unlinkSync(csvFilePath);
        console.log('Fichier temporaire supprimé');
      }
    } catch (e) {
      console.warn('Impossible de supprimer le fichier temporaire', e);
    }
    
    if (uploadResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Fichier CSV pour l'annonce ${annonceId} créé et envoyé avec succès`,
        annonce: annonceDetails,
        csvContent: csvContent,
        ftpTest: ftpTest
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Le fichier CSV a été créé mais l'envoi FTP a échoué: ${uploadResult.message}`,
        csvContent: csvContent,
        ftpTest: ftpTest
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Erreur lors du test FTP:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erreur lors du test FTP", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}