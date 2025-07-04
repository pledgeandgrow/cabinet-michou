import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const supabase = getSupabaseClient();
    
    // Récupérer l'état actuel de publication
    const { data: actualite, error: getError } = await supabase
      .from('actualites')
      .select('publie')
      .eq('id', id)
      .single();
    
    if (getError || !actualite) {
      console.error("Erreur lors de la récupération de l'actualité:", getError);
      return NextResponse.json(
        { error: "Actualité non trouvée" },
        { status: 404 }
      );
    }
    
    // Inverser l'état de publication
    const newPublieState = !actualite.publie;
    
    // Mettre à jour l'état de publication
    const { error: updateError } = await supabase
      .from('actualites')
      .update({ publie: newPublieState })
      .eq('id', id);
    
    if (updateError) {
      console.error("Erreur lors de la mise à jour de l'actualité:", updateError);
      throw updateError;
    }

    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json({ success: true, publie: newPublieState }, { headers })
  } catch (error) {
    console.error("Erreur lors du basculement de l'état de publication:", error)
    return NextResponse.json(
      { error: "Erreur lors du basculement de l'état de publication" },
      { status: 500 }
    )
  }
}
