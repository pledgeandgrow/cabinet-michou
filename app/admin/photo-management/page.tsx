"use client"
import { Suspense } from "react"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { Trash2, Star, Upload, Home, List } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

// Define types for our photos
interface Photo {
  id?: number
  annonce_id: number
  nom: string
  principale: number
  file?: File
  preview?: string
  isNew?: boolean
}

// Your PhotoManagement component
const PhotoManagementContent = () => {
  const searchParams = useSearchParams()
  const annonceId = searchParams.get("id")

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch existing photos when component mounts
  useEffect(() => {
    if (annonceId) {
      fetchPhotos(Number.parseInt(annonceId))
    }
  }, [annonceId])

  const fetchPhotos = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/annonces/${id}/photos`)
      if (!response.ok) throw new Error("Failed to fetch photos")

      const data = await response.json()
      setPhotos(
        data.map((photo: Photo) => ({
          ...photo,
          preview: `/uploads/${photo.nom}`, // Adjust path as needed
        })),
      )
    } catch (error) {
      console.error("Error fetching photos:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les photos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
    }
  }

  const handleAddPhotos = () => {
    if (!selectedFiles || !annonceId) return

    const newPhotos: Photo[] = Array.from(selectedFiles).map((file) => ({
      annonce_id: Number.parseInt(annonceId),
      nom: file.name,
      principale: 0,
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }))

    // If this is the first photo, make it the principal one
    if (photos.length === 0 && newPhotos.length > 0) {
      newPhotos[0].principale = 1
    }

    setPhotos([...photos, ...newPhotos])
    setSelectedFiles(null)

    // Reset the file input
    const fileInput = document.getElementById("photos") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleRemovePhoto = (index: number) => {
    const photoToRemove = photos[index]

    // If removing the principal photo, set another one as principal
    if (photoToRemove.principale === 1 && photos.length > 1) {
      const newPhotos = [...photos]
      newPhotos.splice(index, 1)

      // Find the first remaining photo and make it principal
      const firstRemainingPhotoIndex = newPhotos.findIndex((p) => p.id !== photoToRemove.id)
      if (firstRemainingPhotoIndex !== -1) {
        newPhotos[firstRemainingPhotoIndex].principale = 1
      }

      setPhotos(newPhotos)
    } else {
      // Just remove the photo
      setPhotos(photos.filter((_, i) => i !== index))
    }

    // If the photo has a preview URL, revoke it to free memory
    if (photoToRemove.preview && photoToRemove.isNew) {
      URL.revokeObjectURL(photoToRemove.preview)
    }
  }

  const handleSetPrincipal = (index: number) => {
    const updatedPhotos = photos.map((photo, i) => ({
      ...photo,
      principale: i === index ? 1 : 0,
    }))
    setPhotos(updatedPhotos)
  }

  const handleSaveChanges = async () => {
    if (!annonceId) return

    setIsSaving(true)
    try {
      // Create FormData to handle file uploads
      const formData = new FormData()
      formData.append("annonceId", annonceId)

      // Add information about which photos to keep, delete, and which is principal
      const existingPhotoIds = photos
        .filter((p) => !p.isNew && p.id)
        .map((p) => ({ id: p.id, principale: p.principale }))

      formData.append("existingPhotos", JSON.stringify(existingPhotoIds))

      // Add new files
      photos
        .filter((p) => p.isNew && p.file)
        .forEach((photo) => {
          if (photo.file) {
            formData.append("files", photo.file)
            formData.append(
              "fileInfo",
              JSON.stringify({
                name: photo.nom,
                principale: photo.principale,
              }),
            )
          }
        })

      const response = await fetch(`/api/annonces/${annonceId}/photos`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to save photos")

      toast({
        title: "Succès",
        description: "Les photos ont été enregistrées avec succès",
      })

      // Refresh photos from server
      fetchPhotos(Number.parseInt(annonceId))
    } catch (error) {
      console.error("Error saving photos:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les photos",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:underline cursor-pointer inline-flex items-center">
            <Home className="h-3.5 w-3.5 mr-1" />
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link href="/annonces" className="hover:underline cursor-pointer inline-flex items-center">
            <List className="h-3.5 w-3.5 mr-1" />
            Gestion des annonces
          </Link>
          <span className="mx-2">/</span>
          <span>Gestion des photos pour le bien</span>
        </div>
        <div className="text-orange-400 uppercase tracking-wide text-sm font-semibold mb-2">ANNONCES</div>
        <h1 className="text-4xl font-bold text-[#00458E] mb-8">Gérer les photos de l'annonce {annonceId}</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00458E]"></div>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center text-orange-400 text-lg mb-12 p-8 border-2 border-dashed border-gray-300 rounded-lg">
          Vous n&apos;avez ajouté aucune photo à cette annonce
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {photos.map((photo, index) => (
            <div key={index} className="relative group border rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video relative">
                <img
                  src={photo.preview || "/placeholder.svg?height=200&width=300"}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {photo.principale === 1 && (
                  <div className="absolute top-2 left-2 bg-orange-400 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Principale
                  </div>
                )}
              </div>

              <div className="p-3 bg-white">
                <p className="text-sm truncate" title={photo.nom}>
                  {photo.nom}
                </p>
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {photo.principale !== 1 && (
                  <Button
                    onClick={() => handleSetPrincipal(index)}
                    size="sm"
                    variant="outline"
                    className="bg-white hover:bg-orange-400 hover:text-white"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Définir principale
                  </Button>
                )}
                <Button onClick={() => handleRemovePhoto(index)} size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-8 bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#00458E]">Sélectionnez les photos à ajouter</h2>
          <div className="space-y-2">
            <Input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Formats acceptés: JPG, PNG, GIF. Taille maximale: 5MB par image.
            </p>
          </div>

          <Button
            onClick={handleAddPhotos}
            disabled={!selectedFiles}
            className="bg-orange-400 hover:bg-orange-500 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Ajouter les photos
          </Button>
        </div>

        <div className="flex justify-center pt-4 border-t border-gray-200">
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving || photos.length === 0}
            className="bg-[#00458E] hover:bg-[#003366] min-w-[200px]"
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Wrap your component with Suspense
export default function PhotoManagement() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00458E]"></div>
        </div>
      }
    >
      <PhotoManagementContent />
    </Suspense>
  )
}

