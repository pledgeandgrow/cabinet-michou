"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const TEAM_ITEMS = [
  {
    "title": "Dirigeant société",
    "subtitle": "1 responsable",
    "content": "Angélique Mouton-Baboz, diplômée en droit, spécialisée dans la gestion immobilière, supervise la société et le service."
  },
  {
    "title": "Responsable service gérance",
    "subtitle": "1 responsable",
    "content": "Spécialisée dans la gestion d'appartements, de baux commerciaux et de locaux industriels. Au service de nos clients, elle encadre un service de 8 personnes."
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
    "content": "Compte de gérance, avis d'échéance, régularisation des charges, paiement des factures… et ceci n'est qu'une partie de son univers."
  }
];

export function TabsTransitionPanel() {
  return (
    <div className="w-full py-24 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_ITEMS.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className="h-full bg-card hover:bg-accent transition-colors duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="mt-1">
                    {item.subtitle}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground flex-grow">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
