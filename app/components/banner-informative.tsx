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
                    <Badge className="mb-2">Gestion Locative</Badge>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold my-4 md:my-8">Vous êtes propriétaire</h1>
                    <p className="w-full md:w-3/4 lg:w-1/2 text-base md:text-lg text-zinc-800 dark:text-zinc-200 my-4 leading-relaxed">
                        Vous recherchez un Administrateur de Biens compétent, disponible, accessible et humain pour gérer vos biens immobiliers. 
                        <span className="block mt-2">Notre équipe assure un service complet et personnalisé suivant vos demandes.</span>
                    </p>
                </>
            ) : (
                <>
                    <Badge className="mb-2">Gestion Propriétaire</Badge>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold my-4 md:my-8">Vous êtes propriétaire</h1>
                    <p className="w-full md:w-3/4 lg:w-1/2 text-base md:text-lg text-zinc-800 dark:text-zinc-200 my-4 leading-relaxed">
                        Vous recherchez un partenaire fiable pour gérer efficacement vos biens immobiliers. 
                        <span className="block mt-2">Notre service est adapté pour répondre à vos besoins spécifiques.</span>
                    </p>
                </>
            )}
        </div>
    );
};

export default BannerInformative;
