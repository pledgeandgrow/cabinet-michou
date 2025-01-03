"use client";

import { Badge } from "@/components/ui/badge";
import * as React from "react";

interface BannerInformativeProps {
    type: "gestion-locative" | "gestion-proprio";
}

const BannerInformative: React.FC<BannerInformativeProps> = ({ type }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center text-center py-12 px-6 md:px-12 lg:px-24">
            {type === "gestion-locative" ? (
                <>
                    <Badge>Gestion Locative</Badge>
                    <h1 className="text-5xl font-bold my-8">Vous êtes propriétaire</h1>
                    <p className="w-1/2 text-zinc-800 dark:text-zinc-200 my-4">
                        Vous recherchez un Administrateur de Biens compétent, disponible, accessible et humain pour gérer vos biens immobiliers. 
                        Notre équipe assure un service complet et personnalisé suivant vos demandes.
                    </p>
                </>
            ) : (
                <>
                    <Badge>Gestion Propriétaire</Badge>
                    <h1 className="text-5xl font-bold my-8">Vous êtes propriétaire</h1>
                    <p className="w-1/2 text-zinc-800 dark:text-zinc-200 my-4">
                        Vous recherchez un partenaire fiable pour gérer efficacement vos biens immobiliers. 
                        Notre service est adapté pour répondre à vos besoins spécifiques.
                    </p>
                </>
            )}
        </div>
    );
};

export default BannerInformative;
