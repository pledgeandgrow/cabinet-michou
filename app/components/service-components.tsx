import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ServicesComponent() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="text-center mb-8">
        <Badge className="text-sm px-4 py-2 bg-blue-100 text-blue-800 font-semibold animate-pulse">
          CONTACTEZ-NOUS
        </Badge>
        <h2 className="text-3xl font-extrabold text-blue-800 mt-4">
          Votre message
        </h2>
      </div>

      <form className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Input
          type="text"
          id="firstName"
          placeholder="Nom"
          className="col-span-1 border border-gray-300 rounded-lg p-4 shadow-sm"
        />
        <Input
          type="text"
          id="lastName"
          placeholder="Prénom"
          className="col-span-1 border border-gray-300 rounded-lg p-4 shadow-sm"
        />
        <Input
          type="email"
          id="email"
          placeholder="Adresse e-mail"
          className="col-span-1 border border-gray-300 rounded-lg p-4 shadow-sm"
        />
        <Input
          type="tel"
          id="telephone"
          placeholder="Téléphone"
          className="col-span-1 border border-gray-300 rounded-lg p-4 shadow-sm"
        />
        <Input
          type="text"
          id="objet"
          placeholder="Objet"
          className="col-span-2 border border-gray-300 p-4 rounded-lg"
        />
        <Input
          type="text"
          id="message"
          placeholder="Votre message"
          className="col-span-2 border border-gray-300 p-4 h-32 rounded-lg shadow-sm"
        />

        <Progress value={30} className="col-span-2 mx-auto w-full" />
        <Button className="bg-blue-800 text-white col-span-2 w-40 mx-auto py-2 rounded-lg hover:bg-orange-400">
          Envoyer
        </Button>
      </form>
    </section>
  );
}
