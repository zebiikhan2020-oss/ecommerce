"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/product/my-products");
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white border-2 border-slate-300 p-8 rounded-2xl shadow-md text-center max-w-sm w-full">
          <div className="h-7 w-7 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-base font-black text-slate-800 tracking-tight">Loading Inventory Fleet...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-100 px-4 sm:px-6 py-12 overflow-hidden selection:bg-emerald-700 selection:text-white">
      
      {/* Split-Cinematic Animation System */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes frameFromBottom {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes imageFromTop {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-card-frame {
          animation: frameFromBottom 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        .animate-image-split {
          animation: imageFromTop 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
      `}} />

      {/* Decorative Radial Background Layers */}
      <div className="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/5 blur-[120px]" />
      <div className="absolute -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Section Header */}
        <div className="relative pb-5 border-b-2 border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 shadow-xs border border-slate-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Asset Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Products Inventory
            </h1>
          </div>

          <Link
            href="/seller/products/add"
            className="inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-sm transition-all text-center cursor-pointer whitespace-nowrap"
          >
            + Add New Asset
          </Link>
        </div>

        {/* Empty Catalog View */}
        {products.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 p-10 rounded-2xl shadow-sm text-center max-w-sm mx-auto space-y-4">
            <div className="text-4xl">📂</div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">No Products Found</h3>
              <p className="text-slate-600 text-xs font-semibold mt-1">
                Your direct digital catalog parameters are currently empty.
              </p>
            </div>
          </div>
        ) : (
          
          /* Auto-row alignment setup for uniform card sizing */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white border-2 border-slate-300/80 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-400 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group animate-card-frame"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                
                {/* Top Half Section */}
                <div className="flex flex-col flex-1">
                  
                  {/* Fixed Image Container with Out of Stock Overlay */}
                  <div 
                    className="relative h-48 w-full bg-slate-50 border-b border-slate-200 overflow-hidden shrink-0 animate-image-split p-3 flex items-center justify-center"
                    style={{ animationDelay: `${(index * 60) + 150}ms` }}
                  >
                    {/* Out of Stock Overlay Badge */}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md">
                          Out of Stock ❌
                        </span>
                      </div>
                    )}

                    <img
                      src={
                        product.image
                          ? `/images/${product.image}`
                          : "/images/no-image.png"
                      }
                      alt={product.title}
                      className="w-full h-full object-contain scale-100 group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Body Content - Spreads elements uniformly */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-sm font-black text-slate-900 tracking-tight line-clamp-1 group-hover:text-emerald-700 transition-colors duration-200">
                        {product.title}
                      </h2>
                      {product.category?.name && (
                        <span className="inline-block text-[10px] font-bold text-slate-500 tracking-wide">
                          {product.category.name}
                        </span>
                      )}
                      
                      <p className="text-slate-600 text-[11px] font-semibold leading-relaxed line-clamp-3 pt-1">
                        {product.description || "No description provided."}
                      </p>
                    </div>

                    {/* Uniform Parameter Metrics */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Asset Valuation</span>
                        <span className="font-mono font-black text-sm text-slate-900">
                          Rs. {product.price ? product.price.toLocaleString() : "0"}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Integrity</span>
                        <span className={`text-[11px] font-black ${
                          product.stock > 0 ? "text-slate-800" : "text-rose-600"
                        }`}>
                          {product.stock > 0 ? `${product.stock} Units` : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Always Aligned Action Buttons Footer */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2 shrink-0">
                  <Link
                    href={`/seller/products/edit/${product.id}`}
                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 active:scale-97 border border-slate-300 text-slate-800 text-[11px] font-black uppercase tracking-wider py-2 rounded-xl transition-all shadow-2xs text-center"
                  >
                    ✏️ Edit
                  </Link>
                  
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-rose-50 hover:bg-rose-100 active:scale-97 border border-rose-200 text-rose-700 text-[11px] font-black uppercase tracking-wider py-2 rounded-xl transition-all shadow-2xs text-center cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}