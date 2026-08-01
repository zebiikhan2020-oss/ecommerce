"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProductDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setProduct(data.product);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchReviews() {
    try {
      const response = await fetch(`/api/reviews?productId=${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error) {
      console.log(error);
    }
  }

  async function addToCart() {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function buyNow() {
    try {
      const response = await fetch("/api/buy-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
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
          productId: product.id,
          quantity: 1,
        })
      );

      router.push("/checkout");

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function contactSeller() {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      router.push(`/messages/${data.conversation.id}`);

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleAddToWishlist() {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: "" });
        fetchReviews();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  function renderStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <div className="text-gray-500 font-bold text-sm tracking-wider uppercase animate-pulse">Syncing Inventory...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      
      {/* Decorative Modern Background Mesh Glow Shapes */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16 bg-white/70 backdrop-blur-md selection:bg-blue-500 selection:text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Image Container Showcase (Animated Drop & Elastic Bounce) */}
          <motion.div 
            initial={{ opacity: 0, y: -200, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 60, 
              damping: 15, 
              duration: 0.9 
            }}
            className="sticky top-6 bg-gray-50/70 p-4 sm:p-6 rounded-3xl border border-gray-100 flex items-center justify-center shadow-xl shadow-blue-950/5 group overflow-hidden"
          >
            {/* Soft inner glow behind image */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Out of Stock Overlay Badge */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
                <span className="bg-rose-600 text-white text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">
                  Out of Stock ❌
                </span>
              </div>
            )}

            <img
              src={product.image ? `/images/${product.image}` : "/images/no-image.png"}
              alt={product.title}
              className="relative z-10 w-full max-h-[480px] rounded-2xl object-contain shadow-md bg-white mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </motion.div>

          {/* Right Column: Product Core Details (Staggered Animation Feed) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col"
          >
            {/* Category Pill Badge */}
            <div className="inline-block self-start bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              {product.category.name}
            </div>

            {/* Product Headline Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Rating Summary Area */}
            <div className="flex items-center gap-3 mt-4 border-b border-gray-100 pb-5 w-full">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                <span className="text-amber-500 text-base font-bold leading-none">
                  {renderStars(Math.round(avgRating))}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-500 hover:underline cursor-pointer hover:text-blue-600 transition-colors">
                ({totalReviews} verified user feedback submissions)
              </span>
            </div>

            {/* Product Long Description */}
            <p className="text-gray-600 mt-6 text-sm sm:text-base leading-relaxed font-normal">
              {product.description || "No specific technical specifications are available for this unique tech artifact."}
            </p>

            {/* Premium Pricing Block */}
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100/30 p-4 sm:p-5 rounded-2xl border border-gray-100 flex items-baseline gap-2">
              <span className="text-gray-400 text-sm font-bold uppercase">Price Matrix:</span>
              <h2 className="text-3xl sm:text-4xl text-blue-600 font-black tracking-tight">
                Rs. {product.price.toLocaleString()}
              </h2>
            </div>

            {/* Inventory Stock & Seller Info Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white border border-gray-150 p-3.5 rounded-xl shadow-xs">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Availability</p>
                <p className="text-sm font-extrabold text-gray-800 mt-0.5">
                  {product.stock > 0 ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      {product.stock} Units In Stock
                    </span>
                  ) : (
                    <span className="text-rose-600">Out of Stock</span>
                  )}
                </p>
              </div>
              
              <div className="bg-white border border-gray-150 p-3.5 rounded-xl shadow-xs">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Verified Seller</p>
                <p className="text-sm font-extrabold text-gray-800 mt-0.5 flex items-center gap-1">
                  🛡️ {product.seller.name}
                </p>
              </div>
            </div>

            {/* Premium Call To Action Buttons Matrix (Animated Gradients & Scales) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 w-full">
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-900/10 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none text-xs uppercase tracking-wider"
              >
                {product.stock === 0 ? "🚫 Item Depleted" : "🛒 Add To Cart"}
              </button>

              <button
                onClick={buyNow}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-900/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none text-xs uppercase tracking-wider"
              >
                {product.stock === 0 ? "🚫 Item Depleted" : "⚡ Purchase Instantly"}
              </button>

              <button
                onClick={handleAddToWishlist}
                className="w-full bg-gradient-to-r from-rose-50 to-orange-50 text-rose-600 border border-rose-100 font-bold py-3.5 px-4 rounded-xl hover:from-rose-100 hover:to-orange-100 transition-all transform active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                ❤️ Wishlist
              </button>

              <button
                onClick={contactSeller}
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:from-black hover:to-black transition-all transform active:scale-95 shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                💬 Message Seller
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section Block (Cascade Pop-In Animation) */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 border-t border-gray-100 pt-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Customer Feedbacks</h2>
              <p className="text-sm text-gray-400 font-medium mt-0.5">Hear directly from verified buyer critique summaries</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="self-start sm:self-auto bg-blue-50 text-blue-600 border border-blue-200 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-0.5 active:scale-97 text-sm shadow-sm"
            >
              {showReviewForm ? "Close Form" : "✍️ Write Feedback"}
            </button>
          </div>

          {/* Dynamic Review Form Component */}
          {showReviewForm && (
            <div className="bg-gray-50/70 backdrop-blur-md border border-gray-150 rounded-2xl p-6 mb-10 shadow-inner max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Share Your Tech Experience</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Assign Rating</label>
                  <select
                    value={reviewData.rating}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, rating: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 bg-white font-semibold rounded-xl p-3 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ - Premium Performance</option>
                    <option value={4}>⭐⭐⭐⭐ - Robust Build Quality</option>
                    <option value={3}>⭐⭐⭐ - Functional Capabilities</option>
                    <option value={2}>⭐⭐ - Moderate Usage</option>
                    <option value={1}>⭐ - Subpar Experience</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Detailed critique Message</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                    rows={4}
                    placeholder="Share specific insights on performance, build, or features."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-97 shadow-md shadow-blue-900/10 text-sm"
                >
                  Submit verified critique
                </button>
              </form>
            </div>
          )}

          {/* Reviews Cards Feed */}
          {reviews.length === 0 ? (
            <div className="bg-gray-50/70 border border-gray-200 border-dashed rounded-2xl p-12 text-center max-w-xl mx-auto">
              <span className="text-3xl block mb-2">💬</span>
              <p className="text-gray-700 font-bold text-base">No critique submissions found</p>
              <p className="text-gray-400 text-xs mt-1">Be the trailblazer user to post a detailed critique session!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((review, index) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-150/80 p-5 rounded-2xl shadow-xs flex flex-col justify-between transition-shadow hover:shadow-xl hover:shadow-blue-950/5 hover:border-gray-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs uppercase tracking-tighter shadow-sm">{review.user.name.substring(0, 2)}</span>
                        <div>
                          <h4 className="font-extrabold text-gray-800 text-sm sm:text-base">{review.user.name}</h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="text-amber-500 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg text-sm tracking-tighter leading-none shadow-sm">
                        {renderStars(review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm mt-4 leading-relaxed italic bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}