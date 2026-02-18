import { PrismaClient } from '@prisma/client'

const rawUrl = process.argv[2] || process.env.DATABASE_URL;
const dbUrl = rawUrl 
  ? rawUrl.trim().replace(/[\n\r]/g, '').replace(/^["']|["']$/g, '') 
  : undefined;

console.log(`DEBUG: Raw Input: [${rawUrl}]`);
console.log(`DEBUG: Refined URL: [${dbUrl ? dbUrl.substring(0, 15) + "..." : "UNDEFINED"}]`);

if (!dbUrl) {
  console.error("ERROR: No database URL provided. Please pass it as an argument or set DATABASE_URL env var.");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
} as any)

async function seed() {
    const brands = ['Apple', 'Samsung', 'Xiaomi', 'Asus', 'Lenovo', 'HP', 'Dell', 'Acer']
    
    console.log('Start seeding...')
    
    for (const name of brands) {
        try {
          const existing = await prisma.brand.findFirst({
              where: { name }
          })
          
          if (!existing) {
              await prisma.brand.create({
                  data: { name }
              })
              console.log(`Created brand: ${name}`)
          } else {
              console.log(`Brand already exists: ${name}`)
          }
        } catch (error) {
           console.error(`Error processing brand ${name}:`, error);
        }
    }
    
    console.log('Seeding finished.')
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
