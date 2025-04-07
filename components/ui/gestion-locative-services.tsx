import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import image from "../../public/1.jpg";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

interface Section {
  title: string;
  description: string;
}

interface FeatureProps {
  sections: Section[];
  title: string;
  badge: string;
}

function Feature({ sections, title, badge }: FeatureProps) {
  return (
    <div className="w-full py-12 md:py-20 lg:py-40">
      <div className="container mx-auto px-12 md:px-24 lg:px-32">
        <div className="grid rounded-lg grid-cols-1 gap-6 md:gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="default">{badge}</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-5xl font-bold lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
                  {title}
                </h2>
              </div>
            </div>
            <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {sections.map((section: Section, index: number) => (
                    <CarouselItem key={index}>
                      <div key={index} className="flex gap-4 flex-col">
                        <div className="flex gap-2 items-center">
                          <Check size={24} className="text-accent" />
                          <h3 className="text-lg font-semibold">{section.title}</h3>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground">{section.description}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-between items-center mt-6">
                  <CarouselPrevious className="relative static md:absolute h-10 w-10 bg-[#00408A] text-white hover:bg-[#003070] border-none shadow-md" />
                  <div className="flex items-center justify-center gap-2 md:hidden">
                    <span className="text-xs text-muted-foreground">Glisser pour voir plus</span>
                  </div>
                  <CarouselNext className="relative static md:absolute h-10 w-10 bg-[#00408A] text-white hover:bg-[#003070] border-none shadow-md" />
                </div>
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