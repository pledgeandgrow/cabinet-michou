import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home, MoveRight, PhoneCall, UserCheck2 } from "lucide-react";
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
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full   bg-center flex items-center justify-center"
    style={{ backgroundImage: "url('https://cabinet-michou.com/images/bandeau.jpg')" }}>
      <div className="container mx-auto">
        <div className="flex  gap-8 py-20 px-5 lg:py-40  justify-center flex-col">
          {/* <Badge className="text-center w-fit" variant={"outline"}>Un cabinet à votre écoute</Badge> */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">Nous gérons vos </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg font-bold text-gray-300 md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Le cabinet R. MICHOU vous accompagne dans les différents domaines <br /> de la gestion immobilière.
            </p>
          </div>
          <div className="flex flex-row gap-3">
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
    </div>
  );
}

export { Hero };
