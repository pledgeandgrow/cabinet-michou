import { Metadata } from "next";
import { getLocationAnnonces } from "@/lib/queries";
import { Case } from "@/components/ui/cases-with-infinite-scroll";

export const metadata: Metadata = {
  title: "Nos locations",
  description: "Découvrez toutes nos locations disponibles",
};

export default async function LocationPage() {
  const annonces = await getLocationAnnonces();

  const formattedAnnonces = annonces.map((annonce: any) => ({
    ...annonce,
    photos: [{
      id: annonce.id,
      url: `/annonces/${annonce.id}/${annonce.photo}`
    }]
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nos locations</h1>
      <Case items={formattedAnnonces} />
    </div>
  );
}
