import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AdminCategory {
  _id: string;
  name: string;
}

interface AdminProduct {
  _id: string;
  title: string;
  price: number;
  description: string;
  category?: AdminCategory;
}

interface AdminOrder {
  _id: string;
  razorpayOrderId?: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [images, setImages] = useState<FileList | null>(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (!storedToken) {
      navigate("/admin/login");
    } else {
      setToken(storedToken);
      fetchData(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (authToken: string) => {
    try {
      const [prodRes, catRes, ordRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/products/categories`),
        fetch(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${authToken}` } }),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    }
  };

  const handleAddOrEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      const url = editingProductId
        ? `${API_URL}/api/products/${editingProductId}`
        : `${API_URL}/api/products`;
      const method = editingProductId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success(
          editingProductId ? "Product updated successfully!" : "Product added successfully!",
        );
        resetForm();
        fetchData(token);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save product");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const resetForm = () => {
    setNewProduct({ title: "", description: "", price: "", category: "" });
    setImages(null);
    setEditingProductId(null);
  };

  const handleEditProductClick = (product: AdminProduct) => {
    setEditingProductId(product._id);
    setNewProduct({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category?._id || "",
    });
    setImages(null);
    // Optionally scroll to top to see form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Product deleted");
        fetchData(token!);
        if (editingProductId === id) resetForm();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Manage Products</TabsTrigger>
          <TabsTrigger value="orders">Manage Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add/Edit Product Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 h-fit">
              <h2 className="text-xl font-semibold mb-4">
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleAddOrEditProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Images (Multiple)</label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImages(e.target.files)}
                  />
                  {editingProductId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep existing images.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingProductId ? "Update Product" : "Add Product"}
                  </Button>
                  {editingProductId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 max-h-[700px] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-md dark:border-gray-700 gap-4"
                  >
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-gray-500">
                        ₹{product.price} | {product.category?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProductClick(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && <p className="text-gray-500">No products found.</p>}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Customer Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b dark:border-gray-700">
                      <td className="px-6 py-4">{order.razorpayOrderId || order._id}</td>
                      <td className="px-6 py-4">
                        {order.customerName}
                        <br />
                        <span className="text-xs">{order.customerEmail}</span>
                      </td>
                      <td className="px-6 py-4">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
