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
  prix_avec_honoraires?: number | "N/C"
  prix_hors_honoraires?: number | "N/C"
  charges: number | "N/C"
  surface: number | "N/C"
  // Champs avec les deux formats possibles (ancien et nouveau)
  nb_pieces?: number | "N/C"
  pieces?: number | "N/C"
  nb_chambres?: number | "N/C"
  chambres?: number | "N/C"
  nb_sdb?: number | "N/C"
  sdb?: number | "N/C"
  nb_wc?: number | "N/C"
  wc?: number | "N/C"
  etage: number | "N/C"
  // Champs booléens qui peuvent avoir plusieurs formats
  ascenseur?: "Oui" | "Non" | boolean | number
  balcon?: "Oui" | "Non" | boolean | number
  terrasse?: "Oui" | "Non" | boolean | number
  jardin?: "Oui" | "Non" | boolean | number
  cave?: "Oui" | "Non" | boolean | number
  parking?: "Oui" | "Non" | boolean | number
  publie: boolean
  meuble?: "Oui" | "Non" | boolean | number
  photos: Photo[]
  equipements: Equipements
  honoraires_locataire?: string
  etat_des_lieux?: string
  depot_garantie?: string
  charges_details?: string
  date_disponibilite?: string
  honoraires_acheteur?: string
  prix_m2?: string
  copropriete?: "Oui" | "Non" | boolean | number
  nb_lots?: number | "N/C"
  code_postal?: string
  ville?: string
  transaction_nom?: string
  typebien_nom?: string
}

export default function RealEstateTable({ items }: { items?: Annonce[] }) {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const router = useRouter();
  const [isPublishingToSeLoger, setIsPublishingToSeLoger] = useState(false);
  const [publishMessage, setPublishMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
      try {
        const response = await fetch(`/api/annonces/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression");
        }

        // Rafraîchir la liste des annonces après suppression
        const updatedAnnonces = annonces.filter(annonce => annonce.id !== id);
        setAnnonces(updatedAnnonces);
        setFilteredAnnonces(updatedAnnonces);
        
        alert("Annonce supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression de l'annonce");
      }
    }
  }
  
  // Fonction pour basculer l'état de publication d'une annonce
  const togglePublie = async (id: string) => {
    try {
      // Mettre à jour l'état local immédiatement pour une réactivité instantanée
      const currentAnnonces = [...annonces];
      const annonceIndex = currentAnnonces.findIndex(a => a.id === id);
      
      if (annonceIndex !== -1) {
        // Inverser l'état de publication dans l'interface avant la réponse du serveur
        const newPublieState = !currentAnnonces[annonceIndex].publie;
        currentAnnonces[annonceIndex] = { ...currentAnnonces[annonceIndex], publie: newPublieState };
        setAnnonces(currentAnnonces);
        setFilteredAnnonces(currentAnnonces);
      }
      
      // Envoyer la requête au serveur
      const response = await fetch(`/api/annonces/${id}/toggle-publie`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut");
      }

      const result = await response.json();
      
      // Mettre à jour l'état local avec la réponse du serveur pour s'assurer de la cohérence
      const updatedAnnonces = annonces.map(annonce => {
        if (annonce.id === id) {
          // Utiliser la valeur retournée par le serveur
          return { ...annonce, publie: result[0].publie };
        }
        return annonce;
      });
      
      setAnnonces(updatedAnnonces);
      setFilteredAnnonces(updatedAnnonces);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Une erreur est survenue lors de la mise à jour du statut de publication");
      
      // En cas d'erreur, récupérer les données à jour depuis le serveur
      const fetchAnnonces = async () => {
        try {
          const response = await fetch("/api/listings");
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          setAnnonces(data);
          setFilteredAnnonces(data);
        } catch (fetchError) {
          console.error("Error fetching annonces:", fetchError);
        }
      };
      
      fetchAnnonces();
    }
  }

  // Fonction pour publier les annonces sur SeLoger
  const publishToSeLoger = async () => {
    try {
      setIsPublishingToSeLoger(true);
      setPublishMessage(null);
      
      // Faire la requête avec responseType blob pour récupérer directement le fichier ZIP
      const response = await fetch('/api/annonces/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Envoyer toutes les annonces publiées
      });
      
      // Vérifier si la réponse est OK
      if (response.ok) {
        // Récupérer le nom du fichier depuis l'en-tête Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'SeLogerExport.zip';
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        // Récupérer le blob
        const blob = await response.blob();
        
        // Créer une URL pour le blob
        const url = window.URL.createObjectURL(blob);
        
        // Créer un lien temporaire pour le téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Nettoyer
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        setPublishMessage({ 
          type: 'success', 
          text: 'Export réussi! Téléchargement du fichier en cours...' 
        });
      } else {
        // En cas d'erreur, essayer de lire la réponse JSON pour obtenir le message d'erreur
        try {
          const errorData = await response.json();
          setPublishMessage({ type: 'error', text: errorData.message || 'Erreur lors de la génération du fichier' });
        } catch {
          setPublishMessage({ type: 'error', text: `Erreur ${response.status}: ${response.statusText}` });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération du fichier:', error);
      setPublishMessage({ type: 'error', text: 'Erreur lors de la génération du fichier' });
    } finally {
      setIsPublishingToSeLoger(false);
    }
  };

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
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div>
            {publishMessage && (
              <div className={`px-4 py-2 rounded ${publishMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {publishMessage.text}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Link href={'/admin/create-annonce'} className={`bg-[#F5A623] ${buttonVariants()} hover:bg-[#E59512] text-white`}>Créer une annonce</Link>
            
            <Button 
              className="bg-[#F5A623] hover:bg-[#E59512] text-white" 
              onClick={publishToSeLoger}
              disabled={isPublishingToSeLoger}
            >
              {isPublishingToSeLoger ? (
                <>
                  <span className="mr-2">Publication en cours...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                'Publier sur Se Loger'
              )}
            </Button>
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
                  <TableCell>{annonce.transaction_nom || "N/A"}</TableCell>
                  <TableCell>{annonce.typebien_nom || "N/A"}</TableCell>
                  <TableCell>{annonce.reference || "N/A"}</TableCell>
                  <TableCell>{annonce.surface ? `${annonce.surface} m²` : "N/A"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {annonce.prix_avec_honoraires ? `${annonce.prix_avec_honoraires} €` : "N/C"}
                    {annonce.charges && annonce.charges !== "N/C" && (
                      <span className="text-sm text-gray-500 block">{`(+${annonce.charges}€ charges)`}</span>
                    )}
                  </TableCell>
                  <TableCell>{annonce.code_postal || "N/A"}</TableCell>
                  <TableCell>{annonce.ville || "N/A"}</TableCell>
                  <TableCell>
                    <div 
                      className={`h-3 w-3 rounded-full ${annonce.publie ? "bg-green-500" : "bg-red-500"} cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => togglePublie(annonce.id)}
                      title={annonce.publie ? "Cliquez pour masquer l'annonce" : "Cliquez pour publier l'annonce"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
