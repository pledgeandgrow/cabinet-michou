import { Metadata } from "next";
import { getVenteAnnonces } from "@/lib/queries";
import { Case } from "@/components/ui/cases-with-infinite-scroll";

export const metadata: Metadata = {
  title: "Nos ventes",
  description: "Découvrez tous nos biens à vendre",
};

export default async function VentePage() {
  const annonces = await getVenteAnnonces();

  const formattedAnnonces = annonces.map((annonce: any) => ({
    ...annonce,
    photos: [{
      id: annonce.id,
      url: `/annonces/${annonce.id}/${annonce.photo}`
    }]
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nos ventes</h1>
      <Case items={formattedAnnonces} />
    </div>
  );
}
