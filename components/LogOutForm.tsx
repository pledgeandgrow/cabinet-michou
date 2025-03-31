"use client"

import { useState, useEffect } from "react"
import { getSessionStatus, logout } from "@/app/actions"
import { useRouter } from "next/navigation"

export default function LogOutForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
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
    <form action={handleLogout} className="ml-24">
      {isLoggedIn ==true && (
        <button type="submit" className="text-orange-500">
          Déconnection
        </button>
      )}
    </form>
  )
}

