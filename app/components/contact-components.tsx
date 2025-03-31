import { Badge } from "@/components/ui/badge";

export default function ContactComponent() {
  return (
    <section className="px-6 py-12">
      <div className="w-full mx-auto text-center">
        <Badge
          variant={"outline"}
        >Services</Badge>
        <h2 className="text-3xl font-extrabold text-black dark:text-white leading-tight">
          Nous appeler
        </h2>
      </div>

      <div className="mt-8 space-y-4 max-w-xl mx-auto">
        <ContactItem
          icon="🏠"
          label="Gestion locative"
          number="01 48 87 94 78"
        />
        <ContactItem
          icon="🏢"
          label="Location"
          number="01 40 09 32 44"
        />
        <ContactItem icon="🛒" label="Vente" number="01 48 87 97 30" />
        <ContactItem icon="👥" label="Syndic" number="01 48 87 56 99" />
        <ContactItem
          icon="⚠️"
          label="Service d'urgence"
          number="Numéro disponible sur notre répondeur syndic"
        />
      </div>
    </section>
  );
}

function ContactItem({ icon, label, number }: { icon: string; label: string; number: string }) {
  return (
    <div className="flex items-start space-x-4">
      <span className="text-2xl">{icon}</span>
      <div className="text-left">
        <p className="text-lg font-bold text-gray-500">
          {label}
        </p>
        <p className="text-gray-800 font-light text-base dark:text-gray-200">{number}</p>
      </div>
    </div>
  );
}
