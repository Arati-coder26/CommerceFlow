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
