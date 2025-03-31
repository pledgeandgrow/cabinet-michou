
import { NextRequest, NextResponse } from 'next/server';
import { getAnnonces } from '@/lib/annonces';
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params: any = {
      transactionId: 2, // Vente
      limit: Number(searchParams.get('limit')) || 50,
      offset: Number(searchParams.get('offset')) || 0,
      search: searchParams.get('search') || '',
      ville: searchParams.get('ville') || '',
      prixMin: searchParams.get('prix_min') ? Number(searchParams.get('prix_min')) : null,
      prixMax: searchParams.get('prix_max') ? Number(searchParams.get('prix_max')) : null,
      surfaceMin: searchParams.get('surface_min') ? Number(searchParams.get('surface_min')) : null,
      surfaceMax: searchParams.get('surface_max') ? Number(searchParams.get('surface_max')) : null,
      nbPieces: searchParams.get('nb_pieces') ? Number(searchParams.get('nb_pieces')) : null,
      typeLogementId: searchParams.get('type_logement_id') ? Number(searchParams.get('type_logement_id')) : null,
    };

    const annonces = await getAnnonces(params);
    return NextResponse.json(annonces);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
