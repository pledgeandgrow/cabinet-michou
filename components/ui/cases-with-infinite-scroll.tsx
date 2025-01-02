"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "./badge";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { MoveLeft, MoveRight } from "lucide-react";

function Case() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
 
  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 5000);
  }, [api, current]);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
      <Badge className="my-4">Sélection du moment</Badge>
        <div className="flex flex-col gap-10">
          <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
          📢 Nos annonces
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {Array.from({ length: 12 }).map((_, index) => (
                <CarouselItem className="basis-1/4" key={index}>
                  <Card className="w-full shadow-lg">
                    <CardHeader>
                      <CardDescription className="font-medium"><Badge>Appartement</Badge></CardDescription>
                      <CardTitle className="font-thin"><span className="font-bold">Paris</span>, {index}eme</CardTitle>
                    </CardHeader>
                    <div className="h-[500px] bg-gray-200 dark:bg-gray-800"></div>
                    <div className="flex justify-around">
                      <Badge variant={"outline"} className="m-2">à partir de $1200 / mois</Badge>
                      <Badge className="m-2">50m²</Badge>
                      <Badge className="m-2">2 pièces</Badge>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex mt-8 gap-4">
              <MoveLeft 
                onClick={() => api?.scrollPrev(true)}
              />
              <MoveRight
                onClick={() => api?.scrollNext(true)}
              />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export { Case };
