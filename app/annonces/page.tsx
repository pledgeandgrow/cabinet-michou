"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Euro, Maximize2, BedDouble, Bath, MapPin, Thermometer, Leaf, Building2, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Annonce = {
  id: number;
  titre: string;
  reference: string;
  prix: number;
  surface: number;
  nb_pieces: number;
  nb_chambres: number;
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
  description: string;
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

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    transaction: "all",
    type: "all",
    minPrix: "",
    maxPrix: "",
    minSurface: "",
    maxSurface: "",
    nbPieces: "all",
  });

  // Référence pour savoir si c'est le premier rendu
  const isFirstRender = React.useRef(true);
  
  // Effet pour initialiser les filtres à partir de l'URL au chargement initial
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log('Paramètres URL au chargement:', Object.fromEntries(searchParams.entries()));
    
    const urlFilters = {
      transaction: searchParams.get('transaction') || 'all',
      type: searchParams.get('type') || 'all',
      minPrix: searchParams.get('minPrix') || '',
      maxPrix: searchParams.get('maxPrix') || '',
      minSurface: searchParams.get('minSurface') || '',
      maxSurface: searchParams.get('maxSurface') || '',
      nbPieces: searchParams.get('nbPieces') || 'all',
    };
    
    console.log('Initialisation des filtres avec:', urlFilters);
    setFilters(urlFilters);
    
    // Ajouter un écouteur d'événements pour les changements d'URL
    const handleUrlChange = () => {
      const newSearchParams = new URLSearchParams(window.location.search);
      const newUrlFilters = {
        transaction: newSearchParams.get('transaction') || 'all',
        type: newSearchParams.get('type') || 'all',
        minPrix: newSearchParams.get('minPrix') || '',
        maxPrix: newSearchParams.get('maxPrix') || '',
        minSurface: newSearchParams.get('minSurface') || '',
        maxSurface: newSearchParams.get('maxSurface') || '',
        nbPieces: newSearchParams.get('nbPieces') || 'all',
      };
      console.log('Changement d\'URL détecté, nouveaux filtres:', newUrlFilters);
      setFilters(newUrlFilters);
    };

    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Effet pour mettre à jour l'URL lorsque les filtres changent (mais pas au premier rendu)
  useEffect(() => {
    // Ne pas mettre à jour l'URL lors du premier rendu
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const searchParams = new URLSearchParams();
    if (filters.transaction !== 'all') searchParams.set('transaction', filters.transaction);
    if (filters.type !== 'all') searchParams.set('type', filters.type);
    if (filters.minPrix) searchParams.set('minPrix', filters.minPrix);
    if (filters.maxPrix) searchParams.set('maxPrix', filters.maxPrix);
    if (filters.minSurface) searchParams.set('minSurface', filters.minSurface);
    if (filters.maxSurface) searchParams.set('maxSurface', filters.maxSurface);
    if (filters.nbPieces !== 'all') searchParams.set('nbPieces', filters.nbPieces);

    const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    console.log('Mise à jour de l\'URL avec les filtres:', filters);
    window.history.pushState({}, '', newUrl);
  }, [filters]);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const response = await fetch('/api/annonces');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setAnnonces(data);
        
        console.log('Filtres actuels:', filters);
        console.log('Nombre d\'annonces récupérées:', data.length);
        
        // Appliquer les filtres immédiatement
        const filtered = data.filter((annonce: any) => {
          // Rendre la comparaison insensible à la casse
          const matchTransaction = filters.transaction === "all" || 
                                  annonce.transaction.toLowerCase() === filters.transaction.toLowerCase();
          
          const matchType = filters.type === "all" || annonce.typeLogement === filters.type;
          const matchPrix = (!filters.minPrix || annonce.prix >= Number(filters.minPrix)) &&
                         (!filters.maxPrix || annonce.prix <= Number(filters.maxPrix));
          const matchSurface = (!filters.minSurface || annonce.surface >= Number(filters.minSurface)) &&
                            (!filters.maxSurface || annonce.surface <= Number(filters.maxSurface));
          const matchPieces = filters.nbPieces === "all" || annonce.nb_pieces === Number(filters.nbPieces);
          
          return matchTransaction && matchType && matchPrix && matchSurface && matchPieces;
        });
        
        setFilteredAnnonces(filtered);
      } catch (error) {
        console.error('Error fetching annonces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnonces();
  }, [filters]);

  // L'effet de filtrage est maintenant intégré dans fetchAnnonces

  const uniqueTypes = [...new Set(annonces.map(a => a.typeLogement))];
  const uniqueTransactions = [...new Set(annonces.map(a => a.transaction))];
  const uniquePieces = [...new Set(annonces.map(a => a.nb_pieces))].sort((a, b) => a - b);

  const resetFilters = () => {
    setFilters({
      transaction: "all",
      type: "all",
      minPrix: "",
      maxPrix: "",
      minSurface: "",
      maxSurface: "",
      nbPieces: "all",
    });
  };
  const numberToWords = (num: number) => {
    const words = [
      "A", "B", "C", "D", "E", "F", "G", "H"
    ];
    return words[num - 1]; // Convert number to corresponding word
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-[180px]" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Nos biens immobiliers</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <Select
              value={filters.transaction}
              onValueChange={(value) => setFilters(prev => ({ ...prev, transaction: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les transactions</SelectItem>
                {uniqueTransactions.map(transaction => (
                  <SelectItem key={transaction} value={transaction}>
                    {transaction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de bien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.nbPieces}
              onValueChange={(value) => setFilters(prev => ({ ...prev, nbPieces: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Nombre de pièces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les pièces</SelectItem>
                {uniquePieces.map(pieces => (
                  <SelectItem key={pieces} value={pieces.toString()}>
                    {pieces} pièce{pieces > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Prix min"
                className="w-[120px] h-10 px-3 rounded-md border"
                value={filters.minPrix}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrix: e.target.value }))}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Prix max"
                className="w-[120px] h-10 px-3 rounded-md border"
                value={filters.maxPrix}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrix: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Surface min"
                className="w-[120px] h-10 px-3 rounded-md border"
                value={filters.minSurface}
                onChange={(e) => setFilters(prev => ({ ...prev, minSurface: e.target.value }))}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Surface max"
                className="w-[120px] h-10 px-3 rounded-md border"
                value={filters.maxSurface}
                onChange={(e) => setFilters(prev => ({ ...prev, maxSurface: e.target.value }))}
              />
            </div>

            {(filters.transaction !== "all" || 
              filters.type !== "all" || 
              filters.nbPieces !== "all" || 
              filters.minPrix || 
              filters.maxPrix || 
              filters.minSurface || 
              filters.maxSurface) && (
              <Button variant="ghost" onClick={resetFilters} size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnonces.map((annonce) => (
            <Link href={`/annonces/${annonce.id}`} key={annonce.id}>
              <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
                <CardHeader className="p-0 relative aspect-[4/3]">
                  {annonce.photos?.[0] ? (
                    // N'afficher que la première photo (principale)
                    <Image
                      key={annonce.photos[0].id}
                      src={annonce.photos[0].url}
                      alt={annonce.titre}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge className="absolute top-4 bg-[#00408A] hover:bg-white hover:text-[#F6A831] dark:bg-background/90 left-4  backdrop-blur-sm">
                    {annonce.transaction}
                  </Badge>
                  {annonce.dpe_conso && (
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "bg-background/90 backdrop-blur-sm",
                          DPE_COLORS[annonce.dpe_conso]
                        )}
                      >
                        <Thermometer className="h-4 w-4 mr-1" />
                        DPE {numberToWords(parseInt(annonce.dpe_conso) || 0)}
                      </Badge>
                      {annonce.dpe_emission && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "bg-background/90 backdrop-blur-sm",
                            DPE_COLORS[annonce.dpe_emission]
                          )}
                        >
                          <Leaf className="h-4 w-4 mr-1" />
                          GES {numberToWords(parseInt(annonce.dpe_emission) || 0)}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg mb-1">{annonce.reference || "Réf. non disponible"}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {annonce.ville} ({annonce.code_postal})
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {annonce.typeLogement}
                    </Badge>
                  </div>
                  <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {annonce.description}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    <span>{(annonce.prix || 0).toLocaleString()} {annonce.transaction === "Location" ? "€/mois" : "€"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4" />
                    <span>{annonce.surface} m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    <span>{annonce.nb_pieces} pièce{annonce.nb_pieces > 1 ? 's' : ''}</span>
                  </div>
                  {annonce.nb_chambres > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4" />
                      <span>{annonce.nb_chambres} ch.</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {filteredAnnonces.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Aucun bien ne correspond à vos critères</h3>
            <p className="text-muted-foreground">Essayez de modifier vos filtres pour voir plus de résultats</p>
          </div>
        )}
      </div>
    </div>
  );
}
