"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "./ui/badge"
import Link from "next/link"
import Image from "next/image"
import React, { useEffect, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

// Interface pour les actualités récupérées depuis l'API
interface Actualite {
  id: number
  titre: string
  contenu: string
  lien?: string
  publie: boolean
  date_creation?: string
}

// Pas besoin de données statiques, les actualités sont récupérées depuis l'API

export default function NewsSections() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [actualites, setActualites] = useState<Actualite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupération des actualités depuis l'API
  useEffect(() => {
    async function fetchActualites() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/actualites")
        if (!response.ok) {
          throw new Error("Failed to fetch actualités")
        }
        const data = await response.json()
        // Filtrer les actualités publiées uniquement
        const publishedActualites = data.filter((item: Actualite) => item.publie)
        setActualites(publishedActualites)
      } catch (err) {
        setError("Une erreur s'est produite lors de la récupération des actualités")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActualites()
  }, [])

  // Gestion du carousel
  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="py-8 md:py-12 px-3 md:px-12 lg:px-24 my-6 md:my-8 mx-3 md:mx-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 md:mb-8">
          <Badge className="mb-2 md:mb-4 bg-[#f6a831] hover:bg-[#f6a831]/90 text-white">ACTUALITÉS</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-gray-900 dark:text-white">Dernières nouvelles</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-start">
          {/* Image section - on desktop it's on the left, on mobile it's below */}
          <div className="relative rounded-xl overflow-hidden shadow-lg order-3 md:order-1 h-[200px] md:h-[400px] mt-4 md:mt-0">
            <Image
              src="https://cabinet-michou.com/images/homepage/actualites.jpg"
              alt="Paris cityscape"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 md:p-6 text-white">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Cabinet R. Michou & Cie</h3>
                <p className="text-xs md:text-base">Votre partenaire immobilier depuis 1952</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            {/* Title is now shown for all screen sizes in the centered section above */}
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-visible relative">
              <Carousel className="w-full" setApi={setApi}>
                <CarouselContent className="px-0">
                  {isLoading ? (
                    <CarouselItem className="px-0">
                      <div className="flex flex-col p-4 md:p-8 rounded-lg text-center">
                        <p>Chargement des actualités...</p>
                      </div>
                    </CarouselItem>
                  ) : error ? (
                    <CarouselItem className="px-0">
                      <div className="flex flex-col p-4 md:p-8 rounded-lg text-center">
                        <p className="text-red-500">{error}</p>
                      </div>
                    </CarouselItem>
                  ) : actualites.length === 0 ? (
                    <CarouselItem className="px-0">
                      <div className="flex flex-col p-4 md:p-8 rounded-lg text-center">
                        <p>Aucune actualité disponible pour le moment.</p>
                      </div>
                    </CarouselItem>
                  ) : (
                    actualites.map((item, index) => (
                      <CarouselItem key={item.id} className="px-0">
                        <div className="flex flex-col py-4 md:py-8 px-10 md:px-12 rounded-lg text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-3">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{item.date_creation ? new Date(item.date_creation).toLocaleDateString('fr-FR') : ''}</span>
                          </div>
                          <h3 className="text-black font-bold text-lg md:text-2xl lg:text-3xl mb-3 md:mb-5 dark:text-white">{item.titre}</h3>
                          <div className="text-gray-600 space-y-1 md:space-y-3 dark:text-gray-200 mb-3 md:mb-4 text-xs md:text-base overflow-x-hidden mx-auto md:mx-0 max-w-[90%] md:max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: item.contenu }} />
                            {item.lien && (
                              <div className="mt-4 flex justify-center md:justify-start">
                                <Link href={item.lien} target="_blank" className={`bg-[#003C7F] hover:bg-[#003C7F]/90 ${buttonVariants({size: "sm"})}`}>En savoir plus</Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                
                {/* Custom navigation arrows that are more visible and positioned on the sides */}
                <div className="absolute left-[-20px] right-[-20px] top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-50 overflow-visible">
                  <Button 
                    onClick={() => api?.scrollPrev()} 
                    size="icon" 
                    className="rounded-full bg-white hover:bg-white text-[#00408A] border border-gray-200 shadow-lg pointer-events-auto h-8 w-8 md:h-10 md:w-10 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
                  </Button>
                  <Button 
                    onClick={() => api?.scrollNext()} 
                    size="icon" 
                    className="rounded-full bg-white hover:bg-white text-[#00408A] border border-gray-200 shadow-lg pointer-events-auto h-8 w-8 md:h-10 md:w-10 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center mt-2 md:mt-4 px-4 md:px-6 pb-3 md:pb-4">
                  <div className="flex gap-1">
                    {actualites.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`h-1.5 md:h-2 rounded-full transition-all ${
                          current === index 
                            ? "bg-[#00408A] w-4 md:w-6" 
                            : "bg-gray-300 dark:bg-gray-600 w-1.5 md:w-2"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
