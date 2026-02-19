"use client";
import { useState} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { type Brand } from "@prisma/client";
import { useToast } from "@/components/ToastProvider";

type Product = {
    id: number;
    title: string;
    price: number;
    brandId: number;
} 

const DeleteProduct = ({product}: {product: Product}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleDelete = async (productId: number) => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/products/${productId}`);
            router.refresh();
            setIsOpen(false);
            showToast("Product deleted successfully!", "info");
        } catch (error) {
            console.error("Error deleting product:", error);
            showToast("Failed to delete product.", "error");
        } finally {
            setIsLoading(false);
        }
    }

    const handleModal = () => {
        setIsOpen(!isOpen); 
    }

  return (
    <div>
        <button className="btn btn-error btn-sm" onClick={handleModal}>DELETE</button>
        <div className={isOpen ? 'modal modal-open' : 'modal'}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Mau delete {product.title} kah bujang?</h3>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={handleModal}>GAJADI LAH</button>
                        <button type="button" onClick={()=>handleDelete(product.id)} className="btn btn-primary" disabled={isLoading}>{isLoading ? "Deleting..." : "GAS PAOK"}</button>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteProduct