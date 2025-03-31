import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import image from "../../public/1.jpg";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

function Feature({sections,title,badge}:any) {
    
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid rounded-lg container p-8 grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="default">{badge}</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-5xl font-bold lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
                    {title}
                </h2>
              </div>
            </div>
            <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
            <Carousel className="w-full">
            <CarouselContent>
              {sections.map((section, index) => (
                <CarouselItem key={index}>
                  <div key={index} className="flex gap-4 flex-col">
                    <div className="flex gap-2 items-center">
                      <Check size={24} className="text-accent" />
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </CarouselItem>
              ))}
              </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
              </div>
          </div>
          <div className="bg-muted rounded-md aspect-square">
            <img
              src={'/2.jpg'}
              alt="Image"
              className="rounded-md w-full h-full cover-container"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };