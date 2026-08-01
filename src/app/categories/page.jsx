"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getCategoryIcon(name) {
    const category = name.toLowerCase();

    if (category.includes("mobile")) return "📱";
    if (category.includes("laptop")) return "💻";
    if (category.includes("watch")) return "⌚";
    if (category.includes("audio")) return "🎧";
    if (category.includes("electronic")) return "🖥️";
    if (category.includes("fashion")) return "👕";
    if (category.includes("gaming")) return "🎮";
    if (category.includes("camera")) return "📷";
    if (category.includes("accessories")) return "🎒";
    if (category.includes("home")) return "🏠";

    return "📦";
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Hero */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl text-white p-12 mb-14 text-center">

          <h1 className="text-5xl font-extrabold mb-5">
            Shop by Categories
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-8">
            Browse products by category and quickly discover everything you
            need in one place.
          </p>

        </div>

        {/* Categories */}

        {categories.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">

            <div className="text-7xl mb-6">
              📂
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No Categories Available
            </h2>

            <p className="text-gray-500">
              Categories will appear here after they are created by the admin.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">

            {categories.map((category) => (

              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center border border-gray-200 hover:border-blue-600 hover:-translate-y-2"
              >

                <div className="text-5xl mb-5">
                  {getCategoryIcon(category.name)}
                </div>

                <h2 className="text-2xl font-bold mb-3">
                  {category.name}
                </h2>

                <p className="text-gray-500 mb-5">
                  {category.products?.length || 0} Products
                </p>

                <span className="inline-flex items-center text-blue-600 font-semibold">
                  Browse Products →
                </span>

              </Link>

            ))}

          </div>

        )}

        {/* Why Shop With iShop */}

        <div className="mt-20">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold text-gray-900">
              Why Shop With iShop?
            </h2>

            <p className="text-gray-600 mt-3 text-lg">
              Enjoy a safe, simple and reliable shopping experience.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">

              <div className="text-5xl mb-5">
                🚚
              </div>

              <h3 className="text-xl font-bold mb-3">
                Fast Delivery
              </h3>

              <p className="text-gray-600">
                Receive your orders quickly with reliable delivery services.
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">

              <div className="text-5xl mb-5">
                🔒
              </div>

              <h3 className="text-xl font-bold mb-3">
                Secure Shopping
              </h3>

              <p className="text-gray-600">
                Shop confidently with a secure and protected experience.
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">

              <div className="text-5xl mb-5">
                💳
              </div>

              <h3 className="text-xl font-bold mb-3">
                Easy Payments
              </h3>

              <p className="text-gray-600">
                Complete your purchases easily with multiple payment options.
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">

              <div className="text-5xl mb-5">
                🎧
              </div>

              <h3 className="text-xl font-bold mb-3">
                Customer Support
              </h3>

              <p className="text-gray-600">
                Our support team is ready to help whenever you need assistance.
              </p>

            </div>

          </div>

        </div>

        {/* Ready to Shop */}

<div className="mt-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-xl">

  <h2 className="text-4xl font-bold mb-4">
    Ready to Start Shopping?
  </h2>

  <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-8 mb-8">
    Explore thousands of quality products from trusted sellers. Find great
    deals, secure payments and fast delivery—all in one place.
  </p>

  <Link
    href="/products"
    className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
  >
    Browse All Products →
  </Link>

</div>

      </div>

    </div>
  );
}