import { FormEvent, useEffect, useMemo, useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { useProducts } from "../hooks/useProducts";
import {
  getDeletedProductIds,
  getSavedProducts,
  saveProducts,
} from "../services/localProductStorage";
import { Product } from "../types/product";

export default function ProductsPage() {
  const { data = [], isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>(getSavedProducts);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    inventory: "",
    image: "",
  });

  useEffect(() => {
    saveProducts(localProducts);
  }, [localProducts]);

  const products = useMemo(() => {
    const localProductIds = new Set(localProducts.map((product) => product.id));
    const deletedProductIds = new Set(getDeletedProductIds());
    return [
      ...localProducts,
      ...data.filter(
        (product) =>
          !localProductIds.has(product.id) && !deletedProductIds.has(product.id)
      ),
    ];
  }, [data, localProducts]);

  const categoryOptions = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products]
  );

  const formCategoryOptions = categoryOptions.length
    ? categoryOptions
    : ["electronics", "jewelery", "men's clothing", "women's clothing"];

  const resetForm = () => {
    setFormState({
      title: "",
      description: "",
      price: "",
      category: "",
      inventory: "",
      image: "",
    });
  };

  const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextProduct: Product = {
      id: Date.now(),
      title: formState.title.trim() || "New product",
      description: formState.description.trim() || "Freshly added product listing.",
      price: Number(formState.price) || 0,
      category: (formState.category || formCategoryOptions[0] || "uncategorized").trim(),
      image:
        formState.image.trim() ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      rating: {
        rate: 4.8,
        count: 0,
      },
      inventory: Number(formState.inventory) || 0,
    };

    setLocalProducts((currentProducts) => [nextProduct, ...currentProducts]);
    setSelectedCategory(nextProduct.category);
    setSearchTerm("");
    setSortBy("featured");
    setVisibleCount(12);
    setIsAddProductOpen(false);
    resetForm();
  };

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    let list = products.filter((product) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort(
          (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)
        );
        break;
      case "featured":
      default:
        break;
    }

    return list;
  }, [products, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, selectedCategory, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const summary = useMemo(() => {
    const totalInventory = products.reduce((sum, product) => sum + (product.inventory ?? 0), 0);
    const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);
    const averagePrice = products.length ? totalRevenue / products.length : 0;
    const lowStock = products.filter((product) => (product.inventory ?? 0) < 20).length;
    const topCategory =
      Object.entries(
        products.reduce<Record<string, number>>((acc, product) => {
          acc[product.category] = (acc[product.category] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0] ?? ["All", 0];

    return {
      totalInventory,
      averagePrice,
      products: products.length,
      lowStock,
      topCategory: topCategory[0],
    };
  }, [products]);

  if (isLoading) {
    return (
      <main className="page-shell">
        <div className="status-panel">Loading products...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <div className="status-panel status-panel--error">
          Something went wrong while loading products.
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="dashboard-header">
        <div className="brand-block">
          <div className="brand-mark">CF</div>
          <div>
            <p className="eyebrow">CommerceFlow</p>
            <h1>Product management dashboard</h1>
          </div>
        </div>

        <div className="header-actions">
          <div className="status-strip">
            <span className="dot-indicator" />
            Live dashboard
          </div>
          <div className="user-pill">
            <span className="user-avatar">AS</span>
            <div>
              <strong>Admin Suite</strong>
              <small>Operations</small>
            </div>
          </div>
          <button type="button" className="primary-button" onClick={() => setIsAddProductOpen(true)}>
            + Add product
          </button>
        </div>
      </header>

      {isAddProductOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddProductOpen(false)}>
          <div
            className="modal-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">New listing</p>
                <h3 id="add-product-title">Add product</h3>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsAddProductOpen(false)}
                aria-label="Close add product form"
              >
                ×
              </button>
            </div>

            <form className="add-product-form" onSubmit={handleAddProduct}>
              <div className="form-grid">
                <label className="form-field">
                  <span>Product title</span>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Premium backpack"
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
                    placeholder="129.99"
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Category</span>
                  <input
                    type="text"
                    list="product-category-options"
                    value={formState.category}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, category: event.target.value }))
                    }
                    placeholder="Choose or enter a category"
                    required
                  />
                  <datalist id="product-category-options">
                    {formCategoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </datalist>
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
                    placeholder="25"
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
                    placeholder="https://example.com/product.jpg"
                  />
                </label>

                <label className="form-field form-field--wide">
                  <span>Description</span>
                  <textarea
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="Describe the product and value proposition"
                    required
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setIsAddProductOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="insight-panel">
        <div>
          <span className="insight-kicker">Performance snapshot</span>
          <h2>Revenue is trending up with strong demand in {summary.topCategory}.</h2>
        </div>
        <div className="insight-grid">
          <div className="insight-card">
            <span>Low stock alerts</span>
            <strong>{summary.lowStock}</strong>
          </div>
          <div className="insight-card">
            <span>Top category</span>
            <strong>{summary.topCategory}</strong>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card stat-card--purple">
          <span>Total products</span>
          <strong>{summary.products}</strong>
        </article>
        <article className="stat-card stat-card--green">
          <span>Inventory units</span>
          <strong>{summary.totalInventory}</strong>
        </article>
        <article className="stat-card stat-card--amber">
          <span>Avg. price</span>
          <strong>${summary.averagePrice.toFixed(2)}</strong>
        </article>
      </section>

      <section className="toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <label className="sort-select" aria-label="Sort products">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </section>

      <section className="filter-panel">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      <section className="product-grid">
        {filteredProducts.length > 0 ? (
          visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="empty-state">No products match your filters.</div>
        )}
      </section>
      {visibleCount < filteredProducts.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setVisibleCount((count) => count + 12)}
          >
            Load more products
          </button>
        </div>
      )}
    </main>
  );
}
