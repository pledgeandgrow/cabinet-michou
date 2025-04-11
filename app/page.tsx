import { Case } from "@/components/ui/cases-with-infinite-scroll";
import HeroCustom from "./components/hero-custom";
import Presentation from "./components/presentation";
import Activities from "@/components/ui/activities";
import NewsSections from "@/components/News-section";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="px-0 py-0">
      <HeroCustom />
      <div className="container mx-auto">
        <div className="text-center mt-16 mb-8">
          <Badge className="mb-4 bg-[#f6a831] hover:bg-[#f6a831]/90 text-white">IMMOBILIER</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white">
            Nos annonces
          </h2>
        </div>
        <div className="space-y-12">
          <Case />
          <Presentation />
          <Activities/>
          <NewsSections/>
        </div>
      </div>
    </main>
  );
}