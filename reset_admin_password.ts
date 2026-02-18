import prisma from "./prisma/client"
import bcrypt from "bcryptjs"

async function main() {
  const email = "admin@example.com"
  const password = "password123"
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: "ADMIN",
      },
      create: {
        email,
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    })
    console.log(`Admin user ${email} configured with password: ${password}`)
  } catch (error) {
    console.error("Error resetting admin password:", error)
  } finally {
    // await prisma.$disconnect()
  }
}

main()
