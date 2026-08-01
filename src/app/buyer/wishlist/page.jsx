"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerWishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      const response = await fetch("/api/wishlist");
      const data = await response.json();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId) {
    if (!confirm("Remove this item from wishlist?")) return;

    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        fetchWishlist();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleAddToCart(productId) {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 bg-white px-8 py-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Loading Wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Saved Items
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              My Wishlist ❤️
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Manage your favorite items and move them to your cart when you are ready.
            </p>
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl self-start sm:self-auto">
            Total Items: <span className="text-blue-600 font-black">{wishlist.length}</span>
          </div>
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-blue-100">
              🛍️
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Your wishlist is empty</p>
              <p className="text-xs text-slate-500 mt-0.5">Explore our products and save your favorites here.</p>
            </div>
            <button
              onClick={() => router.push("/products")}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-sm inline-block"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative bg-slate-100 aspect-video sm:aspect-square w-full overflow-hidden">
                    <img
                      src={
                        item.product.image
                          ? `/images/${item.product.image}`
                          : "/images/no-image.png"
                      }
                      alt={item.product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 flex items-center justify-center font-bold text-xs shadow-sm transition-all cursor-pointer"
                      title="Remove from wishlist"
                    >
                      ✕
                    </button>
                    {item.product.stock === 0 && (
                      <span className="absolute bottom-3 left-3 bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                        {item.product.category?.name || "General"}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 mt-2 leading-snug">
                        {item.product.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>Seller: <strong className="text-slate-700">{item.product.seller?.name || "Store"}</strong></span>
                      <span>Stock: <strong className="text-slate-700">{item.product.stock}</strong></span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg sm:text-xl font-black text-slate-900">
                        Rs. {item.product.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    disabled={item.product.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-center"
                  >
                    {item.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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