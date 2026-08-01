"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.log(error);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("categoryId", formData.categoryId);

      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      alert(result.message);

      if (response.ok) {
        setFormData({
          title: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
        });
        setImageFile(null);
        setPreview("");
        router.push("/admin/products");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans px-4 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Top Navigation / Header */}
        <div className="flex items-center justify-between bg-sky-50 p-6 rounded-xl border border-sky-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Add New Product 📦
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Create and list a new item into your store catalog.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="bg-white hover:bg-sky-100 text-sky-700 font-semibold text-xs px-4 py-2 rounded-lg transition border border-sky-300 shadow-2xs"
          >
            ← Back
          </Link>
        </div>

        {/* Form Card (Sky Blue Theme with White Inputs) */}
        <div className="bg-sky-50 rounded-xl border border-sky-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Product Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Wireless Gaming Mouse"
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                required
              />
            </div>

            {/* Category & Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Price (Rs.)
                </label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                  required
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Stock Quantity
              </label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 50"
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide product features, specs, and details..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                rows="4"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Product Image (Max 5MB)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-100 file:text-sky-800 hover:file:bg-sky-200 transition"
              />

              {preview && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Image Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border border-sky-300 bg-white shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-3 rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving Product..." : "Save & Add Product"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}