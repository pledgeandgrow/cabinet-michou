"use client";

import * as React from "react";
import Image from "next/image";
import cabinet from "@/public/cabinet.jpg"
import { Badge } from "@/components/ui/badge";

const Presentation: React.FC = () => {
    return (
        <section className="py-12 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <Badge className="mb-4">Le cabinet</Badge>
                    <h1 className="text-4xl font-medium mb-4">
                        Présent à Paris depuis 1952
                    </h1>
                    <p className="text-lg text-gray-500 mb-4">
                        Installé dans le Marais depuis 1952, le cabinet Michou assure aujourd’hui la gestion de plus de 200 copropriétés dans le centre de Paris et compte plus de 1500 lots en gestion locative.
                    </p>
                    <p className="text-lg text-gray-500 mb-4">
                        Notre cabinet, réputé pour son caractère familial, vous accompagne dans les différents domaines de la gestion immobilière autour de deux grandes activités : la gestion de copropriétés et la gestion locative et transaction.
                    </p>
                    <p className="text-lg text-gray-500">
                        La gestion du cabinet est assurée par Angélique Mouton et Alexandre Baboz, accompagnés de leurs collaborateurs qui sont à votre disposition pour vous renseigner et vous épauler au quotidien.
                    </p>
                </div>
                <div className="flex justify-center">
                <Image
                    src={cabinet}
                    alt="Cabinet"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                />
                </div>
            </div>
        </section>
    );
}

export default Presentation;