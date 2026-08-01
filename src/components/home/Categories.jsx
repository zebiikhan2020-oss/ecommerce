"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }

  // Helper function to dynamically match beautiful icons based on category name
  function getCategoryEmoji(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("access")) return "🔌";
    if (lowerName.includes("audi")) return "🎧";
    if (lowerName.includes("elect")) return "⚡";
    if (lowerName.includes("lap") || lowerName.includes("comp")) return "💻";
    if (lowerName.includes("mob") || lowerName.includes("phon")) return "📱";
    if (lowerName.includes("tab")) return "🧮";
    if (lowerName.includes("watch") || lowerName.includes("clock")) return "⌚";
    return "📦"; // Default icon for other categories
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <div className="text-sm font-bold text-gray-500 tracking-wider uppercase">
          Loading Premium Categories...
        </div>
      </div>
    );
  }

  return (
    /* Pure section ko motion dynamic banaya taake ye Hero ki tarah ooper se spring drop kare */
    <motion.section 
      initial={{ opacity: 0, y: -150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 55, 
        damping: 14,
        duration: 0.8
      }}
      className="bg-white py-16 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Shop by Categories
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Find exactly what you're looking for instantly
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 border-dashed rounded-2xl py-16 text-center">
            <span className="text-4xl block mb-2">📁</span>
            <h3 className="text-lg font-bold text-gray-700">No Categories Found</h3>
            <p className="text-gray-400 text-sm mt-0.5">Check back later or contact admin.</p>
          </div>
        ) : (
          /* Professional Responsive Grid Layout */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05, // Har card thode gap ke sath smoothly pop hoga
                  ease: "easeOut"
                }}
              >
                <Link
                  href={`/products?category=${category.id}`}
                  className="group flex flex-col items-center justify-center p-6 bg-gray-50/60 rounded-2xl border border-gray-150/80 transition-all duration-300 hover:bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-950/5 active:scale-95 text-center cursor-pointer h-full"
                >
                  {/* Dynamic Category Emoji Container */}
                  <span className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-3">
                    {getCategoryEmoji(category.name)}
                  </span>

                  {/* Category Title */}
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </motion.section>
  );
}