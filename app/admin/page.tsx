
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { getSession } from "../actions"
import { useRouter } from "next/router"

export default async function BackOfficeWelcome() {
  
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="text-center mb-12">
        <p className="text-amber-500 font-medium mb-2">BACK OFFICE</p>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900">Bienvenue</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/actus">
          <Card className="overflow-hidden h-64 transition-transform hover:scale-[1.02]">
            <CardContent className="p-0 h-full relative">
              <Image
                src="https://images.pexels.com/photos/242492/pexels-photo-242492.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Paris cityscape"
                width={600}
                height={300}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-2xl md:text-3xl font-bold">Gestion des actualités</h2>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/annonces">
          <Card className="overflow-hidden h-64 transition-transform hover:scale-[1.02]">
            <CardContent className="p-0 h-full relative">
              <Image
                src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Modern living room"
                width={600}
                height={300}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-2xl md:text-3xl font-bold">Gestion des annonces</h2>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

