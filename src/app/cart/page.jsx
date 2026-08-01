"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState([]); // Default mein empty array (0 items selected)

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setCart(data.cart);
      // Yahan se auto-select wala code hata diya gaya hai taake default mein kuch select na ho
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(cartItemId, quantity) {
    if (quantity < 1) return;
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
          quantity,
        }),
      });

      const data = await response.json();
      alert(data.message);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  }

  async function removeItem(cartItemId) {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
        }),
      });

      const data = await response.json();
      alert(data.message);
      
      setSelectedItemIds((prev) => prev.filter((id) => id !== cartItemId));
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  }

  // Toggle single checkbox
  function toggleSelectItem(id) {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Select all or Deselect all
  function toggleSelectAll() {
    if (!cart || !cart.items) return;
    if (selectedItemIds.length === cart.items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cart.items.map((item) => item.id));
    }
  }

  function handleCheckout() {
    if (selectedItemIds.length === 0) {
      alert("Please select at least one item to proceed to checkout.");
      return;
    }
    router.push(`/checkout?items=${selectedItemIds.join(",")}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Loading Cart...</span>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans">
        <div className="text-center space-y-4 max-w-sm bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-blue-100">
            🛒
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 mt-1">Looks like you haven't added anything to your shopping bag yet.</p>
          </div>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-xs transition-all"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = cart.items.reduce((total, item) => {
    if (selectedItemIds.includes(item.id)) {
      return total + item.product.price * item.quantity;
    }
    return total;
  }, 0);

  const isAllSelected = cart.items.length > 0 && selectedItemIds.length === cart.items.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Shopping Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              My Cart ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select desired items to proceed to secure checkout.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all self-start sm:self-auto text-center"
          >
            Continue Shopping 🛍️
          </Link>
        </div>

        {/* Select All Bar */}
        <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Select All Items ({selectedItemIds.length}/{cart.items.length} Selected)
            </span>
          </label>
        </div>

        {/* Cart Items List */}
        <div className="space-y-4">
          {cart.items.map((item) => {
            const isChecked = selectedItemIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all ${
                  isChecked ? "border-blue-500 bg-blue-50/10" : "border-slate-200"
                }`}
              >
                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                  <img
                    src={
                      item.product.image
                        ? `/images/${item.product.image}`
                        : "/images/no-image.png"
                    }
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {item.product.category?.name || "General"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      Seller: <strong className="text-slate-800">{item.product.seller?.name || "Store"}</strong>
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                    {item.product.title}
                  </h2>

                  <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                    {item.product.description}
                  </p>

                  <p className="text-base font-extrabold text-blue-600 pt-1">
                    Rs. {item.product.price}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-800 font-bold text-sm cursor-pointer shadow-2xs"
                    >
                      -
                    </button>

                    <span className="font-extrabold text-sm w-6 text-center text-slate-900">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-800 font-bold text-sm cursor-pointer shadow-2xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Remove 🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Checkout Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Cart Summary ({selectedItemIds.length} items selected)
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Shipping & taxes calculated at checkout
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Subtotal Amount</span>
            <span className="text-2xl font-black text-blue-600">
              Rs. {totalPrice}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={handleCheckout}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-xs transition-all cursor-pointer text-center"
            >
              Proceed to Checkout 💳
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}