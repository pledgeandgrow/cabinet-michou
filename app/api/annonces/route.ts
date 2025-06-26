import { NextResponse } from 'next/server';
import { getAllAnnonces } from '@/lib/queries';

export async function GET() {
  try {
    const annonces = await getAllAnnonces();

    // Formater les données
    const formattedAnnonces = annonces.map((annonce: any) => ({
      id: annonce.id,
      titre: annonce.nom || 'N/C',
      reference: annonce.reference || 'N/C',
      prix: annonce.transaction_id === 1 
        ? annonce.loyer_avec_charges || 'N/C'
        : annonce.prix_avec_honoraires || 'N/C',
      prix_hors_charges: annonce.transaction_id === 1
        ? annonce.loyer_hors_charges || 'N/C'
        : annonce.prix_hors_honoraires || 'N/C',
      charges: annonce.charges || 'N/C',
      surface: annonce.surface || 'N/C',
      nb_pieces: annonce.pieces || 'N/C',
      nb_chambres: annonce.chambres || 'N/C',
      typeLogement: annonce.typeLogement || 'N/C',
      transaction: annonce.transaction_id === 1 ? 'Location' : 'Vente',
      chauffage: annonce.chauffage || 'N/C',
      dpe_conso: annonce.bilan_conso_id || 'N/C',
      dpe_emission: annonce.bilan_emission_id || 'N/C',
      description: annonce.description || 'N/C',
      ville: annonce.ville || 'N/C',
      code_postal: annonce.cp || 'N/C',
      etage: annonce.etage !== null ? `${annonce.etage}${annonce.nb_etages ? `/${annonce.nb_etages}` : ''}` : 'N/C',
      ascenseur: annonce.ascenseur ? 'Oui' : 'Non',
      balcon: annonce.nb_balcons ? 'Oui' : 'Non',
      terrasse: annonce.terrasse ? 'Oui' : 'Non',
      cave: annonce.cave ? 'Oui' : 'Non',
      parking: annonce.parking ? 'Oui' : 'Non',
      meuble: annonce.meuble ? 'Oui' : 'Non',
      photos: [{
        id: annonce.id,
        url: annonce.photo && annonce.photo.startsWith('http') 
          ? annonce.photo 
          : `/uploads/annonces/${annonce.id}/${annonce.photo}`,
        principale: true
      }],
      // Informations spécifiques à la location
      ...(annonce.transaction_id === 1 && {
        honoraires_locataire: annonce.honoraires_locataire || 'N/C',
        etat_des_lieux: annonce.etat_des_lieux || 'N/C',
        depot_garantie: annonce.depot_garantie || 'N/C',
        charges_details: annonce.nom_charges || 'N/C',
        date_disponibilite: annonce.date_dispo ? new Date(annonce.date_dispo).toLocaleDateString('fr-FR') : 'N/C'
      }),
      // Informations spécifiques à la vente
      ...(annonce.transaction_id === 2 && {
        honoraires_acheteur: annonce.honoraires_acheteur ? `${annonce.honoraires_acheteur}%` : 'N/C',
        prix_m2: annonce.prix_m2 || 'N/C',
        copropriete: annonce.copro ? 'Oui' : 'Non',
        nb_lots: annonce.lots || 'N/C'
      }),
      // Équipements
      equipements: {
        cuisine: annonce.cuisine_id || 'N/C',
        parquet: annonce.parquet ? 'Oui' : 'Non',
        placards: annonce.placard ? 'Oui' : 'Non',
        digicode: annonce.digicode ? 'Oui' : 'Non',
        interphone: annonce.interphone ? 'Oui' : 'Non',
        gardien: annonce.gardien ? 'Oui' : 'Non',
        fibre: annonce.cable ? 'Oui' : 'Non'
      }
    }));

    return NextResponse.json(formattedAnnonces);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
