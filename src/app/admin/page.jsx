"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 bg-white px-8 py-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
              Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              Admin Dashboard ⚡
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Manage platform users, oversee active products, and track real-time financial analytics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Live
            </span>
          </div>
        </div>

        {/* Analytics Cards Grid */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            
            {/* Total Users */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg border border-purple-100">
                  👥
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Users</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{analytics.users.total}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {analytics.users.buyers} buyers, {analytics.users.sellers} sellers
                </p>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg border border-blue-100">
                  📦
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalog</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{analytics.products.total}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {analytics.products.active} active listings
                </p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-lg border border-amber-100">
                  🛒
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{analytics.orders.total}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Processed overall</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg border border-emerald-100">
                  💰
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</span>
              </div>
              <div className="mt-4">
                <p className="text-lg sm:text-xl font-black text-slate-900 truncate">
                  Rs. {analytics.orders.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Gross volume</p>
              </div>
            </div>

            {/* Admin Profit */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg border border-emerald-100">
                  🏦
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commission</span>
              </div>
              <div className="mt-4">
                <p className="text-lg sm:text-xl font-black text-emerald-600 truncate">
                  Rs. {analytics.orders.totalCommission.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Net profit</p>
              </div>
            </div>

            {/* Seller Earnings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg border border-blue-100">
                  💵
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payouts</span>
              </div>
              <div className="mt-4">
                <p className="text-lg sm:text-xl font-black text-blue-600 truncate">
                  Rs. {analytics.orders.totalSellerAmount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Seller share</p>
              </div>
            </div>

          </div>
        )}

        {/* Navigation Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Link
            href="/"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-9 h-9 bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-600 rounded-xl flex items-center justify-center text-base mb-3 transition-colors">
              🏠
            </div>
            <h2 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">Home</h2>
            <p className="text-xs text-slate-500 mt-0.5">Return to storefront</p>
          </Link>

          <Link
            href="/admin/notifications"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-9 h-9 bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-600 rounded-xl flex items-center justify-center text-base mb-3 transition-colors">
              🔔
            </div>
            <h2 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">Notifications</h2>
            <p className="text-xs text-slate-500 mt-0.5">Alerts and logs</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-9 h-9 bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-600 rounded-xl flex items-center justify-center text-base mb-3 transition-colors">
              👥
            </div>
            <h2 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">Users</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage accounts</p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-9 h-9 bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-600 rounded-xl flex items-center justify-center text-base mb-3 transition-colors">
              📦
            </div>
            <h2 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">Products</h2>
            <p className="text-xs text-slate-500 mt-0.5">Catalog control</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-9 h-9 bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-600 rounded-xl flex items-center justify-center text-base mb-3 transition-colors">
              🛒
            </div>
            <h2 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Customer fulfillments</p>
          </Link>

          <Link
            href="/admin/couriers"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-9 h-9 bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-600 rounded-xl flex items-center justify-center text-base mb-3 transition-colors">
              🚚
            </div>
            <h2 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">Couriers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Shipping logistics</p>
          </Link>
        </div>

        {/* Top Products Table */}
        {analytics && analytics.topProducts && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Top Performing Products</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Ranked by total quantity sold across the platform</p>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl">
                Best Sellers
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="p-4 sm:px-6">Product Title</th>
                    <th className="p-4 sm:px-6">Price</th>
                    <th className="p-4 sm:px-6">Stock Left</th>
                    <th className="p-4 sm:px-6">Total Sold</th>
                    <th className="p-4 sm:px-6">Store Seller</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                  {analytics.topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 sm:px-6 font-bold text-slate-900">{product.title}</td>
                      <td className="p-4 sm:px-6 font-semibold">Rs. {product.price}</td>
                      <td className="p-4 sm:px-6">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${product.stock > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 font-black text-purple-600">{product.totalSold}</td>
                      <td className="p-4 sm:px-6 text-slate-500">{product.seller}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Sellers Table */}
        {analytics && analytics.topSellers && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Top Revenue Sellers</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Leading merchants generating high gross income</p>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl">
                Leaderboard
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="p-4 sm:px-6">Seller Name</th>
                    <th className="p-4 sm:px-6">Email Address</th>
                    <th className="p-4 sm:px-6">Active Products</th>
                    <th className="p-4 sm:px-6">Total Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                  {analytics.topSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 sm:px-6 font-bold text-slate-900">{seller.name}</td>
                      <td className="p-4 sm:px-6 text-slate-500">{seller.email}</td>
                      <td className="p-4 sm:px-6 font-semibold">{seller.totalProducts}</td>
                      <td className="p-4 sm:px-6 font-black text-purple-600">
                        Rs. {seller.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}