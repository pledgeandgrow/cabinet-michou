import { type NextRequest, NextResponse } from "next/server"
import { deleteActualite, updateActualite } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const { titre, contenu, lien, publie } = await req.json()

    if (!id || !titre || !contenu ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await updateActualite(Number(id), titre, contenu, lien, publie)

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "No record found to update" }, { status: 404 })
    }

    return NextResponse.json({ message: "Actualité updated successfully" })
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
  
	  if (result.affectedRows === 0) {
		return NextResponse.json(
		  { error: 'No record found to delete' },
		  { status: 404 }
		);
	  }
  
	  return NextResponse.json({ message: 'Actualité deleted successfully' });
	} catch (error) {
	  console.error(error);
	  return NextResponse.json(
		{ error: 'Erreur lors de la suppression de l\'actualité' },
		{ status: 500 }
	  );
	}
  }

