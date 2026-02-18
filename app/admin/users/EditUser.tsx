"use client"

import { useState, SyntheticEvent } from "react"
import { useRouter } from "next/navigation"

type Props = {
  user: {
    id: string
    name: string | null
    email: string | null
  }
}

export default function EditUser({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(user.name ?? "")
  const [email, setEmail] = useState(user.email ?? "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim() || !email.trim()) {
      setError("Nama dan email tidak boleh kosong")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsOpen(false)
        window.location.reload()
      } else {
        setError(data.error || "Terjadi kesalahan")
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-xs btn-info"
      >
        Edit
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Pengguna</h3>

          {error && (
            <div className="alert alert-error text-sm py-2 mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nama</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama pengguna"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsOpen(false)
                  setError("")
                  setName(user.name ?? "")
                  setEmail(user.email ?? "")
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={() => setIsOpen(false)} />
      </div>
    </>
  )
}
