import Link from "next/link";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";

import { Prisma } from "@prisma/client";

const getProducts = async (userId: string | undefined, isAdmin: boolean) => {
    // If not admin and no user ID, return empty list (or handle appropriately)
    if (!isAdmin && !userId) {
        return [];
    }
    
    // Explicitly check for userId existence before creating where clause
    const whereClause: Prisma.ProductWhereInput = isAdmin ? {} : { userId: userId };
    
    const res = await prisma.product.findMany({
        where: whereClause,
        select:{
            id:true,
            title:true,
            price:true,
            brandId:true,
            brand:true,
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
    return res;
}

const getBrands = async () => {
    const res = await prisma.brand.findMany();
    return res;
}

const Products = async () => { 
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const userId = session?.user?.id;
    
    // Pass sorting/filtering params
    const [products, brands] = await Promise.all([getProducts(userId, isAdmin), getBrands()]); 

  return (
    <div className="p-10"> 
        <div className="mb-2 flex justify-between items-center">
            <AddProduct brands={brands}/>
            <Link href="/" className="btn btn-outline btn-sm">Home</Link>
        </div>
        <table className="table w-full">
            <thead>
                <tr className="bg-gray-100">
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Brand</th>
                    {isAdmin && <th>Created By</th>}
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={product.id}>
                        <td>{index + 1}</td>
                        <td>{product.title}</td>
                        <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                        <td>{product.brand.name}</td>
                        {isAdmin && <td>{product.user?.name || product.user?.email || "-"}</td>}
                        <td className="flex justify-center gap-2">
                            <DeleteProduct product={product}/>
                            <UpdateProduct brands={brands} product={product}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

    </div>
  )
}

export default Products