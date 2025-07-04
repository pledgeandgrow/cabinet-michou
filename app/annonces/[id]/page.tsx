import { getAnnonceById, getAnnoncePhotos } from "@/lib/queries";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import he from 'he'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Euro,
  Maximize2,
  BedDouble,
  Bath,
  MapPin,
  Thermometer,
  Leaf,
  Building2,
  Calendar,
  Info,
  Home,
  Key,
  Phone,
  Wifi,
  Tv,
  Lock,
  Snowflake,
  Flame,
  Car,
  Trees,
  Waves,
  Shield,
  Baby,
  Compass,
  Accessibility,
  Dog,
  CheckCircle,
  Refrigerator,
  Utensils,
  Warehouse,
  Eye,
  Footprints,
  Sofa,
  DoorClosed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import AnnonceCarousel from "@/app/components/AnnonceCarousel";

// Import dynamique de MapView avec SSR désactivé pour éviter l'erreur window is not defined
const MapView = dynamic(
  () => import("@/app/components/MapView"),
  { ssr: false }
);

const DPE_COLORS: { [key: string]: string } = {
  A: "bg-green-500",
  B: "bg-lime-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  E: "bg-red-500",
  F: "bg-red-700",
  G: "bg-red-900",
};

interface Photo {
  id: number;
  url: string;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const annonce = await getAnnonceById(params.id);
  if (!annonce) return { title: "Annonce non trouvée" };

  return {
    title: annonce.nom,
    description: annonce.description,
  };
}

