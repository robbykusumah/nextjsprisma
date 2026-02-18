import { auth } from "@/auth"
import prisma from "@/prisma/client"
import { redirect } from "next/navigation"
import RoleToggle from "./RoleToggle"
import EditUser from "./EditUser"
import Link from "next/link"

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/")
  }

  const users = await prisma.$queryRaw<Array<{
    id: string
    email: string
    name: string | null
    role: string
    createdAt: Date
  }>>`
    SELECT id, email, name, role, "createdAt" FROM "User" ORDER BY "createdAt" DESC
  `

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
        <Link href="/admin/products" className="btn btn-primary btn-sm">
          Kelola Produk
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full shadow-lg border rounded-lg overflow-hidden">
          <thead className="bg-base-200 text-base-content text-lg">
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Bergabung</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover">
                <th>{index + 1}</th>
                <td>{user.name ?? "-"}</td>
                <td>{user.email}</td>
                <td>
                  <RoleToggle userId={user.id} currentRole={user.role as "ADMIN" | "USER"} />
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString("id-ID")}</td>
                <td className="text-center">
                  <EditUser user={{ id: user.id, name: user.name, email: user.email }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
