"use client";

import { Badge } from "@/components/ui/badge";
import * as React from "react";
import document from "../../public/3.jpg";
import Image from "next/image";
import { Check } from "lucide-react";

const BannerDocument: React.FC = () => {
    return (
        <section className="py-12 px-4 md:px-12 lg:px-24 my-8 mx-4 md:mx-0">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <Badge className="mb-4">Locataire</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Documents à fournir</h2>
                        
                        <div className="space-y-4">
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-[#00408A]" />
                                    <span className="text-gray-600 dark:text-gray-300">Carte d'identité</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-[#00408A]" />
                                    <span className="text-gray-600 dark:text-gray-300">3 derniers bulletins de salaire</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-[#00408A]" />
                                    <span className="text-gray-600 dark:text-gray-300">Dernier avis d'imposition</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-[#00408A]" />
                                    <span className="text-gray-600 dark:text-gray-300">3 dernières quittances de loyer</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-[#00408A]" />
                                    <span className="text-gray-600 dark:text-gray-300">Attestation employeur</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden h-[400px]">
                        <Image 
                            src={document} 
                            alt="Documents pour location"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BannerDocument;