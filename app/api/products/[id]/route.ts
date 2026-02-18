import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import type { Product } from "@prisma/client";


export const PATCH= async (request: Request, {params}: {params: Promise<{id: string}>}) => {
    const body: Product = await request.json();
    const { id } = await params;
    const product = await prisma.product.update({
        where: {
            id: Number(id),
        },
        data: {
            title: body.title,
            price: body.price,
            brandId: body.brandId,
        }
    });
    return NextResponse.json(product, {status: 200});
}

export const DELETE = async (request: Request, {params}: {params: Promise<{id: string}>}) => {
    const { id } = await params;
    const product = await prisma.product.delete({
        where: {
            id: Number(id),
        }
    });
    return NextResponse.json(product, {status: 200});
}

