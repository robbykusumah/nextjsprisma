import { Pool } from "pg"

const pool = new Pool({
  connectionString: "postgresql://postgres:12345@localhost:5432/next_db",
})

async function main() {
  const client = await pool.connect()
  try {
    // List all users
    const result = await client.query('SELECT id, email, name, role FROM "User"')
    console.log("=== All Users ===")
    console.table(result.rows)

    // Update all users named "Admin User" or email containing "admin" to ADMIN role
    const updateResult = await client.query(
      `UPDATE "User" SET role = 'ADMIN' WHERE name = 'Admin User' OR email LIKE '%admin%' RETURNING id, email, name, role`
    )
    console.log("\n=== Updated to ADMIN ===")
    console.table(updateResult.rows)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(console.error)
