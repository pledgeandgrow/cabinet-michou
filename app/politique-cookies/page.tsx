import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Politique de Cookies | Cabinet R. Michou & Cie",
  description: "Politique de cookies du Cabinet R. Michou & Cie - Informations sur l'utilisation des cookies sur notre site web.",
}

export default function PolitiqueCookies() {
  return (
    <div className="container px-5 py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Politique de Cookies</h1>
      
      <div className="grid gap-6">
        {/* Définition des cookies */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Qu'est-ce qu'un cookie ?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou téléphone mobile) 
                lors de la visite d'un site web. Il permet au site de vous reconnaître, de mémoriser vos préférences et 
                de vous proposer un contenu adapté.
              </p>
              <p>
                Les cookies sont gérés par votre navigateur internet et seul l'émetteur d'un cookie peut lire ou 
                modifier les informations qui y sont contenues.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Types de cookies */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Les types de cookies que nous utilisons</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="font-medium text-foreground">Cookies strictement nécessaires</p>
              <p>
                Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés. 
                Ils ne contiennent aucune information personnelle identifiable.
              </p>
              
              <Separator className="my-4" />
              
              <p className="font-medium text-foreground">Cookies analytiques/de performance</p>
              <p>
                Ces cookies nous permettent de comptabiliser les visites et les sources de trafic afin d'évaluer 
                et d'améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont les plus 
                et les moins populaires et à voir comment les visiteurs se déplacent sur le site.
              </p>
              
              <Separator className="my-4" />
              
              <p className="font-medium text-foreground">Cookies de fonctionnalité</p>
              <p>
                Ces cookies permettent d'améliorer la fonctionnalité et la personnalisation de notre site. Ils peuvent 
                être définis par nous ou par des fournisseurs tiers dont nous avons ajouté les services à nos pages.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gestion des cookies */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Comment gérer vos cookies</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut également être 
                paramétré pour vous signaler les cookies qui sont déposés dans votre terminal et vous demander de les 
                accepter ou non.
              </p>
              <p>
                Vous pouvez accepter ou refuser les cookies au cas par cas ou bien les refuser systématiquement. 
                Nous vous rappelons que le paramétrage est susceptible de modifier vos conditions d'accès à nos 
                services nécessitant l'utilisation de cookies.
              </p>
              <p>
                Pour la gestion des cookies et de vos choix, la configuration de chaque navigateur est différente. 
                Elle est décrite dans le menu d'aide de votre navigateur :
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Pour Chrome : <a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Gérer les cookies dans Chrome</a></li>
                <li>Pour Firefox : <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Paramètres de confidentialité dans Firefox</a></li>
                <li>Pour Safari : <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Gérer les cookies dans Safari</a></li>
                <li>Pour Edge : <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Gérer les cookies dans Edge</a></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Mise à jour */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Mise à jour de notre politique de cookies</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Nous nous réservons le droit de modifier cette politique de cookies à tout moment. Nous vous 
                encourageons à consulter régulièrement cette page pour prendre connaissance des modifications 
                et des nouvelles versions.
              </p>
              <p>
                Dernière mise à jour : Avril 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
