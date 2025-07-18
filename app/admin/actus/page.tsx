"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, X } from "lucide-react"
import { useState, useEffect } from "react"
import CreateActusPopup from "@/components/createActus"
import EditActualiteForm from "@/components/EditActus"

interface Actualite {
  id: number
  titre: string
  lien: string
  publie: boolean
  contenu: string
}

export default function NewsManagement() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)  
  const [actualites, setActualites] = useState<Actualite[]>([])
  const [currentActualite, setCurrentActualite] = useState<Actualite | null>(null)  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActualites() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/actualites")
        if (!response.ok) {
          throw new Error("Failed to fetch actualités")
        }
        const data = await response.json()
        setActualites(data)
      } catch (err) {
        setError("An error occurred while fetching actualités")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActualites()
  }, [])

  const handleEditClick = (actualite: Actualite) => {
    setCurrentActualite(actualite)
    setIsEditMode(true)
    setIsPopupOpen(true)
  }

  const handleSubmit = async (updatedActualite: Actualite) => {
    const { id, titre, contenu, lien, publie } = updatedActualite;
  
    try {
      const response = await fetch(`/api/actualites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titre, contenu, lien, publie }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        console.error('Error from server:', errorMessage);
        return;
      }
  
      const result = await response.json();
      console.log('Actualité updated successfully', result);
      setIsPopupOpen(false)

  
      setActualites((prevActualites) => 
        prevActualites.map((item) =>
          item.id === id ? { ...item, ...updatedActualite } : item
        )
      );
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }
  
  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/actualites/${id}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to delete');
    } else {
      alert('Actualité deleted successfully');
      setActualites((prev) => prev.filter((item) => item.id !== id));
    }
  };
  
  // Fonction pour basculer l'état de publication d'une actualité
  const handleTogglePublie = async (id: number, currentState: boolean) => {
    try {
      const response = await fetch(`/api/actualites/${id}/toggle-publie`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to toggle publication state');
        return;
      }
      
      const result = await response.json();
      
      // Mettre à jour l'état local
      setActualites((prevActualites) => 
        prevActualites.map((item) =>
          item.id === id ? { ...item, publie: result.publie } : item
        )
      );
    } catch (error) {
      console.error('Error during toggle publication:', error);
      alert('Une erreur est survenue lors du changement d\'état de publication');
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4">
          <span className="hover:underline cursor-pointer">Accueil</span>
          <span className="mx-2">/</span>
          <span>Gestion des actualités</span>
        </div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Gestion des actualités</h1>
        <div className="text-right">
          <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#F5A623] hover:bg-[#E59512] text-white">
                {isEditMode ? 'Modifier l\'actualité' : 'Créer une actualité'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[705px]">
              {isEditMode && currentActualite ? (
                <EditActualiteForm
                  actualite={currentActualite}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsPopupOpen(false)}
                />
              ) : (
                <CreateActusPopup />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <p>Chargement des actualités...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] bg-[#00458E] text-white">ACTIONS</TableHead>
              <TableHead className="bg-[#00458E] text-white">TITRE</TableHead>
              <TableHead className="w-[100px] bg-[#00458E] text-white">LIEN</TableHead>
              <TableHead className="w-[100px] bg-[#00458E] text-white">PUBLIÉ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actualites.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
    className="text-red-600 hover:text-red-800"
    onClick={() => handleDelete(item.id)}
  >
    <X className="h-4 w-4" />
  </button>
                </TableCell>
                <TableCell>{item.titre}</TableCell>
                <TableCell>{item.lien ? "Oui" : "Non"}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleTogglePublie(item.id, item.publie)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    title={item.publie ? "Cliquez pour dépublier" : "Cliquez pour publier"}
                  >
                    <div className={`h-3 w-3 rounded-full ${item.publie ? "bg-green-500" : "bg-red-500"}`} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
