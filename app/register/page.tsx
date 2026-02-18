"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        router.push("/login?message=Registration successful")
      } else {
        const data = await res.json()
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("Something went wrong")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] justify-center items-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="text-3xl font-bold text-center mb-6 text-primary">Register</h2>
            {error && <div role="alert" className="alert alert-error text-sm py-2 mb-4"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Name</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Your Name"
                        required
                    />
                </div>
                <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Email</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="email@example.com"
                    required
                />
                </div>
                <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Password</span>
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Create a password"
                    required
                />
                </div>
                <div className="form-control mt-8">
                    <button className="btn btn-primary w-full text-lg">Sign Up</button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm">Sudah punya akun? <Link href="/login" className="link link-primary">Login di sini</Link></p>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}
