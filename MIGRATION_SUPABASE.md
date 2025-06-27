# Guide de Migration vers Supabase

Ce document explique les étapes nécessaires pour migrer l'application Cabinet Michou de MySQL vers Supabase (PostgreSQL).

## Prérequis

1. Un compte Supabase (https://supabase.com)
2. Un projet Supabase créé
3. Les variables d'environnement configurées

## Variables d'environnement

Assurez-vous que les variables suivantes sont définies dans votre fichier `.env` :

```
# Variables Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon

# Variables FTP pour SeLoger
FTP_HOST=transferts.seloger.com
FTP_PORT=990
FTP_USER=PLEDGEANDGROW
FTP_PASSWORD=1YL60thR
FTP_SECURE=true
```

## Structure de la base de données

Les tables principales à créer dans Supabase sont :

1. `actualites` - Pour les actualités du site
2. `annonces` - Pour les annonces immobilières
3. `annonces_photos` - Pour les photos des annonces
4. `transaction` - Types de transactions (vente, location)
5. `typebien` - Types de biens immobiliers

## Fonctions RPC

Des fonctions RPC ont été créées pour gérer les requêtes complexes :

1. `execute_sql` - Pour exécuter des requêtes SQL dynamiques (compatibilité temporaire)
2. `get_all_listings` - Pour récupérer toutes les annonces avec jointures
3. `get_listing_by_id` - Pour récupérer une annonce spécifique avec jointures

Ces fonctions sont définies dans le fichier `supabase/migrations/20240101000000_create_rpc_functions.sql`.

## Exécution des migrations

Pour exécuter les migrations SQL dans Supabase :

1. Connectez-vous à votre projet Supabase
2. Allez dans l'éditeur SQL
3. Copiez et exécutez le contenu des fichiers dans le dossier `supabase/migrations/`

## Modifications du code

Les principales modifications apportées sont :

1. Remplacement des fonctions MySQL dans `lib/db.ts` par des appels à l'API Supabase
2. Adaptation des API routes pour utiliser les nouvelles fonctions
3. Ajout d'en-têtes pour désactiver la mise en cache sur Vercel
4. Gestion des erreurs et formatage des données pour le frontend

## Fonctionnalités spécifiques

### Génération de CSV pour SeLoger

La fonctionnalité d'envoi de fichiers CSV vers le serveur FTP de SeLoger a été maintenue. Elle est appelée automatiquement lors de la création d'une nouvelle annonce.

### Photos des annonces

Les photos des annonces sont gérées avec les URLs complètes suivant la structure :
`https://cabinet-michou.com/uploads/annonces/${annonceId}/${photo.url}`

## Vérification de la migration

Pour vérifier que la migration s'est bien déroulée :

1. Testez la récupération des actualités : `/api/actualites`
2. Testez la récupération des annonces : `/api/annonces`
3. Testez la récupération d'une annonce spécifique : `/api/annonces/[id]`
4. Testez la création, mise à jour et suppression d'annonces

## Support et dépannage

En cas de problème avec la migration :

1. Vérifiez les logs côté serveur pour identifier les erreurs
2. Assurez-vous que les fonctions RPC sont correctement créées dans Supabase
3. Vérifiez que les variables d'environnement sont correctement configurées
