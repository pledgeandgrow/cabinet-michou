"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

// Define types for the API data
interface TypeBien {
  id: number;
  nom: string;
}

interface TypeTransaction {
  id: number;
  nom: string;
}

interface FormData {
  id: number;
  transaction_id: number;
  typebien_id: number;
  sous_typebien_id: number;
  reference: string;
  date_dispo: string;
  nom: string;
  surface: number;
  surface_terrain: number;
  terrain_agricole: boolean;
  terrain_constructible: boolean;
  terrain_rue: boolean;
  terrain_viabilise: boolean;
  pieces: number;
  chambres: number;
  sdb: number;
  sde: number;
  wc: number;
  wc_separe: boolean;
  cave: boolean;
  surface_cave: number;
  sam: boolean;
  sejour: boolean;
  surface_sejour: number;
  salle_a_manger: boolean;
  surface_salle_a_manger: number;
  construction: string;
  recent: boolean;
  refait: boolean;
  travaux: boolean;
  box: number;
  parking: number;
  etage: number;
  nb_etages: number;
  ascenseur: boolean;
  duplex: boolean;
  nb_balcons: number;
  surface_balcons: number;
  terrasse: boolean;
  nb_terrasses: number;
  alarme: boolean;
  chauffage_id: number;
  cable: boolean;
  piscine: boolean;
  entretien: boolean;
  cuisine: boolean;
  securite: boolean;
  historique: boolean;
  parking_inclus: boolean;
  lot_neuf: boolean;
  cheminee: boolean;
  vue: boolean;
  entree: boolean;
  parquet: boolean;
  placard: boolean;
  nb_couverts: number;
  nb_lits_doubles: number;
  nb_lits_simples: number;
  vis_a_vis: boolean;
  calme: boolean;
  congelateur: boolean;
  four: boolean;
  lave_vaisselle: boolean;
  micro_ondes: boolean;
  lave_linge: boolean;
  seche_linge: boolean;
  internet: boolean;
  equipement_bebe: boolean;
  telephone: boolean;
  proche_lac: boolean;
  proche_tennis: boolean;
  proche_pistes: boolean;
  gardien: boolean;
  climatisation: boolean;
  handicapes: boolean;
  animaux: boolean;
  digicode: boolean;
  video: boolean;
  interphone: boolean;
  cuisine_id: number;
  situation_id: number;
  orientation_sud: boolean;
  orientation_est: boolean;
  orientation_ouest: boolean;
  orientation_nord: boolean;
  bilan_conso_id: number;
  consos: number;
  version_dpe: string;
  bilan_emission_id: number;
  emissions: number;
  exclusivite: boolean;
  coup_de_coeur: boolean;
  bail: string;
  nature_bail: string;
  duree_bail: number;
  droit_au_bail: number;
  loyer_murs: number;
  is_loyer_cc: string;
  is_loyer_ht: string;
  loyer_hors_charges: number;
  charges: number;
  complement_loyer: number;
  loyer_avec_charges: number;
  loyer_m2: number;
  loyer_base: number;
  loyer_ref_majore: number;
  encadrement_des_loyers: string;
  charges_id: number;
  honoraires_locataire: number;
  etat_des_lieux: number;
  depot_garantie: number;
  droit_entree: number;
  meuble: boolean;
  prix_masque: boolean;
  prix_ht: string;
  prix_hors_honoraires: number;
  prix_avec_honoraires: number;
  prix_m2: number;
  honoraires_id: number;
  honoraires_acheteur: number;
  copro: boolean;
  lots: number;
  quote_part: number;
  procedure_syndic: boolean;
  detail_procedure: string;
  adresse: string;
  quartier: string;
  ligne: string;
  station: string;
  cp: string;
  ville: string;
  cp_reel: string;
  ville_reel: string;
  arrondissement: number;
  pays: string;
  latitude: number;
  longitude: number;
  description: string;
  panoramique: string;
  visite_virtuelle: string;
  valeur_achat: number;
  montant_rapport: string;
  activites_commerciales: string;
  chiffre_affaire: number;
  longueur_facade: number;
  si_viager_vendu_libre: boolean;
  immeuble_type_bureaux: boolean;
  commentaires: string;
  negociateur: string;
  se_loger: string;
  selection: boolean;
  publie: boolean;
}




