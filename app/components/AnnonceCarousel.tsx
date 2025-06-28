"use client"

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Photo {
  id: number;
  url: string;
}

interface AnnonceCarouselProps {
  photos: Photo[];
  annonceName: string;
}

export default function AnnonceCarousel({ photos, annonceName }: AnnonceCarouselProps) {

  return (
    <div className="space-y-2 md:space-y-4 mb-11">
      <Carousel className="w-full">
        <CarouselContent>
          {photos.map((photo: Photo, index: number) => (
            <CarouselItem key={photo.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={photo.url}
                  alt={`${annonceName} - Photo`}
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
            <CarouselPrevious className="left-2 h-8 w-8 md:h-10 md:w-10" />
            <CarouselNext className="right-2 h-8 w-8 md:h-10 md:w-10" />
          </>
        )}
      </Carousel>
      {photos.length > 1 && (
        <div className="flex gap-1 md:gap-2 overflow-x-auto pb-1 snap-x scrollbar-thin">
          {photos.map((photo: Photo, index: number) => (
            <div
              key={photo.id}
              className="relative aspect-[4/3] w-14 md:w-20 flex-shrink-0 overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity snap-start"
            >
              <Image
                src={photo.url}
                alt={`${annonceName} - Miniature ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50px, 80px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
