"use client";

import { Badge } from "@/components/ui/badge";
import * as React from "react";
import document from "../../public/3.jpg";
import Image from "next/image";
import { Check } from "lucide-react";

const BannerDocument: React.FC = () => {
    return (
        <div className="w-full flex flex-row my-48 px-6 md:px-12 lg:px-24">
            <div className="w-full ">
                <Badge variant={"default"}>Locataire</Badge>
                <h1 className="text-5xl font-bold my-4">Documents à fournir</h1>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Carte d’identité</span>
                    </li>
                  
                    <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>3 derniers bulletins de salaire</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Dernier avis d’imposition complet</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>3 dernières quittances de loyer (ou copie de l’avis Taxe Foncière si propriétaire)</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Attestation employeur ou copie contrat de travail</span>
                    </li>
                </ul>
            </div>
            <Image 
                src={document} 
                alt="document"
                height={200}
                className="rounded-lg shadow-lg my-4 w-1/2"
            />
            
        </div>
    );
}

export default BannerDocument;