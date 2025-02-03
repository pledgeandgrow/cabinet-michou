import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home, UserCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "./badge";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Gestions locatives 🏠", "Transactions 💳", "Copropriétés 🏢"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify- "
      style={{ backgroundImage: "url('https://cabinet-michou.com/images/bandeau.jpg')" }}
    >
      {/* Overlay to improve text readability */}

      <div className="relative z-10 text-center text-white flex flex-col items-center justify-center max-w-3xl px-6">
        <Badge variant="outline">Un cabinet à votre écoute</Badge>
        <h1 className="text-5xl md:text-7xl tracking-tighter font-regular">
          <span className="text-spektr-cyan-50">Nous gérons vos </span>
          <span className="relative inline-block h-14 md:h-16 overflow-hidden">
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute w-full font-semibold"
                initial={{ opacity: 0, y: "-100%" }}
                transition={{ type: "spring", stiffness: 50 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                }
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl mt-4">
          Le cabinet R. MICHOU vous accompagne dans les différents domaines de la gestion immobilière.
        </p>
        <div className="flex flex-row gap-3 mt-6">
          <Button size="lg" className="gap-4" variant="outline">
            <Link href="/annonces" className="flex items-center gap-2">
              Nos annonces <Home className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" className="gap-4">
            Espace client <UserCheck2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Hero };
