"use client";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import * as React from "react";
import { TabsTransitionPanel } from "../components/tabs-transition-panel";
import BannerInformative from "../components/banner-informative";
import { Feature } from "@/components/ui/feature";
import { Separator } from "@/components/ui/separator";
import BannerDocument from "../components/banner-document";
import { Button } from "@/components/ui/button";

const GestionLocative: React.FC = () => {
    return (
        <>
            <Breadcrumb className="ml-24 mt-12">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Acceuil</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/gestion-locative">Gestion locative</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-full my-24 flex flex-col items-center">
                <div className="w-full m-auto text-center">
                    <Badge className="mt-12 m-auto mb-4">GESTION LOCATIVE</Badge>
                    <h1 className="text-7xl font-bold">Notre équipe</h1>
                </div>
                <TabsTransitionPanel />
            </div>
            <Separator />
            <BannerInformative type="gestion-proprio" />
            <Feature />
            <Separator />
            <BannerInformative type="gestion-locative" />
            <BannerDocument />
            <div className="w-full flex justify-center my-24">
            <Link href="/annonces" >
                <Button>Voir nos annonces</Button>
            </Link>
            </div>
        </>
    );
}

export default GestionLocative;