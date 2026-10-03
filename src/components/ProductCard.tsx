import { Product } from "../types/product";
 
interface Props {
product: Product;
}
 
export default function ProductCard({
product,
}: Props) {
return (
<div className="border rounded-lg p-4">
{product.image}
 
<h3 className="font-bold mt-2">
{product.title}
</h3>
 
<p>${product.price}</p>
</div>
);
}
import { Link } from "react-router-dom";
import { Product } from "../types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="border rounded-lg p-4">
        <h3>{product.title}</h3>
        <p>${product.price}</p>
      </div>
    </Link>
  );
}
