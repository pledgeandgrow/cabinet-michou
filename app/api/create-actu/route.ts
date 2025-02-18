import { insertActualite } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { titre, contenu, lien, publie } = await req.json();
    
    await insertActualite(titre, contenu, lien, publie);

    return NextResponse.json({ message: 'Actualité créée avec succès!' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de l\'insertion:', error);
    return NextResponse.json({ message: 'Erreur lors de la création de l\'actualité' }, { status: 500 });
  }
}
