import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import {
  deleteProduct as deleteStoredProduct,
  getSavedProduct,
  saveProduct,
} from "../services/localProductStorage";
import { Product } from "../types/product";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    inventory: "",
    image: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => getSavedProduct(Number(id)) ?? getProductById(id ?? "1"),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <main className="page-shell">
        <div className="status-panel">Loading product...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="page-shell">
        <div className="status-panel status-panel--error">Product not found.</div>
      </main>
    );
  }

  const openEditForm = () => {
    setFormState({
      title: data.title,
      description: data.description,
      price: String(data.price),
      category: data.category,
      inventory: String(data.inventory ?? 0),
      image: data.image,
    });
    setIsEditing(true);
  };

  const handleSaveChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedProduct: Product = {
      ...data,
      title: formState.title.trim(),
      description: formState.description.trim(),
      price: Number(formState.price),
      category: formState.category.trim(),
      inventory: Number(formState.inventory),
      image: formState.image.trim(),
    };

    saveProduct(updatedProduct);
    queryClient.setQueryData(["product", id], updatedProduct);
    setIsEditing(false);
  };

  const handleDeleteProduct = () => {
    if (!window.confirm(`Delete "${data.title}"? This cannot be undone.`)) {
      return;
    }

    deleteStoredProduct(data.id);
    queryClient.removeQueries({ queryKey: ["product", id] });
    navigate("/");
  };

  return (
    <main className="page-shell detail-page">
      <Link to="/" className="back-link">
        ← Back to products
      </Link>

      <article className="detail-layout">
        <div className="detail-image-shell">
          <img src={data.image} alt={data.title} className="detail-image" />
        </div>

        <div className="detail-content">
          <span className="badge badge--neutral">{data.category}</span>
          <h1>{data.title}</h1>
          <div className="detail-price-row">
            <strong>${data.price.toFixed(2)}</strong>
            <span>★ {data.rating?.rate ?? 0} ({data.rating?.count ?? 0} reviews)</span>
          </div>
          <p className="detail-description">{data.description}</p>

          <div className="detail-meta">
            <div>
              <span>Inventory</span>
              <strong>{data.inventory ?? 0} units</strong>
            </div>
            <div>
              <span>Availability</span>
              <strong>{(data.inventory ?? 0) > 0 ? "In stock" : "Sold out"}</strong>
            </div>
          </div>

          <div className="detail-actions">
            <button type="button" className="secondary-button" onClick={openEditForm}>
              Edit product
            </button>
            <button type="button" className="danger-button" onClick={handleDeleteProduct}>
              Delete product
            </button>
            <button type="button" className="primary-button">
              Add to cart
            </button>
            <button type="button" className="secondary-button">
              Save for later
            </button>
          </div>
        </div>
      </article>

      {isEditing && (
        <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
          <div
            className="modal-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Product details</p>
                <h3 id="edit-product-title">Edit product</h3>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsEditing(false)}
                aria-label="Close edit product form"
              >
                ×
              </button>
            </div>

            <form className="add-product-form" onSubmit={handleSaveChanges}>
              <div className="form-grid">
                <label className="form-field">
                  <span>Product title</span>
                  <input
                    value={formState.title}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, title: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.price}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, price: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Category</span>
                  <input
                    value={formState.category}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, category: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Inventory</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.inventory}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, inventory: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className="form-field form-field--wide">
                  <span>Image URL</span>
                  <input
                    type="url"
                    value={formState.image}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, image: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className="form-field form-field--wide">
                  <span>Description</span>
                  <textarea
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, description: event.target.value }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
