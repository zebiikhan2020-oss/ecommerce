"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans px-4 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Manage Products 📦
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Oversee platform catalog, check active inventory, and manage listings.
            </p>
          </div>
          <Link
            href="/admin/products/add"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition shadow-sm text-center"
          >
            + Add New Product
          </Link>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">All Products List</h2>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
              Total: <span className="text-purple-600 font-bold">{products.length}</span>
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              Loading products...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
                    <th className="p-3.5 sm:px-6">Image</th>
                    <th className="p-3.5 sm:px-6">Title</th>
                    <th className="p-3.5 sm:px-6">Seller</th>
                    <th className="p-3.5 sm:px-6">Category</th>
                    <th className="p-3.5 sm:px-6">Price</th>
                    <th className="p-3.5 sm:px-6">Stock</th>
                    <th className="p-3.5 sm:px-6">Status</th>
                    <th className="p-3.5 sm:px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm font-medium text-slate-700">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 sm:px-6">
                          <img
                            src={
                              product.image
                                ? `/images/${product.image}`
                                : "/images/no-image.png"
                            }
                            alt={product.title}
                            className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-white"
                          />
                        </td>
                        <td className="p-3.5 sm:px-6 font-bold text-slate-900 max-w-xs truncate">
                          {product.title}
                        </td>
                        <td className="p-3.5 sm:px-6 text-slate-600">
                          {product.seller?.name || "N/A"}
                        </td>
                        <td className="p-3.5 sm:px-6 text-slate-600">
                          {product.category?.name || "N/A"}
                        </td>
                        <td className="p-3.5 sm:px-6 font-semibold text-purple-700">
                          Rs. {product.price}
                        </td>
                        <td className="p-3.5 sm:px-6">
                          <span className={`font-bold text-xs ${product.stock > 0 ? "text-slate-700" : "text-rose-600"}`}>
                            {product.stock > 0 ? `${product.stock} Units` : "Out of Stock ❌"}
                          </span>
                        </td>
                        <td className="p-3.5 sm:px-6">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                              product.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-3.5 sm:px-6 text-center whitespace-nowrap">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-xs px-3 py-1.5 rounded-md mr-2 transition inline-block"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs px-3 py-1.5 rounded-md transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}