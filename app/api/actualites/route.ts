import { getAllActualites } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const actualites = await getAllActualites()
    return NextResponse.json(actualites)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching actualités" }, { status: 500 })
  }
}

