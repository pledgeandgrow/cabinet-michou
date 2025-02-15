import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, X } from "lucide-react"

interface NewsItem {
  id: number
  title: string
  hasLink: boolean
  isPublished: boolean
}

export default function NewsManagement() {
  const newsItems: NewsItem[] = [
    { id: 1, title: "Un nouveau site Internet pour le cabinet Michou", hasLink: false, isPublished: false },
    { id: 2, title: "On parle de nous sur Intratone", hasLink: true, isPublished: true },
    { id: 3, title: "Retrouvez-nous sur Instagram", hasLink: true, isPublished: true },
    { id: 4, title: "TVA et biens immobiliers", hasLink: false, isPublished: false },
    { id: 5, title: "Course des lumières", hasLink: true, isPublished: false },
    { id: 6, title: "Recrutement", hasLink: false, isPublished: false },
    {
      id: 7,
      title: "40, rue de Varenne - Exposition POP UP STORE du 24 au 28 Mars 2022",
      hasLink: false,
      isPublished: false,
    },
    { id: 8, title: "FERMETURE CABINET PRINTEMPS 2022", hasLink: false, isPublished: false },
    { id: 9, title: "Déclaration des biens immobiliers", hasLink: false, isPublished: true },
    { id: 10, title: "Pour des vacances sereines", hasLink: false, isPublished: true },
    { id: 11, title: "Bonne année 2024", hasLink: false, isPublished: false },
  ]

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4">
          <span className="hover:underline cursor-pointer">Accueil</span>
          <span className="mx-2">/</span>
          <span>Gestion des actualités</span>
        </div>
        <h1 className="text-4xl font-bold text-[#00458E] mb-8">Gestion des actualités</h1>
        <div className="text-right">
          <Button className="bg-[#F5A623] hover:bg-[#E59512] text-white">Créer une actualité</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-[#00458E] text-white">ACTIONS</TableHead>
            <TableHead className="bg-[#00458E] text-white">TITRE</TableHead>
            <TableHead className="w-[100px] bg-[#00458E] text-white">LIEN</TableHead>
            <TableHead className="w-[100px] bg-[#00458E] text-white">PUBLIÉ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <X className="h-4 w-4" />
                </button>
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.hasLink ? "Oui" : "Non"}</TableCell>
              <TableCell>
                <div className={`h-3 w-3 rounded-full ${item.isPublished ? "bg-green-500" : "bg-red-500"}`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

