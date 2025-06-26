import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { RowDataPacket } from "mysql2"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Récupérer l'état actuel de publication
    const actualite = await query<RowDataPacket[]>({
      query: "SELECT publie FROM actualites WHERE id = ?",
      values: [id],
    })

    if (!actualite || actualite.length === 0) {
      return NextResponse.json(
        { error: "Actualité non trouvée" },
        { status: 404 }
      )
    }

    // Inverser l'état de publication
    const newPublieState = actualite[0].publie ? 0 : 1

    // Mettre à jour l'état de publication
    await query({
      query: "UPDATE actualites SET publie = ? WHERE id = ?",
      values: [newPublieState, id],
    })

    return NextResponse.json({ success: true, publie: newPublieState === 1 })
  } catch (error) {
    console.error("Erreur lors du basculement de l'état de publication:", error)
    return NextResponse.json(
      { error: "Erreur lors du basculement de l'état de publication" },
      { status: 500 }
    )
  }
}
