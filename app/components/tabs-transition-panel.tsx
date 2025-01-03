"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TabsTransitionPanel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const ITEMS = [
    {
      "title": "Dirigeant société",
      "subtitle": "1 responsable",
      "content": "Angélique Mouton-Baboz, diplômée en droit, spécialisée dans la gestion immobilière, supervise la société et le service."
    },
    {
      "title": "Responsable service gérance",
      "subtitle": "1 responsable",
      "content": "Spécialisée dans la gestion d’appartements, de baux commerciaux et de locaux industriels. Au service de nos clients, elle encadre un service de 8 personnes."
    },
    {
      "title": "Gestionnaire",
      "subtitle": "4 gestionnaires",
      "content": "Des collaboratrices spécialisées dans la gestion à la pointe de la réglementation. Interlocutrices privilégiées de nos propriétaires."
    },
    {
      "title": "Assistante gérance",
      "subtitle": "3 assistantes gérance",
      "content": "Des collaboratrices qui répondent au quotidien aux questions diverses et variées des locataires, suivent les prestataires et règlent les soucis du quotidien."
    },
    {
      "title": "Comptable",
      "subtitle": "1 comptable",
      "content": "Compte de gérance, avis d’échéance, régularisation des charges, paiement des factures… et ceci n’est qu’une partie de son univers."
    }
  ]
  ;

  return (
    <div className="w-full my-48 px-6 md:px-12 lg:px-24">
      <div className='mb-4 flex space-x-2'>
        {ITEMS.map((item, index) => (
          <Button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="w-full"
            variant={activeIndex === index ? 'secondary' : 'outline'}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <Separator className="my-4" />
      <div className='transition-opacity duration-500'>
        <Badge className="my-2">{ITEMS[activeIndex].subtitle}</Badge>
        <h2 className='text-5xl font-bold'>{ITEMS[activeIndex].title}</h2>
        <p className='mt-2'>{ITEMS[activeIndex].content}</p>
      </div>
    </div>
  );
}