export default async function AnnoncePage({ params }: { params: { id: string } }) {
  const annonce = await getAnnonceById(params.id);
  if (!annonce) notFound();

  // Récupérer les photos directement sans transformation
  const photos = await getAnnoncePhotos(params.id);

  // Ajouter un log pour déboguer
  console.log("Photos récupérées pour l'annonce:", JSON.stringify(photos));

  // Déterminer si c'est une location ou une vente
  const isLocation = annonce.transaction_id === 1;
  
  // Fonction pour vérifier si une caractéristique est présente
  const isFeaturePresent = (value: any) => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") {
      return value.toLowerCase() === "oui" || value === "1" || value.toLowerCase() === "true";
    }
    if (typeof value === "number") return value === 1 || value > 0;
    if (typeof value === "boolean") return value === true;
    return false;
  };

  // Utiliser la bibliothèque he pour décoder le HTML au lieu de DOMParser qui n'est pas disponible côté serveur
  const decodeHtml = (html: string | null | undefined): string => {
    return html ? he.decode(html) : "";
  };
  const numberToWords = (num: number | string | null | undefined): string => {
    // S'assurer que num est un nombre valide
    if (typeof num !== 'number') {
      // Essayer de convertir en nombre si possible
      const parsedNum = parseInt(String(num), 10);
      if (isNaN(parsedNum)) return "N/C";
      num = parsedNum;
    }

    const words = [
      "A", "B", "C", "D", "E", "F", "G", "H"
    ];

    // Vérifier que l'index est valide
    if (num < 1 || num > words.length) return "N/C";

    return words[num - 1]; // Convert number to corresponding word
  };

  return (
    <div className="container max-w-full px-2 md:px-4 py-4 md:py-8 mb-16 md:mb-0">
      {/* Mobile Header - Only visible on small screens */}
      <div className="md:hidden mb-3">
        <Badge className="mb-1">{isLocation ? "Location" : "Vente"}</Badge>
        <h1 className="text-lg font-bold mb-1">{typeof annonce.nom === 'string' ? annonce.nom : String(annonce.nom || '')}</h1>
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          {annonce.ville} ({annonce.cp})
        </p>
      </div>

      <div className="grid gap-3 md:gap-8 md:grid-cols-2">
        {/* Images */}
        <div>
          <AnnonceCarousel photos={photos} annonceName={typeof annonce.nom === 'string' ? annonce.nom : String(annonce.nom || '')} />
          <div className="mt-4">
            <MapView
              postalCode={annonce.cp}
              latitude={annonce.latitude}
              longitude={annonce.longitude}
            />
          </div>
        </div>

        {/* Informations principales */}
        <div className="space-y-2 md:space-y-5">
          {/* Desktop Header - Hidden on small screens */}
          <div className="hidden md:block">
            <Badge className="mb-2 md:mb-3">{isLocation ? "Location" : "Vente"}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{typeof annonce.nom === 'string' ? annonce.nom : String(annonce.nom || '')}</h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm md:text-base">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              {annonce.ville} ({annonce.cp})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1 md:gap-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-1 px-2 md:px-4 pt-2 md:pt-4">
                <CardTitle className="text-xs md:text-lg flex items-center gap-1 md:gap-2">
                  <Euro className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  Prix
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 md:px-4 pb-2 md:pb-4">
                <p className="text-sm md:text-xl font-bold">
                  {isLocation ? (
                    <>
                      {annonce.loyer_avec_charges?.toLocaleString() || "N/C"} €/mois
                      {annonce.charges && (
                        <span className="text-xs md:text-sm font-normal block mt-1">
                          (dont {annonce.charges} € de charges)
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {annonce.prix_avec_honoraires?.toLocaleString() || "N/C"} €
                      {annonce.honoraires_acheteur && (
                        <span className="text-xs md:text-sm font-normal block mt-1">
                          (Honoraires {annonce.honoraires_acheteur}% inclus)
                        </span>
                      )}
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-1 px-2 md:px-4 pt-2 md:pt-4">
                <CardTitle className="text-xs md:text-lg flex items-center gap-1 md:gap-2">
                  <Maximize2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  Surface
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 md:px-4 pb-2 md:pb-4">
                <p className="text-sm md:text-xl font-bold">
                  {annonce.surface} m²
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Caractéristiques */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1 px-2 pt-2 md:pb-2 md:px-4 md:pt-4">
              <CardTitle className="text-xs md:text-lg">Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-1 px-2 pb-2 text-xs md:text-sm md:gap-3 md:px-4 md:pb-4">
              {/* Pièces */}
              <div className="flex items-center gap-1 md:gap-2">
                <Home className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                <span className="truncate">
                  {(annonce.pieces || annonce.nb_pieces)} pièce{(annonce.pieces || annonce.nb_pieces) !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Chambres */}
              {(annonce.chambres || annonce.nb_chambres) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <BedDouble className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">
                    {(annonce.chambres || annonce.nb_chambres)} chambre{(annonce.chambres || annonce.nb_chambres) !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Salles de bain */}
              {(annonce.sdb || annonce.nb_sdb) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Bath className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">
                    {(annonce.sdb || annonce.nb_sdb)} salle{(annonce.sdb || annonce.nb_sdb) !== 1 ? "s" : ""} de bain
                  </span>
                </div>
              )}

              {/* WC */}
              {(annonce.wc || annonce.nb_wc) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                    <path d="M8 10h8"></path>
                    <path d="M8 14h8"></path>
                    <path d="M11 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                  </svg>
                  <span className="truncate">
                    {(annonce.wc || annonce.nb_wc)} WC
                  </span>
                </div>
              )}

              {/* Étage */}
              {annonce.etage !== null && annonce.etage !== undefined && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">
                    {annonce.etage}
                    {annonce.nb_etages ? `/${annonce.nb_etages}` : ""}
                    {(annonce.ascenseur === "Oui" || annonce.ascenseur === 1 || annonce.ascenseur === true) ? " (asc.)" : ""}
                  </span>
                </div>
              )}

              {/* Date disponibilité */}
              {isLocation && annonce.date_dispo && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">
                    Disponible le {new Date(annonce.date_dispo).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
              
              {/* Meublé */}
              {isFeaturePresent(annonce.meuble) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Home className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Meublé</span>
                </div>
              )}
              
              {/* Alarme */}
              {isFeaturePresent(annonce.alarme) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Shield className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Alarme</span>
                </div>
              )}
              
              {/* Orientations */}
              {isFeaturePresent(annonce.orientation_sud) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Orientation sud</span>
                </div>
              )}
              
              {isFeaturePresent(annonce.orientation_est) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Orientation est</span>
                </div>
              )}
              
              {isFeaturePresent(annonce.orientation_ouest) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Orientation ouest</span>
                </div>
              )}
              
              {isFeaturePresent(annonce.orientation_nord) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Orientation nord</span>
                </div>
              )}
              
              {/* Terrain */}
              {isFeaturePresent(annonce.terrain_agricole) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Trees className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Terrain agricole</span>
                </div>
              )}
              
              {isFeaturePresent(annonce.terrain_constructible) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Terrain constructible</span>
                </div>
              )}
              
              {isFeaturePresent(annonce.terrain_rue) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Terrain sur rue</span>
                </div>
              )}
              
              {isFeaturePresent(annonce.terrain_viabilise) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Terrain viabilisé</span>
                </div>
              )}
              
              {/* Séjour */}
              {isFeaturePresent(annonce.sejour) && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Sofa className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">Séjour</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Équipements et options */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1 px-2 pt-2 md:pb-2 md:px-4 md:pt-4">
              <CardTitle className="text-xs md:text-lg">Équipements et options</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-1 px-2 pb-2 text-xs md:text-sm md:gap-3 md:px-4 md:pb-4">
              {/* Affichage des équipements disponibles */}
              {(function() {
                // Ajouter un log pour déboguer les valeurs des équipements
                console.log("Valeurs des équipements:", {
                  balcon: annonce.nb_balcons > 0,
                  terrasse: annonce.terrasse,
                  jardin: annonce.jardin,
                  parking: annonce.parking > 0,
                  ascenseur: annonce.ascenseur,
                  cave: annonce.cave,
                  meuble: annonce.meuble,
                  climatisation: annonce.climatisation,
                  internet: annonce.internet,
                  lave_vaisselle: annonce.lave_vaisselle,
                  lave_linge: annonce.lave_linge,
                  four: annonce.four,
                  micro_ondes: annonce.micro_ondes,
                  seche_linge: annonce.seche_linge,
                  interphone: annonce.interphone,
                  digicode: annonce.digicode,
                  video: annonce.video,
                  piscine: annonce.piscine,
                  proche_lac: annonce.proche_lac,
                  proche_pistes: annonce.proche_pistes,
                  proche_tennis: annonce.proche_tennis,
                  calme: annonce.calme,
                  cheminee: annonce.cheminee,
                  duplex: annonce.duplex,
                  box: annonce.box > 0,
                  alarme: annonce.alarme,
                  cuisine: annonce.cuisine,
                  securite: annonce.securite,
                  vue: annonce.vue,
                  parquet: annonce.parquet,
                  placard: annonce.placard,
                  vis_a_vis: annonce.vis_a_vis,
                  congelateur: annonce.congelateur,
                  equipement_bebe: annonce.equipement_bebe,
                  telephone: annonce.telephone,
                  gardien: annonce.gardien,
                  handicapes: annonce.handicapes,
                  animaux: annonce.animaux,
                  orientation_sud: annonce.orientation_sud,
                  orientation_est: annonce.orientation_est,
                  orientation_ouest: annonce.orientation_ouest,
                  orientation_nord: annonce.orientation_nord,
                  wc_separe: annonce.wc_separe,
                  recent: annonce.recent,
                  refait: annonce.refait,
                  entretien: annonce.entretien,
                  entree: annonce.entree,
                  sejour: annonce.sejour,
                  salle_a_manger: annonce.salle_a_manger,
                  sam: annonce.sam,
                  terrain_agricole: annonce.terrain_agricole,
                  terrain_constructible: annonce.terrain_constructible,
                  terrain_rue: annonce.terrain_rue,
                  terrain_viabilise: annonce.terrain_viabilise,
                  surface_cave: annonce.surface_cave,
                  surface_sejour: annonce.surface_sejour,
                  surface_salle_a_manger: annonce.surface_salle_a_manger,
                  cable: annonce.cable,
                  historique: annonce.historique,
                  parking_inclus: annonce.parking_inclus,
                  lot_neuf: annonce.lot_neuf,
                  nb_couverts: annonce.nb_couverts,
                  nb_lits_doubles: annonce.nb_lits_doubles,
                  nb_lits_simples: annonce.nb_lits_simples,
                });

                // La fonction isFeaturePresent est maintenant définie au niveau supérieur

                // Liste des caractéristiques avec leur nom d'affichage et icône
                const features = [
                  {
                    key: "balcon", label: "Balcon", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path d="M4 12h16" />
                        <path d="M12 4v16" />
                      </svg>
                    )
                  },
                  {
                    key: "terrasse", label: "Terrasse", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                      </svg>
                    )
                  },
                  {
                    key: "jardin", label: "Jardin", icon: (
                      <Trees className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "parking", label: "Parking", icon: (
                      <Car className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "box", label: "Box", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="M20 9v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                        <path d="M2 10h20" />
                        <path d="M12 10v11" />
                      </svg>
                    )
                  },
                  {
                    key: "ascenseur", label: "Ascenseur", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M8 12h8" />
                        <path d="M12 8l4 4" />
                        <path d="M12 16l-4-4" />
                      </svg>
                    )
                  },
                  {
                    key: "cave", label: "Cave", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="M2 22v-5l5-5 5 5 5-5 5 5v5" />
                        <path d="M7 17v5" />
                        <path d="M17 17v5" />
                        <path d="M2 12V7l5-5 5 5 5-5 5 5v5" />
                      </svg>
                    )
                  },
                  {
                    key: "meuble", label: "Meublé", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="3" y="10" width="18" height="12" rx="2" />
                        <path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
                      </svg>
                    )
                  },
                  {
                    key: "climatisation", label: "Climatisation", icon: (
                      <Snowflake className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "cheminee", label: "Cheminée", icon: (
                      <Flame className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "internet", label: "Internet", icon: (
                      <Wifi className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "lave_vaisselle", label: "Lave-vaisselle", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M8 16v-3" />
                        <path d="M12 16v-3" />
                        <path d="M16 16v-3" />
                      </svg>
                    )
                  },
                  {
                    key: "lave_linge", label: "Lave-linge", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="12" cy="12" r="5" />
                        <path d="M4.5 4.5h3" />
                      </svg>
                    )
                  },
                  {
                    key: "seche_linge", label: "Sèche-linge", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="12" cy="12" r="5" />
                        <path d="M4.5 4.5h3" />
                        <path d="M7 16.5a5 5 0 0 0 10 0" />
                      </svg>
                    )
                  },
                  {
                    key: "four", label: "Four", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M7 8h.01" />
                        <path d="M7 12h.01" />
                        <path d="M7 16h.01" />
                      </svg>
                    )
                  },
                  {
                    key: "micro_ondes", label: "Micro-ondes", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <rect x="2" y="4" width="20" height="15" rx="2" />
                        <rect x="6" y="8" width="12" height="7" rx="1" />
                        <path d="M18 8v7" />
                      </svg>
                    )
                  },
                  {
                    key: "interphone", label: "Interphone", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="M14.5 9.5L9 4" />
                        <path d="M9 9.5L14.5 4" />
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    )
                  },
                  {
                    key: "digicode", label: "Digicode", icon: (
                      <Lock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "video", label: "Vidéosurveillance", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="M17 10h3v4h-3" />
                        <rect x="2" y="6" width="15" height="12" rx="2" />
                      </svg>
                    )
                  },
                  {
                    key: "piscine", label: "Piscine", icon: (
                      <Waves className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "proche_lac", label: "Proche lac", icon: (
                      <Waves className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "proche_pistes", label: "Proche pistes", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="m2 22 1-1h3l9-9" />
                        <path d="M3 15v-2l9-9 2 2-9 9h-2" />
                        <path d="M15 5 5 15" />
                        <path d="M17 7 7 17" />
                        <path d="M19 9 9 19" />
                      </svg>
                    )
                  },
                  {
                    key: "calme", label: "Environnement calme", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="M2 12h6" />
                        <path d="M22 12h-6" />
                        <path d="M12 2v6" />
                        <path d="M12 22v-6" />
                        <path d="M16 8 8 16" />
                        <path d="M8 8l8 8" />
                      </svg>
                    )
                  },
                  {
                    key: "duplex", label: "Duplex", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="M3 21h18" />
                        <path d="M3 7h18" />
                        <path d="M3 14h18" />
                      </svg>
                    )
                  },
                  {
                    key: "alarme", label: "Alarme", icon: (
                      <Shield className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "cuisine", label: "Cuisine équipée", icon: (
                      <Utensils className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "securite", label: "Sécurité", icon: (
                      <Shield className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "vue", label: "Belle vue", icon: (
                      <Eye className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "parquet", label: "Parquet", icon: (
                      <Footprints className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "placard", label: "Placards", icon: (
                      <DoorClosed className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "vis_a_vis", label: "Sans vis-à-vis", icon: (
                      <Eye className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "congelateur", label: "Congélateur", icon: (
                      <Refrigerator className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "equipement_bebe", label: "Équipement bébé", icon: (
                      <Baby className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "telephone", label: "Téléphone", icon: (
                      <Phone className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "proche_tennis", label: "Proche tennis", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M4.93 4.93 19.07 19.07"></path>
                        <path d="M14.83 9.17 9.17 14.83"></path>
                        <path d="M14.83 14.83 9.17 9.17"></path>
                      </svg>
                    )
                  },
                  {
                    key: "gardien", label: "Gardien", icon: (
                      <Shield className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "handicapes", label: "Accès handicapés", icon: (
                      <Accessibility className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "animaux", label: "Animaux acceptés", icon: (
                      <Dog className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "orientation_sud", label: "Orientation sud", icon: (
                      <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "orientation_est", label: "Orientation est", icon: (
                      <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "orientation_ouest", label: "Orientation ouest", icon: (
                      <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "orientation_nord", label: "Orientation nord", icon: (
                      <Compass className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "wc_separe", label: "WC séparés", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                        <path d="M8 10h8"></path>
                        <path d="M8 14h8"></path>
                        <path d="M11 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                      </svg>
                    )
                  },
                  {
                    key: "recent", label: "Construction récente", icon: (
                      <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "refait", label: "Refait à neuf", icon: (
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "entretien", label: "Bien entretenu", icon: (
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "entree", label: "Entrée", icon: (
                      <DoorClosed className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "sejour", label: "Séjour", icon: (
                      <Sofa className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "salle_a_manger", label: "Salle à manger", icon: (
                      <Utensils className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "terrain_agricole", label: "Terrain agricole", icon: (
                      <Trees className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "terrain_constructible", label: "Terrain constructible", icon: (
                      <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "terrain_rue", label: "Terrain sur rue", icon: (
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "terrain_viabilise", label: "Terrain viabilisé", icon: (
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "cable", label: "Câble TV", icon: (
                      <Tv className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "historique", label: "Bâtiment historique", icon: (
                      <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "parking_inclus", label: "Parking inclus", icon: (
                      <Car className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "lot_neuf", label: "Lot neuf", icon: (
                      <Building2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "nb_couverts", label: "Nb couverts", icon: (
                      <Utensils className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "nb_lits_doubles", label: "Lits doubles", icon: (
                      <BedDouble className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  },
                  {
                    key: "nb_lits_simples", label: "Lits simples", icon: (
                      <BedDouble className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500" />
                    )
                  }
                ];

                // Liste des caractéristiques à exclure de la section Équipements et options
                const excludedFeatures = [
                  "meuble", "alarme", "orientation_sud", "orientation_est", 
                  "orientation_ouest", "orientation_nord", "terrain_agricole", 
                  "terrain_constructible", "terrain_rue", "terrain_viabilise", "sejour"
                ];
                
                // Créer un tableau des équipements présents manuellement pour déboguer
                const presentFeatures = features
                  .filter(feature => isFeaturePresent(annonce[feature.key]))
                  .filter(feature => !excludedFeatures.includes(feature.key));
                console.log("Équipements présents:", presentFeatures.map(f => f.label));

                // Organiser les caractéristiques en deux colonnes équilibrées
                const halfLength = Math.ceil(presentFeatures.length / 2);
                const leftColumnFeatures = presentFeatures.slice(0, halfLength);
                const rightColumnFeatures = presentFeatures.slice(halfLength);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                    <div className="flex flex-col gap-2">
                      {leftColumnFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1 md:gap-2">
                          {feature.icon}
                          <span className="truncate">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {rightColumnFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1 md:gap-2">
                          {feature.icon}
                          <span className="truncate">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* DPE */}
          {(annonce.bilan_conso_id || annonce.bilan_emission_id) && (
            <Card className="shadow-sm">
              <CardHeader className="pb-1 px-2 pt-2 md:pb-2 md:px-4 md:pt-4">
                <CardTitle className="text-xs md:text-lg">Diagnostic énergétique</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 px-2 pb-2 md:flex-row md:gap-3 md:px-4 md:pb-4">
                {annonce.bilan_conso_id && (
                  <Badge
                    variant="secondary"
                    className={cn("px-1.5 py-0.5 text-xs w-full md:w-auto justify-center md:justify-start",
                      typeof annonce.bilan_conso_id === 'string' || typeof annonce.bilan_conso_id === 'number'
                        ? DPE_COLORS[String(annonce.bilan_conso_id)]
                        : '')}
                  >
                    <Thermometer className="h-3 w-3 mr-1 flex-shrink-0 md:h-3.5 md:w-3.5 md:mr-1.5" />
                    DPE {numberToWords(annonce.bilan_conso_id)} - {typeof annonce.consos === 'string' || typeof annonce.consos === 'number' ? String(annonce.consos) : 'N/C'} kWh/m²/an
                  </Badge>
                )}
                {annonce.bilan_emission_id && (
                  <Badge
                    variant="secondary"
                    className={cn("px-1.5 py-0.5 text-xs w-full md:w-auto justify-center md:justify-start",
                      typeof annonce.bilan_emission_id === 'string' || typeof annonce.bilan_emission_id === 'number'
                        ? DPE_COLORS[String(annonce.bilan_emission_id)]
                        : '')}
                  >
                    <Leaf className="h-3 w-3 mr-1 flex-shrink-0 md:h-3.5 md:w-3.5 md:mr-1.5" />
                    GES {numberToWords(annonce.bilan_emission_id)} - {typeof annonce.emissions === 'string' || typeof annonce.emissions === 'number' ? String(annonce.emissions) : 'N/C'} kgCO₂/m²/an
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informations complémentaires */}
          {isLocation && (
            <Card className="shadow-sm">
              <CardHeader className="pb-1 px-2 pt-2 md:pb-2 md:px-4 md:pt-4">
                <CardTitle className="text-xs md:text-lg">Informations locatives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 px-2 pb-2 text-xs md:space-y-2 md:px-4 md:pb-4 md:text-sm">
                <p>Dépôt de garantie : {annonce.depot_garantie?.toLocaleString() || "N/C"} €</p>
                <p>Honoraires locataire : {annonce.honoraires_locataire?.toLocaleString() || "N/C"} €</p>
                <p>État des lieux : {annonce.etat_des_lieux?.toLocaleString() || "N/C"} €</p>
                {annonce.encadrement_des_loyers === "OUI" && (
                  <div className="mt-2 md:mt-3">
                    <Badge variant="outline" className="mb-1 text-xs">
                      <Info className="h-3 w-3 mr-1 flex-shrink-0 md:h-3.5 md:w-3.5 md:mr-1.5" />
                      Zone soumise à l&apos;encadrement des loyers
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Loyer de référence majoré : {annonce.loyer_ref_majore?.toLocaleString() || "N/C"} €
                      {annonce.complement_loyer > 0 && (
                        <> - Complément de loyer : {annonce.complement_loyer} €</>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1 px-2 pt-2 md:pb-2 md:px-4 md:pt-4">
              <CardTitle className="text-xs md:text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2 md:px-4 md:pb-4">
              <p className="whitespace-pre-line text-xs md:text-sm">
                {decodeHtml(typeof annonce.description === 'string'
                  ? annonce.description
                  : (annonce.description ? String(annonce.description) : ''))}
              </p>
            </CardContent>
          </Card>

          {/* Contact Buttons */}
          <div className="hidden md:flex justify-end gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">
                <Phone className="h-4 w-4 mr-2" />
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Contact Button - Sticky at bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 p-2 shadow-lg z-10 md:hidden">
        <Button size="sm" className="w-full" asChild>
          <Link href="/contact">
            <Phone className="h-3 w-3 mr-1" />
            Nous contacter
          </Link>
        </Button>
      </div>
    </div>
  );
}