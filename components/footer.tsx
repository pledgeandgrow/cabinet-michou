import Link from 'next/link'
import Image from 'next/image'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Home,
  Building,
  Users,
  MessageSquare,
  FileText,
  Shield,
  UserCircle,
  Cookie
} from "lucide-react"
import Map from './Map'

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Gestion locative', href: '/gestion-locative', icon: Building2 },
  { name: 'Vente', href: '/vente', icon: Building },
  { name: 'Syndic', href: '/syndic', icon: Users },
  { name: 'Contact', href: '/contact', icon: MessageSquare },
  { name: 'Mentions Légales', href: '/mentions-legales', icon: FileText },
  { name: 'Politique de traitement RGPD', href: 'https://www.declarations-juridiques.fr/processing-policy/cabinet-r-michou-et-cie_562016535', icon: Shield },
  { name: 'Politique de cookies', href: '/politique-cookies', icon: Cookie },
  { name: 'Espace client', href: 'https://michou.neotimm.com/extranet/#/login', icon: UserCircle },
]

const contact = [
  { label: 'Syndic', number: '01 48 87 56 99' },
  { label: 'Gestion locative', number: '01 48 87 94 78' },
  { label: 'Location', number: '01 40 09 32 44' },
  { label: 'Vente', number: '01 48 87 97 30' },
]

export default function Footer() {
  return (
    <div>
      <Map/>
      <footer className="border-t bg-background">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>20, rue Malher - 75004 PARIS</span>
              </div>
              
              <div className="flex items-start space-x-2 text-muted-foreground">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Du lundi au vendredi</span>
              </div>
              
              <Button 
                variant="link" 
                className="h-auto p-0 text-muted-foreground hover:text-primary"
                asChild
              >
                <a href="mailto:cabinet@cabinet-michou.com" className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>cabinet@cabinet-michou.com</span>
                </a>
              </Button>

              <div className="space-y-2">
                {contact.map((item) => (
                  <div key={item.label} className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label} : {item.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-lg font-semibold">Informations légales</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Cabinet R. Michou & Cie</span>
                </p>
                <p>SAS au capital de 120 000,00 €</p>
                <p>RCS Paris : B562016535</p>
                <p>SIRET : 562 016 535 000 22</p>
              </div>
              
              <div className="space-y-2 text-muted-foreground">
                <p className="font-medium text-xs">Cartes professionnelles : CPI 7501 2016 000 013 635</p>
                <p className="text-xs">Garantie CEGC domiciliée 59 Avenue Pierre Mendès 75013 Paris</p>
                <p className="text-xs">RC professionnelle : GENERALI IARD AL591311/00037</p>
                <p className="text-xs">TVA intracommunautaire : FR79562016535</p>
                <p className="text-xs">APE 6832A</p>
                <p className="text-xs">ORIAS, mandataire intermédiaire d'assurance : n* 07001914</p>
              </div>
            </div>

            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h4 className="font-semibold">Partenaire</h4>
              <div className="flex items-center space-x-4">
                <div className="relative w-32 h-16 rounded-md p-2 flex items-center justify-center">
                  <Image 
                    src="/unis-light.png" 
                    alt="Logo UNIS" 
                    fill
                    className="object-contain p-1 dark:hidden"
                  />
                  <Image 
                    src="/unis.png" 
                    alt="Logo UNIS" 
                    fill
                    className="object-contain p-1 hidden dark:block"
                  />
                </div>
                <div className="relative w-32 h-16 rounded-md p-2 flex items-center justify-center">
                  <Image 
                    src="/cgec.png" 
                    alt="Logo CGEC" 
                    fill
                    className="object-contain p-1 dark:hidden"
                  />
                  <Image 
                    src="/cgec.png" 
                    alt="Logo CGEC" 
                    fill
                    className="object-contain p-1 hidden dark:block"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Nous sommes membres de l'U.N.I.S (Union des Syndicats de l'Immobilier) 
                  et bénéficions de la garantie financière de la CEGC.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          {new Date().getFullYear()} Cabinet R. Michou & Cie. Tous droits réservés.
        </div>
      </div>
    </footer>
    </div>
  )
}
