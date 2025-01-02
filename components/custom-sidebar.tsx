import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
  import logo from "../public/logo.svg";
import Image from "next/image"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User2, ChevronUp, Calendar, Home, Inbox, Search, Settings, Contact, Link, BookAIcon } from "lucide-react";
import { Button } from "./ui/button";
import { title } from "process";

const items = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
  },
  {
    title: "Nos annonces",
    url: "/",
    icon: Search,
  },
  {
    title: "Gestion locative",
    url: "/gestion-locative",
    icon: Calendar,
  },
  {
    title: "Syndics",
    url: "#",
    icon: Settings,
  },
  {
    title: "Nous contactez",
    url: "/contact",
    icon: Contact,
  },
]

const externalLink = [
  {
    title: "Nos annonces SeLoger",
    url: "/",
    icon: BookAIcon,
  },
  {
    title: "Réaliser mon dossier",
    url: "/",
    icon: Inbox,
  },
  {
    title: "Extranet Client",
    url: "/",
    icon: Link,
  },
]
  
export function CustomSidebar() {
    return (
      <Sidebar
        variant="floating"
        side="left"
      >
        <SidebarHeader>
            <Image
            className="m-auto mt-4"
                width={150}
                src={logo}
                alt="lal"
            />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarContent>
              <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarContent>
              <SidebarGroup>
              <SidebarGroupLabel>Liens externes</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {externalLink.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          </SidebarGroup>
          
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Espace client
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-background border gap-2 p-2 rounded-md shadow-md"
                >
                  <DropdownMenuItem className="flex flex-row gap-2 text-xs">
                    <Button variant={"outline"} className="w-full">Connexion</Button>
                    <Button className="w-full">M'inscrire</Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }
  