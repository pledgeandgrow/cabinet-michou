"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CreateActusPopup() {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [lien, setLien] = useState("");
  const [publie, setPublie] = useState<string>("non");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage(""); 

    const data = { titre, contenu, lien, publie: publie === "oui" };

    try {
      const response = await fetch("/api/create-actu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.location.reload()
        setTitre("");
        setContenu("");
        setLien("");
        setPublie("non");
      } else {
        const { message } = await response.json();
        setErrorMessage(message || "Erreur lors de l'insertion");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Erreur lors de l'insertion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto">
      <div className="text-center mb-8">
        <Badge variant="outline">Actualité</Badge>
        <h2 className="text-3xl font-extrabold text-black dark:text-white leading-tight">Créer une actualité</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="titre" className="text-sm font-medium text-gray-700">
            Titre de l'actualité
          </label>
          <Input
            id="titre"
            className="w-full"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-500">
            Contenu
          </label>
          <Textarea
            id="message"
            rows={5}
            className="w-full"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lien" className="text-sm font-medium text-gray-500">
            Lien si nécessaire
          </label>
          <Input
            id="lien"
            type="text"
            className="w-full"
            value={lien}
            onChange={(e) => setLien(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="publier" className="text-sm font-medium text-gray-700">
            Publier l'actualité
          </label>
          <Select
            value={publie}
            onValueChange={setPublie}
          >
            <SelectTrigger id="publier" className="w-full">
              <SelectValue placeholder="Choisir une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oui">Oui</SelectItem>
              <SelectItem value="non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="flex justify-center">
          <Button type="submit" className="px-8 py-2" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default CreateActusPopup;
