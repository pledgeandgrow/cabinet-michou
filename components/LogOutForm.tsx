"use client"

import { useState, useEffect } from "react"
import { getSessionStatus, logout } from "@/app/actions"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogOutForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkSession = async () => {
      const loggedIn = await getSessionStatus()
      setIsLoggedIn(loggedIn)
    }

    // Vérifier la session à chaque montage du composant
    checkSession()

    // Configurer un intervalle pour vérifier régulièrement la session
    const intervalId = setInterval(checkSession, 2000)

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId)
  }, [pathname]) // Re-exécuter l'effet lorsque le chemin change

  const handleLogout = async () => {
    await logout()
    setIsLoggedIn(false)
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <form action={handleLogout} className="ml-8 z-10">
      {isLoggedIn === true && (
        <Button 
          type="submit" 
          variant="outline" 
          size="sm" 
          className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors relative"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Déconnexion
        </Button>
      )}
    </form>
  )
}

