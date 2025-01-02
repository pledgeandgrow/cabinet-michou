"use client";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import * as React from "react";

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
            <div className="w-full m-auto">
                <Badge className="mt-12 mb-4">GESTION LOCATIVE</Badge>
                <h1 className="text-4xl">3 expertises dans l'immobilier</h1>
            </div>
        </>
    );
}

export default GestionLocative;