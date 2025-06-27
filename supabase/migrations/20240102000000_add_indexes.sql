-- Ajout d'index pour améliorer les performances des requêtes

-- Index sur la table annonces
CREATE INDEX IF NOT EXISTS idx_annonces_reference ON annonces (reference);
CREATE INDEX IF NOT EXISTS idx_annonces_transaction_id ON annonces (transaction_id);
CREATE INDEX IF NOT EXISTS idx_annonces_typebien_id ON annonces (typebien_id);
CREATE INDEX IF NOT EXISTS idx_annonces_publie ON annonces (publie);
CREATE INDEX IF NOT EXISTS idx_annonces_ville ON annonces (ville);
CREATE INDEX IF NOT EXISTS idx_annonces_cp ON annonces (cp);

-- Index sur la table annonces_photos
CREATE INDEX IF NOT EXISTS idx_annonces_photos_annonce_id ON annonces_photos (annonce_id);
CREATE INDEX IF NOT EXISTS idx_annonces_photos_principale ON annonces_photos (principale);

-- Index sur la table actualites
CREATE INDEX IF NOT EXISTS idx_actualites_publie ON actualites (publie);

-- Index sur les tables de référence
CREATE INDEX IF NOT EXISTS idx_typebien_nom ON typebien (nom);
CREATE INDEX IF NOT EXISTS idx_transaction_nom ON transaction (nom);
