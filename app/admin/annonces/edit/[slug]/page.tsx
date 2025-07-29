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
  commentaires: string;
  se_loger: string;
  publie: boolean;
  telephone_contact: string;
  nom_contact: string;
  email_contact: string;
}

interface PageParams {
  slug: string
}

export default function EditListingPage({ params }: { params: PageParams }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typesbiens, setTypesBien] = useState<{ id: number, nom: string }[]>([])
  const [typestransactions, setTypesTransactions] = useState<{ id: number, nom: string }[]>([])
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    reference: "",
    publie: false,
    transaction_id: 0,
    typebien_id: 0,
    surface: 0,
    surface_terrain: 0,
    terrain_agricole: false,
    terrain_constructible: false,
    terrain_rue: false,
    terrain_viabilise: false,
    sous_typebien_id: 0,
    date_dispo: format(new Date(), "yyyy-MM-dd"),
    nom: "",
    adresse: "",
    quartier: "",
    ville: "",
    cp: "",
    prix_hors_honoraires: 0,
    prix_avec_honoraires: 0,
    loyer_hors_charges: 0,
    charges: 0,
    prix_m2: 0,
    honoraires_id: 1,
    honoraires_acheteur: 0,
    honoraires_locataire: 0,
    etat_des_lieux: 0,
    depot_garantie: 0,
    copro: false,
    lots: 0,
    quote_part: 0,
    procedure_syndic: false,
    detail_procedure: "",
    pieces: 0,
    chambres: 0,
    sdb: 0,
    sde: 0,
    wc: 0,
    wc_separe: false,
    etage: 0,
    nb_etages: 0,
    ascenseur: false,
    duplex: false,
    nb_balcons: 0,
    surface_balcons: 0,
    terrasse: false,
    nb_terrasses: 0,
    cave: false,
    surface_cave: 0,
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
    meuble: false,
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
    nb_lits_doubles: 0,
    nb_lits_simples: 0,
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
    situation_id: 0,
    orientation_sud: false,
    orientation_est: false,
    orientation_ouest: false,
    orientation_nord: false,
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
    is_loyer_cc: "",
    is_loyer_ht: "",
    complement_loyer: 0,
    loyer_avec_charges: 0,
    loyer_m2: 0,
    loyer_base: 0,
    loyer_ref_majore: 0,
    encadrement_des_loyers: "",
    charges_id: 0,
    droit_entree: 0,
    prix_masque: false,
    prix_ht: "",
    ligne: "",
    station: "",
    cp_reel: "",
    ville_reel: "",
    arrondissement: 0,
    pays: "France",
    latitude: 0,
    longitude: 0,
    description: "",
    panoramique: "",
    visite_virtuelle: "",
    valeur_achat: 0,
    commentaires: "",
    se_loger: "",
    telephone_contact: "",
    nom_contact: "",
    email_contact: ""
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
          id: Number(annonceData.id) || 0,
          transaction_id: Number(annonceData.transaction_id) || 0,
          typebien_id: Number(annonceData.typebien_id) || 0,
          sous_typebien_id: Number(annonceData.sous_typebien_id) || 0,
          reference: annonceData.reference || "",
          date_dispo: annonceData.date_dispo ? format(new Date(annonceData.date_dispo), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
          nom: annonceData.nom || "",
          surface: Number(annonceData.surface) || 0,
          surface_terrain: Number(annonceData.surface_terrain) || 0,
          terrain_agricole: Boolean(annonceData.terrain_agricole) || false,
          terrain_constructible: Boolean(annonceData.terrain_constructible) || false,
          terrain_rue: Boolean(annonceData.terrain_rue) || false,
          terrain_viabilise: Boolean(annonceData.terrain_viabilise) || false,
          pieces: Number(annonceData.pieces) || 0,
          chambres: Number(annonceData.chambres) || 0,
          sdb: Number(annonceData.sdb) || 0,
          sde: Number(annonceData.sde) || 0,
          wc: Number(annonceData.wc) || 0,
          wc_separe: Boolean(annonceData.wc_separe) || false,
          cave: Boolean(annonceData.cave) || false,
          surface_cave: Number(annonceData.surface_cave) || 0,
          sam: Boolean(annonceData.sam) || false,
          sejour: Boolean(annonceData.sejour) || false,
          surface_sejour: Number(annonceData.surface_sejour) || 0,
          salle_a_manger: Boolean(annonceData.salle_a_manger) || false,
          surface_salle_a_manger: Number(annonceData.surface_salle_a_manger) || 0,
          construction: annonceData.construction || "",
          recent: Boolean(annonceData.recent) || false,
          refait: Boolean(annonceData.refait) || false,
          travaux: Boolean(annonceData.travaux) || false,
          box: Number(annonceData.box) || 0,
          parking: Number(annonceData.parking) || 0,
          etage: Number(annonceData.etage) || 0,
          nb_etages: Number(annonceData.nb_etages) || 0,
          ascenseur: Boolean(annonceData.ascenseur) || false,
          duplex: Boolean(annonceData.duplex) || false,
          nb_balcons: Number(annonceData.nb_balcons) || 0,
          surface_balcons: Number(annonceData.surface_balcons) || 0,
          terrasse: Boolean(annonceData.terrasse) || false,
          nb_terrasses: Number(annonceData.nb_terrasses) || 0,
          alarme: Boolean(annonceData.alarme) || false,
          chauffage_id: Number(annonceData.chauffage_id) || 0,
          cable: Boolean(annonceData.cable) || false,
          piscine: Boolean(annonceData.piscine) || false,
          entretien: Boolean(annonceData.entretien) || false,
          cuisine: Boolean(annonceData.cuisine) || false,
          securite: Boolean(annonceData.securite) || false,
          historique: Boolean(annonceData.historique) || false,
          parking_inclus: Boolean(annonceData.parking_inclus) || false,
          lot_neuf: Boolean(annonceData.lot_neuf) || false,
          cheminee: Boolean(annonceData.cheminee) || false,
          vue: Boolean(annonceData.vue) || false,
          entree: Boolean(annonceData.entree) || false,
          parquet: Boolean(annonceData.parquet) || false,
          placard: Boolean(annonceData.placard) || false,
          nb_couverts: Number(annonceData.nb_couverts) || 0,
          nb_lits_doubles: Number(annonceData.nb_lits_doubles) || 0,
          nb_lits_simples: Number(annonceData.nb_lits_simples) || 0,
          vis_a_vis: Boolean(annonceData.vis_a_vis) || false,
          calme: Boolean(annonceData.calme) || false,
          congelateur: Boolean(annonceData.congelateur) || false,
          four: Boolean(annonceData.four) || false,
          lave_vaisselle: Boolean(annonceData.lave_vaisselle) || false,
          micro_ondes: Boolean(annonceData.micro_ondes) || false,
          lave_linge: Boolean(annonceData.lave_linge) || false,
          seche_linge: Boolean(annonceData.seche_linge) || false,
          internet: Boolean(annonceData.internet) || false,
          equipement_bebe: Boolean(annonceData.equipement_bebe) || false,
          telephone: Boolean(annonceData.telephone) || false,
          proche_lac: Boolean(annonceData.proche_lac) || false,
          proche_tennis: Boolean(annonceData.proche_tennis) || false,
          proche_pistes: Boolean(annonceData.proche_pistes) || false,
          gardien: Boolean(annonceData.gardien) || false,
          climatisation: Boolean(annonceData.climatisation) || false,
          handicapes: Boolean(annonceData.handicapes) || false,
          animaux: Boolean(annonceData.animaux) || false,
          digicode: Boolean(annonceData.digicode) || false,
          video: Boolean(annonceData.video) || false,
          interphone: Boolean(annonceData.interphone) || false,
          cuisine_id: Number(annonceData.cuisine_id) || 0,
          situation_id: Number(annonceData.situation_id) || 0,
          orientation_sud: Boolean(annonceData.orientation_sud) || false,
          orientation_est: Boolean(annonceData.orientation_est) || false,
          orientation_ouest: Boolean(annonceData.orientation_ouest) || false,
          orientation_nord: Boolean(annonceData.orientation_nord) || false,
          bilan_conso_id: Number(annonceData.bilan_conso_id) || 0,
          consos: Number(annonceData.consos) || 0,
          version_dpe: annonceData.version_dpe || "",
          bilan_emission_id: Number(annonceData.bilan_emission_id) || 0,
          emissions: Number(annonceData.emissions) || 0,
          exclusivite: Boolean(annonceData.exclusivite) || false,
          coup_de_coeur: Boolean(annonceData.coup_de_coeur) || false,
          bail: annonceData.bail || "",
          nature_bail: annonceData.nature_bail || "",
          duree_bail: Number(annonceData.duree_bail) || 0,
          droit_au_bail: Number(annonceData.droit_au_bail) || 0,
          loyer_murs: Number(annonceData.loyer_murs) || 0,
          is_loyer_cc: annonceData.is_loyer_cc || "",
          is_loyer_ht: annonceData.is_loyer_ht || "",
          loyer_hors_charges: Number(annonceData.loyer_hors_charges) || 0,
          charges: Number(annonceData.charges) || 2,
          complement_loyer: Number(annonceData.complement_loyer) || 0,
          loyer_avec_charges: Number(annonceData.loyer_avec_charges) || 0,
          loyer_m2: Number(annonceData.loyer_m2) || 0,
          loyer_base: Number(annonceData.loyer_base) || 0,
          loyer_ref_majore: Number(annonceData.loyer_ref_majore) || 0,
          encadrement_des_loyers: annonceData.encadrement_des_loyers || "",
          charges_id: Number(annonceData.charges_id) || 0,
          honoraires_locataire: Number(annonceData.honoraires_locataire) || 0,
          etat_des_lieux: Number(annonceData.etat_des_lieux) || 0,
          depot_garantie: Number(annonceData.depot_garantie) || 0,
          droit_entree: Number(annonceData.droit_entree) || 0,
          meuble: Boolean(annonceData.meuble) || false,
          prix_masque: Boolean(annonceData.prix_masque) || false,
          prix_ht: annonceData.prix_ht || "",
          prix_hors_honoraires: Number(annonceData.prix_hors_honoraires) || 0,
          prix_avec_honoraires: Number(annonceData.prix_avec_honoraires) || 0,
          prix_m2: Number(annonceData.prix_m2) || 0,
          honoraires_id: Number(annonceData.honoraires_id) || 0,
          honoraires_acheteur: Number(annonceData.honoraires_acheteur) || 0,
          copro: Boolean(annonceData.copro) || false,
          lots: Number(annonceData.lots) || 0,
          quote_part: Number(annonceData.quote_part) || 0,
          procedure_syndic: Boolean(annonceData.procedure_syndic) || false,
          detail_procedure: annonceData.detail_procedure || "",
          adresse: annonceData.adresse || "",
          quartier: annonceData.quartier || "",
          ligne: annonceData.ligne || "",
          station: annonceData.station || "",
          cp: annonceData.cp || "",
          ville: annonceData.ville || "",
          cp_reel: annonceData.cp_reel || "",
          ville_reel: annonceData.ville_reel || "",
          arrondissement: Number(annonceData.arrondissement) || 0,
          pays: annonceData.pays || "France",
          latitude: Number(annonceData.latitude) || 0,
          longitude: Number(annonceData.longitude) || 0,
          description: annonceData.description || "",
          panoramique: annonceData.panoramique || "",
          visite_virtuelle: annonceData.visite_virtuelle || "",
          valeur_achat: Number(annonceData.valeur_achat) || 0,
          commentaires: annonceData.commentaires || "",
          se_loger: annonceData.se_loger || "",
          publie: Boolean(annonceData.publie) || false,
          telephone_contact: annonceData.telephone_contact || "",
          nom_contact: annonceData.nom_contact || "",
          email_contact: annonceData.email_contact || ""
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

      // Déterminer si c'est une location (transaction_id === 1) ou une vente (transaction_id === 2)
      const isLocation = Number(formData.transaction_id) === 1;

      const requestBody = {
        // Identifiants et informations de base
        id: formData.id,
        publie: formData.publie,
        reference: formData.reference,
        transaction_id: Number(formData.transaction_id),
        typebien_id: formData.typebien_id ? Number(formData.typebien_id) : null,
        sous_typebien_id: formData.sous_typebien_id ? Number(formData.sous_typebien_id) : null,
        date_dispo: formData.date_dispo,
        nom: formData.nom,
        description: formData.description,

        // Localisation
        adresse: formData.adresse,
        quartier: formData.quartier,
        ville: formData.ville,
        cp: formData.cp,
        cp_reel: formData.cp_reel,
        ville_reel: formData.ville_reel,
        arrondissement: formData.arrondissement ? Number(formData.arrondissement) : null,
        pays: formData.pays,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        ligne: formData.ligne,
        station: formData.station,

        // Informations financières
        prix_hors_honoraires: isLocation ? 0 : (formData.prix_hors_honoraires ? Number(formData.prix_hors_honoraires) : null),
        prix_avec_honoraires: isLocation ? 0 : (formData.prix_avec_honoraires ? Number(formData.prix_avec_honoraires) : null),
        prix_m2: formData.prix_m2 ? Number(formData.prix_m2) : null,
        prix_masque: formData.prix_masque,
        prix_ht: formData.prix_ht,
        loyer_hors_charges: formData.loyer_hors_charges ? Number(formData.loyer_hors_charges) : null,
        charges: formData.charges !== undefined ? Number(formData.charges) : null,
        complement_loyer: formData.complement_loyer ? Number(formData.complement_loyer) : null,
        loyer_avec_charges: formData.loyer_avec_charges ? Number(formData.loyer_avec_charges) : null,
        loyer_m2: formData.loyer_m2 ? Number(formData.loyer_m2) : null,
        loyer_base: formData.loyer_base ? Number(formData.loyer_base) : null,
        loyer_ref_majore: formData.loyer_ref_majore ? Number(formData.loyer_ref_majore) : null,
        encadrement_des_loyers: formData.encadrement_des_loyers,
        is_loyer_cc: formData.is_loyer_cc,
        is_loyer_ht: formData.is_loyer_ht,
        commentaires: formData.commentaires,

        // Honoraires et frais
        honoraires_id: formData.honoraires_id ? Number(formData.honoraires_id) : null,
        honoraires_acheteur: formData.honoraires_acheteur ? Number(formData.honoraires_acheteur) : null,
        honoraires_locataire: formData.honoraires_locataire ? Number(formData.honoraires_locataire) : null,
        etat_des_lieux: formData.etat_des_lieux ? Number(formData.etat_des_lieux) : null,
        depot_garantie: formData.depot_garantie ? Number(formData.depot_garantie) : null,
        droit_entree: formData.droit_entree ? Number(formData.droit_entree) : null,
        charges_id: formData.charges_id ? Number(formData.charges_id) : null,

        // Informations copropriété
        copro: formData.copro,
        lots: formData.lots ? Number(formData.lots) : null,
        quote_part: formData.quote_part ? Number(formData.quote_part) : null,
        procedure_syndic: formData.procedure_syndic,
        detail_procedure: formData.detail_procedure,

        // Caractéristiques du bien
        surface: formData.surface ? Number(formData.surface) : null,
        surface_terrain: formData.surface_terrain ? Number(formData.surface_terrain) : null,
        terrain_agricole: formData.terrain_agricole,
        terrain_constructible: formData.terrain_constructible,
        terrain_rue: formData.terrain_rue,
        terrain_viabilise: formData.terrain_viabilise,
        pieces: formData.pieces ? Number(formData.pieces) : null,
        chambres: formData.chambres ? Number(formData.chambres) : null,
        sdb: formData.sdb ? Number(formData.sdb) : null,
        sde: formData.sde ? Number(formData.sde) : null,
        wc: formData.wc ? Number(formData.wc) : null,
        wc_separe: formData.wc_separe,
        cave: formData.cave,
        surface_cave: formData.surface_cave ? Number(formData.surface_cave) : null,
        sam: formData.sam,
        sejour: formData.sejour,
        surface_sejour: formData.surface_sejour ? Number(formData.surface_sejour) : null,
        salle_a_manger: formData.salle_a_manger,
        surface_salle_a_manger: formData.surface_salle_a_manger ? Number(formData.surface_salle_a_manger) : null,
        construction: formData.construction,
        recent: formData.recent,
        refait: formData.refait,
        travaux: formData.travaux,
        box: formData.box ? Number(formData.box) : null,
        parking: formData.parking ? Number(formData.parking) : null,
        etage: formData.etage ? Number(formData.etage) : null,
        nb_etages: formData.nb_etages ? Number(formData.nb_etages) : null,
        ascenseur: formData.ascenseur,
        duplex: formData.duplex,
        nb_balcons: formData.nb_balcons ? Number(formData.nb_balcons) : null,
        surface_balcons: formData.surface_balcons ? Number(formData.surface_balcons) : null,
        terrasse: formData.terrasse,
        nb_terrasses: formData.nb_terrasses ? Number(formData.nb_terrasses) : null,

        // Équipements et confort
        alarme: formData.alarme,
        chauffage_id: formData.chauffage_id ? Number(formData.chauffage_id) : null,
        cable: formData.cable,
        piscine: formData.piscine,
        entretien: formData.entretien,
        cuisine: formData.cuisine,
        securite: formData.securite,
        historique: formData.historique,
        parking_inclus: formData.parking_inclus,
        lot_neuf: formData.lot_neuf,
        cheminee: formData.cheminee,
        vue: formData.vue,
        entree: formData.entree,
        parquet: formData.parquet,
        placard: formData.placard,
        nb_couverts: formData.nb_couverts ? Number(formData.nb_couverts) : null,
        nb_lits_doubles: formData.nb_lits_doubles ? Number(formData.nb_lits_doubles) : null,
        nb_lits_simples: formData.nb_lits_simples ? Number(formData.nb_lits_simples) : null,
        vis_a_vis: formData.vis_a_vis,
        calme: formData.calme,
        congelateur: formData.congelateur,
        four: formData.four,
        lave_vaisselle: formData.lave_vaisselle,
        micro_ondes: formData.micro_ondes,
        lave_linge: formData.lave_linge,
        seche_linge: formData.seche_linge,
        internet: formData.internet,
        equipement_bebe: formData.equipement_bebe,
        telephone: formData.telephone,
        proche_lac: formData.proche_lac,
        proche_tennis: formData.proche_tennis,
        proche_pistes: formData.proche_pistes,
        gardien: formData.gardien,
        climatisation: formData.climatisation,
        handicapes: formData.handicapes,
        animaux: formData.animaux,
        digicode: formData.digicode,
        video: formData.video,
        interphone: formData.interphone,
        cuisine_id: formData.cuisine_id ? Number(formData.cuisine_id) : null,
        situation_id: formData.situation_id ? Number(formData.situation_id) : null,

        // Orientation
        orientation_sud: formData.orientation_sud,
        orientation_est: formData.orientation_est,
        orientation_ouest: formData.orientation_ouest,
        orientation_nord: formData.orientation_nord,

        // Diagnostics énergétiques
        bilan_conso_id: formData.bilan_conso_id ? Number(formData.bilan_conso_id) : null,
        consos: formData.consos ? Number(formData.consos) : null,
        version_dpe: formData.version_dpe,
        bilan_emission_id: formData.bilan_emission_id ? Number(formData.bilan_emission_id) : null,
        emissions: formData.emissions ? Number(formData.emissions) : null,

        // Autres informations
        exclusivite: formData.exclusivite,
        coup_de_coeur: formData.coup_de_coeur,
        bail: formData.bail,
        nature_bail: formData.nature_bail,
        duree_bail: formData.duree_bail ? Number(formData.duree_bail) : null,
        droit_au_bail: formData.droit_au_bail ? Number(formData.droit_au_bail) : null,
        loyer_murs: formData.loyer_murs ? Number(formData.loyer_murs) : null,
        meuble: formData.meuble,
        panoramique: formData.panoramique,
        visite_virtuelle: formData.visite_virtuelle,
        valeur_achat: formData.valeur_achat ? Number(formData.valeur_achat) : null,

        se_loger: formData.se_loger,
        
        // Informations de contact
        telephone_contact: formData.telephone_contact,
        nom_contact: formData.nom_contact,
        email_contact: formData.email_contact,
      }

      // Validate required fields
      let requiredFields = [
        "reference",
        "transaction_id",
        "typebien_id",
        "date_dispo",
        "adresse",
      ]

      // Ajouter les champs de prix uniquement pour les ventes
      if (!isLocation) {
        requiredFields = [
          ...requiredFields,
          "prix_hors_honoraires",
          "prix_avec_honoraires",
        ]
      } else {
        // Pour les locations, vérifier les champs de loyer
        requiredFields = [
          ...requiredFields,
          "loyer_hors_charges",
          "loyer_avec_charges",
        ]
      }

      // Vérification des champs obligatoires spécifiques
      if (!formData.reference || !formData.transaction_id || !formData.typebien_id || !formData.date_dispo || !formData.adresse || !formData.cp || !formData.ville) {
        // Créer une liste des champs manquants
        const specificMissingFields = [];
        if (!formData.reference) specificMissingFields.push("Référence");
        if (!formData.transaction_id) specificMissingFields.push("Type de transaction");
        if (!formData.typebien_id) specificMissingFields.push("Type de bien");
        if (!formData.date_dispo) specificMissingFields.push("Date de disponibilité");
        if (!formData.adresse) specificMissingFields.push("Adresse");
        if (!formData.cp) specificMissingFields.push("Code postal");
        if (!formData.ville) specificMissingFields.push("Ville");

        // Afficher un message d'erreur
        const errorMessage = document.createElement("div");
        errorMessage.className = "fixed top-16 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg";
        errorMessage.textContent = `Champs obligatoires manquants : ${specificMissingFields.join(', ')}.`;
        document.body.appendChild(errorMessage);

        setTimeout(() => {
          errorMessage.remove();
        }, 5000);

        setIsSubmitting(false);
        return;
      }

      const missingFields = requiredFields.filter((field) => {
        const value = requestBody[field as keyof typeof requestBody];
        return value === null || value === undefined || value === "";
      })

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

      // Afficher un message de confirmation
      const successMessage = document.createElement("div")
      successMessage.className = "fixed top-16 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50"
      successMessage.textContent = "Annonce enregistrée avec succès !"
      document.body.appendChild(successMessage)

      setTimeout(() => {
        successMessage.remove()
      }, 5000)
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Chargement...</div>
        </div>
      </div>
    )
  }

  // Rest of the component (form UI) remains the same
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-10">
        <div className="text-sm text-muted-foreground mb-5">
          <span className="hover:underline cursor-pointer transition-colors" onClick={() => router.push("/")}>Accueil</span>
          <span className="mx-2">/</span>
          <span className="hover:underline cursor-pointer transition-colors" onClick={() => router.push("/admin/annonces")}>Gestion des annonces</span>
          <span className="mx-2">/</span>
          <span>Modifier une annonce</span>
        </div>
        <div className="text-orange-400 uppercase tracking-wide text-sm font-semibold mb-3">ANNONCES</div>
        <h1 className="text-4xl font-bold text-[#00458E] mb-2">Modifier une annonce</h1>
        <p className="text-gray-500">Référence: {formData.reference}</p>
      </div>

      <div className="space-y-12 bg-gray-50 p-4 sm:p-6 rounded-lg">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Informations Générales</h2>
          <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                value={formData.transaction_id?.toString()}
                onValueChange={(value) => setFormData({ ...formData, transaction_id: Number(value) })}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {typestransactions && typestransactions.length > 0 && typestransactions.map((type: { id: number, nom: string }) => (
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
                value={formData.typebien_id?.toString()}
                onValueChange={(value) => setFormData({ ...formData, typebien_id: Number(value) })}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {typesbiens && typesbiens.length > 0 && typesbiens.map((type: { id: number, nom: string }) => (
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

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Localisation</h2>
          <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="cp">
                Code postal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cp"
                value={formData.cp}
                maxLength={5}
                onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">
                Ville <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                required
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom_contact">Nom du contact</Label>
                  <Input
                    id="nom_contact"
                    value={formData.nom_contact}
                    onChange={(e) => setFormData({ ...formData, nom_contact: e.target.value.slice(0, 100) })}
                    maxLength={100}
                    placeholder="Nom de la personne à contacter (100 caractères max)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone_contact">Téléphone de contact</Label>
                  <Input
                    id="telephone_contact"
                    value={formData.telephone_contact}
                    onChange={(e) => setFormData({ ...formData, telephone_contact: e.target.value.slice(0, 20) })}
                    maxLength={20}
                    placeholder="Numéro de téléphone (20 caractères max)"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email_contact">Email de contact</Label>
                  <Input
                    id="email_contact"
                    type="email"
                    value={formData.email_contact}
                    onChange={(e) => setFormData({ ...formData, email_contact: e.target.value.slice(0, 100) })}
                    maxLength={100}
                    placeholder="Adresse email (100 caractères max)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Informations financières</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Champs pour la vente (transaction_id != 1) */}
            {formData.transaction_id !== 1 && (
              <>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prix_masque"
                      checked={formData.prix_masque}
                      onCheckedChange={(checked) => setFormData({ ...formData, prix_masque: checked as boolean })}
                    />
                    <Label htmlFor="prix_masque">Masquer le prix</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prix_ht">Prix HT</Label>
                  <Select
                    value={formData.prix_ht || ""}
                    onValueChange={(value) => setFormData({ ...formData, prix_ht: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oui">Oui</SelectItem>
                      <SelectItem value="non">Non</SelectItem>
                    </SelectContent>
                  </Select>
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
              </>
            )}

            {/* Champs pour la location (transaction_id = 1) */}
            {formData.transaction_id === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="loyer_hors_charges">Loyer hors charges</Label>
                  <Input
                    id="loyer_hors_charges"
                    type="number"
                    value={formData.loyer_hors_charges}
                    onChange={(e) => setFormData({ ...formData, loyer_hors_charges: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charges">Charges</Label>
                  <Input
                    id="charges"
                    type="number"
                    value={formData.charges}
                    onChange={(e) => setFormData({ ...formData, charges: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement_loyer">Complément de loyer</Label>
                  <Input
                    id="complement_loyer"
                    type="number"
                    value={formData.complement_loyer}
                    onChange={(e) => setFormData({ ...formData, complement_loyer: Number(e.target.value) })}
                  />
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
                  <Label htmlFor="loyer_ref_majore">Loyer de référence majoré</Label>
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
                    value={formData.encadrement_des_loyers}
                    onChange={(e) => setFormData({ ...formData, encadrement_des_loyers: e.target.value })}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="is_loyer_cc">Loyer charges comprises</Label>
                  <Select
                    value={formData.is_loyer_cc || ""}
                    onValueChange={(value) => setFormData({ ...formData, is_loyer_cc: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oui">Oui</SelectItem>
                      <SelectItem value="non">Non</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="is_loyer_ht">Loyer HT</Label>
                  <Select
                    value={formData.is_loyer_ht || ""}
                    onValueChange={(value) => setFormData({ ...formData, is_loyer_ht: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oui">Oui</SelectItem>
                      <SelectItem value="non">Non</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loyer_murs">Loyer murs</Label>
                      <Input
                        id="loyer_murs"
                        type="number"
                        value={formData.loyer_murs}
                        onChange={(e) => setFormData({ ...formData, loyer_murs: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="droit_au_bail">Droit au bail</Label>
                      <Input
                        id="droit_au_bail"
                        type="number"
                        value={formData.droit_au_bail}
                        onChange={(e) => setFormData({ ...formData, droit_au_bail: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duree_bail">Durée du bail (mois)</Label>
                      <Input
                        id="duree_bail"
                        type="number"
                        value={formData.duree_bail}
                        onChange={(e) => setFormData({ ...formData, duree_bail: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nature_bail">Nature du bail</Label>
                      <Input
                        id="nature_bail"
                        value={formData.nature_bail}
                        onChange={(e) => setFormData({ ...formData, nature_bail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bail">Bail</Label>
                    <Input
                      id="bail"
                      value={formData.bail}
                      onChange={(e) => setFormData({ ...formData, bail: e.target.value })}
                    />
                  </div>
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
                  <Label htmlFor="etat_des_lieux">Frais d'état des lieux</Label>
                  <Input
                    id="etat_des_lieux"
                    type="number"
                    value={formData.etat_des_lieux}
                    onChange={(e) => setFormData({ ...formData, etat_des_lieux: Number(e.target.value) })}
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
                  <Label htmlFor="droit_entree">Droit d'entrée</Label>
                  <Input
                    id="droit_entree"
                    type="number"
                    value={formData.droit_entree}
                    onChange={(e) => setFormData({ ...formData, droit_entree: Number(e.target.value) })}
                  />
                </div>
              </>
            )}

            <div className="space-y-3 col-span-2 mt-4">
              <Label htmlFor="commentaires">Détails des charges / Commentaires</Label>
              <Textarea
                id="commentaires"
                className="min-h-[100px]"
                value={formData.commentaires}
                onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Caractéristiques du bien</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="arrondissement">Arrondissement</Label>
                <Input
                  id="arrondissement"
                  type="number"
                  value={formData.arrondissement}
                  onChange={(e) => setFormData({ ...formData, arrondissement: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude (coordonnée pour Google Maps)</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude (coordonnée pour Google Maps)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visite_virtuelle">Lien visite virtuelle</Label>
                <Input
                  id="visite_virtuelle"
                  value={formData.visite_virtuelle}
                  onChange={(e) => setFormData({ ...formData, visite_virtuelle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panoramique">Lien photo panoramique</Label>
                <Input
                  id="panoramique"
                  value={formData.panoramique}
                  onChange={(e) => setFormData({ ...formData, panoramique: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nb_lits_doubles">Nombre de lits doubles</Label>
                  <Input
                    id="nb_lits_doubles"
                    type="number"
                    value={formData.nb_lits_doubles}
                    onChange={(e) => setFormData({ ...formData, nb_lits_doubles: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nb_lits_simples">Nombre de lits simples</Label>
                  <Input
                    id="nb_lits_simples"
                    type="number"
                    value={formData.nb_lits_simples}
                    onChange={(e) => setFormData({ ...formData, nb_lits_simples: Number(e.target.value) })}
                  />
                </div>
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="nb_etages">Nombre d'étages</Label>
              <Input
                id="nb_etages"
                type="number"
                value={formData.nb_etages}
                onChange={(e) => setFormData({ ...formData, nb_etages: Number(e.target.value) })}
              />
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
              <Label htmlFor="construction">Année de construction</Label>
              <Input
                id="construction"
                value={formData.construction}
                onChange={(e) => setFormData({ ...formData, construction: e.target.value })}
              />
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
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="duplex"
                  checked={formData.duplex}
                  onCheckedChange={(checked) => setFormData({ ...formData, duplex: checked as boolean })}
                />
                <Label htmlFor="duplex">Duplex</Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meuble"
                  checked={formData.meuble}
                  onCheckedChange={(checked) => setFormData({ ...formData, meuble: checked as boolean })}
                />
                <Label htmlFor="meuble">Meublé</Label>
              </div>
            </div>





            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="refait"
                  checked={formData.refait}
                  onCheckedChange={(checked) => setFormData({ ...formData, refait: checked as boolean })}
                />
                <Label htmlFor="refait">Récemment rénové</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recent"
                  checked={formData.recent}
                  onCheckedChange={(checked) => setFormData({ ...formData, recent: checked as boolean })}
                />
                <Label htmlFor="recent">Construction récente</Label>
              </div>
            </div>


            <div className="space-y-2">

            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Équipements et confort</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alarme"
                      checked={formData.alarme}
                      onCheckedChange={(checked) => setFormData({ ...formData, alarme: checked as boolean })}
                    />
                    <Label htmlFor="alarme">Alarme</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="video"
                    checked={formData.video}
                    onCheckedChange={(checked) => setFormData({ ...formData, video: checked as boolean })}
                  />
                  <Label htmlFor="video">Caméra de surveillance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="securite"
                    checked={formData.securite}
                    onCheckedChange={(checked) => setFormData({ ...formData, securite: checked as boolean })}
                  />
                  <Label htmlFor="securite">Sécurité</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gardien"
                    checked={formData.gardien}
                    onCheckedChange={(checked) => setFormData({ ...formData, gardien: checked as boolean })}
                  />
                  <Label htmlFor="gardien">Gardien</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ascenseur"
                      checked={formData.ascenseur}
                      onCheckedChange={(checked) => setFormData({ ...formData, ascenseur: checked as boolean })}
                    />
                    <Label htmlFor="ascenseur">Ascenseur</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cable"
                      checked={formData.cable}
                      onCheckedChange={(checked) => setFormData({ ...formData, cable: checked as boolean })}
                    />
                    <Label htmlFor="cable">Câble</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cuisine"
                      checked={formData.cuisine}
                      onCheckedChange={(checked) => setFormData({ ...formData, cuisine: checked as boolean })}
                    />
                    <Label htmlFor="cuisine">Cuisine équipée</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cheminee"
                      checked={formData.cheminee}
                      onCheckedChange={(checked) => setFormData({ ...formData, cheminee: checked as boolean })}
                    />
                    <Label htmlFor="cheminee">Cheminée</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="salle_a_manger"
                      checked={formData.salle_a_manger}
                      onCheckedChange={(checked) => setFormData({ ...formData, salle_a_manger: checked as boolean })}
                    />
                    <Label htmlFor="salle_a_manger">Salle à manger</Label>
                  </div>
                </div>

                {formData.salle_a_manger && (
                  <div className="space-y-2">
                    <Label htmlFor="surface_salle_a_manger">Surface salle à manger (m²)</Label>
                    <Input
                      id="surface_salle_a_manger"
                      type="number"
                      value={formData.surface_salle_a_manger}
                      onChange={(e) => setFormData({ ...formData, surface_salle_a_manger: Number(e.target.value) })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sejour"
                      checked={formData.sejour}
                      onCheckedChange={(checked) => setFormData({ ...formData, sejour: checked as boolean })}
                    />
                    <Label htmlFor="sejour">Séjour</Label>
                  </div>
                </div>

                {formData.sejour && (
                  <div className="space-y-2">
                    <Label htmlFor="surface_sejour">Surface séjour (m²)</Label>
                    <Input
                      id="surface_sejour"
                      type="number"
                      value={formData.surface_sejour}
                      onChange={(e) => setFormData({ ...formData, surface_sejour: Number(e.target.value) })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="climatisation"
                      checked={formData.climatisation}
                      onCheckedChange={(checked) => setFormData({ ...formData, climatisation: checked as boolean })}
                    />
                    <Label htmlFor="climatisation">Climatisation</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="internet"
                      checked={formData.internet}
                      onCheckedChange={(checked) => setFormData({ ...formData, internet: checked as boolean })}
                    />
                    <Label htmlFor="internet">Internet</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interphone"
                      checked={formData.interphone}
                      onCheckedChange={(checked) => setFormData({ ...formData, interphone: checked as boolean })}
                    />
                    <Label htmlFor="interphone">Interphone</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wc_separe"
                      checked={formData.wc_separe}
                      onCheckedChange={(checked) => setFormData({ ...formData, wc_separe: checked as boolean })}
                    />
                    <Label htmlFor="wc_separe">WC séparé</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="digicode"
                      checked={formData.digicode}
                      onCheckedChange={(checked) => setFormData({ ...formData, digicode: checked as boolean })}
                    />
                    <Label htmlFor="digicode">Digicode</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="congelateur"
                      checked={formData.congelateur}
                      onCheckedChange={(checked) => setFormData({ ...formData, congelateur: checked as boolean })}
                    />
                    <Label htmlFor="congelateur">Congélateur</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="four"
                      checked={formData.four}
                      onCheckedChange={(checked) => setFormData({ ...formData, four: checked as boolean })}
                    />
                    <Label htmlFor="four">Four</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipement_bebe"
                      checked={formData.equipement_bebe}
                      onCheckedChange={(checked) => setFormData({ ...formData, equipement_bebe: checked as boolean })}
                    />
                    <Label htmlFor="equipement_bebe">Équipement bébé</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="telephone"
                      checked={formData.telephone}
                      onCheckedChange={(checked) => setFormData({ ...formData, telephone: checked as boolean })}
                    />
                    <Label htmlFor="telephone">Téléphone</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lave_vaisselle"
                      checked={formData.lave_vaisselle}
                      onCheckedChange={(checked) => setFormData({ ...formData, lave_vaisselle: checked as boolean })}
                    />
                    <Label htmlFor="lave_vaisselle">Lave-vaisselle</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="micro_ondes"
                      checked={formData.micro_ondes}
                      onCheckedChange={(checked) => setFormData({ ...formData, micro_ondes: checked as boolean })}
                    />
                    <Label htmlFor="micro_ondes">Micro-ondes</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lave_linge"
                      checked={formData.lave_linge}
                      onCheckedChange={(checked) => setFormData({ ...formData, lave_linge: checked as boolean })}
                    />
                    <Label htmlFor="lave_linge">Lave-linge</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seche_linge"
                      checked={formData.seche_linge}
                      onCheckedChange={(checked) => setFormData({ ...formData, seche_linge: checked as boolean })}
                    />
                    <Label htmlFor="seche_linge">Sèche-linge</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Caractéristiques supplémentaires</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="calme"
                      checked={formData.calme}
                      onCheckedChange={(checked) => setFormData({ ...formData, calme: checked as boolean })}
                    />
                    <Label htmlFor="calme">Calme</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parquet"
                      checked={formData.parquet}
                      onCheckedChange={(checked) => setFormData({ ...formData, parquet: checked as boolean })}
                    />
                    <Label htmlFor="parquet">Parquet</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="placard"
                      checked={formData.placard}
                      onCheckedChange={(checked) => setFormData({ ...formData, placard: checked as boolean })}
                    />
                    <Label htmlFor="placard">Placard</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vis_a_vis"
                      checked={formData.vis_a_vis}
                      onCheckedChange={(checked) => setFormData({ ...formData, vis_a_vis: checked as boolean })}
                    />
                    <Label htmlFor="vis_a_vis">Vis-à-vis</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="handicapes"
                      checked={formData.handicapes}
                      onCheckedChange={(checked) => setFormData({ ...formData, handicapes: checked as boolean })}
                    />
                    <Label htmlFor="handicapes">Accès handicapés</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="animaux"
                      checked={formData.animaux}
                      onCheckedChange={(checked) => setFormData({ ...formData, animaux: checked as boolean })}
                    />
                    <Label htmlFor="animaux">Animaux acceptés</Label>
                  </div>
                </div>



                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="proche_lac"
                    checked={formData.proche_lac}
                    onCheckedChange={(checked) => setFormData({ ...formData, proche_lac: checked as boolean })}
                  />
                  <Label htmlFor="proche_lac">Proche d'un lac</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="proche_tennis"
                    checked={formData.proche_tennis}
                    onCheckedChange={(checked) => setFormData({ ...formData, proche_tennis: checked as boolean })}
                  />
                  <Label htmlFor="proche_tennis">Proche d'un tennis</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="proche_pistes"
                    checked={formData.proche_pistes}
                    onCheckedChange={(checked) => setFormData({ ...formData, proche_pistes: checked as boolean })}
                  />
                  <Label htmlFor="proche_pistes">Proche des pistes</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="historique"
                    checked={formData.historique}
                    onCheckedChange={(checked) => setFormData({ ...formData, historique: checked as boolean })}
                  />
                  <Label htmlFor="historique">Lieu historique</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entretien"
                    checked={formData.entretien}
                    onCheckedChange={(checked) => setFormData({ ...formData, entretien: checked as boolean })}
                  />
                  <Label htmlFor="entretien">Entretien mis à disposition</Label>
                </div>


                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="travaux"
                    checked={formData.travaux}
                    onCheckedChange={(checked) => setFormData({ ...formData, travaux: checked as boolean })}
                  />
                  <Label htmlFor="travaux">Travaux</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lot_neuf"
                    checked={formData.lot_neuf}
                    onCheckedChange={(checked) => setFormData({ ...formData, lot_neuf: checked as boolean })}
                  />
                  <Label htmlFor="lot_neuf">Lot neuf</Label>
                </div>

              </div>
            </div>


            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Orientation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orientation_nord"
                      checked={formData.orientation_nord}
                      onCheckedChange={(checked) => setFormData({ ...formData, orientation_nord: checked as boolean })}
                    />
                    <Label htmlFor="orientation_nord">Nord</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orientation_est"
                      checked={formData.orientation_est}
                      onCheckedChange={(checked) => setFormData({ ...formData, orientation_est: checked as boolean })}
                    />
                    <Label htmlFor="orientation_est">Est</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orientation_sud"
                      checked={formData.orientation_sud}
                      onCheckedChange={(checked) => setFormData({ ...formData, orientation_sud: checked as boolean })}
                    />
                    <Label htmlFor="orientation_sud">Sud</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orientation_ouest"
                      checked={formData.orientation_ouest}
                      onCheckedChange={(checked) => setFormData({ ...formData, orientation_ouest: checked as boolean })}
                    />
                    <Label htmlFor="orientation_ouest">Ouest</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Diagnostics énergétiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dpe">DPE</Label>
                  <Select
                    value={formData.bilan_conso_id ? String(formData.bilan_conso_id) : ""}
                    onValueChange={(value) => setFormData({ ...formData, bilan_conso_id: value === "none" ? 0 : Number(value) })}
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
                      <SelectItem value="8">VI (vierge)</SelectItem>
                      <SelectItem value="9">NS (Non soumis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ges">GES</Label>
                  <Select
                    value={formData.bilan_emission_id ? String(formData.bilan_emission_id) : ""}
                    onValueChange={(value) => setFormData({ ...formData, bilan_emission_id: value === "none" ? 0 : Number(value) })}
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
                      <SelectItem value="8">VI (vierge)</SelectItem>
                      <SelectItem value="9">NS (Non soumis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consommation_energie">Consommation énergétique (kWh/m²/an)</Label>
                  <Input
                    id="consommation_energie"
                    type="number"
                    value={formData.consos}
                    onChange={(e) => setFormData({ ...formData, consos: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emission_ges">Emission GES (kg CO2/m²/an)</Label>
                  <Input
                    id="emission_ges"
                    type="number"
                    value={formData.emissions}
                    onChange={(e) => setFormData({ ...formData, emissions: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Équipements extérieurs</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="piscine_ext"
                      checked={formData.piscine}
                      onCheckedChange={(checked) => setFormData({ ...formData, piscine: checked as boolean })}
                    />
                    <Label htmlFor="piscine_ext">Piscine</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking"
                      checked={formData.parking_inclus}
                      onCheckedChange={(checked) => setFormData({ ...formData, parking_inclus: checked as boolean })}
                    />
                    <Label htmlFor="parking">Parking</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terrasse"
                      checked={formData.terrasse}
                      onCheckedChange={(checked) => setFormData({ ...formData, terrasse: checked as boolean })}
                    />
                    <Label htmlFor="terrasse">Terrasse</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cave"
                      checked={formData.cave}
                      onCheckedChange={(checked) => setFormData({ ...formData, cave: checked as boolean })}
                    />
                    <Label htmlFor="cave">Cave</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vue_ext"
                      checked={formData.vue}
                      onCheckedChange={(checked) => setFormData({ ...formData, vue: checked as boolean })}
                    />
                    <Label htmlFor="vue_ext">Belle vue</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parking_nb">Nombre de parkings</Label>
                  <Input
                    id="parking_nb"
                    type="number"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="box">Nombre de box</Label>
                  <Input
                    id="box"
                    type="number"
                    value={formData.box}
                    onChange={(e) => setFormData({ ...formData, box: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_balcons"
                      checked={formData.nb_balcons > 0}
                      onCheckedChange={(checked) => setFormData({ ...formData, nb_balcons: checked ? 1 : 0 })}
                    />
                    <Label htmlFor="has_balcons">Balcon</Label>
                  </div>
                  {formData.nb_balcons > 0 && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="nb_balcons">Nombre de balcons</Label>
                      <Input
                        id="nb_balcons"
                        type="number"
                        value={formData.nb_balcons}
                        onChange={(e) => setFormData({ ...formData, nb_balcons: Number(e.target.value) })}
                      />
                    </div>
                  )}
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

                {formData.cave && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="surface_cave">Surface de la cave (m²)</Label>
                    <Input
                      id="surface_cave"
                      type="number"
                      value={formData.surface_cave}
                      onChange={(e) => setFormData({ ...formData, surface_cave: Number(e.target.value) })}
                    />
                  </div>
                )}

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
            </div>




          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-12">
            <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Caractéristiques du terrain</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="surface_terrain">Surface du terrain (m²)</Label>
                  <Input
                    id="surface_terrain"
                    type="number"
                    value={formData.surface_terrain}
                    onChange={(e) => setFormData({ ...formData, surface_terrain: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terrain_constructible"
                    checked={formData.terrain_constructible}
                    onCheckedChange={(checked) => setFormData({ ...formData, terrain_constructible: checked as boolean })}
                  />
                  <Label htmlFor="terrain_constructible">Terrain constructible</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terrain_rue"
                    checked={formData.terrain_rue}
                    onCheckedChange={(checked) => setFormData({ ...formData, terrain_rue: checked as boolean })}
                  />
                  <Label htmlFor="terrain_rue">Terrain donnant sur rue</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terrain_viabilise"
                    checked={formData.terrain_viabilise}
                    onCheckedChange={(checked) => setFormData({ ...formData, terrain_viabilise: checked as boolean })}
                  />
                  <Label htmlFor="terrain_viabilise">Terrain viabilisé</Label>
                </div>

                {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    id="jardin"
                    checked={formData.jardin}
                    onCheckedChange={(checked) => setFormData({ ...formData, jardin: checked as boolean })}
                  />
                  <Label htmlFor="jardin">Jardin</Label>
                </div> */}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-12">
            <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Informations supplémentaires</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nom" className="font-medium">Titre de l'annonce</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="font-medium"
                />
              </div>

              <div className="space-y-3 mt-4">
                <Label htmlFor="description" className="font-medium">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-[200px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez le bien en détail..."
                />
              </div>

              <div className="space-y-2 mt-4 bg-orange-50 p-4 rounded-md border border-orange-100">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="publie"
                    checked={formData.publie}
                    onCheckedChange={(checked) => setFormData({ ...formData, publie: checked as boolean })}
                  />
                  <Label htmlFor="publie" className="font-medium">Publié</Label>
                </div>
                <p className="text-sm text-gray-500 mt-1 pl-6">Cochez cette case pour rendre l'annonce visible sur le site</p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-12">
            <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Options spéciales</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                  <Checkbox
                    id="coup_de_coeur"
                    checked={formData.coup_de_coeur}
                    onCheckedChange={(checked) => setFormData({ ...formData, coup_de_coeur: checked as boolean })}
                  />
                  <Label htmlFor="coup_de_coeur" className="font-medium">Coup de cœur</Label>
                </div>

                <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                  <Checkbox
                    id="exclusivite"
                    checked={formData.exclusivite}
                    onCheckedChange={(checked) => setFormData({ ...formData, exclusivite: checked as boolean })}
                  />
                  <Label htmlFor="exclusivite" className="font-medium">Exclusivité</Label>
                </div>
              </div>
            </div>
          </div> */}

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-12">
            <h2 className="text-2xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Informations copropriété</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                <Checkbox
                  id="copro"
                  checked={formData.copro}
                  onCheckedChange={(checked) => setFormData({ ...formData, copro: checked as boolean })}
                />
                <Label htmlFor="copro" className="font-medium">Copropriété</Label>
              </div>


              {formData.copro && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="procedure_syndic"
                        checked={formData.procedure_syndic}
                        onCheckedChange={(checked) => setFormData({ ...formData, procedure_syndic: checked as boolean })}
                      />
                      <Label htmlFor="procedure_syndic">Procédure syndic en cours</Label>
                    </div>
                  </div>

                  {formData.procedure_syndic && (
                    <div className="space-y-2 mt-4 pl-6">
                      <Label htmlFor="detail_procedure">Détail de la procédure</Label>
                      <Textarea
                        id="detail_procedure"
                        className="min-h-[100px]"
                        value={formData.detail_procedure}
                        onChange={(e) => setFormData({ ...formData, detail_procedure: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-12 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => router.push("/admin/annonces")} className="px-6 py-2">
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#00458E] hover:bg-[#003366] px-8 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-right text-sm text-gray-500 italic pb-4">* champs obligatoires</div>
      </div>
    </div>

  );
}