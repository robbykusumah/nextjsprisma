"use client";
import { useState, SyntheticEvent } from "react";
import { Brand } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ToastProvider";

const AddProduct = ({brands}: {brands: Brand[]}) => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [brand, setBrand] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        
        const priceNum = Number(price);
        const stockNum = Number(stock);
        const brandNum = Number(brand);

        if (isNaN(priceNum) || isNaN(stockNum) || !brandNum) {
            showToast("Invalid input. Please select a brand and check numbers.", "error");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('/api/products', {
                title: title,
                price: priceNum,
                stock: stockNum,
                brandId: brandNum,
            })
            setTitle("");
            setPrice("");
            setStock("");
            setBrand("");
            router.refresh();
            setIsOpen(false);
            showToast("Product added successfully!", "success");
        } catch (error: any) {
            console.error("Error saving product:", error);
            const errorMessage = error.response?.data?.error || error.message || "Failed to add product.";
            showToast(`Failed: ${errorMessage}`, "error");
        } finally {
            setIsLoading(false);
        }
    }

    const handleModal = () => {
        setIsOpen(!isOpen); 
    }
  return (
    <div>
        <button className="btn btn-neutral" onClick={handleModal}>ADD NEW</button>
        <div className={isOpen ? 'modal modal-open' : 'modal'}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Add New Product</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-control w-full">
                        <label className="label font-bold">Product Name</label>
                        <input type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} 
                        className="input input-bordered w-full" 
                        placeholder="Product Name"/>
                    </div>
                    <div className="form-control w-full">
                        <label className="label font-bold">Price</label>
                        <input type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="input input-bordered w-full" 
                        placeholder="Price"/>
                    </div>
                    <div className="form-control w-full">
                        <label className="label font-bold">Stock</label>
                        <input type="number" 
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="input input-bordered w-full" 
                        placeholder="Stock Quantity"/>
                    </div>
                                        <div className="form-control w-full">
                        <label className="label font-bold">Brand</label>
                        <select value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="select select-bordered w-full" defaultValue="">
                            <option value="" disabled>Select Brand</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={handleModal}>Close</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddProduct