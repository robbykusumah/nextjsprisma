import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import type { Product } from "@prisma/client";
import { auth } from "@/auth";


export const POST = async (request: Request) => {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Product = await request.json();
    const product = await prisma.product.create({
        data: {
            title: body.title,
            price: body.price,
            brandId: body.brandId,
            userId: session.user.id,
        }
    });
    return NextResponse.json(product, {status: 201});
}

