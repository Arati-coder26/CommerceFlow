import { useQuery } from "@tanstack/react-query";
import { Product } from "../types/product";
import { fallbackProducts, getProducts } from "../services/productService";

export const useProducts = () =>
  useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData: fallbackProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
