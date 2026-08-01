"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  async function fetchLatestProducts() {
    try {
      const res = await fetch("/api/products?limit=20");
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">🔥 Latest Products</h2>
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            Loading latest inventory...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50/50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Modern Section Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              🔥 Latest Products
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium hidden sm:block">
              Freshly added tech items by authorized merchants
            </p>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:border-blue-500 hover:text-blue-600 transition duration-300"
          >
            View All <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <span className="text-4xl block mb-2">📥</span>
            <h3 className="text-xl font-bold text-gray-800">No Products Found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Products will appear here automatically after merchants populate the inventory.
            </p>
          </div>
        ) : (
          /* Main Responsive Grid Container */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * (products.indexOf(product) % 8),
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -6,
                }}
                /* Yahan humne card ko full-height flex banaya taake text cut na ho aur button hamesha bottom par stick rahe */
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm hover:shadow-xl transition-all duration-300 min-h-[430px]"
              >
                
                {/* Top Half: Image & Tag Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img
                    src={product.image ? `/images/${product.image}` : "/images/no-image.png"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {product.category?.name && (
                    <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-600 border border-gray-100 shadow-sm">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Bottom Half: Content details with calculated growth wrapper */}
                <div className="flex flex-col flex-1 p-4 justify-between">
                  
                  {/* Title & Description Box */}
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {product.description || "No specific detailed descriptions uploaded yet."}
                    </p>
                  </div>

                  {/* Pricing Matrix & Action Button (Will always stay properly inside the card) */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex flex-col mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Price</span>
                      <span className="text-base font-black text-gray-900">
                        Rs. {Number(product.price).toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="w-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-100 transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-center cursor-pointer"
                    >
                      View Details 🔍
                    </Link>
                  </div>
                  
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}