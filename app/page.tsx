import { Case } from "@/components/ui/cases-with-infinite-scroll";
import HeroCustom from "./components/hero-custom";
import ExpertiseSection from "./components/expertise-section";
import Presentation from "./components/presentation";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8" >
      <HeroCustom />
      <Case />
      <ExpertiseSection />
      <Presentation />
    </main>
  );
}