// Section des diagnostics énergétiques à ajouter dans le formulaire
// Copiez ce bloc et insérez-le juste avant les boutons de navigation (Précédent/Suivant)
// dans le fichier app/admin/create-annonce/page.tsx

<div className="mt-8">
  <h3 className="text-xl font-bold text-[#00458E] mb-6 pb-2 border-b border-gray-100">Diagnostics énergétiques</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label htmlFor="dpe">DPE</Label>
      <Select
        value={formData.bilan_conso_id ? String(formData.bilan_conso_id) : ""}
        onValueChange={(value) => setFormData({ ...formData, bilan_conso_id: value === "none" ? 0 : Number(value) })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Non renseigné</SelectItem>
          <SelectItem value="1">A</SelectItem>
          <SelectItem value="2">B</SelectItem>
          <SelectItem value="3">C</SelectItem>
          <SelectItem value="4">D</SelectItem>
          <SelectItem value="5">E</SelectItem>
          <SelectItem value="6">F</SelectItem>
          <SelectItem value="7">G</SelectItem>
          <SelectItem value="8">VI (vierge)</SelectItem>
          <SelectItem value="9">NS (Non soumis)</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="ges">GES</Label>
      <Select
        value={formData.bilan_emission_id ? String(formData.bilan_emission_id) : ""}
        onValueChange={(value) => setFormData({ ...formData, bilan_emission_id: value === "none" ? 0 : Number(value) })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Non renseigné</SelectItem>
          <SelectItem value="1">A</SelectItem>
          <SelectItem value="2">B</SelectItem>
          <SelectItem value="3">C</SelectItem>
          <SelectItem value="4">D</SelectItem>
          <SelectItem value="5">E</SelectItem>
          <SelectItem value="6">F</SelectItem>
          <SelectItem value="7">G</SelectItem>
          <SelectItem value="8">VI (vierge)</SelectItem>
          <SelectItem value="9">NS (Non soumis)</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="consommation_energie">Consommation énergétique (kWh/m²/an)</Label>
      <Input
        id="consommation_energie"
        type="number"
        value={formData.consos}
        onChange={(e) => setFormData({ ...formData, consos: Number(e.target.value) })}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="emission_ges">Emission GES (kg CO2/m²/an)</Label>
      <Input
        id="emission_ges"
        type="number"
        value={formData.emissions}
        onChange={(e) => setFormData({ ...formData, emissions: Number(e.target.value) })}
      />
    </div>
  </div>
</div>
