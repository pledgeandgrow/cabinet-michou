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

  const isLocation = annonce.transaction_id === 1;
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
            <MapView postalCode={annonce.cp}/>
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
            </CardContent>
          </Card>
          
          {/* Équipements et options */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1 px-2 pt-2 md:pb-2 md:px-4 md:pt-4">
              <CardTitle className="text-xs md:text-lg">Équipements et options</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-1 px-2 pb-2 text-xs md:text-sm md:gap-3 md:px-4 md:pb-4">
              {/* Affichage des équipements disponibles */}
              {(() => {
                // Ajouter un log pour déboguer les valeurs des équipements
                console.log("Valeurs des équipements:", {
                  balcon: annonce.balcon,
                  terrasse: annonce.terrasse,
                  jardin: annonce.jardin,
                  parking: annonce.parking,
                  ascenseur: annonce.ascenseur,
                  cave: annonce.cave,
                  meuble: annonce.meuble,
                });
                
                // Fonction améliorée pour vérifier si une caractéristique est présente
                const isFeaturePresent = (value: any) => {
                  if (value === undefined || value === null) return false;
                  if (typeof value === "string") {
                    return value.toLowerCase() === "oui" || value === "1" || value.toLowerCase() === "true";
                  }
                  if (typeof value === "number") return value === 1;
                  if (typeof value === "boolean") return value === true;
                  return false;
                };
                
                // Liste des caractéristiques avec leur nom d'affichage et icône
                const features = [
                  { key: "balcon", label: "Balcon", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                      <rect x="4" y="4" width="16" height="16" rx="2"/>
                      <path d="M4 12h16"/>
                      <path d="M12 4v16"/>
                    </svg>
                  ) },
                  { key: "terrasse", label: "Terrasse", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 9h18"/>
                    </svg>
                  ) },
                  { key: "jardin", label: "Jardin", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                      <path d="M12 22a9 9 0 0 0 9-9"/>
                      <path d="M3 13a9 9 0 0 1 9-9"/>
                      <path d="M18 3a6 6 0 0 0-9 9 6 6 0 0 0-9 9"/>
                      <circle cx="12" cy="12" r="1"/>
                    </svg>
                  ) },
                  { key: "parking", label: "Parking", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                      <rect x="3" y="5" width="18" height="14" rx="2"/>
                      <path d="M10 9h4"/>
                      <path d="M12 9v6"/>
                    </svg>
                  ) },
                  { key: "ascenseur", label: "Ascenseur", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M8 12h8"/>
                      <path d="M12 8l4 4"/>
                      <path d="M12 16l-4-4"/>
                    </svg>
                  ) },
                  { key: "cave", label: "Cave", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                      <path d="M2 22v-5l5-5 5 5 5-5 5 5v5"/>
                      <path d="M7 17v5"/>
                      <path d="M17 17v5"/>
                      <path d="M2 12V7l5-5 5 5 5-5 5 5v5"/>
                    </svg>
                  ) },
                  { key: "meuble", label: "Meublé", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-gray-500">
                      <rect x="3" y="10" width="18" height="12" rx="2"/>
                      <path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/>
                    </svg>
                  ) },
                ];
                
                // Créer un tableau des équipements présents manuellement pour déboguer
                const manualFeatures = [];
                
                // Vérifier chaque équipement individuellement
                if (isFeaturePresent(annonce.balcon)) manualFeatures.push(features.find(f => f.key === "balcon")!);
                if (isFeaturePresent(annonce.terrasse)) manualFeatures.push(features.find(f => f.key === "terrasse")!);
                if (isFeaturePresent(annonce.jardin)) manualFeatures.push(features.find(f => f.key === "jardin")!);
                if (isFeaturePresent(annonce.parking)) manualFeatures.push(features.find(f => f.key === "parking")!);
                if (isFeaturePresent(annonce.ascenseur)) manualFeatures.push(features.find(f => f.key === "ascenseur")!);
                if (isFeaturePresent(annonce.cave)) manualFeatures.push(features.find(f => f.key === "cave")!);
                if (isFeaturePresent(annonce.meuble)) manualFeatures.push(features.find(f => f.key === "meuble")!);
                
                console.log("Équipements détectés:", manualFeatures.map(f => f.label));
                
                return manualFeatures.length > 0 ? (
                  manualFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 md:gap-2">
                      {feature.icon}
                      <span className="truncate">{feature.label}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-muted-foreground">Aucun équipement spécifique mentionné</div>
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