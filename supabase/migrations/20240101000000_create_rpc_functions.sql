-- Fonction pour exécuter des requêtes SQL dynamiques
-- Cette fonction est utilisée pour la compatibilité avec l'ancienne fonction query()
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT, params JSONB DEFAULT '[]'::JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql_query INTO result USING params;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'SQL Error: %', SQLERRM;
END;
$$;

-- Fonction pour récupérer toutes les annonces avec les informations de jointure
CREATE OR REPLACE FUNCTION get_all_listings()
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_build_object(
      'id', a.id,
      'reference', a.reference,
      'prix_hors_honoraires', a.prix_hors_honoraires,
      'prix_avec_honoraires', a.prix_avec_honoraires,
      'prix_m2', a.prix_m2,
      'honoraires_id', a.honoraires_id,
      'honoraires_acheteur', a.honoraires_acheteur,
      'copro', a.copro,
      'lots', a.lots,
      'quote_part', a.quote_part,
      'procedure_syndic', a.procedure_syndic,
      'detail_procedure', a.detail_procedure,
      'adresse', a.adresse,
      'quartier', a.quartier,
      'transaction_id', a.transaction_id,
      'typebien_id', a.typebien_id,
      'sous_typebien_id', a.sous_typebien_id,
      'reference', a.reference,
      'date_dispo', a.date_dispo,
      'publie', a.publie,
      'surface', a.surface,
      'ville', a.ville,
      'cp', a.cp,
      'description', a.description,
      'transaction_nom', t.nom,
      'typebien_nom', tb.nom,
      'photo', COALESCE(p.nom, '')
    )
  FROM 
    annonces a
    LEFT JOIN transaction t ON a.transaction_id = t.id
    LEFT JOIN typebien tb ON a.typebien_id = tb.id
    LEFT JOIN annonces_photos p ON p.annonce_id = a.id AND p.principale = true
  ORDER BY 
    a.id DESC;
END;
$$;

-- Fonction pour récupérer une annonce spécifique avec les informations de jointure
CREATE OR REPLACE FUNCTION get_listing_by_id(listing_id INTEGER)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_build_object(
      'id', a.id,
      'reference', a.reference,
      'prix_hors_honoraires', a.prix_hors_honoraires,
      'prix_avec_honoraires', a.prix_avec_honoraires,
      'prix_m2', a.prix_m2,
      'honoraires_id', a.honoraires_id,
      'honoraires_acheteur', a.honoraires_acheteur,
      'copro', a.copro,
      'lots', a.lots,
      'quote_part', a.quote_part,
      'procedure_syndic', a.procedure_syndic,
      'detail_procedure', a.detail_procedure,
      'adresse', a.adresse,
      'quartier', a.quartier,
      'transaction_id', a.transaction_id,
      'typebien_id', a.typebien_id,
      'sous_typebien_id', a.sous_typebien_id,
      'reference', a.reference,
      'date_dispo', a.date_dispo,
      'publie', a.publie,
      'surface', a.surface,
      'ville', a.ville,
      'cp', a.cp,
      'description', a.description,
      'transaction_nom', t.nom,
      'typebien_nom', tb.nom
    )
  FROM 
    annonces a
    LEFT JOIN transaction t ON a.transaction_id = t.id
    LEFT JOIN typebien tb ON a.typebien_id = tb.id
  WHERE 
    a.id = listing_id;
END;
$$;
