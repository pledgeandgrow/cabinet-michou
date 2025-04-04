"use client"

import { useState, useEffect } from "react"
import { Pencil, Camera, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Photo {
  id: string
  url: string
  principale: boolean
}

interface Equipements {
  cuisine: string | "N/C"
  parquet: "Oui" | "Non"
  placards: "Oui" | "Non"
  digicode: "Oui" | "Non"
  interphone: "Oui" | "Non"
  gardien: "Oui" | "Non"
  fibre: "Oui" | "Non"
}

interface Annonce {
  id: string
  titre: string
  reference: string
  prix: number | "N/C"
  prix_hors_charges: number | "N/C"
  charges: number | "N/C"
  surface: number | "N/C"
  nb_pieces: number | "N/C"
  nb_chambres: number | "N/C"
  typeLogement: string
  transaction: "Location" | "Vente"
  chauffage: string
  dpe_conso: string | "N/C"
  dpe_emission: string | "N/C"
  description: string
  ville: string
  code_postal: string
  etage: string
  ascenseur: "Oui" | "Non"
  balcon: "Oui" | "Non"
  terrasse: "Oui" | "Non"
  cave: "Oui" | "Non"
  parking: "Oui" | "Non"
  meuble: "Oui" | "Non"
  photos: Photo[]
  equipements: Equipements
  honoraires_locataire?: string
  etat_des_lieux?: string
  depot_garantie?: string
  charges_details?: string
  date_disponibilite?: string
  honoraires_acheteur?: string
  prix_m2?: string
  copropriete?: "Oui" | "Non"
  nb_lots?: number | "N/C"
}

export default function RealEstateTable({ items }: { items?: Annonce[] }) {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const router = useRouter();

  const [currentAnnonce, setCurrentAnnonce] = useState<Annonce | null>(null)

  useEffect(() => {
    if (items) {
      setAnnonces(items)
      setFilteredAnnonces(items)
      setIsLoading(false)
    } else {
      const fetchAnnonces = async () => {
        try {
          const response = await fetch("/api/listings")
          if (!response.ok) throw new Error("Failed to fetch")
          const data = await response.json()
          setAnnonces(data)
          setFilteredAnnonces(data)
        } catch (error) {
          console.error("Error fetching annonces:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchAnnonces()
    }
  }, [items])

  const handleEditClick = (annonce: Annonce) => {
    setCurrentAnnonce(annonce)
    setIsEditMode(true)
    setIsPopupOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      console.log("Delete annonce:", id)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <p>Chargement des annonces...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4">
          <span className="hover:underline cursor-pointer">Accueil</span>
          <span className="mx-2">/</span>
          <span>Gestion des annonces</span>
        </div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Gestion des annonces</h1>
        <div className="flex justify-end gap-4">
              <Link href={'/admin/create-annonce'} className={`bg-[#F5A623] ${buttonVariants()} hover:bg-[#E59512] text-white`}>Créer une annonce</Link>
            
          <Button className="bg-[#F5A623] hover:bg-[#E59512] text-white">Publier sur Se Loger</Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] bg-[#00458E] text-white">ACTIONS</TableHead>
              <TableHead className="bg-[#00458E] text-white">TRANSACTION</TableHead>
              <TableHead className="bg-[#00458E] text-white">TYPE DE BIEN</TableHead>
              <TableHead className="bg-[#00458E] text-white">RÉFÉRENCE</TableHead>
              <TableHead className="bg-[#00458E] text-white">SURFACE</TableHead>
              <TableHead className="bg-[#00458E] text-white">PRIX</TableHead>
              <TableHead className="bg-[#00458E] text-white">CP</TableHead>
              <TableHead className="bg-[#00458E] text-white">VILLE</TableHead>
              <TableHead className="bg-[#00458E] text-white">PUBLIÉ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnnonces.map((annonce) => (
              <TableRow key={annonce.id}>
                <TableCell className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => router.push(`/admin/annonces/edit/${annonce.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <Link href={`/admin/photo-management?id=${annonce.id}`} className={`text-blue-600 hover:text-blue-800`}>
                    <Camera className="h-4 w-4" />
                  </Link>
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(annonce.id)}>
                    <X className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell>{annonce.id}</TableCell>
                <TableCell>{annonce.typebien_nom}</TableCell>
                <TableCell>{annonce.reference}</TableCell>
                <TableCell>{annonce.surface} m²</TableCell>
                <TableCell className="whitespace-nowrap">
                  {annonce.prix === "N/C" ? "N/C" : `${annonce.prix} €`}
                  {annonce.charges !== "N/C" && (
                    <span className="text-sm text-gray-500 block">{`(+${annonce.charges}€ charges)`}</span>
                  )}
                </TableCell>
                <TableCell>{annonce.code_postal}</TableCell>
                <TableCell>{annonce.ville}</TableCell>
                <TableCell>
                  <div className={`h-3 w-3 rounded-full ${annonce.publie ? "bg-green-500" : "bg-red-500"}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

