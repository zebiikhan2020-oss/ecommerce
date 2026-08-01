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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("categoryId", formData.categoryId);

      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await fetch("/api/product", {
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
        router.push("/seller/products");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen w-full bg-white text-white px-4 sm:px-6 py-16 font-sans antialiased">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between px-1">
          <Link 
            href="/seller/products" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-blue-200 transition-colors bg-[#3b82f6] px-4 py-2 rounded-xl shadow-sm"
          >
            <span>←</span> Back to Store
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-[#3b82f6] px-3 py-1 rounded-full shadow-sm">
            Catalog Core
          </span>
        </div>

        {/* Light Blue Card */}
        <div className="bg-[#60a5fa] border border-blue-400 rounded-3xl shadow-xl p-6 sm:p-10">
          
          <div className="mb-8 border-b border-blue-400 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Launch Product Asset
            </h1>
            <p className="text-xs font-medium text-white mt-1.5 leading-relaxed opacity-90">
              Fill out the required parameters to instantly broadcast this item configuration onto the active store listings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input: Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block">Product Title</label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Premium Smart Leather Pack"
                className="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3.5 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-hidden transition-all duration-200"
                required
              />
            </div>

            {/* Input: Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block">Detailed Specifications</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe structural product configurations, key technical specs, sizing..."
                className="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3.5 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-hidden transition-all duration-200 resize-none leading-relaxed"
                required
              />
            </div>

            {/* Financial Parameters Split Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Input: Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white tracking-wider uppercase block">Retail Valuation</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 font-mono">PKR</span>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl pl-12 pr-4 py-3.5 text-sm font-mono text-black font-bold placeholder:text-gray-400 focus:outline-hidden transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Input: Stock */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white tracking-wider uppercase block">Available Stock</label>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  className="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3.5 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-hidden transition-all duration-200"
                  required
                />
              </div>

            </div>

            {/* Input: Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white tracking-wider uppercase block">System Classification</label>
              <div className="relative">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3.5 text-sm font-semibold text-black focus:outline-hidden transition-all duration-200 cursor-pointer appearance-none"
                  style={{backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 16px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat'}}
                  required
                >
                  <option value="" className="text-gray-400 bg-white">Select parameter node...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="text-black bg-white">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input: Media Frame */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-white tracking-wider uppercase block">Product Graphic Asset</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                
                {/* Upload Core Trigger */}
                <div className="sm:col-span-2 relative border border-dashed border-blue-200 hover:border-blue-600 bg-white rounded-xl p-6 transition-all duration-200 flex flex-col items-center justify-center text-center group cursor-pointer min-h-[120px]">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-1 pointer-events-none">
                    <span className="text-xl block">📸</span>
                    <p className="text-xs font-bold text-black">Upload showcasing media</p>
                    <p className="text-[10px] text-gray-500 font-medium">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                </div>

                {/* Display Panel */}
                <div className="border border-blue-200 bg-white rounded-xl h-[120px] flex items-center justify-center p-2 relative overflow-hidden shadow-inner">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Standby
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-950 active:scale-[0.99] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-all duration-200 text-center cursor-pointer"
              >
                Publish Store Asset
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}