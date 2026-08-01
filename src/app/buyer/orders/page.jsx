"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to cancel order");
        return;
      }

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Loading Orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-slate-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-slate-200">
            📦
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-950">No Orders Found</h2>
            <p className="text-xs text-slate-500 mt-1">You haven't placed any orders yet. Explore our products to start shopping.</p>
          </div>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header (Dark Card on White BG) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
              Purchase History
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              My Orders
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Track and review all your past and active orders.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all self-start sm:self-auto shadow-md"
          >
            Shop More 🛍️
          </Link>
        </div>

        {/* Orders List (Light Gray Cards with Status-based Left Borders) */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusLower = order.status?.toLowerCase() || "";
            const isCancelled = statusLower.includes("cancel");
            const isPending = statusLower === "pending";

            // Border color assignment: Cancelled = Red (rose), Pending = Yellow (amber), Shipped/Delivered/Others = Green (emerald)
            const leftBorderColor = isCancelled
              ? "border-l-rose-500"
              : isPending
              ? "border-l-amber-500"
              : "border-l-emerald-500";

            return (
              <div
                key={order.id}
                className={`bg-slate-50 rounded-3xl border border-slate-200 border-l-4 ${leftBorderColor} shadow-2xs overflow-hidden transition-all hover:border-slate-300`}
              >
                {/* Order Top Bar */}
                <div className="bg-white/80 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-black text-slate-950">
                        Order #{order.id}
                      </h2>
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500">Total Amount</p>
                      <p className="text-base sm:text-lg font-black text-blue-600">
                        Rs. {order.totalPrice}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${
                          isCancelled
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : isPending
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>

                      {/* Cancel Button (Only visible if pending) */}
                      {isPending && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        idx !== 0 ? "border-t border-slate-200 pt-4" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0 relative">
                          <img
                            src={
                              item.product?.image
                                ? `/images/${item.product.image}`
                                : "/images/no-image.png"
                            }
                            className="w-full h-full object-cover"
                            alt={item.product?.title || "Product"}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-slate-900 truncate">
                            {item.product?.title || "Product Name"}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Qty: <span className="text-slate-900 font-bold">{item.quantity}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0 pl-20 sm:pl-0">
                        <p className="text-xs text-slate-400 font-medium">Price per unit</p>
                        <p className="text-sm font-bold text-slate-900">Rs. {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}