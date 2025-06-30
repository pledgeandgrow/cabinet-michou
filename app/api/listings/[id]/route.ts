import { NextRequest, NextResponse } from "next/server"
import { getListings, getListing, deleteListing } from "@/lib/db"
import { updateListingFixed } from "@/lib/listing-utils"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
  
    if (id) {
      const listing = await getListing(Number(id))
      return NextResponse.json(listing)
    }
  
    const listings = await getListings()
    return NextResponse.json(listings)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching listings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
  
    const body = await req.json()
    const result = await updateListingFixed(Number(id), body)
    return NextResponse.json({ message: "Listing updated successfully", result })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error updating listing" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
  
    const result = await deleteListing(Number(id))
    return NextResponse.json({ message: "Listing deleted successfully", result })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error deleting listing" }, { status: 500 })
  }
}
  
  