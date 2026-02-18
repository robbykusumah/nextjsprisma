import { auth } from "@/auth"
import prisma from "@/prisma/client"
import { redirect } from "next/navigation"
import Link from "next/link"
import AddProduct from "@/app/products/addProduct"
import DeleteProduct from "@/app/products/deleteProduct"
import UpdateProduct from "@/app/products/updateProduct"

export default async function AdminProductsPage() {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/")
  }

  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        brandId: true,
        brand: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.brand.findMany(),
  ])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Produk</h1>
        <div className="flex gap-2">
          <AddProduct brands={brands} />
          <Link href="/admin/users" className="btn btn-outline btn-sm">
            ← Kelola Pengguna
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full shadow-lg border rounded-lg overflow-hidden">
          <thead className="bg-base-200 text-base-content text-lg">
            <tr>
              <th>#</th>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Brand</th>
              <th>Dibuat Oleh</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="hover">
                <td>{index + 1}</td>
                <td>{product.title}</td>
                <td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(product.price)}
                </td>
                <td>{product.brand.name}</td>
                <td>{product.user?.name || product.user?.email || "-"}</td>
                <td className="flex justify-center gap-2">
                  <DeleteProduct product={product} />
                  <UpdateProduct brands={brands} product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
