import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building, Home, Landmark } from "lucide-react"

const activities = [
  {
    title: "Gestion locative",
    description: "Nous gérons tous types de biens immobiliers pour les propriétaires bailleurs.",
    icon: <Home className="h-8 w-8 text-[#00408A]" />,
    link: "/gestion-locative"
  },
  {
    title: "Syndic de copropriété",
    description: "Nous assurons la gestion administrative, comptable et technique de votre copropriété.",
    icon: <Building className="h-8 w-8 text-[#00408A]" />,
    link: "/syndic"
  },
  {
    title: "Transaction immobilière",
    description: "Nous vous accompagnons dans l'achat ou la vente de votre bien immobilier.",
    icon: <Landmark className="h-8 w-8 text-[#00408A]" />,
    link: "/vente"
  }
]

export default function Activities() {
  return (
    <section className="py-12 px-4 md:px-12 lg:px-24 my-8 mx-4 md:mx-0">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Badge className="mb-4">NOS ACTIVITÉS</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-black dark:text-white">
            3 expertises dans l'immobilier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {activities.map((activity, index) => (
            <Link href={activity.link} key={index} className="block">
              <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group h-full">
                <CardHeader className="pb-2 flex flex-col items-center text-center">
                  <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-black dark:text-white">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300 min-h-[60px] text-center">
                    {activity.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-[#00408A] text-black hover:bg-[#00408A] hover:text-white dark:border-blue-400 dark:text-white dark:hover:bg-blue-800">
                    En savoir plus
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
