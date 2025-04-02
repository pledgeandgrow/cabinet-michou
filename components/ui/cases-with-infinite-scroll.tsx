"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Badge } from "./badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Euro, Maximize2, BedDouble, Bath, MapPin, Thermometer, Leaf, Building2, Filter } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Annonce = {
  id: number;
  titre: string;
  prix: number | string;
  surface: number;
  nb_pieces: number;
  nb_chambres: number | 'N/C';
  typeLogement: string;
  transaction: string;
  chauffage: string;
  situation: string;
  dpe_conso: string;
  dpe_emission: string;
  sous_type: string;
  photos: Array<{ id: number; url: string }>;
  ville: string;
  code_postal: string;
  reference?: string;
  etage?: string;
  ascenseur?: string;
  balcon?: string;
  terrasse?: string;
  cave?: string;
  parking?: string;
};

const DPE_COLORS: { [key: string]: string } = {
  A: "bg-green-500",
  B: "bg-lime-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  E: "bg-red-500",
  F: "bg-red-700",
  G: "bg-red-900",
};

interface CaseProps {
  items?: Annonce[];
}

export function Case({ items }: CaseProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    transaction: "all",
    type: "all",
  });

  useEffect(() => {
    if (items) {
      setAnnonces(items);
      setFilteredAnnonces(items);
      setIsLoading(false);
    } else {
      const fetchAnnonces = async () => {
        try {
          const response = await fetch('/api/annonces');
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          setAnnonces(data);
          setFilteredAnnonces(data);
        } catch (error) {
          console.error('Error fetching annonces:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnnonces();
    }
  }, [items]);

  useEffect(() => {
    const filtered = annonces.filter(annonce => {
      const matchTransaction = filters.transaction === "all" || annonce.transaction === filters.transaction;
      const matchType = filters.type === "all" || annonce.typeLogement === filters.type;
      return matchTransaction && matchType;
    });
    setFilteredAnnonces(filtered);
  }, [filters, annonces]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-12 px-4 md:px-12 lg:px-24 mt-10 mx-4 md:mx-0">
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse min-w-[300px]">
                <div className="aspect-[4/3] bg-gray-200" />
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredAnnonces.length > 0 ? (
          <>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {filteredAnnonces.map((annonce) => (
                <Link 
                  key={annonce.id} 
                  href={`/annonces/${annonce.id}`}
                  className="min-w-[300px]"
                >
              
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {annonce.photos && annonce.photos.length > 0 ? (
                      <div className="relative">
                        <Carousel className="w-full relative" setApi={setApi}>
                          <CarouselContent>
                            {annonce.photos.map((photo) => (
                              <CarouselItem key={photo.id}>
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                  <Image
                                    src={photo.url}
                                    alt={`Photo ${photo.id} - ${annonce.titre}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute left-2 top-1/3 -translate-y-1/2 h-8 w-8 z-10 bg-white/80 hover:bg-white hover:text-[#00408A] border-white/50 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white hidden md:flex" />
                          <CarouselNext className="absolute right-2 top-1/3 -translate-y-1/2 h-8 w-8 z-10 bg-white/80 hover:bg-white hover:text-[#00408A] border-white/50 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white hidden md:flex" />
                        </Carousel>
                        <Badge className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm bg-[#00408A] hover:bg-white hover:text-[#F6A831] dark:bg-background/90">
                          {annonce.transaction}
                        </Badge>
                        {annonce.reference && (
                          <Badge className="absolute top-4 right-4 z-10 bg-[#00408A] hover:bg-white hover:text-[#F6A831] dark:bg-background/90  backdrop-blur-sm">
                            Réf: {annonce.reference}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="line-clamp-1">{annonce.titre}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {annonce.ville} ({annonce.code_postal})
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4" />
                          <span>
                            {typeof annonce.prix === 'number' ? annonce.prix.toLocaleString() : annonce.prix}{" "}
                            {annonce.transaction === "Location" ? "€/mois" : "€"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Maximize2 className="h-4 w-4" />
                          <span>{annonce.surface} m²</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4" />
                          <span>{annonce.nb_pieces} pièce{annonce.nb_pieces !== 1 ? 's' : ''}</span>
                        </div>
                        {annonce.nb_chambres !== 'N/C' && (
                          <div className="flex items-center gap-2">
                            <Bath className="h-4 w-4" />
                            <span>{annonce.nb_chambres} ch.</span>
                          </div>
                        )}
                      </div>

                      {(annonce.dpe_conso !== 'N/C' || annonce.dpe_emission !== 'N/C') && (
                        <div className="flex gap-2 mt-4">
                          {annonce.dpe_conso !== 'N/C' && (
                            <Badge 
                              variant="secondary" 
                              className={cn(DPE_COLORS[annonce.dpe_conso])}
                            >
                              <Thermometer className="h-4 w-4 mr-1" />
                              DPE {annonce.dpe_conso}
                            </Badge>
                          )}
                          {annonce.dpe_emission !== 'N/C' && (
                            <Badge 
                              variant="secondary" 
                              className={cn(DPE_COLORS[annonce.dpe_emission])}
                            >
                              <Leaf className="h-4 w-4 mr-1" />
                              GES {annonce.dpe_emission}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{annonce.typeLogement}</Badge>
                      {annonce.etage !== 'N/C' && (
                        <Badge variant="outline">
                          {annonce.etage}{annonce.ascenseur === 'Oui' ? ' - Asc.' : ''}
                        </Badge>
                      )}
                      {annonce.balcon === 'Oui' && <Badge variant="outline">Balcon</Badge>}
                      {annonce.terrasse === 'Oui' && <Badge variant="outline">Terrasse</Badge>}
                      {annonce.cave === 'Oui' && <Badge variant="outline">Cave</Badge>}
                      {annonce.parking === 'Oui' && <Badge variant="outline">Parking</Badge>}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>Aucune annonce ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </section>
  );
}
