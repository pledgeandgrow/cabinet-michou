import { Case } from "@/components/ui/cases-with-infinite-scroll";
import HeroCustom from "./components/hero-custom";
import { ThemeToggle } from "@/components/theme-toggle";
import Presentation from "./components/presentation";

const Home = () => {
  return (
    <>
      <ThemeToggle />
      <HeroCustom />
      <Case />
      <Presentation />
    </>
  );
}

export default Home; 