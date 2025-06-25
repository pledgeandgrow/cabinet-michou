"use client"

import { useState, useEffect } from "react"
import { getSessionStatus, logout } from "@/app/actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogOutForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      // Pour tester l'affichage du bouton, on force isLoggedIn à true
      const loggedIn = await getSessionStatus()
      setIsLoggedIn(loggedIn)

    }

    checkSession()
  }, [])

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

