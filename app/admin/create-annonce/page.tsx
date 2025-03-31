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
  // Basic Information
  reference: string
  transactionType: string
  propertyType: string
  subPropertyType: string
  date_dispo: string

  // Location
  address: string
  district: string
  situation_id: string
  orientation_sud: boolean
  orientation_est: boolean
  orientation_ouest: boolean
  orientation_nord: boolean

  // Financial Information
  prix_hors_honoraires: string
  prix_avec_honoraires: string
  prix_m2: string
  honoraires_id: string
  honoraires_acheteur: string
  depot_garantie: string

  // Co-ownership Information
  copro: boolean
  lots: string
  quote_part: string
  procedure_syndic: boolean
  detail_procedure: string

  // Property Features
  nb_pieces: string
  nb_chambres: string
  nb_lits_doubles: string
  nb_lits_simples: string
  nb_sdb: string
  nb_wc: string
  surface: string

  // Amenities
  alarme: boolean
  chauffage_id: string
  cable: boolean
  piscine: boolean
  entretien: boolean
  cuisine: boolean
  securite: boolean
  historique: boolean
  parking_inclus: boolean

  // Additional Features
  dpe_id: string
  emissions: string
  coup_de_coeur: boolean
  interphone: boolean
  ascenseur: boolean
  cave: boolean

  // Lease Information
  bail: string
  nature_bail: string

  // Energy Information
  version_dpe: string
  bilan_emission_id: string
  emissions_ges: string
}

