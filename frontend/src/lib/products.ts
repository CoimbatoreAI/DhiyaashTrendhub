import { useState, useEffect } from "react";

export type Category = "Kitchen" | "Return Gifts" | "Home & Bath" | string;

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
}

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface ApiCategory {
  _id: string;
  name: string;
}

interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  category?: ApiCategory;
  images?: string[];
  description: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/products/categories`),
        ]);

        if (prodRes.ok) {
          const data: ApiProduct[] = await prodRes.json();
          const mappedProducts: Product[] = data.map((p) => ({
            id: p._id,
            name: p.title,
            price: p.price,
            category: p.category?.name || "Uncategorized",
            image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png",
            description: p.description,
          }));
          setProducts(mappedProducts);
        }

        if (catRes.ok) {
          const data: ApiCategory[] = await catRes.json();
          setCategories(data.map((c) => c.name));
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, categories, loading };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (res.ok) {
          const p: ApiProduct = await res.json();
          setProduct({
            id: p._id,
            name: p.title,
            price: p.price,
            category: p.category?.name || "Uncategorized",
            image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png",
            description: p.description,
          });
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return { product, loading };
}