export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typesbiens, setTypesBien] = useState<TypeBien[]>([])
  const [typestransactions, setTypesTransactions] = useState<TypeTransaction[]>([])
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    reference: "",
    nom: "",
    transaction_id: 0,
    typebien_id: 0,
    sous_typebien_id: 0,
    date_dispo: format(new Date(), "yyyy-MM-dd"),
    adresse: "",
    quartier: "",
    situation_id: 0,
    orientation_sud: false,
    orientation_est: false,
    orientation_ouest: false,
    orientation_nord: false,
    prix_hors_honoraires: 0,
    prix_avec_honoraires: 0,
    prix_m2: 0,
    honoraires_id: 1,
    honoraires_acheteur: 0,
    depot_garantie: 0,
    copro: false,
    lots: 0,
    quote_part: 0,
    procedure_syndic: false,
    detail_procedure: "",
    pieces: 0,
    chambres: 0,
    nb_lits_doubles: 0,
    nb_lits_simples: 0,
    sdb: 0,
    sde: 0,
    wc: 0,
    wc_separe: false,
    cave: false,
    surface: 0,
    surface_terrain: 0,
    terrain_agricole: false,
    terrain_constructible: false,
    terrain_rue: false,
    terrain_viabilise: false,
    sam: false,
    sejour: false,
    surface_sejour: 0,
    salle_a_manger: false,
    surface_salle_a_manger: 0,
    construction: "",
    recent: false,
    refait: false,
    travaux: false,
    box: 0,
    parking: 0,
    etage: 0,
    nb_etages: 0,
    ascenseur: false,
    duplex: false,
    nb_balcons: 0,
    surface_balcons: 0,
    terrasse: false,
    nb_terrasses: 0,
    alarme: false,
    chauffage_id: 0,
    cable: false,
    piscine: false,
    entretien: false,
    cuisine: false,
    securite: false,
    historique: false,
    parking_inclus: false,
    lot_neuf: false,
    cheminee: false,
    vue: false,
    entree: false,
    parquet: false,
    placard: false,
    nb_couverts: 0,
    vis_a_vis: false,
    calme: false,
    congelateur: false,
    four: false,
    lave_vaisselle: false,
    micro_ondes: false,
    lave_linge: false,
    seche_linge: false,
    internet: false,
    equipement_bebe: false,
    telephone: false,
    proche_lac: false,
    proche_tennis: false,
    proche_pistes: false,
    gardien: false,
    climatisation: false,
    handicapes: false,
    animaux: false,
    digicode: false,
    video: false,
    interphone: false,
    cuisine_id: 0,
    bilan_conso_id: 0,
    consos: 0,
    version_dpe: "",
    bilan_emission_id: 0,
    emissions: 0,
    exclusivite: false,
    coup_de_coeur: false,
    bail: "",
    nature_bail: "",
    duree_bail: 0,
    droit_au_bail: 0,
    loyer_murs: 0,
    is_loyer_cc: "0",
    is_loyer_ht: "0",
    loyer_hors_charges: 0,
    charges: 0,
    complement_loyer: 0,
    loyer_avec_charges: 0,
    loyer_m2: 0,
    loyer_base: 0,
    loyer_ref_majore: 0,
    encadrement_des_loyers: "",
    charges_id: 0,
    honoraires_locataire: 0,
    etat_des_lieux: 0,
    droit_entree: 0,
    meuble: false,
    prix_masque: false,
    prix_ht: "0",
    ligne: "",
    station: "",
    cp: "",
    ville: "",
    cp_reel: "",
    ville_reel: "",
    arrondissement: 0,
    pays: "",
    latitude: 0,
    longitude: 0,
    description: "",
    panoramique: "",
    visite_virtuelle: "",
    valeur_achat: 0,
    montant_rapport: "",
    activites_commerciales: "",
    chiffre_affaire: 0,
    longueur_facade: 0,
    si_viager_vendu_libre: false,
    immeuble_type_bureaux: false,
    commentaires: "",
    negociateur: "",
    se_loger: "0",
    selection: false,
    publie: false,
    surface_cave: 0
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
        publie: 1,
        reference: formData.reference,
        nom: formData.nom,
        transaction_id: Number(formData.transaction_id),
        typebien_id: formData.typebien_id ? Number(formData.typebien_id) : null,
        sous_typebien_id: formData.sous_typebien_id ? Number(formData.sous_typebien_id) : null,
        date_dispo: formData.date_dispo,
        adresse: formData.adresse,
        quartier: formData.quartier,
        situation_id: formData.situation_id ? Number(formData.situation_id) : null,
        orientation_sud: formData.orientation_sud ? 1 : 0,
        orientation_est: formData.orientation_est ? 1 : 0,
        orientation_ouest: formData.orientation_ouest ? 1 : 0,
        orientation_nord: formData.orientation_nord ? 1 : 0,
        prix_hors_honoraires: Number(formData.prix_hors_honoraires),
        prix_avec_honoraires: Number(formData.prix_avec_honoraires),
        prix_m2: Number(formData.prix_m2),
        honoraires_id: Number(formData.honoraires_id),
        honoraires_acheteur: Number(formData.honoraires_acheteur),
        depot_garantie: Number(formData.depot_garantie),
        copro: formData.copro ? 1 : 0,
        lots: Number(formData.lots),
        quote_part: Number(formData.quote_part),
        procedure_syndic: formData.procedure_syndic ? 1 : 0,
        detail_procedure: formData.detail_procedure,
        pieces: Number(formData.pieces),
        chambres: Number(formData.chambres),
        nb_lits_doubles: Number(formData.nb_lits_doubles),
        nb_lits_simples: Number(formData.nb_lits_simples),
        sdb: Number(formData.sdb),
        sde: Number(formData.sde),
        wc: Number(formData.wc),
        wc_separe: Number(formData.wc_separe),
        surface: Number(formData.surface),
        surface_terrain: Number(formData.surface_terrain),
        terrain_agricole: Number(formData.terrain_agricole),
        terrain_constructible: Number(formData.terrain_constructible),
        terrain_rue: Number(formData.terrain_rue),
        terrain_viabilise: Number(formData.terrain_viabilise),
        sam: formData.sam ? 1 : 0,
        sejour: formData.sejour ? 1 : 0,
        surface_sejour: Number(formData.surface_sejour),
        salle_a_manger: Number(formData.salle_a_manger),
        surface_salle_a_manger: Number(formData.surface_salle_a_manger),
        construction: formData.construction,
        recent: formData.recent ? 1 : 0,
        refait: formData.refait ? 1 : 0,
        travaux: formData.travaux ? 1 : 0,
        box: formData.box ? 1 : 0,
        parking: formData.parking ? 1 : 0,
        etage: Number(formData.etage),
        nb_etages: Number(formData.nb_etages),
        ascenseur: formData.ascenseur ? 1 : 0,
        duplex: formData.duplex ? 1 : 0,
        nb_balcons: Number(formData.nb_balcons),
        surface_balcons: Number(formData.surface_balcons),
        terrasse: formData.terrasse ? 1 : 0,
        nb_terrasses: Number(formData.nb_terrasses),
        alarme: formData.alarme ? 1 : 0,
        chauffage_id: formData.chauffage_id ? Number(formData.chauffage_id) : null,
        cable: formData.cable ? 1 : 0,
        piscine: formData.piscine ? 1 : 0,
        entretien: formData.entretien ? 1 : 0,
        cuisine: formData.cuisine ? 1 : 0,
        securite: formData.securite ? 1 : 0,
        historique: formData.historique ? 1 : 0,
        parking_inclus: formData.parking_inclus ? 1 : 0,
        lot_neuf: formData.lot_neuf ? 1 : 0,
        cheminee: formData.cheminee ? 1 : 0,
        vue: formData.vue,
        entree: formData.entree ? 1 : 0,
        parquet: formData.parquet ? 1 : 0,
        placard: formData.placard ? 1 : 0,
        nb_couverts: Number(formData.nb_couverts),
        vis_a_vis: formData.vis_a_vis ? 1 : 0,
        calme: formData.calme ? 1 : 0,
        congelateur: formData.congelateur ? 1 : 0,
        four: formData.four ? 1 : 0,
        lave_vaisselle: formData.lave_vaisselle ? 1 : 0,
        micro_ondes: formData.micro_ondes ? 1 : 0,
        lave_linge: formData.lave_linge ? 1 : 0,
        seche_linge: formData.seche_linge ? 1 : 0,
        internet: formData.internet ? 1 : 0,
        equipement_bebe: formData.equipement_bebe ? 1 : 0,
        telephone: formData.telephone ? 1 : 0,
        proche_lac: formData.proche_lac ? 1 : 0,
        proche_tennis: formData.proche_tennis ? 1 : 0,
        proche_pistes: formData.proche_pistes ? 1 : 0,
        gardien: formData.gardien ? 1 : 0,
        climatisation: formData.climatisation ? 1 : 0,
        handicapes: formData.handicapes ? 1 : 0,
        animaux: formData.animaux ? 1 : 0,
        digicode: formData.digicode ? 1 : 0,
        video: formData.video ? 1 : 0,
        interphone: formData.interphone ? 1 : 0,
        cuisine_id: formData.cuisine_id ? Number(formData.cuisine_id) : null,
        coup_de_coeur: formData.coup_de_coeur ? 1 : 0,
        cave: formData.cave ? 1 : 0,
        surface_cave: Number(formData.surface_cave),
        bail: formData.bail,
        nature_bail: formData.nature_bail,
        duree_bail: Number(formData.duree_bail),
        droit_au_bail: Number(formData.droit_au_bail),
        loyer_murs: Number(formData.loyer_murs),
        is_loyer_cc: formData.is_loyer_cc ? 1 : 0,
        is_loyer_ht: formData.is_loyer_ht ? 1 : 0,
        loyer_hors_charges: Number(formData.loyer_hors_charges),
        charges: Number(formData.charges),
        complement_loyer: Number(formData.complement_loyer),
        loyer_avec_charges: Number(formData.loyer_avec_charges),
        loyer_m2: Number(formData.loyer_m2),
        loyer_base: Number(formData.loyer_base),
        loyer_ref_majore: Number(formData.loyer_ref_majore),
        encadrement_des_loyers: formData.encadrement_des_loyers,
        charges_id: formData.charges_id ? Number(formData.charges_id) : null,
        honoraires_locataire: Number(formData.honoraires_locataire),
        etat_des_lieux: Number(formData.etat_des_lieux),
        droit_entree: Number(formData.droit_entree),
        meuble: formData.meuble ? 1 : 0,
        prix_masque: Number(formData.prix_masque),
        prix_ht: Number(formData.prix_ht),
        ligne: formData.ligne,
        station: formData.station,
        cp: formData.cp,
        ville: formData.ville,
        cp_reel: formData.cp_reel,
        ville_reel: formData.ville_reel,
        arrondissement: Number(formData.arrondissement),
        pays: formData.pays,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        description: formData.description,
        panoramique: formData.panoramique,
        visite_virtuelle: formData.visite_virtuelle,
        valeur_achat: Number(formData.valeur_achat),
        montant_rapport: formData.montant_rapport,
        activites_commerciales: formData.activites_commerciales,
        chiffre_affaire: Number(formData.chiffre_affaire),
        longueur_facade: Number(formData.longueur_facade),
        si_viager_vendu_libre: Number(formData.si_viager_vendu_libre),
        immeuble_type_bureaux: Number(formData.immeuble_type_bureaux),
        commentaires: formData.commentaires,
        negociateur: formData.negociateur,
        se_loger: formData.se_loger,
        selection: Number(formData.selection),
        bilan_conso_id: formData.bilan_conso_id ? Number(formData.bilan_conso_id) : null,
        bilan_emission_id: formData.bilan_emission_id ? Number(formData.bilan_emission_id) : null,
        consos: Number(formData.consos),
        emissions: Number(formData.emissions),
        version_dpe: formData.version_dpe,
        exclusivite: formData.exclusivite ? 1 : 0,
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
      
      // Afficher un message de confirmation élégant
      const successMessage = document.createElement("div")
      successMessage.className = "fixed top-16 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50"
      successMessage.textContent = "Annonce créée avec succès !"
      document.body.appendChild(successMessage)
      
      // Rediriger après un court délai
      setTimeout(() => {
        successMessage.remove()
        router.push("/annonces")
      }, 2000)
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
          <span className="hover:underline cursor-pointer" onClick={() => router.push("/")}>Accueil</span>
          <span className="mx-2">/</span>
          <span className="hover:underline cursor-pointer" onClick={() => router.push("/admin/annonces")}>Gestion des annonces</span>
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
                    <Label htmlFor="nom">
                      Nom du bien
                    </Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Appartement lumineux, Maison de charme..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction_id">
                      Type de transaction <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={String(formData.transaction_id)}
                      onValueChange={(value) => setFormData({ ...formData, transaction_id: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {typestransactions.map((type: TypeTransaction) => (
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
                      value={String(formData.typebien_id)}
                      onValueChange={(value) => setFormData({ ...formData, typebien_id: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {typesbiens.map((type: TypeBien) => (
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="cp">Code postal</Label>
                    <Input
                      id="cp"
                      value={formData.cp}
                      onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cp_reel">Code postal réel</Label>
                    <Input
                      id="cp_reel"
                      value={formData.cp_reel}
                      onChange={(e) => setFormData({ ...formData, cp_reel: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ville_reel">Ville réelle</Label>
                    <Input
                      id="ville_reel"
                      value={formData.ville_reel}
                      onChange={(e) => setFormData({ ...formData, ville_reel: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="arrondissement">Arrondissement</Label>
                    <Input
                      id="arrondissement"
                      type="number"
                      value={formData.arrondissement}
                      onChange={(e) => setFormData({ ...formData, arrondissement: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Input
                      id="pays"
                      value={formData.pays}
                      onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ligne">Ligne de transport</Label>
                    <Input
                      id="ligne"
                      value={formData.ligne}
                      onChange={(e) => setFormData({ ...formData, ligne: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="station">Station</Label>
                    <Input
                      id="station"
                      value={formData.station}
                      onChange={(e) => setFormData({ ...formData, station: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, prix_hors_honoraires: Number(e.target.value) })}
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
                      onChange={(e) => setFormData({ ...formData, prix_avec_honoraires: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prix_m2">Prix au m²</Label>
                    <Input
                      id="prix_m2"
                      type="number"
                      value={formData.prix_m2}
                      onChange={(e) => setFormData({ ...formData, prix_m2: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="honoraires_acheteur">Honoraires acheteur</Label>
                    <Input
                      id="honoraires_acheteur"
                      type="number"
                      value={formData.honoraires_acheteur}
                      onChange={(e) => setFormData({ ...formData, honoraires_acheteur: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prix_ht">Prix HT</Label>
                    <Input
                      id="prix_ht"
                      type="number"
                      value={formData.prix_ht}
                      onChange={(e) => setFormData({ ...formData, prix_ht: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prix_masque"
                      checked={formData.prix_masque}
                      onCheckedChange={(checked) => setFormData({ ...formData, prix_masque: checked as boolean })}
                    />
                    <Label htmlFor="prix_masque">Masquer le prix</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_avec_charges">Loyer avec charges</Label>
                    <Input
                      id="loyer_avec_charges"
                      type="number"
                      value={formData.loyer_avec_charges}
                      onChange={(e) => setFormData({ ...formData, loyer_avec_charges: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_m2">Loyer au m²</Label>
                    <Input
                      id="loyer_m2"
                      type="number"
                      value={formData.loyer_m2}
                      onChange={(e) => setFormData({ ...formData, loyer_m2: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depot_garantie">Dépôt de garantie</Label>
                    <Input
                      id="depot_garantie"
                      type="number"
                      value={formData.depot_garantie}
                      onChange={(e) => setFormData({ ...formData, depot_garantie: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_base">Loyer de base</Label>
                    <Input
                      id="loyer_base"
                      type="number"
                      value={formData.loyer_base}
                      onChange={(e) => setFormData({ ...formData, loyer_base: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_ref_majore">Loyer référence majoré</Label>
                    <Input
                      id="loyer_ref_majore"
                      type="number"
                      value={formData.loyer_ref_majore}
                      onChange={(e) => setFormData({ ...formData, loyer_ref_majore: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="encadrement_des_loyers">Encadrement des loyers</Label>
                    <Input
                      id="encadrement_des_loyers"
                      type="text"
                      value={formData.encadrement_des_loyers}
                      onChange={(e) => setFormData({ ...formData, encadrement_des_loyers: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, lots: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quote_part">Quote-part</Label>
                        <Input
                          id="quote_part"
                          type="number"
                          value={formData.quote_part}
                          onChange={(e) => setFormData({ ...formData, quote_part: Number(e.target.value) })}
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
                    <Label htmlFor="prix_hors_honoraires">Prix hors honoraires</Label>
                    <Input
                      id="prix_hors_honoraires"
                      type="number"
                      value={formData.prix_hors_honoraires}
                      onChange={(e) => setFormData({ ...formData, prix_hors_honoraires: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prix_avec_honoraires">Prix avec honoraires</Label>
                    <Input
                      id="prix_avec_honoraires"
                      type="number"
                      value={formData.prix_avec_honoraires}
                      onChange={(e) => setFormData({ ...formData, prix_avec_honoraires: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prix_ht">Prix HT</Label>
                    <Input
                      id="prix_ht"
                      type="number"
                      value={formData.prix_ht}
                      onChange={(e) => setFormData({ ...formData, prix_ht: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prix_masque"
                      checked={formData.prix_masque}
                      onCheckedChange={(checked) => setFormData({ ...formData, prix_masque: checked as boolean })}
                    />
                    <Label htmlFor="prix_masque">Masquer le prix</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_avec_charges">Loyer avec charges</Label>
                    <Input
                      id="loyer_avec_charges"
                      type="number"
                      value={formData.loyer_avec_charges}
                      onChange={(e) => setFormData({ ...formData, loyer_avec_charges: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_m2">Loyer au m²</Label>
                    <Input
                      id="loyer_m2"
                      type="number"
                      value={formData.loyer_m2}
                      onChange={(e) => setFormData({ ...formData, loyer_m2: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_base">Loyer de base</Label>
                    <Input
                      id="loyer_base"
                      type="number"
                      value={formData.loyer_base}
                      onChange={(e) => setFormData({ ...formData, loyer_base: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyer_ref_majore">Loyer référence majoré</Label>
                    <Input
                      id="loyer_ref_majore"
                      type="number"
                      value={formData.loyer_ref_majore}
                      onChange={(e) => setFormData({ ...formData, loyer_ref_majore: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="encadrement_des_loyers">Encadrement des loyers</Label>
                    <Input
                      id="encadrement_des_loyers"
                      type="text"
                      value={formData.encadrement_des_loyers}
                      onChange={(e) => setFormData({ ...formData, encadrement_des_loyers: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="charges_id">ID des charges</Label>
                    <Input
                      id="charges_id"
                      type="text"
                      value={formData.charges_id}
                      onChange={(e) => setFormData({ ...formData, charges_id: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="honoraires_locataire">Honoraires locataire</Label>
                    <Input
                      id="honoraires_locataire"
                      type="number"
                      value={formData.honoraires_locataire}
                      onChange={(e) => setFormData({ ...formData, honoraires_locataire: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="etat_des_lieux">État des lieux</Label>
                    <Input
                      id="etat_des_lieux"
                      type="number"
                      value={formData.etat_des_lieux}
                      onChange={(e) => setFormData({ ...formData, etat_des_lieux: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="droit_entree">Droit d'entrée</Label>
                    <Input
                      id="droit_entree"
                      type="number"
                      value={formData.droit_entree}
                      onChange={(e) => setFormData({ ...formData, droit_entree: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meuble"
                      checked={formData.meuble}
                      onCheckedChange={(checked) => setFormData({ ...formData, meuble: checked as boolean })}
                    />
                    <Label htmlFor="meuble">Meublé</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="honoraires_locataire">Honoraires locataire</Label>
                    <Input
                      id="honoraires_locataire"
                      type="number"
                      value={formData.honoraires_locataire}
                      onChange={(e) => setFormData({ ...formData, honoraires_locataire: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="etat_des_lieux">État des lieux</Label>
                    <Input
                      id="etat_des_lieux"
                      type="number"
                      value={formData.etat_des_lieux}
                      onChange={(e) => setFormData({ ...formData, etat_des_lieux: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="droit_entree">Droit d'entrée</Label>
                    <Input
                      id="droit_entree"
                      type="number"
                      value={formData.droit_entree}
                      onChange={(e) => setFormData({ ...formData, droit_entree: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meuble"
                      checked={formData.meuble}
                      onCheckedChange={(checked) => setFormData({ ...formData, meuble: checked as boolean })}
                    />
                    <Label htmlFor="meuble">Meublé</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valeur_achat">Valeur d'achat</Label>
                    <Input
                      id="valeur_achat"
                      type="number"
                      value={formData.valeur_achat}
                      onChange={(e) => setFormData({ ...formData, valeur_achat: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="montant_rapport">Montant rapport</Label>
                    <Input
                      id="montant_rapport"
                      type="number"
                      value={formData.montant_rapport}
                      onChange={(e) => setFormData({ ...formData, montant_rapport: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activites_commerciales">Activités commerciales</Label>
                    <Input
                      id="activites_commerciales"
                      type="text"
                      value={formData.activites_commerciales}
                      onChange={(e) => setFormData({ ...formData, activites_commerciales: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chiffre_affaire">Chiffre d'affaire</Label>
                    <Input
                      id="chiffre_affaire"
                      type="number"
                      value={formData.chiffre_affaire}
                      onChange={(e) => setFormData({ ...formData, chiffre_affaire: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longueur_facade">Longueur façade</Label>
                    <Input
                      id="longueur_facade"
                      type="number"
                      value={formData.longueur_facade}
                      onChange={(e) => setFormData({ ...formData, longueur_facade: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="si_viager_vendu_libre"
                      checked={formData.si_viager_vendu_libre}
                      onCheckedChange={(checked) => setFormData({ ...formData, si_viager_vendu_libre: checked as boolean })}
                    />
                    <Label htmlFor="si_viager_vendu_libre">Si viager vendu libre</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="immeuble_type_bureaux"
                      checked={formData.immeuble_type_bureaux}
                      onCheckedChange={(checked) => setFormData({ ...formData, immeuble_type_bureaux: checked as boolean })}
                    />
                    <Label htmlFor="immeuble_type_bureaux">Immeuble type bureaux</Label>
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="commentaires">Commentaires internes</Label>
                    <Textarea
                      id="commentaires"
                      value={formData.commentaires}
                      onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
                      placeholder="Commentaires internes non visibles par les clients"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="negociateur">Négociateur</Label>
                    <Input
                      id="negociateur"
                      type="text"
                      value={formData.negociateur}
                      onChange={(e) => setFormData({ ...formData, negociateur: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="se_loger"
                      checked={formData.se_loger === "1"}
                      onCheckedChange={(checked) => setFormData({ ...formData, se_loger: checked ? "1" : "0" })}
                    />
                    <Label htmlFor="se_loger">SeLoger</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selection"
                      checked={formData.selection}
                      onCheckedChange={(checked) => setFormData({ ...formData, selection: checked as boolean })}
                    />
                    <Label htmlFor="selection">Sélection</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="panoramique">URL Panoramique</Label>
                    <Input
                      id="panoramique"
                      type="text"
                      value={formData.panoramique}
                      onChange={(e) => setFormData({ ...formData, panoramique: e.target.value })}
                      placeholder="URL de la visite panoramique"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visite_virtuelle">URL Visite virtuelle</Label>
                    <Input
                      id="visite_virtuelle"
                      type="text"
                      value={formData.visite_virtuelle}
                      onChange={(e) => setFormData({ ...formData, visite_virtuelle: e.target.value })}
                      placeholder="URL de la visite virtuelle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pieces">Nombre de pièces</Label>
                    <Input
                      id="pieces"
                      type="number"
                      value={formData.pieces}
                      onChange={(e) => setFormData({ ...formData, pieces: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chambres">Nombre de chambres</Label>
                    <Input
                      id="chambres"
                      type="number"
                      value={formData.chambres}
                      onChange={(e) => setFormData({ ...formData, chambres: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sdb">Nombre de salles de bain</Label>
                    <Input
                      id="sdb"
                      type="number"
                      value={formData.sdb}
                      onChange={(e) => setFormData({ ...formData, sdb: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sde">Nombre de salles d'eau</Label>
                    <Input
                      id="sde"
                      type="number"
                      value={formData.sde}
                      onChange={(e) => setFormData({ ...formData, sde: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wc">Nombre de WC</Label>
                    <Input
                      id="wc"
                      type="number"
                      value={formData.wc}
                      onChange={(e) => setFormData({ ...formData, wc: Number(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wc_separe"
                      checked={formData.wc_separe}
                      onCheckedChange={(checked) => setFormData({ ...formData, wc_separe: checked as boolean })}
                    />
                    <Label htmlFor="wc_separe">WC séparé</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surface">Surface (m²)</Label>
                    <Input
                      id="surface"
                      type="number"
                      value={formData.surface}
                      onChange={(e) => setFormData({ ...formData, surface: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surface_terrain">Surface du terrain (m²)</Label>
                    <Input
                      id="surface_terrain"
                      type="number"
                      value={formData.surface_terrain}
                      onChange={(e) => setFormData({ ...formData, surface_terrain: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-lg font-semibold mb-2 block">Caractéristiques du logement</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sejour"
                        checked={formData.sejour}
                        onCheckedChange={(checked) => setFormData({ ...formData, sejour: checked as boolean })}
                      />
                      <Label htmlFor="sejour">Séjour</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surface_sejour">Surface du séjour (m²)</Label>
                      <Input
                        id="surface_sejour"
                        type="number"
                        value={formData.surface_sejour}
                        onChange={(e) => setFormData({ ...formData, surface_sejour: Number(e.target.value) })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="salle_a_manger"
                        checked={formData.salle_a_manger}
                        onCheckedChange={(checked) => setFormData({ ...formData, salle_a_manger: checked as boolean })}
                      />
                      <Label htmlFor="salle_a_manger">Salle à manger</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surface_salle_a_manger">Surface salle à manger (m²)</Label>
                      <Input
                        id="surface_salle_a_manger"
                        type="number"
                        value={formData.surface_salle_a_manger}
                        onChange={(e) => setFormData({ ...formData, surface_salle_a_manger: Number(e.target.value) })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sam"
                        checked={formData.sam}
                        onCheckedChange={(checked) => setFormData({ ...formData, sam: checked as boolean })}
                      />
                      <Label htmlFor="sam">SAM</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="construction">Année de construction</Label>
                      <Input
                        id="construction"
                        value={formData.construction}
                        onChange={(e) => setFormData({ ...formData, construction: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recent"
                        checked={formData.recent}
                        onCheckedChange={(checked) => setFormData({ ...formData, recent: checked as boolean })}
                      />
                      <Label htmlFor="recent">Construction récente</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="refait"
                        checked={formData.refait}
                        onCheckedChange={(checked) => setFormData({ ...formData, refait: checked as boolean })}
                      />
                      <Label htmlFor="refait">Récemment refait</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="travaux"
                        checked={formData.travaux}
                        onCheckedChange={(checked) => setFormData({ ...formData, travaux: checked as boolean })}
                      />
                      <Label htmlFor="travaux">Travaux à prévoir</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="etage">Etage</Label>
                      <Input
                        id="etage"
                        type="number"
                        value={formData.etage}
                        onChange={(e) => setFormData({ ...formData, etage: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nb_etages">Nombre d'étages</Label>
                      <Input
                        id="nb_etages"
                        type="number"
                        value={formData.nb_etages}
                        onChange={(e) => setFormData({ ...formData, nb_etages: Number(e.target.value) })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="duplex"
                        checked={formData.duplex}
                        onCheckedChange={(checked) => setFormData({ ...formData, duplex: checked as boolean })}
                      />
                      <Label htmlFor="duplex">Duplex</Label>
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
                        id="terrasse"
                        checked={formData.terrasse}
                        onCheckedChange={(checked) => setFormData({ ...formData, terrasse: checked as boolean })}
                      />
                      <Label htmlFor="terrasse">Terrasse</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nb_terrasses">Nombre de terrasses</Label>
                      <Input
                        id="nb_terrasses"
                        type="number"
                        value={formData.nb_terrasses}
                        onChange={(e) => setFormData({ ...formData, nb_terrasses: Number(e.target.value) })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nb_balcons">Nombre de balcons</Label>
                      <Input
                        id="nb_balcons"
                        type="number"
                        value={formData.nb_balcons}
                        onChange={(e) => setFormData({ ...formData, nb_balcons: Number(e.target.value) })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="surface_balcons">Surface des balcons (m²)</Label>
                      <Input
                        id="surface_balcons"
                        type="number"
                        value={formData.surface_balcons}
                        onChange={(e) => setFormData({ ...formData, surface_balcons: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-lg font-semibold mb-2 block">Extérieurs</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terrasse"
                        checked={formData.terrasse}
                        onCheckedChange={(checked) => setFormData({ ...formData, terrasse: checked as boolean })}
                      />
                      <Label htmlFor="terrasse">Terrasse</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nb_terrasses">Nombre de terrasses</Label>
                      <Input
                        id="nb_terrasses"
                        type="number"
                        value={formData.nb_terrasses}
                        onChange={(e) => setFormData({ ...formData, nb_terrasses: Number(e.target.value) })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="box"
                        checked={formData.box === 1}
                        onCheckedChange={(checked) => setFormData({ ...formData, box: checked ? 1 : 0 })}
                      />
                      <Label htmlFor="box">Box</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parking"
                        checked={formData.parking === 1}
                        onCheckedChange={(checked) => setFormData({ ...formData, parking: checked ? 1 : 0 })}
                      />
                      <Label htmlFor="parking">Parking</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nb_balcons">Nombre de balcons</Label>
                      <Input
                        id="nb_balcons"
                        type="number"
                        value={formData.nb_balcons}
                        onChange={(e) => setFormData({ ...formData, nb_balcons: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surface_balcons">Surface des balcons (m²)</Label>
                      <Input
                        id="surface_balcons"
                        type="number"
                        value={formData.surface_balcons}
                        onChange={(e) => setFormData({ ...formData, surface_balcons: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label className="text-lg font-semibold mb-2 block">Caractéristiques du terrain</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terrain_agricole"
                        checked={formData.terrain_agricole}
                        onCheckedChange={(checked) => setFormData({ ...formData, terrain_agricole: checked as boolean })}
                      />
                      <Label htmlFor="terrain_agricole">Terrain agricole</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terrain_constructible"
                        checked={formData.terrain_constructible}
                        onCheckedChange={(checked) => setFormData({ ...formData, terrain_constructible: checked as boolean })}
                      />
                      <Label htmlFor="terrain_constructible">Terrain constructible</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terrain_rue"
                        checked={formData.terrain_rue}
                        onCheckedChange={(checked) => setFormData({ ...formData, terrain_rue: checked as boolean })}
                      />
                      <Label htmlFor="terrain_rue">Terrain donnant sur rue</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terrain_viabilise"
                        checked={formData.terrain_viabilise}
                        onCheckedChange={(checked) => setFormData({ ...formData, terrain_viabilise: checked as boolean })}
                      />
                      <Label htmlFor="terrain_viabilise">Terrain viabilisé</Label>
                    </div>
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
                      <Label htmlFor="bilan_conso_id">DPE - Consommation énergétique</Label>
                      <Select
                        value={String(formData.bilan_conso_id)}
                        onValueChange={(value) => setFormData({ ...formData, bilan_conso_id: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Non renseigné</SelectItem>
                          <SelectItem value="1">A</SelectItem>
                          <SelectItem value="2">B</SelectItem>
                          <SelectItem value="3">C</SelectItem>
                          <SelectItem value="4">D</SelectItem>
                          <SelectItem value="5">E</SelectItem>
                          <SelectItem value="6">F</SelectItem>
                          <SelectItem value="7">G</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consos">Valeur de consommation (kWh/m²/an)</Label>
                      <Input
                        id="consos"
                        type="number"
                        value={formData.consos}
                        onChange={(e) => setFormData({ ...formData, consos: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bilan_emission_id">GES - Émission de gaz à effet de serre</Label>
                      <Select
                        value={String(formData.bilan_emission_id)}
                        onValueChange={(value) => setFormData({ ...formData, bilan_emission_id: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Non renseigné</SelectItem>
                          <SelectItem value="1">A</SelectItem>
                          <SelectItem value="2">B</SelectItem>
                          <SelectItem value="3">C</SelectItem>
                          <SelectItem value="4">D</SelectItem>
                          <SelectItem value="5">E</SelectItem>
                          <SelectItem value="6">F</SelectItem>
                          <SelectItem value="7">G</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emissions">Valeur d'émission (kg CO2/m²/an)</Label>
                      <Input
                        id="emissions"
                        type="number"
                        value={formData.emissions}
                        onChange={(e) => setFormData({ ...formData, emissions: Number(e.target.value) })}
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
