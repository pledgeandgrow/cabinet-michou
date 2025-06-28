import { NextResponse } from "next/server";
import { getTypeTransactions } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const transactions = await getTypeTransactions();
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json(transactions, { headers });
  } catch (error) {
    console.error("Erreur lors de la récupération des types de transactions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des types de transactions" },
      { status: 500 }
    );
  }
}
