import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { annonceId, cloudinary_url, principale } = await request.json()

    if (!annonceId || !cloudinary_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the photo with Cloudinary URL in the nom field
    const result = await query({
      query: "INSERT INTO annonces_photos (annonce_id, nom, principale) VALUES (?, ?, ?)",
      values: [annonceId, cloudinary_url, principale],
    })

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("Error saving Cloudinary photo:", error)
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 })
  }
}
