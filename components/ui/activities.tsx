import Link from "next/link"
import { Badge } from "./badge"
import { Building2, FileText, Key } from "lucide-react"

function Activities() {
  return (
    <div className="flex justify-center flex-col py-6  px-6 md:px-12 lg:px-40">
      <Badge className="mt-12 m-auto mb-4">Nos activités</Badge>
      <h1 className="text-center font-bold text-4xl lg:text-6xl text-gray-900 dark:text-white">
        3 expertises dans <br /> l'immobilier
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="group flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
          <div className="mb-6 p-4 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-400 dark:text-orange-300 transition-transform duration-300 group-hover:scale-110">
            <Building2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">GESTION LOCATIVE</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Composée d'interlocuteurs de confiance, notre équipe de gestion locative assure l'entière gestion de vos
            biens immobiliers, qu'il s'agisse de locaux à usage commercial ou d'habitation.
          </p>
          <Link href={'gestion-locative'} className="mt-auto rounded-lg px-6 py-2 bg-[#00408A]  text-white    transition-colors duration-300">
            En savoir plus
          </Link>
        </div>

        <div className="group flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
          <div className="mb-6 p-4 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-400 dark:text-orange-300 transition-transform duration-300 group-hover:scale-110">
            <Key size={32} />
          </div>
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">VENTE</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Dans le cadre des missions de vente, notre cabinet se charge de visiter et estimer votre bien afin de vous
            accompagner au mieux dans votre projet immobilier.
          </p>
          <Link href={'/vente'} className="mt-auto px-6 py-2 bg-[#00408A]  text-white rounded-lg  transition-colors duration-300">
            En savoir plus
          </Link>
        </div>

        <div className="group flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
          <div className="mb-6 p-4 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-400 dark:text-orange-300 transition-transform duration-300 group-hover:scale-110">
            <FileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">SYNDIC</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Notre équipe de gestion de copropriétés se compose de gestionnaires, assistantes et comptables qui veillent
            au bon fonctionnement quotidien de votre immeuble et l'entretien de ses équipements.
          </p>
          <Link href={'/syndic'} className="mt-auto px-6 py-2 bg-[#00408A]  text-white rounded-lg  transition-colors duration-300">
            En savoir plus
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Activities

