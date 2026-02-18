import prisma from "./prisma/client"

async function main() {
  const email = "admin@example.com" // Change this if needed
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    })
    console.log(`User ${email} promoted to ADMIN.`)
  } catch (error) {
    console.error("Error promoting user:", error)
  } finally {
    // await prisma.$disconnect()
  }
}

main()
