import Link from "next/link";
import prisma from "@/prisma/client";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

const getPublicProducts = async (query: string, currentPage: number) => {
    try {
        const whereClause: Prisma.ProductWhereInput = query ? { title: { contains: query, mode: 'insensitive' } } : {};
        const itemsPerPage = 8; // More items for grid view
        const skip = (currentPage - 1) * itemsPerPage;
        
        const [products, count] = await prisma.$transaction([
            prisma.product.findMany({
                where: whereClause,
                skip: skip,
                take: itemsPerPage,
                include: { brand: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(count / itemsPerPage);
        return { products, totalPages };
    } catch (error) {
        console.error("Error fetching public products:", error);
        return { products: [], totalPages: 0 };
    }
}

const Products = async (props: { searchParams: Promise<{ query?: string, page?: string }> }) => {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";
    const currentPage = Number(searchParams.page) || 1;
    
    const { products, totalPages } = await getPublicProducts(query, currentPage);

  return (
    <div className="container mx-auto p-10"> 
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
            <p className="text-gray-500">Find the best products curated just for you</p>
        </div>

        <div className="mb-6 flex justify-center max-w-md mx-auto">
            <Suspense fallback={<div>Loading search...</div>}>
                <Search />
            </Suspense>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
                <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-200">
                    <figure className="px-10 pt-10 min-h-[200px] bg-base-200 flex items-center justify-center">
                        {/* Placeholder for Product Image */}
                        <span className="text-6xl">📦</span>
                    </figure>
                    <div className="card-body items-center text-center">
                        <div className="badge badge-secondary mb-2">{product.brand?.name}</div>
                        <h2 className="card-title">{product.title}</h2>
                        <p className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                        </p>
                        <div className="card-actions mt-4">
                            <button className="btn btn-primary btn-sm">Add to Cart</button>
                        </div>
                         <div className="text-xs text-gray-400 mt-2">
                            Stock: {product.stock}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {products.length === 0 && (
            <div className="text-center py-20">
                <h3 className="text-xl text-gray-500">No products found matching your search.</h3>
            </div>
        )}

        <div className="flex justify-center mt-10">
            <Suspense fallback={<div>Loading pagination...</div>}>
                <Pagination totalPages={totalPages} />
            </Suspense>
        </div>
    </div>
  )
}

export default Products