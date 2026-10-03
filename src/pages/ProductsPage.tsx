import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function ProductsPage() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {data?.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
