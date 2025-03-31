import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const annonceId = params.id

    const photos = await query({
      query: "SELECT id, annonce_id, nom, principale FROM annonces_photos WHERE annonce_id = ?",
      values: [annonceId],
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error("Error fetching photos:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const annonceId = params.id

    await ensureUploadDir()

    const formData = await request.formData()

    const existingPhotosJson = formData.get("existingPhotos") as string
    const existingPhotos = existingPhotosJson ? JSON.parse(existingPhotosJson) : []

    await query({ query: "START TRANSACTION", values: [] })

    await query({
      query: "UPDATE annonces_photos SET principale = 0 WHERE annonce_id = ?",
      values: [annonceId],
    })

    for (const photo of existingPhotos) {
      await query({
        query: "UPDATE annonces_photos SET principale = ? WHERE id = ?",
        values: [photo.principale, photo.id],
      })
    }

    const existingIds = existingPhotos.map((p: any) => p.id)
    const idsPlaceholder = existingIds.length ? existingIds.map(() => "?").join(",") : "NULL"

    await query({
      query: `DELETE FROM annonces_photos WHERE annonce_id = ? AND id NOT IN (${idsPlaceholder})`,
      values: [annonceId, ...existingIds],
    })

    const files = formData.getAll("files") as File[]
    const fileInfos = formData.getAll("fileInfo").map((info) => JSON.parse(info as string))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileInfo = fileInfos[i]

      const timestamp = Date.now()
      const uniqueFilename = `${timestamp}-${fileInfo.name}`

      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(UPLOAD_DIR, uniqueFilename), buffer)

      await query({
        query: "INSERT INTO annonces_photos (annonce_id, nom, principale) VALUES (?, ?, ?)",
        values: [annonceId, uniqueFilename, fileInfo.principale],
      })
    }

    await query({ query: "COMMIT", values: [] })

    return NextResponse.json({ success: true })
  } catch (error) {
    await query({ query: "ROLLBACK", values: [] })

    console.error("Error saving photos:", error)
    return NextResponse.json({ error: "Failed to save photos" }, { status: 500 })
  }
}

