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
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

const getProducts = async (userId: string | undefined, isAdmin: boolean, query: string, currentPage: number, filterUserId?: string) => {
    try {
        // Core Logic: 
        // 1. If Admin: Show all, unless filtered by specific user.
        // 2. If User: Show ONLY their own products (ignore filter params).
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
                    brand: true,
                    user: { select: { name: true, email: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(count / itemsPerPage);
        return { products, totalPages };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], totalPages: 0 };
    }
}

const getBrands = async () => {
    return await prisma.brand.findMany();
}

const getUsers = async () => {
    return await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });
}

const Products = async (props: { searchParams: Promise<{ query?: string, page?: string, user?: string }> }) => {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";
    const currentPage = Number(searchParams.page) || 1;
    const filterUserId = searchParams.user || "";
    
    // Auth Check
    const session = await auth();
    if (!session || !session.user?.id) {
        redirect("/api/auth/signin"); // Redirect if not logged in
    }

    const isAdmin = session.user.role === "ADMIN";
    const userId = session.user.id;
    
    // Fetch Data
    const [{ products, totalPages }, brands, users] = await Promise.all([
        getProducts(userId, isAdmin, query, currentPage, filterUserId), 
        getBrands(),
        isAdmin ? getUsers() : Promise.resolve([]) // Only fetch users if Admin
    ]);
    
    // Seed Prompt (Only for Admin if DB is empty)
    if (brands.length === 0 && isAdmin) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Database Empty or Not Seeded</h2>
                <p className="mb-4">No brands found. Please seed the database.</p>
                <a href="/api/seed" target="_blank" className="btn btn-primary">Seed Database</a>
            </div>
        );
    } 

  return (
    <div className="container mx-auto p-4 sm:p-10"> 
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
                {isAdmin ? "Product Management" : "My Products"}
            </h1>
        </div>

        <div className="mb-4 flex flex-col lg:flex-row justify-between items-center gap-4 bg-base-100 p-4 rounded-lg shadow-sm border border-base-200">
            <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                <AddProduct brands={brands}/>
                {isAdmin && (
                    <Suspense fallback={<div className="loading loading-spinner loading-xs"></div>}>
                         <UserFilter users={users} />
                    </Suspense>
                )}
            </div>
            
            <div className="flex gap-2 items-center w-full lg:w-auto">
                <Suspense fallback={<div className="loading loading-spinner loading-xs"></div>}>
                    <Search />
                </Suspense>
            </div>
        </div>

        <div className="overflow-x-auto bg-base-100 shadow-xl rounded-box border border-base-200">
            <table className="table w-full">
                <thead className="bg-base-200">
                    <tr>
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
                        <tr key={product.id} className="hover">
                            <td>{index + 1}</td>
                            <td>
                                <div className="font-bold">{product.title}</div>
                            </td>
                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                            <td>
                                <div className={`badge ${product.stock > 0 ? 'badge-info gap-2' : 'badge-error gap-2'}`}>
                                    {product.stock}
                                </div>
                            </td>
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
                            <td colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-gray-500">
                                No products found. {isAdmin ? "Clear filters or add one." : "Start by adding a product!"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="flex justify-center mt-6">
            <Suspense fallback={<div>Loading pagination...</div>}>
                <Pagination totalPages={totalPages} />
            </Suspense>
        </div>
    </div>
  )
}

export default Products