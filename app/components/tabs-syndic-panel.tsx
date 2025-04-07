"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const TEAM_ITEMS = [
  {
    "title": "Dirigeant société",
    "subtitle": "1 responsable",
    "content": "Alexandre Baboz, diplômé de l'ESPI et de l'I.C.H, spécialisé dans la gestion de copropriété, supervise la société et le service."
  },
  {
    "title": "Assistantes de copropriété",
    "subtitle": "3 assistants",
    "content": "Des collaboratrices qui répondent au quotidien aux questions diverses et variées des copropriétaires, suivent les prestataires et règlent les soucis du quotidien."
  },
  {
    "title": "Gestionnaire",
    "subtitle": "5 gestionnaires",
    "content": "Des collaborateurs spécialisés dans la gestion des copropriétés. Mobiles, réactifs, attentifs et à votre écoute."
  },
  
  {
    "title": "Comptable",
    "subtitle": "4 comptables",
    "content": "Un service de 4 personnes qui assurent le suivi comptable de votre copropriété, le paiement des factures ainsi que la gestion des gardiens."
  }
];

export function TabsSyndicPanel() {
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
            <Card className="h-full bg-card hover:bg-accent  transition-colors duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="mt-1">
                    {item.subtitle}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className=" flex-grow text-black dark:text-white">
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
