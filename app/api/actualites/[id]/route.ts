import { type NextRequest, NextResponse } from "next/server"
import { deleteActualite, updateActualite } from "@/lib/db"

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const data = await req.json()

    if (!id) {
      return NextResponse.json({ error: "ID d'actualité manquant" }, { status: 400 })
    }

    const result = await updateActualite(Number(id), data)

    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json({ success: true, data: result }, { headers })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'actualité" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	const id = params.id
	
	if (!id) {
	  return NextResponse.json(
		{ error: 'ID is required' },
		{ status: 400 }
	  );
	}
  
	try {
	  const result = await deleteActualite(Number(id));
  
	  // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return NextResponse.json({ success: true }, { headers });
	} catch (error) {
	  console.error(error);
	  return NextResponse.json(
		{ error: 'Erreur lors de la suppression de l\'actualité' },
		{ status: 500 }
	  );
	}
  }

