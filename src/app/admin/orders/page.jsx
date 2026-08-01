"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [showCancelled, setShowCancelled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Helper for status badge styling
  function getStatusBadge(status) {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans px-4 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header & Toggle */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Manage Orders 🛒
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Oversee customer orders, update delivery statuses, and track revenue breakdown.
            </p>
          </div>
          <button
            onClick={() => setShowCancelled(!showCancelled)}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition shadow-sm w-full sm:w-auto text-center"
          >
            {showCancelled ? "Hide Cancelled Orders" : "Show Cancelled Orders"}
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center text-slate-500 font-medium">
            Loading orders...
          </div>
        ) : (
          <div className="space-y-6">
            {orders.filter((order) => showCancelled || order.status !== "CANCELLED").length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center text-slate-400 font-medium">
                No Orders Found
              </div>
            ) : (
              orders
                .filter((order) => showCancelled || order.status !== "CANCELLED")
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 transition hover:border-slate-300"
                  >
                    {/* Order Top Details */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5 pb-5 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-lg font-bold text-slate-900">
                            Order #{order.id}
                          </h2>
                          <span className={`px-3 py-1 rounded-md text-xs font-bold border uppercase tracking-wide ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                          Buyer: <span className="font-normal text-slate-600">{order.buyer.name} ({order.buyer.email})</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Placed on: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-start lg:items-end gap-1 bg-slate-50 p-4 rounded-xl border border-slate-200/60 w-full lg:w-auto">
                        <p className="text-lg font-bold text-blue-700">
                          Total: Rs. {order.totalPrice?.toLocaleString()}
                        </p>
                        <p className="text-xs font-semibold text-emerald-700">
                          Admin Commission: Rs. {order.adminCommission?.toLocaleString()}
                        </p>
                        <p className="text-xs font-semibold text-purple-700">
                          Seller Amount: Rs. {order.sellerAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Ordered Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3.5"
                          >
                            <img
                              src={
                                item.product.image
                                  ? `/images/${item.product.image}`
                                  : "/images/no-image.png"
                              }
                              alt={item.product.title}
                              className="w-16 h-16 shrink-0 rounded-lg object-cover border border-slate-200 bg-white"
                            />
                            <div className="flex-1 space-y-0.5">
                              <h3 className="font-bold text-sm text-slate-900">
                                {item.product.title}
                              </h3>
                              <p className="text-xs text-slate-600 font-medium">
                                Quantity: <span className="font-bold text-slate-800">{item.quantity}</span>
                              </p>
                              <p className="text-xs text-slate-600 font-medium">
                                Price: <span className="font-bold text-slate-800">Rs. {item.price}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap">
                      {order.status !== "CONFIRMED" &&
                        order.status !== "SHIPPED" &&
                        order.status !== "DELIVERED" && (
                          <button
                            onClick={() => updateStatus(order.id, "CONFIRMED")}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-xs px-4 py-2 rounded-lg transition"
                          >
                            Confirm Order
                          </button>
                        )}

                      {order.status === "CONFIRMED" && (
                        <button
                          onClick={() => updateStatus(order.id, "SHIPPED")}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold text-xs px-4 py-2 rounded-lg transition"
                        >
                          Mark as Shipped
                        </button>
                      )}

                      {order.status === "SHIPPED" && (
                        <button
                          onClick={() => updateStatus(order.id, "DELIVERED")}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs px-4 py-2 rounded-lg transition"
                        >
                          Mark as Delivered
                        </button>
                      )}

                      {order.status !== "DELIVERED" &&
                        order.status !== "CANCELLED" && (
                          <button
                            onClick={() => updateStatus(order.id, "CANCELLED")}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs px-4 py-2 rounded-lg transition"
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}