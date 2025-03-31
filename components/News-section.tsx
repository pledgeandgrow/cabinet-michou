import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "./ui/badge"
import Link from "next/link"

const newsItems = [
  {
    title: "Good Loc",
    content:
      "Afin de certifier vos locataires, le cabinet Michou s'engage auprès de Good loc de Verlingue, votre garantie loyer impayée",
  },
  
  {
    title: "Pour des vacances sereines",
    content: (
      <>
        <p>
          En ce début de période estivale, nous vous adressons quelques informations qui sauront contribuer à votre
          sérénité et celle de votre copropriété.
        </p>
        <p>
          Notre cabinet reste ouvert aux horaires habituels, assurant le maintien des prestations au service de la
          gestion de votre résidence (en dehors des week-end et jours fériés).
        </p>
        <p>Nous vous rappelons que vous trouverez sur notre répondeur le N° d'urgence en cas de grave sinistre.</p>
        <p>
          N'oubliez pas si cela n'est pas déjà fait de renseigner ou actualiser votre numéro de téléphone portable et
          mail via votre espace client. En effet, de simples dégâts des eaux peuvent se transformer en catastrophe du
          fait de l'impossibilité de vous joindre et prenez soin de laisser un jeu de clés chez un de vos voisins ou ami
          de confiance...
        </p>
        <p>Nous vous souhaitons de bonnes vacances</p>
      </>
    ),
  },
  {
    title: "Retrouvez-nous sur Instagram",
    content: (
      <div className="flex flex-col items-start gap-4">
        <p>Tous nos derniers posts</p>
        <Link target="_blank" href={'https://www.instagram.com/cabinetrmichou'} className={`bg-[#003C7F] hover:bg-[#003C7F]/90 ${buttonVariants()}`}>Cliquez ici</Link>
      </div>
    ),
  },
  
]

export default function NewsSections() {
  return (
    <div className="container mx-auto  py-12 px-6 md:px-12 lg:px-24">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="relative">
          <img
            src="https://cabinet-michou.com/images/homepage/actualites.jpg"
            alt="Paris cityscape"
            className="w-full h-auto rounded-lg"
          />
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {newsItems.map((item, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col">
                  <div className="mb-6">
                    <Badge className="">ACTUALITÉS</Badge>
                  </div>
                  <h2 className="text-black font-bold text-3xl md:text-4xl mb-6 dark:text-white">{item.title}</h2>
                  <div className="text-gray-600 space-y-4 dark:text-white">{item.content}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex gap-4 mt-8">
            <CarouselPrevious className="relative static left-0 right-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative static left-0 right-0 translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}

