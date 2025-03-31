"use client" 

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/app/actions" 

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)

    try {
      const response = await login({ login: username, password })

      if (response.success) {
        router.push("/admin") 
      } else {
        setError(response.message) 
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("An error occurred during login. Please try again.") 
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <p className="text-amber-500 font-medium mb-2">BACK OFFICE</p>
        <h1 className="text-4xl font-bold text-blue-900">Connexion</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Login"
          className="h-14 bg-stone-50 border-none rounded-md px-4 text-gray-700"
          name="login"
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="h-14 bg-stone-50 border-none rounded-md px-4 text-gray-700"
          name="password"
        />

        {error && <p className="text-red-500 text-center mt-2">{error}</p>} 
        <div className="flex justify-center mt-4">
          <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-10 py-6">
            Valider
          </Button>
        </div>
      </form>
    </div>
  )
}
