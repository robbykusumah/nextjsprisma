import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  const brands = [
    { name: 'Nike' },
    { name: 'Adidas' },
    { name: 'Puma' },
    { name: 'Apple' },
    { name: 'Samsung' },
    { name: 'Xiaomi' },
    { name: 'Asus' },
    { name: 'Lenovo' },
    { name: 'HP' },
    { name: 'Dell' },
    { name: 'Acer' }
  ];

  try {
    const results = [];
    for (const brand of brands) {
        // Check if brand exists
        const existing = await prisma.brand.findFirst({
            where: { name: brand.name }
        });
        
        if (!existing) {
            // Create if not exists
            const newBrand = await prisma.brand.create({
                data: brand
            });
            results.push(`Created: ${newBrand.name}`);
        } else {
            results.push(`Exists: ${brand.name}`);
        }
    }
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed", details: String(error) }, { status: 500 });
  }
}
