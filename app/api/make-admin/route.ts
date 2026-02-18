import { NextResponse } from "next/server"
import prisma from "@/prisma/client"

// TEMPORARY ENDPOINT - DELETE AFTER USE
// Visit: http://localhost:3000/api/make-admin?email=YOUR_EMAIL
export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get("email")

  if (!email) {
    // List all users if no email provided
    const users = await prisma.$queryRaw<Array<{id: string, email: string, name: string, role: string}>>`
      SELECT id, email, name, role FROM "User"
    `
    return NextResponse.json({ users })
  }

  try {
    await prisma.$executeRaw`
      UPDATE "User" SET role = 'ADMIN'::"Role" WHERE email = ${email}
    `
    const users = await prisma.$queryRaw<Array<{id: string, email: string, name: string, role: string}>>`
      SELECT id, email, name, role FROM "User" WHERE email = ${email} LIMIT 1
    `
    return NextResponse.json({ success: true, user: users[0] })
  } catch (error) {
    return NextResponse.json({ error: "User not found or error occurred", email }, { status: 404 })
  }
}
