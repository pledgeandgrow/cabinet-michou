import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

function Feature() {
  const sections = [
    {
      title: "Opter pour le prélèvement",
      description: "Il suffit de nous adresser votre demande et votre Relevé d’Identité Bancaire afin que nous vous transmettions l'autorisation Sepa."
    },
    {
      title: "ASSURER LA GESTION TECHNIQUE DE VOS BIENS",
      description: "- un service extranet qui vous permet de récupérer vos avis d’échéance, factures, position de compte,règlement de vos loyers par prélèvement automatique , des collaboratrices qui sont disponibles et accessibles grâce à leurs lignes directes et leurs mails personnels , des baux signés par voie électronique."
    },
    {
      title: "ASSURER LA GESTION LOCATIVE",
      description: "Nous mettons en location votre bien, au prix du marché. Nous nous occupons de votre bien, de l’entrée de vos locataires jusqu’à leur départ. Nous gérons les sinistres, nous réglons vos litiges. Nous entretenons et valorisons votre patrimoine immobilier."
    },
    {
      title: "RESPECT DE LA RÉGLEMENTATION",
      description: "Diagnostic, état des lieux, dépôt de garantie, charges récupérables, travaux récupérables, autant d’obligations et de sources de conflit. Le cabinet veille au respect de ces différentes étapes durant la période pendant laquelle nous gérons votre bien."
    }
  ];  
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid rounded-lg container p-8 grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="default">Propriétaire</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-5xl font-bold lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
                   Un service informatisé

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
          <div className=" rounded-md h-[400px] ">
            <img
              src='https://cabinet-michou.com/images/bandeau2.jpg'
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