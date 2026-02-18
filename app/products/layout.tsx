export const metadata = {
    title: "Products",
    description: "Products Page",
}

const ProductLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="py-10 px-10">{children}</div>
  )
}

export default ProductLayout