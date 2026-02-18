// Run with: node --env-file=.env fix_role.mjs
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // List all users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true }
  })
  console.log("=== All Users ===")
  console.table(users)

  // Update all users to ADMIN (for testing - you can change this)
  // We'll update the first user or the one named "Admin User"
  const adminUser = users.find(u => u.name === "Admin User" || u.email?.includes("admin"))
  
  if (adminUser) {
    const updated = await prisma.user.update({
      where: { id: adminUser.id },
      data: { role: "ADMIN" },
      select: { id: true, email: true, name: true, role: true }
    })
    console.log("\n=== Updated User ===")
    console.table([updated])
  } else {
    console.log("\nNo admin user found. Showing all users above - pick one to promote.")
    // Promote the first user as fallback
    if (users.length > 0) {
      const updated = await prisma.user.update({
        where: { id: users[0].id },
        data: { role: "ADMIN" },
        select: { id: true, email: true, name: true, role: true }
      })
      console.log("Promoted first user to ADMIN:")
      console.table([updated])
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
