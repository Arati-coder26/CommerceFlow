import { memo } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/product";

interface Props {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: Props) {
  const lowStock = (product.inventory ?? 0) < 20;

  return (
    <Link to={`/products/${product.id}`} className="product-card" aria-label={`View ${product.title}`}>
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card__image"
          loading="lazy"
          decoding="async"
        />
        {lowStock ? <span className="stock-pill stock-pill--warning">Low stock</span> : null}
      </div>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="badge badge--neutral">{product.category}</span>
          {product.rating ? (
            <span className="product-card__rating">★ {product.rating.rate}</span>
          ) : null}
        </div>

        <h3>{product.title}</h3>
        <p className="product-card__description">{product.description.slice(0, 80)}...</p>

        <div className="product-card__footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className={lowStock ? "inventory inventory--warning" : "inventory"}>
            {product.inventory ?? 0} in stock
          </span>
        </div>
      </div>
    </Link>
  );
});

export default ProductCard;
