import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home, MoveRight, PhoneCall, UserCheck2, Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "./badge";
import Link from "next/link";
import Image from "next/image";

export default function AnimatedHero() {
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
    <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] w-full overflow-hidden">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/cab1.jpg"
          alt="Cabinet Michou"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-center px-4 py-16">
        <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-[#00408A]">
          Un cabinet à votre écoute
        </Badge>
        
        <h1 className="font-bold text-white mb-6 max-w-4xl">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2">
            Nous gérons vos 
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 min-h-[60px] sm:min-h-[70px]">
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute font-semibold text-white"
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
        
        <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mb-8">
          Le cabinet R. MICHOU vous accompagne dans les différents domaines de la gestion immobilière.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Button size="lg" className="gap-2 w-full sm:w-auto" variant="outline">
            <Link href="/annonces" className="flex items-center gap-2 w-full justify-center">
              Nos annonces <Home className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" className="gap-2 w-full sm:w-auto">
            <Link href="#" className="flex items-center gap-2 w-full justify-center">
              Extranet client <UserCheck2 className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Emoticons section - always on the right */}
      <div className="hidden md:flex flex-col gap-4 absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 z-30">
        <Link href="https://www.facebook.com/cabinetrmichou/" target="_blank" aria-label="Facebook">
          <Button size="icon" variant="outline" className="rounded-full bg-white/20 backdrop-blur-sm border-white/50 hover:bg-white hover:text-[#00408A]">
            <Facebook className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="https://www.instagram.com/cabinetrmichou/" target="_blank" aria-label="Instagram">
          <Button size="icon" variant="outline" className="rounded-full bg-white/20 backdrop-blur-sm border-white/50 hover:bg-white hover:text-[#00408A]">
            <Instagram className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="https://www.linkedin.com/company/cabinet-r-michou-cie/" target="_blank" aria-label="LinkedIn">
          <Button size="icon" variant="outline" className="rounded-full bg-white/20 backdrop-blur-sm border-white/50 hover:bg-white hover:text-[#00408A]">
            <Linkedin className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
