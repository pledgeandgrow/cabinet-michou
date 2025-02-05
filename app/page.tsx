import { Case } from "@/components/ui/cases-with-infinite-scroll";
import HeroCustom from "./components/hero-custom";
import ExpertiseSection from "./components/expertise-section";
import Presentation from "./components/presentation";

export default function Home() {
  return (
    <main className=" mx-0 px-0 " >
      <HeroCustom />
      <Case />
      <ExpertiseSection />
      <Presentation />
    </main>
  );
}