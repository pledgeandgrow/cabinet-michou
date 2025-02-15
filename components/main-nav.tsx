"use client"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import logo from "../public/logo.svg"
import { Home, Search, Building2, Building, Phone, FileText, ExternalLink, Key, Users, Banknote } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import DossierPopup from "./Dossier-popup"

const mainMenuItems = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
    description: "Retour à la page d'accueil",
  },
  {
    title: "Nos services",
    icon: Building2,
    items: [
      {
        title: "Gestion locative",
        description: "Confiez-nous la gestion de vos biens immobiliers",
        icon: Key,
        url: "/gestion-locative",
      },
      {
        title: "Nos dernières annonces",
        description: "Achat, vente ou location de biens immobiliers",
        icon: Banknote,
        url: "/#annonces",
      },
      {
        title: "Syndic",
        description: "Gestion transparente et efficace de votre copropriété",
        icon: Banknote,
        url: "/syndic",
      },
      {
        title: "Vente",
        description: "Accompagnement sur-mesure pour vendre rapidement et en toute sécurité",
        icon: Banknote,
        url: "/vente",
      },
    ],
  },
  {
    title: "Annonces",
    icon: Search,
    items: [
      {
        title: "Nos biens à vendre",
        description: "Découvrez notre sélection de biens à vendre",
        icon: Building,
        url: "/annonces?transaction=Vente",
      },
      {
        title: "Nos locations",
        description: "Consultez nos offres de location",
        icon: Key,
        url: "/annonces?transaction=Location",
      },
      {
        title: "Annonces SeLoger",
        description: "Voir nos annonces sur SeLoger.com",
        icon: ExternalLink,
        url: "https://www.seloger.com/professionnels/agences-immobilieres/paris-4eme-arrondissement-75004/agence-3801/",
      },
    ],
  },
  {
    title: "Le Cabinet",
    url: "/cabinet",
    icon: Building2,
    description: "Découvrez notre histoire depuis 1952",
  },
  {
    title: "Contact",
    url: "/contact",
    icon: Phone,
    description: "Prenez contact avec notre équipe",
  },
]

const quickLinks = [
  {
    title: "Extranet Client",
    description: "Accédez à votre espace client",
    url: "https://michou.neotimm.com/extranet/#/login",
    icon: Users,
  },
  {
    title: "Constituer mon dossier",
    description: "Préparez votre dossier de location",
    url: "/dossier-location",
    icon: FileText,
  },
]

const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}

export function MainNav() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                className="ml-8"
                src={logo || "/placeholder.svg"}
                alt="Cabinet Michou"
                width={120}
                height={40}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  {mainMenuItems.map((item, index) =>
                    item.items ? (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuTrigger className="bg-background">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.items.map((subItem, subIndex) => (
                              <ListItem key={subIndex} title={subItem.title} href={subItem.url}>
                                {subItem.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    ) : (
                      <NavigationMenuItem key={index}>
                        <Link href={item.url} legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ),
                  )}
                  <NavigationMenuItem>
                    <ThemeToggle />
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden md:flex items-center gap-4">
            {quickLinks.map((link) =>
              link.title === "Constituer mon dossier" ? (
                <Dialog key={link.title} open={isPopupOpen} onOpenChange={setIsPopupOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <link.icon className="h-4 w-4" />
                      {link.title}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[705px]">
                    <DossierPopup />
                  </DialogContent>
                </Dialog>
              ) : (
                <Link key={link.title} href={link.url}>
                  <Button
                    variant={link.title === "Extranet Client" ? "default" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.title}
                  </Button>
                </Link>
              ),
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Image src={logo || "/placeholder.svg"} alt="Cabinet Michou" width={120} height={40} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {mainMenuItems.map((item) => (
                  <div key={item.title} className="space-y-3">
                    {item.items ? (
                      <>
                        <h2 className="flex items-center gap-2 font-medium">
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </h2>
                        <div className="pl-6 space-y-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            >
                              <subItem.icon className="h-4 w-4" />
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-2 font-medium hover:text-primary">
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="border-t pt-4 space-y-4">
                  {quickLinks.map((link) =>
                    link.title === "Constituer mon dossier" ? (
                      <Dialog key={link.title} open={isPopupOpen} onOpenChange={setIsPopupOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="flex items-center gap-2 w-full justify-start">
                            <link.icon className="h-4 w-4" />
                            {link.title}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DossierPopup />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Link
                        key={link.title}
                        href={link.url}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <link.icon className="h-4 w-4" />
                        {link.title}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

