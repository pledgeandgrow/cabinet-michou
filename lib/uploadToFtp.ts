import fs from 'fs';
import * as ftp from 'basic-ftp';

export async function uploadZipToFtp(localZipPath: string, remoteZipName: string) {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  console.log("Tentative de connexion FTP à SeLoger...");

  try {
    // Configuration pour FTP implicite sur TLS (FTPS)
    await client.access({
      host: "transferts.seloger.com",
      port: 990, // Port standard pour FTPS implicite
      user: "PLEDGEANDGROW",
      password: "1YL60thR",
      secure: "implicit", // Utiliser le mode implicite au lieu de true
      secureOptions: { 
        rejectUnauthorized: false // Ignorer les problèmes de certificat
      }
    });

    console.log("Connexion FTPS réussie");
    
    // Définir le mode de transfert en binaire (pour les fichiers ZIP)
    await client.send("TYPE I"); // "I" pour binaire
    
    console.log(`Envoi du fichier ${remoteZipName} en cours...`);
    
    // Utiliser uploadFrom avec le chemin direct au lieu d'un stream
    await client.uploadFrom(localZipPath, remoteZipName);

    console.log(`Fichier ${remoteZipName} envoyé avec succès sur SeLoger`);
    return true;
  } catch (err) {
    console.error("Erreur FTP :", err);
    throw err; // Propager l'erreur pour que la route API puisse la gérer
  } finally {
    client.close();
  }
}