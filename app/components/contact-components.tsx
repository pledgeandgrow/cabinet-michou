import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactComponent() {
  return (
    <section className="w-full md:w-1/2 px-4 py-8 md:py-12">
      <div className="w-full mx-auto text-center mb-6">
        <Badge
          variant={"outline"}
          className="mb-2"
        >Services</Badge>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white leading-tight">
          Nous appeler
        </h2>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <ContactItem
              icon="🏠"
              label="Gestion locative"
              number="01 48 87 94 78"
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <ContactItem
              icon="🏢"
              label="Location"
              number="01 40 09 32 44"
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <ContactItem 
              icon="🛒" 
              label="Vente" 
              number="01 48 87 97 30" 
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <ContactItem 
              icon="👥" 
              label="Syndic" 
              number="01 48 87 56 99" 
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <ContactItem
              icon="⚠️"
              label="Service d'urgence"
              number="Numéro disponible sur notre répondeur syndic"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, number }: { icon: string; label: string; number: string }) {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="text-left">
        <p className="text-base md:text-lg font-bold text-[#00408A] dark:text-blue-300">
          {label}
        </p>
        <p className="text-gray-800 font-medium text-sm md:text-base dark:text-gray-200">{number}</p>
      </div>
    </div>
  );
}
