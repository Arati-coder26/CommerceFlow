import axios from "axios";
import { Product } from "../types/product";

const API_URL = "https://fakestoreapi.com/products";

export const fallbackProducts: Product[] = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
    price: 109.95,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: { rate: 3.9, count: 120 },
    inventory: 42,
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight fabric.",
    price: 22.3,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: { rate: 4.1, count: 259 },
    inventory: 68,
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    description:
      "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions.",
    price: 55.99,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.7, count: 500 },
    inventory: 31,
  },
  {
    id: 4,
    title: "Women's Casual Slim Fit T-Shirt",
    description:
      "Lightweight fabric with a slim fit, perfect for daily wear and layering.",
    price: 15.99,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    rating: { rate: 4.5, count: 320 },
    inventory: 52,
  },
  {
    id: 5,
    title: "John Hardy Women's Necklace",
    description:
      "A unique handcrafted necklace made with premium quality materials and attention to detail.",
    price: 695,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.6, count: 400 },
    inventory: 12,
  },
  {
    id: 6,
    title: "Solid Gold Petite Micropave",
    description:
      "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in Pakistan.",
    price: 168,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 3.9, count: 70 },
    inventory: 16,
  },
];

const getFallbackProducts = (): Product[] => fallbackProducts;

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data ?? [];
    return data.map((item: Product) => ({
      ...item,
      inventory: item.inventory ?? Math.max(10, 100 - item.id * 6),
    }));
  } catch (error) {
    return getFallbackProducts();
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return {
      ...response.data,
      inventory: response.data.inventory ?? Math.max(10, 100 - Number(id) * 6),
    };
  } catch (error) {
    const product = getFallbackProducts().find((item) => item.id === Number(id));

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
};
