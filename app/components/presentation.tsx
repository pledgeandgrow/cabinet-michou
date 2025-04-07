"use client";

import * as React from "react";
import Image from "next/image";
import cabinet from "@/public/cabinet.jpg"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Presentation: React.FC = () => {
    return (
        <section className="py-12 px-4 md:px-12 lg:px-24 my-8 mx-4 md:mx-0">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1">
                    <Badge className="mb-4">LE CABINET</Badge>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        Présent à Paris depuis 1952
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4">
                        Installé dans le Marais depuis 1952, le cabinet Michou assure aujourd'hui la gestion de plus de 200 copropriétés dans le centre de Paris et compte plus de 1500 lots en gestion locative.
                    </p>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4">
                        Notre cabinet, réputé pour son caractère familial, vous accompagne dans les différents domaines de la gestion immobilière autour de deux grandes activités : la gestion de copropriétés et la gestion locative et transaction.
                    </p>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
                        La gestion du cabinet est assurée par Angélique Mouton et Alexandre Baboz, accompagnés de leurs collaborateurs qui sont à votre disposition pour vous renseigner et vous épauler au quotidien.
                    </p>
                </div>
                <div className="flex justify-center order-1 md:order-2 mb-6 md:mb-0">
                    <div className="relative w-full max-w-md h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
                        <Image
                            src={cabinet}
                            alt="Cabinet R. Michou & Cie"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Presentation;