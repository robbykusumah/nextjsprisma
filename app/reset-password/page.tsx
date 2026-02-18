"use client"

import { useState, SyntheticEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Password tidak cocok" })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter" })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: "success", text: "Password berhasil diubah! Silakan login." })
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setMessage({ type: "error", text: data.error || "Terjadi kesalahan" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-2">
            Reset Password
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-4">
            Masukkan email dan password baru Anda
          </p>

          {message && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-4`}>
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@contoh.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password Baru</span>
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Konfirmasi Password</span>
              </label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="divider"></div>
          <p className="text-center text-sm">
            Ingat password?{" "}
            <Link href="/login" className="link link-primary font-semibold">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
