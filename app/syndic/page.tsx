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
				<BreadcrumbLink href="/">Accueil</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/syndic">Syndic</BreadcrumbLink>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
	<div className="w-full my-24 flex flex-col items-center">
		<div className="w-full m-auto text-center">
			<Badge className="mt-12 m-auto mb-4">Syndic</Badge>
			<h1 className="text-7xl font-bold text-black dark:text-white">Notre équipe</h1>
		</div>
		<TabsSyndicPanel />
	</div>
	<Separator />
	
	<section className="container mx-auto px-12 md:px-24 lg:px-32 py-16 md:py-24">
        <div className="text-center space-y-6">
         <Badge className="mt-12 m-auto mb-4">Notre Savoir-Faire</Badge>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Notre expertise à votre service pour la gestion de copropriétés à Paris</h1>
          <div className="max-w-3xl mx-auto space-y-6 text-gray-600 dark:text-gray-300">
            <p className="text-base md:text-lg">
              Situé dans le cœur du 4ème arrondissement, notre cabinet se spécialise dans la gestion des syndicats de copropriétaires, en particulier dans les quartiers du Marais et dans Paris intramuros. Avec une expérience solide dans l'administration de plus de 160 immeubles représentant plus de 6000 lots, nous mettons à votre disposition notre savoir-faire pour assurer la gestion optimale de votre copropriété.
            </p>
            <p className="text-base md:text-lg">
              Notre priorité ? Vous offrir une gestion transparente, réactive et adaptée à vos besoins. Nous restons facilement joignables et nous répondons rapidement à toutes vos demandes, avec une attention particulière à la satisfaction de nos clients.
            </p>
            <p className="text-base md:text-lg">
              Confiez-nous la gestion de votre bien en toute sérénité, nous nous occupons de tout.
            </p>
          </div>
        </div>
      </section>

      <Separator />
      <Feature />
	</>
  )
}

export default page