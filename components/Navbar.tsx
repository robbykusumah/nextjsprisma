import Link from "next/link"
import { auth } from "@/auth"
import LogoutButton from "./LogoutButton"

export default async function Navbar() {
  const session = await auth()

  return (
    <div className="navbar bg-base-100 shadow-md mb-4 px-4 sm:px-8 border-b border-base-200">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold text-primary tracking-wide">NextPrismaJS</Link>
      </div>
      
      {/* Mobile Dropdown (Optional, keeping simple for now) */}
      
      <div className="navbar-center hidden lg:flex">
         {/* Center content if needed */}
      </div>

      <div className="navbar-end flex gap-2">
        <Link href="/products" className="btn btn-ghost">Products</Link>
        {!session?.user?.email ? (
            <Link href="/login" className="btn btn-primary btn-sm px-6">Login</Link>
        ) : (
            <div className="flex items-center gap-2">
                {session.user?.role === "ADMIN" && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-sm btn-secondary">Admin ▾</div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-48">
                            <li><Link href="/admin/users">Kelola Pengguna</Link></li>
                            <li><Link href="/admin/products">Kelola Produk</Link></li>
                        </ul>
                    </div>
                )}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost flex items-center gap-2">
                         <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">{session.user?.name}</p>
                         </div>
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span className="text-xs">{session.user?.name?.charAt(0).toUpperCase() || "U"}</span>
                            </div>
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li><a className="justify-between">Profile <span className="badge">New</span></a></li>
                        <li><a>Settings</a></li>
                        <li><LogoutButton /></li>
                    </ul>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}
