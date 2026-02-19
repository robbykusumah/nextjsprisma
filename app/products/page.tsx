import Link from "next/link";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import UserFilter from "@/components/UserFilter";
import { Suspense } from "react";

import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

const getProducts = async (userId: string | undefined, isAdmin: boolean, query: string, currentPage: number, filterUserId?: string) => {
    // If not admin and no user ID, return empty list (or handle appropriately)
    if (!isAdmin && !userId) {
        return { products: [], totalPages: 0 };
    }
    
    try {
        // Explicitly check for userId existence before creating where clause
        const whereClause: Prisma.ProductWhereInput = {
            AND: [
                isAdmin ? (filterUserId ? { userId: filterUserId } : {}) : { userId: userId },
                query ? { title: { contains: query, mode: 'insensitive' } } : {}
            ]
        };

        const itemsPerPage = 5;
        const skip = (currentPage - 1) * itemsPerPage;
        
        const [products, count] = await prisma.$transaction([
            prisma.product.findMany({
                where: whereClause,
                skip: skip,
                take: itemsPerPage,
                include: {
                    brand: true, // Ensure brand is included
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(count / itemsPerPage);

        return { products, totalPages };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], totalPages: 0 }; // Return empty safety fallback
    }
}

const getBrands = async () => {
    const res = await prisma.brand.findMany();
    return res;
}

const getUsers = async () => {
    const res = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });
    return res;
}

const Products = async (props: { searchParams: Promise<{ query?: string, page?: string, user?: string }> }) => {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";
    const currentPage = Number(searchParams.page) || 1;
    const filterUserId = searchParams.user || "";
    
    // Auth & Permissions
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const userId = session?.user?.id;
    
    // Fetch Data
    const [{ products, totalPages }, brands, users] = await Promise.all([
        getProducts(userId, isAdmin, query, currentPage, filterUserId), 
        getBrands(),
        isAdmin ? getUsers() : Promise.resolve([])
    ]);
    
    // If no brands, database likely needs seeding
    if (brands.length === 0 && isAdmin) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Database Empty or Not Seeded</h2>
                <p className="mb-4">No brands found. You need to seed the database first to add products.</p>
                <a href="/api/seed" target="_blank" className="btn btn-primary">
                    Seed Database (Click & Wait)
                </a>
                <p className="mt-2 text-sm text-gray-500">After seeing "Seeding successful", refresh this page.</p>
            </div>
        );
    } 

  return (
    <div className="p-10"> 
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 items-center">
                <AddProduct brands={brands}/>
                {isAdmin && (
                    <Suspense fallback={<div>Loading users...</div>}>
                         <UserFilter users={users} />
                    </Suspense>
                )}
            </div>
            
            <div className="flex gap-2 items-center">
                <Suspense fallback={<div>Loading search...</div>}>
                    <Search />
                </Suspense>
                <Link href="/" className="btn btn-outline btn-sm">Home</Link>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Brand</th>
                        {isAdmin && <th>Created By</th>}
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: any, index: number) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.title}</td>
                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                            <td>{product.stock}</td>
                            <td>{product.brand?.name || "No Brand"}</td>
                            {isAdmin && <td>{product.user?.name || product.user?.email || "-"}</td>}
                            <td className="flex justify-center gap-2">
                                <DeleteProduct product={product}/>
                                <UpdateProduct brands={brands} product={product}/>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-4">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="flex justify-center mt-4">
            <Suspense fallback={<div>Loading pagination...</div>}>
                <Pagination totalPages={totalPages} />
            </Suspense>
        </div>
    </div>
  )
}

export default Products