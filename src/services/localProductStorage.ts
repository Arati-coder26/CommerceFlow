import { Product } from "../types/product";

const STORAGE_KEY = "commerceflow-added-products";
const DELETED_IDS_KEY = "commerceflow-deleted-product-ids";

export const getSavedProducts = (): Product[] => {
  try {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    return Array.isArray(parsedProducts) ? (parsedProducts as Product[]) : [];
  } catch {
    return [];
  }
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getSavedProduct = (id: number) =>
  getSavedProducts().find((product) => product.id === id);

export const saveProduct = (product: Product) => {
  const products = getSavedProducts().filter((savedProduct) => savedProduct.id !== product.id);
  const updatedProducts = [product, ...products];
  saveProducts(updatedProducts);
  return updatedProducts;
};

export const getDeletedProductIds = (): number[] => {
  try {
    const deletedIds = localStorage.getItem(DELETED_IDS_KEY);
    const parsedIds = deletedIds ? JSON.parse(deletedIds) : [];
    return Array.isArray(parsedIds)
      ? parsedIds.filter((id): id is number => typeof id === "number")
      : [];
  } catch {
    return [];
  }
};

export const deleteProduct = (id: number) => {
  saveProducts(getSavedProducts().filter((product) => product.id !== id));
  const deletedIds = new Set(getDeletedProductIds());
  deletedIds.add(id);
  localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...deletedIds]));
};