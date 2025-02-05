import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import React from 'react'
import { TabsTransitionPanel } from '../components/tabs-transition-panel'
import { Separator } from '@/components/ui/separator'
import BannerInformative from '../components/banner-informative'
import { Feature } from '@/components/ui/feature'
import BannerDocument from '../components/banner-document'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TabsSyndicPanel } from '../components/tabs-syndic-panel'
import { Card, CardContent } from '@/components/ui/card'

function page() {
  return (

	<>
	<Breadcrumb className="ml-24 mt-12">
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Acceuil</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/gestion-locative">Gestion locative</BreadcrumbLink>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
	<div className="w-full my-24 flex flex-col items-center">
		<div className="w-full m-auto text-center">
			<Badge className="mt-12 m-auto mb-4">Syndic</Badge>
			<h1 className="text-7xl font-bold">Notre équipe</h1>
		</div>
		<TabsSyndicPanel />
	</div>
	<Separator />
	<Feature />
	<Separator />
	<BannerDocument />
	<div className="w-full flex justify-center my-24">
	<Link href="/annonces" >
		<Button>Voir nos annonces</Button>
	</Link>
	
	</div>
	<section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          <h2 className="text-orange-400 font-medium tracking-wide uppercase">Notre savoir-faire</h2>
          <h1 className="text-blue-900 text-4xl md:text-5xl lg:text-6xl font-bold">Gestion de Copropriété</h1>
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="space-y-6 text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
              <p className='text-black dark:text-white'>
                Notre cabinet assure la gestion des syndicats de copropriétaires. En tant que syndic de copropriétés
                nous administrons 160 immeubles, représentant un total de 6000 lots sur Paris. Notre cabinet situé dans
                le 4ème arrondissement est spécialisé dans la gestion des immeubles dans le Marais et dans Paris
                intramuros. Notre métier de syndic s'adresse à des clients cherchant une bonne gestion de leur
                copropriété. Nous sommes facilement joignable et répondons à vos attentes.
              </p>
              <p className='text-black dark:text-muted'>
                Vous cherchez un syndic compétent, disponible et accessible pour gérer votre copropriété le cabinet
                R.MICHOU est là pour répondre à vos demandes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-orange-400 font-medium tracking-wide uppercase">Gestion de copropriété</h2>
            <h3 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold">Notre équipe</h3>
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="space-y-6 text-gray-600">

                <p>
                  L'équipe qui s'occupe de votre immeuble règle rapidement les interventions, s'occupe des sinistres en
                  lien étroit avec l'assureur, organise vos assemblées générales et gère vos travaux. Le cabinet a une
                  compétence particulière pour la gestion des aspects techniques et des travaux de vos immeubles.
                </p>
                <p>
                  Des réunions sont organisées avec le conseil syndical pour le bon suivi de l'immeuble et la bonne
                  préparation de vos assemblées générales.
                </p>
                <p>
                  L'ensemble de la comptabilité de vos immeubles et la gestion des gardiens est assurée en interne par
                  nos collaborateurs.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <img
              src="https://cabinet-michou.com/images/syndic/3.jpg"
              alt="Parisian building with fountain"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>
</>
  )
}

export default page