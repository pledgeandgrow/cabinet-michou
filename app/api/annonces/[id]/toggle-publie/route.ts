import { NextResponse } from "next/server";
import { toggleListingPublication } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Appeler la fonction pour basculer l'état de publication
    const result = await toggleListingPublication(Number(id));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de publication:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de publication" },
      { status: 500 }
    );
  }
}
