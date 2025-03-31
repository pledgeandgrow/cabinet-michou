"use client";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import * as React from "react";
import { TabsTransitionPanel } from "../components/tabs-transition-panel";
import BannerInformative from "../components/banner-informative";
import { Separator } from "@/components/ui/separator";
import BannerDocument from "../components/banner-document";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Feature } from "@/components/ui/gestion-locative-services";

const sectionsOne = [
    {
      title: "Assurer votre gestion financière, fiscale et comptable",
      description: "Nous assurons la tenue de votre comptabilité sur le logiciel Lojii de la société Neoteem et vous adressons à la période de votre choix (mensuel ou trimestriel) un relevé de compte de gérance accompagné de votre règlement , À tout moment, vos comptes sont consultables sur Internet (via notre accès client), Nous vous adressons tous les ans un récapitulatif afin de vous aider à réaliser votre déclaration des revenus fonciers , Nous vous proposons une garantie des loyers impayés, une assurance Propriétaire Non Occupant…"
    },
    {
      title: "Respect de la réglementation",
      description: "Diagnostic, état des lieux, dépôt de garantie, charges récupérables, travaux récupérables, autant d’obligations et de sources de conflit. Le cabinet veille au respect de ces différentes étapes durant la période pendant laquelle nous gérons votre bien."
    },
    {
      title: "Assurer la gestion technique de vos biens",
      description: "Nous assurons pour votre compte les appels d’offre auprès des entreprises, suivons les travaux d’amélioration ou d’entretien afin de maintenir la valeur locative de votre bien et répondre aux obligations règlementaires , Notre équipe a acquis une réelle compétence dans le suivi des travaux dans les immeubles anciens , Nous assurons le suivi des sinistres de tous ordres et engageons les différentes assurances et garanties dont vous bénéficiez."
    },
    {
      title: "Assurer la gestion locative",
      description: "Nous mettons en location votre bien, au prix du marché , Nous nous occupons de votre bien, de l’entrée de vos locataires jusqu’à leur départ , Nous gérons les sinistres, nous réglons vos litiges , Nous entretenons et valorisons votre patrimoine immobilier."
    }
  ];
const sectionsTwo = [
    {
      title: "Optez pour le prélèvement",
      description: "Il suffit de nous adresser votre demande et votre Relevé d’Identité Bancaire afin que nous vous transmettions l'autorisation Sepa."
    },
    {
      title: "De nombreux avantages",
      description: "un service extranet qui vous permet de récupérer vos avis d’échéance, factures, position de compte , règlement de vos loyers par prélèvement automatique , des collaboratrices qui sont disponibles et accessibles grâce à leurs lignes directes et leurs mails personnels , des baux signés par voie électronique."
    },
    {
      title: "Assurer la gestion technique de vos biens",
      description: "Nous assurons pour votre compte les appels d’offre auprès des entreprises, suivons les travaux d’amélioration ou d’entretien afin de maintenir la valeur locative de votre bien et répondre aux obligations règlementaires , Notre équipe a acquis une réelle compétence dans le suivi des travaux dans les immeubles anciens , Nous assurons le suivi des sinistres de tous ordres et engageons les différentes assurances et garanties dont vous bénéficiez."
    },
    {
      title: "Assurer la gestion locative",
      description: "Nous mettons en location votre bien, au prix du marché , Nous nous occupons de votre bien, de l’entrée de vos locataires jusqu’à leur départ , Nous gérons les sinistres, nous réglons vos litiges , Nous entretenons et valorisons votre patrimoine immobilier."
    }
  ];
const GestionLocative: React.FC = () => {
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
                    <Badge className="mt-12 m-auto mb-4">GESTION LOCATIVE</Badge>
                    <h1 className="text-7xl font-bold">Notre équipe</h1>
                </div>
                <TabsTransitionPanel />
            </div>
            <Separator />
            <Feature badge='locataire' title="Nos principaux services" sections={sectionsOne}/>
            <section className="container mx-auto px-4 py-16 md:py-24">
        
           </section>
            <Separator />
            <BannerInformative type="gestion-locative" />
            <BannerDocument />
            <div className="w-full flex justify-center my-24">
           
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative max-w-5xl hidden lg:flex mx-auto h-[410px] rounded-lg overflow-hidden">
            <img
              src="https://cabinet-michou.com/images/gestion/3.jpg"
              alt="Parisian building with fountain"
              className="object-cover w-full h-full"
            />
        </div>
          <div className="space-y-6  py-20 lg:py-40">
          <Badge className="mt-12 m-auto mb-4 ml-6">Locataire</Badge>
          <h3 className="text-black dark:text-white ml-6 text-3xl md:text-4xl lg:text-5xl font-bold">Visite, acceptation dossier et signature du bail  </h3>
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="space-y-6 text-gray-600">

                <p className='text-black dark:text-white'>
                Nous effectuons des visites individuelles, sur rendez-vous, par notre cabinet. Votre dossier fait l’objet d’une étude précise et sérieuse. Nous le transmettons pour accord à notre client.
                Une fois le dossier accepté, nous organisons rapidement votre entrée dans les lieux, procédons à la signature du bail (par voie électronique) et à un état des lieux par une société spécialisée et intègre.
                </p>
                
              </CardContent>
            </Card>
          </div>
        
        </div>
           <Feature badge='locataire' title="Un service informatisé" sections={sectionsTwo}  />

           <div className="flex justify-center items-center">
           <Link className="" href="/annonces" >
                <Button>Voir nos annonces</Button>
            </Link>
           </div>
        </>
    );
}

export default GestionLocative;