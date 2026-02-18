"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  userId: string
  currentRole: "ADMIN" | "USER"
}

export default function RoleToggle({ userId, currentRole }: Props) {
  const [role, setRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggleRole = async () => {
    const newRole = role === "ADMIN" ? "USER" : "ADMIN"
    setIsLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) {
        setRole(newRole)
        window.location.reload()
      } else {
        alert("Gagal mengubah role")
      }
    } catch (error) {
      alert("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`badge ${role === "ADMIN" ? "badge-primary" : "badge-ghost"}`}>
        {role}
      </span>
      <button
        onClick={toggleRole}
        disabled={isLoading}
        className={`btn btn-xs ${role === "ADMIN" ? "btn-warning" : "btn-success"}`}
      >
        {isLoading ? "..." : role === "ADMIN" ? "→ USER" : "→ ADMIN"}
      </button>
    </div>
  )
}
