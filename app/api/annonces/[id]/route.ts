import { NextResponse } from "next/server";
import { deleteListing } from "@/lib/db";
import { getAnnonceById } from "@/lib/queries";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Vérifier si l'annonce existe
    const annonce = await getAnnonceById(id);
    if (!annonce) {
      return NextResponse.json(
        { error: "Annonce non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer l'annonce
    await deleteListing(Number(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'annonce" },
      { status: 500 }
    );
  }
}
