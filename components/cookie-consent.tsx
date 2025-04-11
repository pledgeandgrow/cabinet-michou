"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold mb-2">Nous utilisons des cookies</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site, personnaliser le contenu et les publicités, 
              fournir des fonctionnalités de médias sociaux et analyser notre trafic.
            </p>
            <p className="text-sm text-muted-foreground">
              Pour en savoir plus, consultez notre{" "}
              <Link href="/politique-cookies" className="text-primary hover:underline font-medium">
                politique de cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={acceptEssential}
              className="whitespace-nowrap"
            >
              Cookies essentiels uniquement
            </Button>
            <Button 
              size="sm" 
              onClick={acceptAll}
              className="whitespace-nowrap"
            >
              Accepter tous les cookies
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeBanner}
              className="absolute top-2 right-2 md:relative md:top-auto md:right-auto"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
