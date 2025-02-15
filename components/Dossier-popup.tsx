import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function DossierPopup() {
  return (
    <section className="container mx-auto">
      <div className="text-center mb-8">
        <Badge variant="outline">Mon Dossier</Badge>
        <h2 className="text-3xl font-extrabold text-black dark:text-white leading-tight">Constituer mon dossier</h2>
        <p className="mt-4 text-gray-600">Nous vous répondrons dans les plus brefs délais</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nom" className="text-sm font-medium text-gray-700">
              Nom
            </label>
            <Input id="nom" />
          </div>

          <div className="space-y-2">
            <label htmlFor="prenom" className="text-sm font-medium text-gray-700">
              Prénom
            </label>
            <Input id="prenom" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-500">
              Email
            </label>
            <Input id="email" type="email" />
          </div>

          <div className="space-y-2">
            <label htmlFor="telephone" className="text-sm font-medium text-gray-500">
              Téléphone
            </label>
            <Input id="telephone" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="objet" className="text-sm font-medium text-gray-500">
            Objet
          </label>
          <Input id="objet" />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-500">
            Message
          </label>
          <Textarea id="message" rows={5} />
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="px-8 py-2">
            envoyer
          </Button>
        </div>
      </form>
    </section>
  )
}

export default DossierPopup

