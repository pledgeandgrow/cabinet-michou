"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Trash2, Star, Upload } from "lucide-react"

// Define types for the API data
interface Photo {
  id?: number
  annonce_id: number
  nom: string
  principale: number
  file?: File
  preview?: string
  isNew?: boolean
  isCloudinary?: boolean
  url?: string
}

interface CloudinaryResult {
  public_id: string
  secure_url: string
  original_filename: string
}

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
  commentaires: string;
  se_loger: string;
  publie: boolean;
}

// Helper function to check if nom is a Cloudinary URL
const isCloudinaryUrl = (nom: string): boolean => {
  return nom.startsWith("https://res.cloudinary.com/") || nom.includes("cloudinary.com")
}

// Helper function to check if a string is a valid URL
const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
}

export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typesbiens, setTypesBien] = useState<TypeBien[]>([])
  const [typestransactions, setTypesTransactions] = useState<TypeTransaction[]>([])
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isUploading, setIsUploading] = useState(false)

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
    commentaires: "",
    se_loger: "0",
    publie: false,
    surface_cave: 0
  })

  const totalSteps = 5
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
    // Vérification des champs obligatoires pour l'étape 1
    if (currentStep === 1) {
      const missingFields = [];
      
      if (!formData.reference) missingFields.push("Référence");
      if (!formData.nom) missingFields.push("Nom du bien");
      if (!formData.transaction_id) missingFields.push("Type de transaction");
      if (!formData.typebien_id) missingFields.push("Type de bien");
      if (!formData.date_dispo) missingFields.push("Date de disponibilité");
      
      if (missingFields.length > 0) {
        // Utiliser une alerte JavaScript standard
        // alert(`Champs obligatoires manquants : ${missingFields.join(', ')}.`);
        
        // Essayer également le toast
        toast({
          title: "Champs obligatoires manquants",
          description: `Veuillez remplir les champs suivants : ${missingFields.join(', ')}.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Vérification des champs obligatoires pour l'étape 2
    if (currentStep === 2) {
      const missingFields = [];
      
      if (!formData.adresse) missingFields.push("Adresse");
      if (!formData.cp) missingFields.push("Code postal");
      if (!formData.ville) missingFields.push("Ville");
      if (!formData.pays) missingFields.push("Pays");
      
      if (missingFields.length > 0) {
        // Utiliser une alerte JavaScript standard
        // alert(`Champs obligatoires manquants : ${missingFields.join(', ')}.`);
        
        // Essayer également le toast
        toast({
          title: "Champs obligatoires manquants",
          description: `Veuillez remplir les champs suivants : ${missingFields.join(', ')}.`,
          variant: "destructive",
        });
        return;
      }
      
      // Si cp_reel est vide, copier la valeur de cp
      // Si ville_reel est vide, copier la valeur de ville
      const updatedFormData = { ...formData };
      let dataUpdated = false;
      
      if (!formData.cp_reel && formData.cp) {
        updatedFormData.cp_reel = formData.cp;
        dataUpdated = true;
      }
      
      if (!formData.ville_reel && formData.ville) {
        updatedFormData.ville_reel = formData.ville;
        dataUpdated = true;
      }
      
      if (dataUpdated) {
        setFormData(updatedFormData);
        toast({
          title: "Champs auto-complétés",
          description: "Les champs 'Code postal réel' et/ou 'Ville réelle' ont été automatiquement remplis avec les valeurs de 'Code postal' et 'Ville'.",
        });
      }
    }
    
    // Si tout est valide ou si ce n'est pas l'étape 1 ou 2, passer à l'étape suivante
    setCurrentStep((prev) => Math.min(prev + 1, 5))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleAddPhotos = async () => {
    if (!selectedFiles) return;

    setIsUploading(true);

    try {
      console.log(`Uploading ${selectedFiles.length} files to Cloudinary...`);

      const uploadPromises = Array.from(selectedFiles).map(async (file, index) => {
        console.log(`Processing file ${index + 1}/${selectedFiles.length}: ${file.name}`);

        // Upload to Cloudinary first
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `annonces/temp`);

        console.log(`Uploading ${file.name} to Cloudinary...`);
        const cloudinaryResponse = await fetch("/api/upload-to-cloudinary", {
          method: "POST",
          body: formData,
        });

        if (!cloudinaryResponse.ok) {
          const errorText = await cloudinaryResponse.text();
          console.error(`Failed to upload ${file.name} to Cloudinary:`, errorText);
          throw new Error(`Failed to upload ${file.name} to Cloudinary: ${cloudinaryResponse.status} ${errorText}`);
        }

        const cloudinaryResult: CloudinaryResult = await cloudinaryResponse.json();
        console.log(`File ${file.name} uploaded successfully:`, cloudinaryResult);

        // Create a photo object
        const newPhoto: Photo = {
          annonce_id: 0, // Sera mis à jour après la création de l'annonce
          nom: cloudinaryResult.secure_url,
          principale: photos.length === 0 && index === 0 ? 1 : 0, // La première photo est principale par défaut
          preview: cloudinaryResult.secure_url,
          isNew: true,
          isCloudinary: true,
        };

        console.log(`Created photo object:`, newPhoto);
        return newPhoto;
      });

      const newPhotos = await Promise.all(uploadPromises);
      console.log(`All ${newPhotos.length} photos uploaded successfully:`, newPhotos);

      setPhotos([...photos, ...newPhotos]);

      // Reset file input
      const fileInput = document.getElementById('photos') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setSelectedFiles(null);

      toast({
        title: "Succès",
        description: `${newPhotos.length} photo(s) uploadée(s) avec succès`,
      });
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload des photos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const photoToRemove = photos[index];
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);

    // Si on supprime la photo principale, définir la première photo restante comme principale
    if (photoToRemove.principale === 1 && newPhotos.length > 0) {
      newPhotos[0].principale = 1;
    }

    setPhotos(newPhotos);

    toast({
      title: "Photo supprimée",
      description: "La photo a été supprimée avec succès",
    });
  };

  const handleSetPrincipal = (index: number) => {
    const newPhotos = photos.map((photo, i) => ({
      ...photo,
      principale: i === index ? 1 : 0,
    }));
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)

    try {
      // Vérifier qu'au moins une photo a été ajoutée
      if (photos.length === 0) {
        toast({
          title: "Photo obligatoire",
          description: "Veuillez ajouter au moins une photo avant de soumettre l'annonce.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
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
        commentaires: formData.commentaires,
        se_loger: formData.se_loger,
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

      // Si l'annonce a été créée avec succès et qu'il y a des photos à sauvegarder
      if (data && data.result && data.result[0] && data.result[0].id && photos.length > 0) {
        try {
          console.log("Annonce créée avec succès, ID:", data.result[0].id);
          console.log("Photos à associer:", photos.length);

          // Pour chaque photo, associer l'ID de l'annonce et sauvegarder
          const photoPromises = photos.map(async (photo, index) => {
            console.log(`Traitement de la photo ${index + 1}/${photos.length}:`, photo);

            const photoData = {
              annonceId: data.result[0].id,
              cloudinary_url: photo.nom,
              principale: photo.principale
            };

            console.log(`Envoi des données pour la photo ${index + 1}:`, photoData);

            const response = await fetch("/api/save-cloudinary-photo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(photoData),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Erreur lors de l'enregistrement de la photo ${index + 1}:`, errorText);
              throw new Error(`Failed to save photo: ${photo.nom}. Status: ${response.status}. ${errorText}`);
            }

            const result = await response.json();
            console.log(`Photo ${index + 1} enregistrée avec succès:`, result);
            return result;
          });

          const photoResults = await Promise.all(photoPromises);
          console.log("Toutes les photos ont été enregistrées:", photoResults);

          toast({
            title: "Photos sauvegardées",
            description: `${photos.length} photo(s) associée(s) à l'annonce avec succès`,
          });
        } catch (error) {
          console.error("Error saving photos:", error);
          toast({
            title: "Attention",
            description: "L'annonce a été créée mais certaines photos n'ont pas pu être sauvegardées",
            variant: "destructive",
          });
        }
      } else {
        console.warn("Pas de photos à associer ou structure de réponse incorrecte:", { data, photosCount: photos.length });
      }

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
          <div className={`p-4 mb-1 ${currentStep === 4 ? "bg-[#F5A623]" : ""}`}>
            <div className="text-sm font-semibold mb-1">ÉTAPE 4</div>
            <div className="text-lg">Caractéristiques</div>
          </div>
          <div className={`p-4 ${currentStep === 5 ? "bg-[#F5A623]" : ""}`}>
            <div className="text-sm font-semibold mb-1">ÉTAPE 5</div>
            <div className="text-lg">Photos</div>
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
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value.slice(0, 20) })}
                      maxLength={20}
                      placeholder="REF-001 (20 caractères max)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nom">
                      Nom du bien <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value.slice(0, 64) })}
                      maxLength={64}
                      placeholder="Appartement lumineux, Maison de charme... (64 caractères max)"
                      required
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
                      required
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
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value.slice(0, 128) })}
                      maxLength={128}
                      placeholder="Adresse complète (128 caractères max)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quartier">Quartier</Label>
                    <Input
                      id="quartier"
                      value={formData.quartier}
                      onChange={(e) => setFormData({ ...formData, quartier: e.target.value.slice(0, 64) })}
                      maxLength={64}
                      placeholder="Quartier (64 caractères max)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cp">Code postal <span className="text-red-500">*</span></Label>
                    <Input
                      id="cp"
                      value={formData.cp}
                      onChange={(e) => setFormData({ ...formData, cp: e.target.value.slice(0, 5) })}
                      maxLength={5}
                      placeholder="Code postal (5 caractères max)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville <span className="text-red-500">*</span></Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value.slice(0, 50) })}
                      maxLength={50}
                      placeholder="Ville (50 caractères max)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cp_reel">Code postal réel</Label>
                    <Input
                      id="cp_reel"
                      value={formData.cp_reel}
                      onChange={(e) => setFormData({ ...formData, cp_reel: e.target.value.slice(0, 5) })}
                      maxLength={5}
                      placeholder="Code postal réel (5 caractères max)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ville_reel">Ville réelle</Label>
                    <Input
                      id="ville_reel"
                      value={formData.ville_reel}
                      onChange={(e) => setFormData({ ...formData, ville_reel: e.target.value.slice(0, 50) })}
                      maxLength={50}
                      placeholder="Ville réelle (50 caractères max)"
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
                    <Label htmlFor="pays">Pays <span className="text-red-500">*</span></Label>
                    <Input
                      id="pays"
                      value={formData.pays}
                      onChange={(e) => setFormData({ ...formData, pays: e.target.value.slice(0, 150) })}
                      maxLength={150}
                      placeholder="Pays (150 caractères max)"
                      required
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
                      onChange={(e) => setFormData({ ...formData, ligne: e.target.value.slice(0, 50) })}
                      maxLength={50}
                      placeholder="Ligne de transport (50 caractères max)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="station">Station</Label>
                    <Input
                      id="station"
                      value={formData.station}
                      onChange={(e) => setFormData({ ...formData, station: e.target.value.slice(0, 50) })}
                      maxLength={50}
                      placeholder="Station (50 caractères max)"
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
                  {/* Champs pour les ventes (transaction_id 1 ou 3) */}
                  {(formData.transaction_id === 2) && (
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
                    </>
                  )}

                  {/* Champs pour les locations (transaction_id 2) */}
                  {formData.transaction_id === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="loyer_hors_charges">Loyer hors charges <span className="text-red-500">*</span></Label>
                        <Input
                          id="loyer_hors_charges"
                          type="number"
                          value={formData.loyer_hors_charges || 0}
                          onChange={(e) => setFormData({ ...formData, loyer_hors_charges: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="charges">Charges</Label>
                        <Input
                          id="charges"
                          type="number"
                          value={formData.charges || 0}
                          onChange={(e) => setFormData({ ...formData, charges: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement_loyer">Complément de loyer</Label>
                        <Input
                          id="complement_loyer"
                          type="number"
                          value={formData.complement_loyer || 0}
                          onChange={(e) => setFormData({ ...formData, complement_loyer: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loyer_avec_charges">Loyer avec charges</Label>
                        <Input
                          id="loyer_avec_charges"
                          type="number"
                          value={formData.loyer_avec_charges || 0}
                          onChange={(e) => setFormData({ ...formData, loyer_avec_charges: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loyer_m2">Loyer au m²</Label>
                        <Input
                          id="loyer_m2"
                          type="number"
                          value={formData.loyer_m2 || 0}
                          onChange={(e) => setFormData({ ...formData, loyer_m2: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loyer_base">Loyer de base</Label>
                        <Input
                          id="loyer_base"
                          type="number"
                          value={formData.loyer_base || 0}
                          onChange={(e) => setFormData({ ...formData, loyer_base: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loyer_ref_majore">Loyer de référence majoré</Label>
                        <Input
                          id="loyer_ref_majore"
                          type="number"
                          value={formData.loyer_ref_majore || 0}
                          onChange={(e) => setFormData({ ...formData, loyer_ref_majore: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="encadrement_loyers">Encadrement des loyers</Label>
                        <Input
                          id="encadrement_loyers"
                          type="number"
                          value={formData.encadrement_des_loyers || 0}
                          onChange={(e) => setFormData({ ...formData, encadrement_des_loyers: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loyer_murs">Loyer murs</Label>
                        <Input
                          id="loyer_murs"
                          type="number"
                          value={formData.loyer_murs || 0}
                          onChange={(e) => setFormData({ ...formData, loyer_murs: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="droit_bail">Droit au bail</Label>
                        <Input
                          id="droit_bail"
                          type="number"
                          value={formData.droit_au_bail || 0}
                          onChange={(e) => setFormData({ ...formData, droit_au_bail: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="honoraires_locataire">Honoraires locataire</Label>
                        <Input
                          id="honoraires_locataire"
                          type="number"
                          value={formData.honoraires_locataire || 0}
                          onChange={(e) => setFormData({ ...formData, honoraires_locataire: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duree_bail">Durée du bail (mois)</Label>
                        <Input
                          id="duree_bail"
                          type="number"
                          value={formData.duree_bail || 0}
                          onChange={(e) => setFormData({ ...formData, duree_bail: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nature_bail">Nature du bail</Label>
                        <Input
                          id="nature_bail"
                          type="text"
                          value={formData.nature_bail || ''}
                          onChange={(e) => setFormData({ ...formData, nature_bail: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bail">Bail</Label>
                        <Input
                          id="bail"
                          type="text"
                          value={formData.bail || ''}
                          onChange={(e) => setFormData({ ...formData, bail: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="frais_etat_lieux">Frais d'état des lieux</Label>
                        <Input
                          id="frais_etat_lieux"
                          type="number"
                          value={formData.etat_des_lieux || 0}
                          onChange={(e) => setFormData({ ...formData, etat_des_lieux: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="depot_garantie">Dépôt de garantie</Label>
                        <Input
                          id="depot_garantie"
                          type="number"
                          value={formData.depot_garantie || 0}
                          onChange={(e) => setFormData({ ...formData, depot_garantie: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="droit_entree">Droit d'entrée</Label>
                        <Input
                          id="droit_entree"
                          type="number"
                          value={formData.droit_entree || 0}
                          onChange={(e) => setFormData({ ...formData, droit_entree: Number(e.target.value) })}
                        />
                      </div>
                    </>
                  )}

                  {/* Message si aucun type de transaction n'est sélectionné */}
                  {!formData.transaction_id && (
                    <div className="col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-700">Veuillez sélectionner un type de transaction à l'étape 1 pour afficher les champs financiers appropriés.</p>
                    </div>
                  )}


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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="se_loger"
                      checked={formData.se_loger === "1"}
                      onCheckedChange={(checked) => setFormData({ ...formData, se_loger: checked ? "1" : "0" })}
                    />
                    <Label htmlFor="se_loger">SeLoger</Label>
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
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-lg font-semibold mb-2 block">Sécurité et services</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
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
                        id="alarme"
                        checked={formData.alarme}
                        onCheckedChange={(checked) => setFormData({ ...formData, alarme: checked as boolean })}
                      />
                      <Label htmlFor="alarme">Alarme</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gardien"
                        checked={formData.gardien}
                        onCheckedChange={(checked) => setFormData({ ...formData, gardien: checked as boolean })}
                      />
                      <Label htmlFor="gardien">Gardien</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="digicode"
                        checked={formData.digicode}
                        onCheckedChange={(checked) => setFormData({ ...formData, digicode: checked as boolean })}
                      />
                      <Label htmlFor="digicode">Digicode</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="interphone"
                        checked={formData.interphone}
                        onCheckedChange={(checked) => setFormData({ ...formData, interphone: checked as boolean })}
                      />
                      <Label htmlFor="interphone">Interphone</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="video"
                        checked={formData.video}
                        onCheckedChange={(checked) => setFormData({ ...formData, video: checked as boolean })}
                      />
                      <Label htmlFor="video">Vidéosurveillance</Label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-lg font-semibold mb-2 block">Caractéristiques du bien</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cave"
                        checked={formData.cave}
                        onCheckedChange={(checked) => setFormData({ ...formData, cave: checked as boolean })}
                      />
                      <Label htmlFor="cave">Cave</Label>
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
                        id="cheminee"
                        checked={formData.cheminee}
                        onCheckedChange={(checked) => setFormData({ ...formData, cheminee: checked as boolean })}
                      />
                      <Label htmlFor="cheminee">Cheminée</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="climatisation"
                        checked={formData.climatisation}
                        onCheckedChange={(checked) => setFormData({ ...formData, climatisation: checked as boolean })}
                      />
                      <Label htmlFor="climatisation">Climatisation</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="calme"
                        checked={formData.calme}
                        onCheckedChange={(checked) => setFormData({ ...formData, calme: checked as boolean })}
                      />
                      <Label htmlFor="calme">Environnement calme</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vis_a_vis"
                        checked={formData.vis_a_vis}
                        onCheckedChange={(checked) => setFormData({ ...formData, vis_a_vis: checked as boolean })}
                      />
                      <Label htmlFor="vis_a_vis">Sans vis-à-vis</Label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-lg font-semibold mb-2 block">Équipements</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cuisine"
                        checked={formData.cuisine}
                        onCheckedChange={(checked) => setFormData({ ...formData, cuisine: checked as boolean })}
                      />
                      <Label htmlFor="cuisine">Cuisine équipée</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="four"
                        checked={formData.four}
                        onCheckedChange={(checked) => setFormData({ ...formData, four: checked as boolean })}
                      />
                      <Label htmlFor="four">Four</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="micro_ondes"
                        checked={formData.micro_ondes}
                        onCheckedChange={(checked) => setFormData({ ...formData, micro_ondes: checked as boolean })}
                      />
                      <Label htmlFor="micro_ondes">Micro-ondes</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lave_vaisselle"
                        checked={formData.lave_vaisselle}
                        onCheckedChange={(checked) => setFormData({ ...formData, lave_vaisselle: checked as boolean })}
                      />
                      <Label htmlFor="lave_vaisselle">Lave-vaisselle</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lave_linge"
                        checked={formData.lave_linge}
                        onCheckedChange={(checked) => setFormData({ ...formData, lave_linge: checked as boolean })}
                      />
                      <Label htmlFor="lave_linge">Lave-linge</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="seche_linge"
                        checked={formData.seche_linge}
                        onCheckedChange={(checked) => setFormData({ ...formData, seche_linge: checked as boolean })}
                      />
                      <Label htmlFor="seche_linge">Sèche-linge</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="congelateur"
                        checked={formData.congelateur}
                        onCheckedChange={(checked) => setFormData({ ...formData, congelateur: checked as boolean })}
                      />
                      <Label htmlFor="congelateur">Congélateur</Label>
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

          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#00458E] mb-6">Photos de l'annonce</h2>

                {photos.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Photos sélectionnées</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group border rounded-lg overflow-hidden bg-gray-50">
                          <div className="aspect-video relative">
                            <img
                              src={photo.preview}
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
                            <p className="text-sm truncate" title={typeof photo.nom === 'string' ? photo.nom : 'Photo'}>
                              {photo.isCloudinary ? "Image Cloudinary" : (typeof photo.nom === 'string' ? photo.nom : 'Photo')}
                            </p>
                            {photo.isCloudinary && <p className="text-xs text-green-600 mt-1">☁️ Cloudinary</p>}
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
                  </div>
                )}

                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium">Sélectionnez les photos à ajouter</h3>
                  <div className="space-y-2">
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      disabled={isUploading}
                    />
                    <p className="text-sm text-muted-foreground">
                      Formats acceptés: JPG, PNG, GIF, WEBP. Taille maximale: 10MB par image. Les images seront automatiquement
                      uploadées vers Cloudinary et l'URL sera sauvegardée en base de données.
                    </p>
                  </div>

                  <Button
                    onClick={handleAddPhotos}
                    disabled={!selectedFiles || isUploading}
                    className="bg-orange-400 hover:bg-orange-500 text-white"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Ajouter les photos
                      </>
                    )}
                  </Button>
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
