import { Metadata } from "next";
import { getVenteAnnonces } from "@/lib/queries";
import { Case } from "@/components/ui/cases-with-infinite-scroll";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Nos ventes",
  description: "Découvrez tous nos biens à vendre",
};

export default async function VentePage() {

 

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="ml-0 md:ml-24 mt-6 md:mt-12">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Acceuil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vente">Vente</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto">
          <div className="w-full m-auto text-center">
            <Badge className="mt-8 md:mt-12 m-auto mb-4">Vente</Badge>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold">Un service complet et personnalisé</h1>
          </div>    
          
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
            Plus qu'une simple recherche de personnes ou de biens, vous y retrouverez un service complet et personnalisé
            en fonction de vos besoins pour vous assurer :
          </p>
        </div>

        <Card className="mt-8 md:mt-12 border-none shadow-none">
          <CardContent className="space-y-4 md:space-y-6">
            <ul className="space-y-3 md:space-y-4 flex flex-col items-start md:items-center text-black dark:text-white">
              <li className="flex flex-col md:flex-row md:gap-2">
                <span className="font-semibold">- Une compétence</span>
                <span>dans l'évaluation de la valeur de votre bien</span>
              </li>
              <li className="flex flex-col md:flex-row md:gap-2">
                <span className="font-semibold">- La tranquilité</span>
                <span>grâce à une prise en charge de chaque étape de la transaction</span>
              </li>
              <li className="flex flex-col md:flex-row md:gap-2">
                <span className="font-semibold">- La sécurité</span>
                <span>grâce à une étude précise des capacités financières des clients acquéreurs et/ou locataire</span>
              </li>
              <li className="flex flex-col md:flex-row md:gap-2">
                <span className="font-semibold">- L'information</span>
                <span>en restant en permanence à votre écoute</span>
              </li>
              <li className="flex flex-col md:flex-row md:gap-2">
                <span className="font-semibold">- Le suivi</span>
                <span>en représentant vos intérêts tout au long de notre partenariat</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="relative h-[300px] md:h-[400px] lg:h-[540px] rounded-lg overflow-hidden">
            <img
              src="https://cabinet-michou.com/images/bandeau2.jpg"
              alt="Historic Parisian architecture"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <Badge>Vente</Badge>
              <h3 className="text-black dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold">Notre savoir-faire</h3>
            </div>

            <Card className="border-none shadow-none pt-4 md:pt-11">
              <CardContent>
                <ul className="space-y-3 md:space-y-6 text-black dark:text-white pl-5">
                  <li className="list-disc">Estimation du prix de vente du bien</li>
                  <li className="list-disc">Information du propriétaire</li>
                  <li className="list-disc">Mise en publicité de votre bien</li>
                  <li className="list-disc">Organisation et réalisation des visites</li>
                  <li className="list-disc">
                    Coordination pendant le processus de vente entre les différents interlocuteurs : vendeur/acquéreur,
                    notaires, confrères Syndic
                  </li>
                  <li className="list-disc">
                    Demande et suivi des diagnostiques techniques via une entreprise extérieure
                  </li>
                  <li className="list-disc">
                    Négociation
                  </li>
                  <li className="list-disc">
                    Accompagnement jusqu'à la signature de l'acte définitif
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
