import Link from "next/link";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import AddProduct from "@/app/products/addProduct";
import DeleteProduct from "@/app/products/deleteProduct";
import UpdateProduct from "@/app/products/updateProduct";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import UserFilter from "@/components/UserFilter";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

const getProducts = async (userId: string | undefined, isAdmin: boolean, query: string, currentPage: number, filterUserId?: string) => {
    try {
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

const AdminProductsPage = async (props: { searchParams: Promise<{ query?: string, page?: string, user?: string }> }) => {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";
    const currentPage = Number(searchParams.page) || 1;
    const filterUserId = searchParams.user || "";
    
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/");
    }
    
    // Admin is verified, so we can pass isAdmin=true and userId exists
    const [{ products, totalPages }, brands, users] = await Promise.all([
        getProducts(session.user.id, true, query, currentPage, filterUserId), 
        getBrands(),
        getUsers()
    ]);
    
  return (
    <div className="p-10"> 
        <h1 className="text-2xl font-bold mb-6">Admin Product Management</h1>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 items-center">
                <AddProduct brands={brands}/>
                <Suspense fallback={<div>Loading users...</div>}>
                        <UserFilter users={users} />
                </Suspense>
            </div>
            
            <div className="flex gap-2 items-center">
                <Suspense fallback={<div>Loading search...</div>}>
                    <Search />
                </Suspense>
                <Link href="/" className="btn btn-outline btn-sm">Home</Link>
            </div>
        </div>
        <div className="overflow-x-auto bg-base-100 shadow-xl rounded-box">
            <table className="table w-full">
                <thead>
                    <tr className="bg-base-200">
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Brand</th>
                        <th>Created By</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: any, index: number) => (
                        <tr key={product.id} className="hover">
                            <td>{index + 1}</td>
                            <td>{product.title}</td>
                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                            <td>
                                <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                                    {product.stock}
                                </span>
                            </td>
                            <td>{product.brand?.name || "No Brand"}</td>
                            <td>{product.user?.name || product.user?.email || "-"}</td>
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

export default AdminProductsPage
