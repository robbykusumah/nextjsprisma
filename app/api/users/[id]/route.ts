import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/prisma/client"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params;

  // Only admin can edit users
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { role, name, email } = body

    // Update role
    if (role !== undefined) {
      if (role !== "ADMIN" && role !== "USER") {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 })
      }
      await prisma.$executeRaw`
        UPDATE "User" SET role = ${role}::"Role" WHERE id = ${id}
      `
    }

    // Update name and/or email
    if (name !== undefined || email !== undefined) {
      if (email !== undefined) {
        // Check email not already taken by another user
        const existing = await prisma.$queryRaw<Array<{id: string}>>`
          SELECT id FROM "User" WHERE email = ${email} AND id != ${id} LIMIT 1
        `
        if (existing.length > 0) {
          return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 })
        }
      }

      if (name !== undefined && email !== undefined) {
        await prisma.$executeRaw`
          UPDATE "User" SET name = ${name}, email = ${email} WHERE id = ${id}
        `
      } else if (name !== undefined) {
        await prisma.$executeRaw`
          UPDATE "User" SET name = ${name} WHERE id = ${id}
        `
      } else if (email !== undefined) {
        await prisma.$executeRaw`
          UPDATE "User" SET email = ${email} WHERE id = ${id}
        `
      }
    }

    // Fetch updated user
    const users = await prisma.$queryRaw<Array<{id: string, email: string, name: string, role: string}>>`
      SELECT id, email, name, role FROM "User" WHERE id = ${id} LIMIT 1
    `

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
