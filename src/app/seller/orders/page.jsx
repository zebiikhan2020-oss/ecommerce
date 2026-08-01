"use client";

import { useEffect, useState } from "react";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/seller/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStatus(id, status) {
    try {
      const response = await fetch(`/api/seller/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();
      alert(data.message);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white border-2 border-slate-300 p-8 rounded-2xl shadow-md text-center max-w-sm w-full space-y-4">
          <div className="text-4xl animate-bounce">📦</div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">No Active Pipelines</h3>
            <p className="text-slate-600 text-xs font-semibold mt-1">
              Your customer transaction registry is currently clean and empty.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-100 px-4 sm:px-6 py-12 overflow-hidden selection:bg-emerald-700 selection:text-white">
      
      {/* Soft Background Accents */}
      <div className="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/5 blur-[120px]" />
      <div className="absolute -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Compact Header */}
        <div className="relative pb-5 border-b-2 border-slate-300 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 shadow-xs border border-slate-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Pipelines
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Order Fulfillment Registry
            </h1>
          </div>
        </div>

        {/* Medium Sized Orders Track */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border-2 border-slate-300/90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              
              {/* Compact Header bar */}
              <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Order #{order.id}
                    </h2>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md shadow-2xs">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-700 font-bold">
                    <p><span className="text-slate-500 font-semibold">User:</span> {order.buyer.name}</p>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <p><span className="text-slate-500 font-semibold">Email:</span> {order.buyer.email}</p>
                  </div>
                </div>

                {/* Compact Control inputs */}
                <div className="flex items-center gap-2 bg-white p-1.5 border border-slate-300 rounded-xl self-start md:self-auto w-full sm:w-auto">
                  <select
                    defaultValue={order.status}
                    id={`status-${order.id}`}
                    className="bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-[11px] uppercase tracking-wider rounded-lg px-2 py-1.5 outline-hidden focus:border-slate-400 transition-all w-full sm:w-auto cursor-pointer"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  
                  <button
                    onClick={() =>
                      updateStatus(
                        order.id,
                        document.getElementById(`status-${order.id}`).value
                      )
                    }
                    className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xs transition-all w-full sm:w-auto text-center cursor-pointer whitespace-nowrap"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Items Manifest List */}
              <div className="px-4 sm:px-5 py-1 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative h-12 w-12 rounded-xl border border-slate-300 bg-slate-50 overflow-hidden shrink-0 shadow-2xs">
                        <img
                          src={
                            item.product.image
                              ? `/images/${item.product.image}`
                              : "/images/no-image.png"
                          }
                          className="w-full h-full object-cover"
                          alt={item.product.title}
                        />
                      </div>
                      
                      <div className="min-w-0 space-y-0.5">
                        <h3 className="font-black text-slate-900 text-sm tracking-tight truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                          {item.product.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold">
                          <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-sm">
                            Qty: <span className="text-slate-900 font-black">{item.quantity}</span>
                          </span>
                          <span className="font-mono text-slate-500">Rs. {item.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal View */}
                    <div className="text-right shrink-0 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl min-w-[90px]">
                      <span className="font-mono font-black text-xs text-slate-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                ))}
              </div>

              {/* Compact Card Footer */}
              <div className="px-4 sm:px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-emerald-50/20">
                <span className="text-[10px] font-black uppercase text-emerald-900 tracking-widest">
                  Invoice Total
                </span>
                <div className="bg-white border border-emerald-600 px-3 py-1 rounded-xl shadow-2xs">
                  <span className="text-sm font-black text-emerald-700 font-mono tracking-tight">
                    Rs. {order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}