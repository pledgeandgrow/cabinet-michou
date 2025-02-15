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
    title: "JEUX OLYMPIQUES- JOURNEE DU 26 JUILLET 2024",
    content: (
      <>
        <p>Chère cliente, cher client,</p>
        <p>
          En raison des conditions de sécurité très strictes prévues par les autorités pour les Jeux Olympiques de Paris
          2024, notre cabinet sera fermé à la réception le vendredi 26 juillet.
        </p>
        <p>Nos collaborateurs resteront joignables sur leurs lignes directes pendant cette journée de fermeture.</p>
        <p>
          A ce titre, nous vous remercions de les contacter sur leurs lignes directes. Vous trouverez leurs coordonnées
          téléphoniques sur vos appels de fonds. Vous pouvez également les joindre via leur mail direct et ils vous
          rappelleront pour traiter votre dossier. Nous vous rappelons également que vous disposez d'un accès client
          depuis notre site extranet où vous pourrez retrouver votre situation de compte ainsi que les coordonnées de
          votre gestionnaire.
        </p>
      </>
    ),
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
        <Link target="_blank" href={'https://www.instagram.com/cabinetmichou'} className={`bg-[#003C7F] hover:bg-[#003C7F]/90 ${buttonVariants()}`}>Cliquez ici</Link>
      </div>
    ),
  },
  {
    title: "Déclaration des biens immobiliers",
    content: (
      <>
        <p>
          une nouvelle obligation déclarative est à réaliser pour l'ensemble des particuliers propriétaires de locaux
          d'habitation.
        </p>
        <p>Celle-ci sera à produire avant le 30 juin 2023.</p>
        <p>
          Lors de la réalisation de cette dernière, il vous sera nécessaire d'y reporter différentes informations. Entre
          autres, la précision d'occupation du local, le type de bail s'il était loué : de facto les informations
          relatives à l'occupant (Nom, Prénom, date de naissance, date de début de la location) ainsi que le montant du
          loyer hors charges (facultatif).
        </p>
        <p>
          Cette démarche est purement déclarative et a pour but d'accompagner l'administration à établir la taxe
          d'habitation sur les résidences secondaires, la taxe sur les locaux vacants (TLV) et la taxe d'habitation sur
          les logements vacants (THLV).
        </p>
      </>
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
                  <h2 className="text-black font-bold text-3xl md:text-4xl mb-6">{item.title}</h2>
                  <div className="text-gray-600 space-y-4">{item.content}</div>
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

