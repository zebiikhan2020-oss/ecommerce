"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const keyword = searchParams.get("search") || "";
    setSearch(keyword);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  async function fetchProducts() {
    try {
      const response = await fetch(
        `/api/products?search=${encodeURIComponent(search)}&category=${category}&page=${page}&limit=20`
      );
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function addToCart(productId) {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  }

  async function messageSeller(productId) {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      window.location.href = `/messages/${data.conversation.id}`;
    } catch (error) {
      console.log(error);
    }
  }

  async function addToWishlist(productId) {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  }

  async function buyNow(productId) {
    try {
      const response = await fetch("/api/buy-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      sessionStorage.setItem(
        "buyNow",
        JSON.stringify({
          productId,
          quantity: 1,
        })
      );
      router.push("/checkout");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            {category ? "✨ Category Products" : "🛍️ Explore All Products"}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Showing {products.length} beautiful items
          </p>
        </div>

        {/* Premium Search Bar */}
        <div className="mb-10 relative max-w-2xl shadow-sm rounded-2xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search premium products, brands, electronics..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-200 bg-white pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium shadow-inner"
          />
        </div>

        {/* Main Grid Content */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-200 rounded-3xl shadow-sm">
            <span className="text-5xl block mb-4">📦</span>
            <h2 className="text-2xl font-extrabold text-gray-800">No Products Found</h2>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * (products.indexOf(product) % 8),
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image & Top Overlays */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img
                    src={product.image ? `/images/${product.image}` : "/images/no-image.png"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Category Pill Tag */}
                  {product.category?.name && (
                    <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm border border-gray-100">
                      🏷️ {product.category.name}
                    </span>
                  )}

                  {/* Clean Float Wishlist Icon */}
                  <button
                    onClick={() => addToWishlist(product.id)}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-all duration-300 hover:bg-red-50 hover:text-red-500 hover:scale-110 border border-gray-100 cursor-pointer"
                    title="Add to Wishlist"
                  >
                    ❤️
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Seller Indicator */}
                  {product.seller?.name && (
                    <div className="mb-1.5 flex items-center text-[11px] font-medium text-gray-400">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                      Seller: <span className="text-gray-600 font-semibold ml-1">{product.seller.name}</span>
                    </div>
                  )}

                  {/* Product Title */}
                  <h2 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h2>

                  {/* Description Description */}
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {product.description || "No description description provided for this premium item."}
                  </p>

                  {/* Price Section */}
                  <div className="mt-auto pt-3 flex items-baseline justify-between border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Price</span>
                      <span className="text-lg font-black text-gray-900">
                        Rs. {Number(product.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Smart Professional Grid Buttons */}
                  <div className="mt-4 space-y-2">
                    {/* Primary Purchase Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addToCart(product.id)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-800 transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-95 cursor-pointer"
                      >
                        🛒 Cart
                      </button>

                      <button
                        onClick={() => buyNow(product.id)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-100 transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-95 cursor-pointer"
                      >
                        ⚡ Buy Now
                      </button>
                    </div>

                    {/* Secondary Contact Row */}
                    <button
                      onClick={() => messageSeller(product.id)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-98 cursor-pointer"
                    >
                      💬 Message Seller
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Premium Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-14 pt-6 border-t border-gray-200">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            ← Prev
          </button>

          <span className="text-sm font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-xl">
            Page {page} <span className="text-gray-400 font-normal">of</span> {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}