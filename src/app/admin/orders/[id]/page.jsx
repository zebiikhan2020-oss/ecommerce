"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 font-semibold text-lg">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 font-semibold text-lg">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans px-4 sm:px-8 py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Back Button */}
        <div>
          <button
            onClick={() => router.back()}
            className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-xs px-4 py-2 rounded-lg transition shadow-2xs cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* Main Card Container */}
        <div className="bg-sky-50 rounded-xl border border-sky-200 shadow-xs p-6 sm:p-8 space-y-8">

          {/* Header Title & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-sky-200 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Order #{order.id} 📦
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white border border-sky-200 text-sky-700 shadow-2xs inline-block">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Buyer & Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Buyer Information */}
            <div className="bg-white rounded-xl p-5 border border-sky-200 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-sky-100 pb-2">
                Buyer Information
              </h2>
              <div className="text-sm space-y-1.5 text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Name:</span> {order.buyer.name}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Email:</span> {order.buyer.email}
                </p>
              </div>
            </div>

            {/* Order Financial Summary */}
            <div className="bg-white rounded-xl p-5 border border-sky-200 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-sky-100 pb-2">
                Order Summary
              </h2>
              <div className="text-sm space-y-1.5 text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Total Items:</span> {order.items.length}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Total Amount:</span>{" "}
                  <span className="font-bold text-sky-700">Rs. {order.totalPrice}</span>
                </p>
              </div>
            </div>

          </div>

          {/* Products List Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Ordered Products ({order.items.length})
            </h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-sky-200 shadow-2xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        item.product.image
                          ? `/images/${item.product.image}`
                          : "/images/no-image.png"
                      }
                      alt={item.product.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-sky-200 bg-sky-50"
                    />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                        {item.product.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Quantity: <span className="font-semibold text-slate-700">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-0 pt-2 sm:pt-0 border-sky-100 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                    <span className="text-xs text-slate-500 sm:hidden">Price:</span>
                    <span className="text-sm sm:text-base font-bold text-sky-700">
                      Rs. {item.price * item.quantity}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline-block">
                      (Rs. {item.price} each)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}