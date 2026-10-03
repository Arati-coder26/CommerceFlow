import axios from "axios";
import { Product } from "../types/product";
 
const API_URL = "https://fakestoreapi.com/products";
 
export const getProducts = async (): Promise<Product[]> => {
const response = await axios.get(API_URL);
return response.data;
};
 
export const getProductById = async (
id: string
): Promise<Product> => {
const response = await axios.get(`${API_URL}/${id}`);
return response.data;
};
