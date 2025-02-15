import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import image from "../../public/1.jpg";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

function Feature() {
  const sections = [
    {
      title: "Assurer votre gestion financière, fiscale et comptable",
      description: "Nous assurons la tenue de votre comptabilité sur le logiciel ThétraWin et vous adressons à la période de votre choix (mensuel ou trimestriel) un relevé de compte de gérance accompagné de votre règlement , À tout moment, vos comptes sont consultables sur Internet (via notre accès client), Nous vous adressons tous les ans un récapitulatif afin de vous aider à réaliser votre déclaration des revenus fonciers , Nous vous proposons une garantie des loyers impayés, une assurance Propriétaire Non Occupant…"
    },
    {
      title: "Respect de la réglementation",
      description: "Diagnostic, état des lieux, dépôt de garantie, charges récupérables, travaux récupérables, autant d’obligations et de sources de conflit. Le cabinet veille au respect de ces différentes étapes durant la période pendant laquelle nous gérons votre bien."
    },
    {
      title: "Assurer la gestion technique de vos biens",
      description: "Nous assurons pour votre compte les appels d’offre auprès des entreprises, suivons les travaux d’amélioration ou d’entretien afin de maintenir la valeur locative de votre bien et répondre aux obligations règlementaires , Notre équipe a acquis une réelle compétence dans le suivi des travaux dans les immeubles anciens , Nous assurons le suivi des sinistres de tous ordres et engageons les différentes assurances et garanties dont vous bénéficiez."
    },
    {
      title: "Assurer la gestion locative",
      description: "Nous mettons en location votre bien, au prix du marché , Nous nous occupons de votre bien, de l’entrée de vos locataires jusqu’à leur départ , Nous gérons les sinistres, nous réglons vos litiges , Nous entretenons et valorisons votre patrimoine immobilier."
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
                Nos principaux services
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