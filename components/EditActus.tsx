"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Actualite {
  id: number;
  titre: string;
  contenu: string;
  lien: string;
  publie: boolean;
}

interface EditActualiteFormProps {
  actualite: Actualite;
  onSubmit: (actualite: Actualite) => void;
  onCancel: () => void;
}

export default function EditActualiteForm({ actualite, onSubmit, onCancel }: EditActualiteFormProps) {
  const [titre, setTitre] = useState(actualite.titre);
  const [contenu, setContenu] = useState(actualite.contenu);
  const [lien, setLien] = useState(actualite.lien);
  const [publie, setPublie] = useState(actualite.publie);

  useEffect(() => {
    setTitre(actualite.titre);
    setContenu(actualite.contenu);
    setLien(actualite.lien);
    setPublie(actualite.publie);
  }, [actualite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...actualite, titre, contenu, lien, publie });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <Input id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="contenu" className="block text-sm font-medium text-gray-700">
          Contenu
        </label>
        <Textarea id="contenu" value={contenu} onChange={(e) => setContenu(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="lien" className="block text-sm font-medium text-gray-700">
          Lien
        </label>
        <Input id="lien" value={lien} onChange={(e) => setLien(e.target.value)} />
      </div>
      <div>
        <label htmlFor="publie" className="block text-sm font-medium text-gray-700">
          Publié
        </label>
        <Select value={publie ? "true" : "false"} onValueChange={(value) => setPublie(value === "true")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Oui</SelectItem>
            <SelectItem value="false">Non</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
