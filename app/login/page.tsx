"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Email atau Password salah!")
        } else {
            router.push("/")
            router.refresh()
        }
    } catch (err) {
        setError("Terjadi kesalahan saat login")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] justify-center items-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="text-3xl font-bold text-center mb-6 text-primary">Login</h2>
            {error && <div role="alert" className="alert alert-error text-sm py-2 mb-4"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your password"
                    required
                />
                </div>
            <div className="form-control mt-4">
                <button className="btn btn-primary w-full text-lg">Sign In</button>
            </div>
            
            <div className="divider">OR</div>
            
            <div className="form-control">
                <button 
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="btn btn-outline w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  Sign in with Google
                </button>
            </div>
            </form>
            <div className="text-center mt-4">
                <p className="text-sm mb-2">
                  <Link href="/reset-password" className="link link-warning text-sm">
                    Lupa Password?
                  </Link>
                </p>
                <p className="text-sm">Belum punya akun? <Link href="/register" className="link link-primary">Daftar di sini</Link></p>
            </div>
        </div>
      </div>
    </div>
  )
}
