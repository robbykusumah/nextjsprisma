import { NextResponse } from "next/server"
import prisma from "@/prisma/client"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email dan password baru wajib diisi" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      )
    }

    // Check if user exists
    const users = await prisma.$queryRaw<Array<{id: string, email: string}>>`
      SELECT id, email FROM "User" WHERE email = ${email} LIMIT 1
    `

    if (!users[0]) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 404 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.$executeRaw`
      UPDATE "User" SET password = ${hashedPassword} WHERE email = ${email}
    `

    return NextResponse.json({ success: true, message: "Password berhasil diubah" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