export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typesbiens, setTypesBien] = useState([])
  const [typestransactions, setTypesTransactions] = useState([])
  const [formData, setFormData] = useState<FormData>({
    reference: "",
    transactionType: "",
    propertyType: "",
    subPropertyType: "",
    date_dispo: format(new Date(), "yyyy-MM-dd"),
    address: "",
    district: "",
    situation_id: "",
    orientation_sud: false,
    orientation_est: false,
    orientation_ouest: false,
    orientation_nord: false,
    prix_hors_honoraires: "",
    prix_avec_honoraires: "",
    prix_m2: "",
    honoraires_id: "1",
    honoraires_acheteur: "",
    depot_garantie: "",
    copro: false,
    lots: "",
    quote_part: "",
    procedure_syndic: false,
    detail_procedure: "",
    nb_pieces: "",
    nb_chambres: "",
    nb_lits_doubles: "",
    nb_lits_simples: "",
    nb_sdb: "",
    nb_wc: "",
    surface: "",
    alarme: false,
    chauffage_id: "",
    cable: false,
    piscine: false,
    entretien: false,
    cuisine: false,
    securite: false,
    historique: false,
    parking_inclus: false,
    dpe_id: "",
    emissions: "",
    coup_de_coeur: false,
    interphone: false,
    ascenseur: false,
    cave: false,
    bail: "",
    nature_bail: "",
    version_dpe: "",
    bilan_emission_id: "",
    emissions_ges: "",
  })

  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [typesbiensRes, typestransactionsRes] = await Promise.all([
          fetch("/api/typesbiens"),
          fetch("/api/typestransactions"),
        ])

        if (!typesbiensRes.ok || !typestransactionsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [typesbiensData, typestransactionsData] = await Promise.all([
          typesbiensRes.json(),
          typestransactionsRes.json(),
        ])

        setTypesBien(typesbiensData)
        setTypesTransactions(typestransactionsData)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Validate required fields
      

      // Convert form data to API format
      const requestBody = {
        publie:1,
        reference: formData.reference,
        transaction_id: Number(formData.transactionType),
        typebien_id: formData.propertyType ? Number(formData.propertyType) : null,
        sous_typebien_id: formData.subPropertyType ? Number(formData.subPropertyType) : null,
        date_dispo: formData.date_dispo,
        adresse: formData.address,
        quartier: formData.district,
        situation_id: formData.situation_id ? Number(formData.situation_id) : null,
        orientation_sud: formData.orientation_sud,
        orientation_est: formData.orientation_est,
        orientation_ouest: formData.orientation_ouest,
        orientation_nord: formData.orientation_nord,
        prix_hors_honoraires: formData.prix_hors_honoraires ? Number(formData.prix_hors_honoraires) : null,
        prix_avec_honoraires: formData.prix_avec_honoraires ? Number(formData.prix_avec_honoraires) : null,
        prix_m2: formData.prix_m2 ? Number(formData.prix_m2) : null,
        honoraires_id: Number(formData.honoraires_id),
        honoraires_acheteur: formData.honoraires_acheteur ? Number(formData.honoraires_acheteur) : null,
        depot_garantie: formData.depot_garantie ? Number(formData.depot_garantie) : null,
        copro: formData.copro,
        lots: formData.lots ? Number(formData.lots) : null,
        quote_part: formData.quote_part ? Number(formData.quote_part) : null,
        procedure_syndic: formData.procedure_syndic,
        detail_procedure: formData.detail_procedure,
        nb_pieces: formData.nb_pieces ? Number(formData.nb_pieces) : null,
        nb_chambres: formData.nb_chambres ? Number(formData.nb_chambres) : null,
        nb_lits_doubles: formData.nb_lits_doubles ? Number(formData.nb_lits_doubles) : null,
        nb_lits_simples: formData.nb_lits_simples ? Number(formData.nb_lits_simples) : null,
        nb_sdb: formData.nb_sdb ? Number(formData.nb_sdb) : null,
        nb_wc: formData.nb_wc ? Number(formData.nb_wc) : null,
        surface: formData.surface ? Number(formData.surface) : null,
        alarme: formData.alarme,
        chauffage_id: formData.chauffage_id ? Number(formData.chauffage_id) : null,
        cable: formData.cable,
        piscine: formData.piscine,
        entretien: formData.entretien,
        cuisine: formData.cuisine,
        securite: formData.securite,
        historique: formData.historique,
        parking_inclus: formData.parking_inclus,
        dpe_id: formData.dpe_id ? Number(formData.dpe_id) : null,
        emissions: formData.emissions,
        coup_de_coeur: formData.coup_de_coeur,
        interphone: formData.interphone,
        ascenseur: formData.ascenseur,
        cave: formData.cave,
        bail: formData.bail,
        nature_bail: formData.nature_bail,
        version_dpe: formData.version_dpe,
        bilan_emission_id: formData.bilan_emission_id ? Number(formData.bilan_emission_id) : null,
        emissions_ges: formData.emissions_ges,
      }

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            const textError = await response.text()
            console.error("Server response:", textError)
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Response data:", data)

      alert("Annonce created successfully!")
      router.push("/annonces")
    } catch (error: any) {
      console.error("Submission error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
      alert(`Failed to create annonce: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4">
          <span className="hover:underline cursor-pointer">Accueil</span>
          <span className="mx-2">/</span>
          <span className="hover:underline cursor-pointer">Gestion des annonces</span>
          <span className="mx-2">/</span>
          <span>Créer une annonce</span>
        </div>
        <div className="text-orange-400 uppercase tracking-wide text-sm font-semibold mb-2">ANNONCES</div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Créer une annonce</h1>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className={`p-4 mb-1 ${currentStep === 1 ? "bg-[#F5A623]" : ""}`}>
            <div className="text-sm font-semibold mb-1">ÉTAPE 1</div>
            <div className="text-lg">Type de bien</div>
          </div>
          <div className={`p-4 mb-1 ${currentStep === 2 ? "bg-[#F5A623]" : ""}`}>
            <div className="text-sm font-semibold mb-1">ÉTAPE 2</div>
            <div className="text-lg">Localisation</div>
          </div>
          <div className={`p-4 mb-1 ${currentStep === 3 ? "bg-[#F5A623]" : ""}`}>
            <div className="text-sm font-semibold mb-1">ÉTAPE 3</div>
            <div className="text-lg">Informations financières</div>
          </div>
          <div className={`p-4 ${currentStep === 4 ? "bg-[#F5A623]" : ""}`}>
            <div className="text-sm font-semibold mb-1">ÉTAPE 4</div>
            <div className="text-lg">Caractéristiques</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {currentStep === 1 && (
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
                      placeholder="REF-001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionType">
                      Type de transaction <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.transactionType}
                      onValueChange={(value) => setFormData({ ...formData, transactionType: value })}
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
                    <Label htmlFor="propertyType">
                      Type de bien <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
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

              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-[#00458E] hover:bg-[#003366]">
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#00458E] mb-6">Localisation</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Adresse <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Quartier</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Orientation</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="orientation_nord"
                          checked={formData.orientation_nord}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, orientation_nord: checked as boolean })
                          }
                        />
                        <Label htmlFor="orientation_nord">Nord</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="orientation_sud"
                          checked={formData.orientation_sud}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, orientation_sud: checked as boolean })
                          }
                        />
                        <Label htmlFor="orientation_sud">Sud</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="orientation_est"
                          checked={formData.orientation_est}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, orientation_est: checked as boolean })
                          }
                        />
                        <Label htmlFor="orientation_est">Est</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="orientation_ouest"
                          checked={formData.orientation_ouest}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, orientation_ouest: checked as boolean })
                          }
                        />
                        <Label htmlFor="orientation_ouest">Ouest</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={handlePrevious} variant="outline">
                  Précédent
                </Button>
                <Button onClick={handleNext} className="bg-[#00458E] hover:bg-[#003366]">
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
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

                  <div className="space-y-2">
                    <Label htmlFor="depot_garantie">Dépôt de garantie</Label>
                    <Input
                      id="depot_garantie"
                      type="number"
                      value={formData.depot_garantie}
                      onChange={(e) => setFormData({ ...formData, depot_garantie: e.target.value })}
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
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, procedure_syndic: checked as boolean })
                          }
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

              <div className="flex justify-between">
                <Button onClick={handlePrevious} variant="outline">
                  Précédent
                </Button>
                <Button onClick={handleNext} className="bg-[#00458E] hover:bg-[#003366]">
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#00458E] mb-6">Caractéristiques du bien</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nb_pieces">Nombre de pièces</Label>
                    <Input
                      id="nb_pieces"
                      type="number"
                      value={formData.nb_pieces}
                      onChange={(e) => setFormData({ ...formData, nb_pieces: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nb_chambres">Nombre de chambres</Label>
                    <Input
                      id="nb_chambres"
                      type="number"
                      value={formData.nb_chambres}
                      onChange={(e) => setFormData({ ...formData, nb_chambres: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nb_sdb">Nombre de salles de bain</Label>
                    <Input
                      id="nb_sdb"
                      type="number"
                      value={formData.nb_sdb}
                      onChange={(e) => setFormData({ ...formData, nb_sdb: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nb_wc">Nombre de WC</Label>
                    <Input
                      id="nb_wc"
                      type="number"
                      value={formData.nb_wc}
                      onChange={(e) => setFormData({ ...formData, nb_wc: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surface">Surface (m²)</Label>
                    <Input
                      id="surface"
                      type="number"
                      value={formData.surface}
                      onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-lg font-semibold">Équipements</Label>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="alarme"
                        checked={formData.alarme}
                        onCheckedChange={(checked) => setFormData({ ...formData, alarme: checked as boolean })}
                      />
                      <Label htmlFor="alarme">Alarme</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cable"
                        checked={formData.cable}
                        onCheckedChange={(checked) => setFormData({ ...formData, cable: checked as boolean })}
                      />
                      <Label htmlFor="cable">Câble</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="piscine"
                        checked={formData.piscine}
                        onCheckedChange={(checked) => setFormData({ ...formData, piscine: checked as boolean })}
                      />
                      <Label htmlFor="piscine">Piscine</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parking_inclus"
                        checked={formData.parking_inclus}
                        onCheckedChange={(checked) => setFormData({ ...formData, parking_inclus: checked as boolean })}
                      />
                      <Label htmlFor="parking_inclus">Parking inclus</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ascenseur"
                        checked={formData.ascenseur}
                        onCheckedChange={(checked) => setFormData({ ...formData, ascenseur: checked as boolean })}
                      />
                      <Label htmlFor="ascenseur">Ascenseur</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cave"
                        checked={formData.cave}
                        onCheckedChange={(checked) => setFormData({ ...formData, cave: checked as boolean })}
                      />
                      <Label htmlFor="cave">Cave</Label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-lg font-semibold">Informations énergétiques</Label>
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="version_dpe">Version DPE</Label>
                      <Input
                        id="version_dpe"
                        value={formData.version_dpe}
                        onChange={(e) => setFormData({ ...formData, version_dpe: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emissions_ges">Émissions GES</Label>
                      <Input
                        id="emissions_ges"
                        value={formData.emissions_ges}
                        onChange={(e) => setFormData({ ...formData, emissions_ges: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={handlePrevious} variant="outline">
                  Précédent
                </Button>
                <Button onClick={handleSubmit} className="bg-[#00458E] hover:bg-[#003366]" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-right text-sm text-gray-500">* champs obligatoires</div>
    </div>
  )
}

