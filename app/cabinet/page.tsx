import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import React from 'react'
import cabinet1 from "@/public/cab1.jpg"
import cabinet2 from "@/public/cab2.jpg"


function CabinetPage() {
  return (
    <div>
       <section className="py-12 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <Badge className="mb-4">Cabinet Michou
                    </Badge>
                    <h1 className="text-5xl font-bold mb-4">
                    Cabinet Michou

                    </h1>
                    <p className="text-lg text-gray-500 mb-4">
                    Spécialiste de l'administration d'immeubles et de biens immobiliers, Cabinet Michou accompagne propriétaires et copropriétaires dans la gestion locative, le syndic de copropriété et les transactions immobilières. Grâce à une expertise pointue et un suivi rigoureux, nous assurons une gestion transparente et optimisée pour valoriser votre patrimoine et garantir votre sérénité.

                    </p>
                    
                </div>
                <div className="flex justify-center">
                <Image
                    src={cabinet1}
                    alt="Cabinet"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                />
                </div>
            </div>
        </section>
       <section className="py-12 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <Image
                    src={cabinet2}
                    alt="Cabinet"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                />
                <div>
                    <Badge className="mb-4">Cabinet Mas Rocher
                    </Badge>
                    <h1 className="text-5xl font-bold mb-4">
                     Cabinet Mas Rocher

                    </h1>
                    <p className="text-lg text-gray-500 mb-4">
                    Le Cabinet Mas Rocher, syndic de copropriété reconnu, gère 84 copropriétés situées aux alentours de Paris 4, représentant un total de 2 433 lots principaux. Fort d'une expérience éprouvée en administration d’immeubles et de biens immobiliers, notre équipe met son savoir-faire au service des propriétaires et copropriétaires pour assurer une gestion efficace, rigoureuse et conforme aux obligations légales.
                    </p>
                  
                </div>
                <div className="flex justify-center">
                
                </div>
            </div>
        </section>
    </div>

  )
}

export default CabinetPage