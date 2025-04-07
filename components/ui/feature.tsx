import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import image from "../../public/1.jpg";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

interface Section {
  title: string;
  description: string;
}

function Feature() {
  const sections: Section[] = [
    {
      title: "",
      description: "Votre cabinet de gestion immobilière offre une gamme complète de services pour assurer le bon fonctionnement de votre copropriété. Voici un aperçu détaillé de vos prestations :"
    },
    {
      title: "GESTION DES INTERVENTIONS ET DES SINISTRES",
      description: "Votre équipe réagit rapidement aux demandes d'intervention, gère les sinistres en étroite collaboration avec l'assureur, organise les assemblées générales et supervise les travaux nécessaires. Cette approche garantit une réactivité optimale et une gestion efficace des incidents."
    },
    {
      title: "REUNION AVEC LE CONSEIL SYNDICAL",
      description: "Des réunions sont organisées avec le conseil syndical pour assurer un suivi rigoureux de l'immeuble et préparer efficacement les assemblées générales. Cette collaboration favorise une communication fluide et une prise de décision éclairée."
    },
    {
      title: "GESTION COMPTABLE",
      description: "L'ensemble de la comptabilité de vos immeubles est assuré en interne par vos collaborateurs. Cette organisation garantit une gestion financière transparente et une coordination optimale entre les services."
    }
  ];  
  return (
    <div className="w-full py-12 md:py-20 lg:py-40">
      <div className="container mx-auto px-12 md:px-24 lg:px-32">
        <div className="grid rounded-lg grid-cols-1 gap-6 md:gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-6 md:gap-10 flex-col">
            <div className="flex gap-3 md:gap-4 flex-col">
              <div>
                <Badge variant="default">Gestion de Copropriété</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter max-w-xl text-left font-regular text-gray-900 dark:text-white">
                  Nos services
                </h2>
              </div>
            </div>
            <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {sections.map((section: Section, index: number) => (
                    <CarouselItem key={index}>
                      <div key={index} className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center">
                          {index !== 0 && <Check size={24} className="text-accent" />}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                        </div>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{section.description}</p>
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
            <Image
              src={image}
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