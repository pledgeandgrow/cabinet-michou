"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface FormData {
  reference: string
  surface: string
  transaction_id: string
  typebien_id: string
  sous_typebien_id: string
  date_dispo: string
  adresse: string
  quartier: string
  prix_hors_honoraires: string
  prix_avec_honoraires: string
  prix_m2: string
  publie : string
  honoraires_id: string
  honoraires_acheteur: string
  copro: boolean
  lots: string
  quote_part: string
  procedure_syndic: boolean
  detail_procedure: string
}

interface PageParams {
  slug: string
}

export default function EditListingPage({ params }: { params: PageParams }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typesbiens, setTypesBien] = useState([])
  const [typestransactions, setTypesTransactions] = useState([])
  const [formData, setFormData] = useState<FormData>({
    reference: "",
    publie : '',
    transaction_id: "",
    typebien_id: "",
    surface: "",
    sous_typebien_id: "",
    date_dispo: format(new Date(), "yyyy-MM-dd"),
    adresse: "",
    quartier: "",
    prix_hors_honoraires: "",
    prix_avec_honoraires: "",
    prix_m2: "",
    honoraires_id: "1",
    honoraires_acheteur: "",
    copro: false,
    lots: "",
    quote_part: "",
    procedure_syndic: false,
    detail_procedure: "",
  })

  const router = useRouter()
  const id = params.slug

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch annonce data
        const annonceRes = await fetch(`/api/listings/${id}`)
        if (!annonceRes.ok) {
          throw new Error("Failed to fetch annonce")
        }
        const annonceData = await annonceRes.json()
        console.log(annonceData)

        // Fetch types biens
        const typesbiensRes = await fetch("/api/typesbiens")
        if (!typesbiensRes.ok) {
          throw new Error("Failed to fetch types biens")
        }
        const typesbiensData = await typesbiensRes.json()

        // Fetch types transactions
        const typestransactionsRes = await fetch("/api/typestransactions")
        if (!typestransactionsRes.ok) {
          throw new Error("Failed to fetch types transactions")
        }
        const typestransactionsData = await typestransactionsRes.json()

        // Set all the data
        setTypesBien(typesbiensData)
        setTypesTransactions(typestransactionsData)
        setFormData({
          publie:annonceData.publie ,
          surface:annonceData.surface || "",
          reference: annonceData.reference || "",
          transaction_id: annonceData.transaction_id?.toString() || "",
          typebien_id: annonceData.typebien_id?.toString() || "",
          sous_typebien_id: annonceData.sous_typebien_id?.toString() || "",
          date_dispo: annonceData.date_dispo || format(new Date(), "yyyy-MM-dd"),
          adresse: annonceData.adresse || "",
          quartier: annonceData.quartier || "",
          prix_hors_honoraires: annonceData.prix_hors_honoraires?.toString() || "",
          prix_avec_honoraires: annonceData.prix_avec_honoraires?.toString() || "",
          prix_m2: annonceData.prix_m2?.toString() || "",
          honoraires_id: annonceData.honoraires_id?.toString() || "1",
          honoraires_acheteur: annonceData.honoraires_acheteur?.toString() || "",
          copro: annonceData.copro || false,
          lots: annonceData.lots?.toString() || "",
          quote_part: annonceData.quote_part?.toString() || "",
          procedure_syndic: annonceData.procedure_syndic || false,
          detail_procedure: annonceData.detail_procedure || "",
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        // Show error message to user
        const errorMessage = document.createElement("div")
        errorMessage.className = "fixed top-26 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg"
        errorMessage.textContent = "Erreur lors du chargement des données"
        document.body.appendChild(errorMessage)
        setTimeout(() => {
          errorMessage.remove()
          router.push("/annonces")
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, router])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const requestBody = {
        publie : formData.publie,
        surface: formData.surface,
        reference: formData.reference,
        transaction_id: Number(formData.transaction_id),
        typebien_id: formData.typebien_id ? Number(formData.typebien_id) : null,
        sous_typebien_id: formData.sous_typebien_id ? Number(formData.sous_typebien_id) : null,
        date_dispo: formData.date_dispo,
        adresse: formData.adresse,
        quartier: formData.quartier,
        prix_hors_honoraires: formData.prix_hors_honoraires ? Number(formData.prix_hors_honoraires) : null,
        prix_avec_honoraires: formData.prix_avec_honoraires ? Number(formData.prix_avec_honoraires) : null,
        prix_m2: formData.prix_m2 ? Number(formData.prix_m2) : null,
        honoraires_id: Number(formData.honoraires_id),
        honoraires_acheteur: formData.honoraires_acheteur ? Number(formData.honoraires_acheteur) : null,
        copro: formData.copro,
        lots: formData.lots ? Number(formData.lots) : null,
        quote_part: formData.quote_part ? Number(formData.quote_part) : null,
        procedure_syndic: formData.procedure_syndic,
        detail_procedure: formData.detail_procedure,
      }

      // Validate required fields
      const requiredFields = [
        "reference",
        "transaction_id",
        "typebien_id",
        "date_dispo",
        "adresse",
        "prix_hors_honoraires",
        "prix_avec_honoraires",
      ]
      const missingFields = requiredFields.filter((field) => !requestBody[field])

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
      }

      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error: ${response.status}`)
      }

      const result = await response.json()
      console.log("Update successful:", result)
    } catch (error: any) {
      console.error("Update error:", error)

      // Show error message
      const errorMessage = document.createElement("div")
      errorMessage.className = "fixed top-16 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg"
      errorMessage.textContent = `Erreur: ${error.message}`
      document.body.appendChild(errorMessage)

      setTimeout(() => {
        errorMessage.remove()
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Rest of the component (form UI) remains the same
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4">
          <span className="hover:underline cursor-pointer">Accueil</span>
          <span className="mx-2">/</span>
          <span className="hover:underline cursor-pointer">Gestion des annonces</span>
          <span className="mx-2">/</span>
          <span>Modifier une annonce</span>
        </div>
        <div className="text-orange-400 uppercase tracking-wide text-sm font-semibold mb-2">ANNONCES</div>
        <h1 className="text-4xl font-bold text-[#00458E] mb-8">Modifier une annonce</h1>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[#00458E] mb-6">Informations Générales</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference">
                Référence <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_id">
                Type de transaction <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.transaction_id}
                onValueChange={(value) => setFormData({ ...formData, transaction_id: value })}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {typestransactions.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typebien_id">
                Type de bien <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.typebien_id}
                onValueChange={(value) => setFormData({ ...formData, typebien_id: value })}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {typesbiens.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_dispo">
                Date de disponibilité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date_dispo"
                type="date"
                value={formData.date_dispo}
                onChange={(e) => setFormData({ ...formData, date_dispo: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00458E] mb-6">Localisation</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adresse">
                Adresse <span className="text-red-500">*</span>
              </Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quartier">Quartier</Label>
              <Input
                id="quartier"
                value={formData.quartier}
                onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00458E] mb-6">Informations financières</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prix_hors_honoraires">
                Prix hors honoraires <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prix_hors_honoraires"
                type="number"
                value={formData.prix_hors_honoraires}
                onChange={(e) => setFormData({ ...formData, prix_hors_honoraires: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix_avec_honoraires">
                Prix avec honoraires <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prix_avec_honoraires"
                type="number"
                value={formData.prix_avec_honoraires}
                onChange={(e) => setFormData({ ...formData, prix_avec_honoraires: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix_m2">Prix au m²</Label>
              <Input
                id="prix_m2"
                type="number"
                value={formData.prix_m2}
                onChange={(e) => setFormData({ ...formData, prix_m2: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="honoraires_acheteur">Honoraires acheteur</Label>
              <Input
                id="honoraires_acheteur"
                type="number"
                value={formData.honoraires_acheteur}
                onChange={(e) => setFormData({ ...formData, honoraires_acheteur: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00458E] mb-6">Informations copropriété</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="copro"
                checked={formData.copro}
                onCheckedChange={(checked) => setFormData({ ...formData, copro: checked as boolean })}
              />
              <Label htmlFor="copro">Copropriété</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="surface">Surface</Label>
              <Input
                id="surface"
                type="number"
                value={formData.surface}
                onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surface">Publié</Label>
              <Select
  value={formData.publie ? "1" : "0"} // Convert boolean/number to string
  onValueChange={(value) =>
    setFormData({ ...formData, publie: value === "1" }) // Convert back to boolean
  }
>
  <SelectTrigger>
    <SelectValue placeholder={formData.publie ? "oui" : "non"} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">oui</SelectItem>
    <SelectItem value="0">non</SelectItem>
  </SelectContent>
</Select>


            </div>

            {formData.copro && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lots">Nombre de lots</Label>
                  <Input
                    id="lots"
                    type="number"
                    value={formData.lots}
                    onChange={(e) => setFormData({ ...formData, lots: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote_part">Quote-part</Label>
                  <Input
                    id="quote_part"
                    type="number"
                    value={formData.quote_part}
                    onChange={(e) => setFormData({ ...formData, quote_part: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="procedure_syndic"
                    checked={formData.procedure_syndic}
                    onCheckedChange={(checked) => setFormData({ ...formData, procedure_syndic: checked as boolean })}
                  />
                  <Label htmlFor="procedure_syndic">Procédure syndic en cours</Label>
                </div>

                {formData.procedure_syndic && (
                  <div className="space-y-2">
                    <Label htmlFor="detail_procedure">Détail de la procédure</Label>
                    <Textarea
                      id="detail_procedure"
                      value={formData.detail_procedure}
                      onChange={(e) => setFormData({ ...formData, detail_procedure: e.target.value })}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push("/annonces")}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="bg-[#00458E] hover:bg-[#003366]" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <div className="mt-4 text-right text-sm text-gray-500">* champs obligatoires</div>
    </div>
  )
}

