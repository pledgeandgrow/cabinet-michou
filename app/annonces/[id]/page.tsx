import { getAnnonceById, getAnnoncePhotos } from "@/lib/queries";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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

  const photos = await getAnnoncePhotos(params.id);

  const isLocation = annonce.transaction_id === 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {photos.map((photo: Photo, index: number) => (
                <CarouselItem key={photo.id}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={photo.url}
                      alt={`${annonce.nom} - Photo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {photos.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photos.map((photo: Photo, index: number) => (
                <div
                  key={photo.id}
                  className="relative aspect-[4/3] w-20 flex-shrink-0 overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={photo.url}
                    alt={`${annonce.nom} - Miniature ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations principales */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-4">{isLocation ? "Location" : "Vente"}</Badge>
            <h1 className="text-3xl font-bold mb-2">{annonce.nom}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {annonce.ville} ({annonce.cp})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Prix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isLocation ? (
                    <>
                      {annonce.loyer_avec_charges?.toLocaleString() || "N/C"} €/mois
                      {annonce.charges && (
                        <span className="text-sm font-normal block">
                          (dont {annonce.charges} € de charges)
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {annonce.prix_avec_honoraires?.toLocaleString() || "N/C"} €
                      {annonce.honoraires_acheteur && (
                        <span className="text-sm font-normal block">
                          (Honoraires {annonce.honoraires_acheteur}% inclus)
                        </span>
                      )}
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Surface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {annonce.surface} m²
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Caractéristiques */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>
                  {annonce.pieces} pièce{annonce.pieces !== 1 ? "s" : ""}
                </span>
              </div>
              {annonce.chambres && (
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4" />
                  <span>{annonce.chambres} chambre{annonce.chambres !== 1 ? "s" : ""}</span>
                </div>
              )}
              {annonce.etage !== null && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>
                    {annonce.etage}
                    {annonce.nb_etages ? `/${annonce.nb_etages}` : ""}
                    {annonce.ascenseur ? " (avec ascenseur)" : ""}
                  </span>
                </div>
              )}
              {isLocation && annonce.date_dispo && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Disponible le {new Date(annonce.date_dispo).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* DPE */}
          {(annonce.bilan_conso_id || annonce.bilan_emission_id) && (
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic énergétique</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                {annonce.bilan_conso_id && (
                  <Badge 
                    variant="secondary" 
                    className={cn("px-4 py-2", DPE_COLORS[annonce.bilan_conso_id])}
                  >
                    <Thermometer className="h-4 w-4 mr-2" />
                    DPE {annonce.bilan_conso_id} - {annonce.consos} kWh/m²/an
                  </Badge>
                )}
                {annonce.bilan_emission_id && (
                  <Badge 
                    variant="secondary" 
                    className={cn("px-4 py-2", DPE_COLORS[annonce.bilan_emission_id])}
                  >
                    <Leaf className="h-4 w-4 mr-2" />
                    GES {annonce.bilan_emission_id} - {annonce.emissions} kgCO₂/m²/an
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informations complémentaires */}
          {isLocation && (
            <Card>
              <CardHeader>
                <CardTitle>Informations locatives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Dépôt de garantie : {annonce.depot_garantie?.toLocaleString() || "N/C"} €</p>
                <p>Honoraires locataire : {annonce.honoraires_locataire?.toLocaleString() || "N/C"} €</p>
                <p>État des lieux : {annonce.etat_des_lieux?.toLocaleString() || "N/C"} €</p>
                {annonce.encadrement_des_loyers === "OUI" && (
                  <div className="mt-4">
                    <Badge variant="outline" className="mb-2">
                      <Info className="h-4 w-4 mr-2" />
                      Zone soumise à l&apos;encadrement des loyers
                    </Badge>
                    <p className="text-sm text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{annonce.description}</p>
            </CardContent>
          </Card>

          {/* Contact */}
          {/* <div className="flex justify-end gap-4">
            <Button size="lg" variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Organiser une visite
            </Button>
            <Button size="lg">
              Nous contacter
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
