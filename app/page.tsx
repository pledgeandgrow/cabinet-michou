import { Case } from "@/components/ui/cases-with-infinite-scroll";
import HeroCustom from "./components/hero-custom";
import Presentation from "./components/presentation";
import Activities from "@/components/ui/activities";
import NewsSections from "@/components/News-section";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (

    <main className=" px-0 py-0" >
      <HeroCustom />
      <div className="flex flex-col items-center mt-16">
        <Badge className="m-auto mb-4 text-center text-black dark:text-white">IMMOBILIER</Badge>
        <h1 className="text-center text-5xl font-bold lg:text-6xl py-2 ">Nos annonces</h1>
      </div>
      <div className="container mx-auto">
      <Case />
      <Presentation />
      <Activities/>
      <NewsSections/>
      </div>
    </main>
  );
}