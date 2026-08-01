"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SellerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/seller/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-100 px-4 sm:px-8 py-14 overflow-hidden selection:bg-emerald-700 selection:text-white">
      
      {/* Dynamic Background Mesh for Depth */}
      <div className="absolute -top-40 -right-40 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/0 blur-[150px]" />
      <div className="absolute -bottom-20 -left-20 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-500/5 to-emerald-500/0 blur-[120px]" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Dynamic Header Block */}
        <div className="relative pb-6 border-b border-slate-300 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-700 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Live Operations Node
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Seller Hub & Analytics
            </h1>
            <p className="text-slate-700 text-sm font-semibold mt-1">
              Real-time telemetry control center. Track gross conversions, asset status, and transaction margins.
            </p>
          </div>
        </div>

        {/* Analytics Dashboard Grid */}
        {!loading && analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            
            {/* Box 1: Total Products */}
            <div className="bg-white border-2 border-slate-300/80 rounded-2xl p-6 shadow-md relative overflow-hidden group hover:border-slate-400 transition-all duration-300">
              <div className="relative z-10">
                <div className="text-xl bg-slate-100 border border-slate-300 w-10 h-10 flex items-center justify-center rounded-xl shadow-xs">📦</div>
                <p className="text-slate-600 text-[11px] font-extrabold uppercase tracking-wider mt-5">Total Catalog Items</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{analytics.totalProducts}</p>
              </div>
            </div>

            {/* Box 2: Total Orders */}
            <div className="bg-white border-2 border-slate-300/80 rounded-2xl p-6 shadow-md relative overflow-hidden group hover:border-slate-400 transition-all duration-300">
              <div className="relative z-10">
                <div className="text-xl bg-slate-100 border border-slate-300 w-10 h-10 flex items-center justify-center rounded-xl shadow-xs">🛒</div>
                <p className="text-slate-600 text-[11px] font-extrabold uppercase tracking-wider mt-5">Active Pipelines</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{analytics.totalOrders}</p>
              </div>
            </div>

            {/* Box 3: Total Revenue */}
            <div className="bg-white border-2 border-emerald-600 rounded-2xl p-6 shadow-md relative overflow-hidden group hover:border-emerald-700 transition-all duration-300 bg-gradient-to-b from-white to-emerald-50/20">
              <div className="relative z-10">
                <div className="text-xl bg-emerald-700 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-xs">💰</div>
                <p className="text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mt-5">Gross Revenues</p>
                <p className="text-2xl font-black text-emerald-700 tracking-tight mt-1 truncate">Rs. {analytics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Box 4: Products Sold */}
            <div className="bg-white border-2 border-slate-300/80 rounded-2xl p-6 shadow-md relative overflow-hidden group hover:border-slate-400 transition-all duration-300">
              <div className="relative z-10">
                <div className="text-xl bg-slate-100 border border-slate-300 w-10 h-10 flex items-center justify-center rounded-xl shadow-xs">📊</div>
                <p className="text-slate-600 text-[11px] font-extrabold uppercase tracking-wider mt-5">Total Sales Volume</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{analytics.totalProductsSold}</p>
              </div>
            </div>

            {/* Box 5: Your Earnings */}
            <div className="bg-white border-2 border-emerald-600 rounded-2xl p-6 shadow-md relative overflow-hidden group hover:border-emerald-700 transition-all duration-300 bg-gradient-to-b from-white to-emerald-50/20">
              <div className="relative z-10">
                <div className="text-xl bg-emerald-700 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-xs">💵</div>
                <p className="text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mt-5">Net Earnings</p>
                <p className="text-2xl font-black text-emerald-700 tracking-tight mt-1 truncate">Rs. {analytics.totalEarnings.toLocaleString()}</p>
              </div>
            </div>

            {/* Box 6: Admin Commission */}
            <div className="bg-white border-2 border-rose-600 rounded-2xl p-6 shadow-md relative overflow-hidden group hover:border-rose-700 transition-all duration-300 bg-gradient-to-b from-white to-rose-50/20">
              <div className="relative z-10">
                <div className="text-xl bg-rose-700 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-xs">🏦</div>
                <p className="text-rose-800 text-[11px] font-extrabold uppercase tracking-wider mt-5">Platform Split</p>
                <p className="text-2xl font-black text-rose-700 tracking-tight mt-1 truncate">Rs. {analytics.totalCommission.toLocaleString()}</p>
              </div>
            </div>

          </div>
        )}

        {/* Workflow Actions Modules */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-700 tracking-widest">Navigation Control Grid</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { label: "Home Base", path: "/", icon: "🏠", desc: "Return back to the global store catalog matrix." },
              { label: "Notification Logs", path: "/seller/notifications", icon: "🔔", desc: "Audit live client triggers and updates logs." },
              { label: "Deploy New Asset", path: "/seller/products/add", icon: "➕", desc: "Inject an item parameter listing into database." },
              { label: "Inventory Fleet", path: "/seller/products", icon: "📦", desc: "Edit titles, evaluate metrics, adjust stock depth." },
              { label: "Order Pipelines", path: "/seller/orders", icon: "⚙️", desc: "Manage client shipping routing timelines." },
              { label: "Identity Profile", path: "/profile", icon: "👤", desc: "Modify system credentials security settings." }
            ].map((action, i) => (
              <Link
                key={i}
                href={action.path}
                className="bg-white border-2 border-slate-300/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">{action.icon}</span>
                    <span className="text-slate-400 group-hover:text-slate-800 transition-colors text-xs font-black">→</span>
                  </div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight mt-4 group-hover:text-emerald-700 transition-colors">
                    {action.label}
                  </h2>
                  <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed font-bold">
                    {action.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Inventory Analytics Table Matrix */}
        {!loading && analytics && (
          <div className="bg-white border-2 border-slate-300/80 rounded-3xl shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  📊 Catalog Item Performance Ledgers
                </h2>
                <p className="text-slate-600 text-xs font-bold mt-0.5">Automated algorithmic analysis of asset velocity outputs</p>
              </div>
              <div className="text-xs bg-slate-200 border border-slate-300 text-slate-800 font-extrabold px-3 py-1.5 rounded-lg self-start sm:self-auto">
                Real-time System Audit
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 shadow-xs">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-300 text-left font-black text-slate-700 uppercase tracking-widest text-[10px]">
                    <th className="p-4 pl-6 border-r border-slate-200">Catalog Asset Name</th>
                    <th className="p-4 border-r border-slate-200">Unit Pricing</th>
                    <th className="p-4 border-r border-slate-200">Stock Integrity</th>
                    <th className="p-4 border-r border-slate-200">Units Cleared</th>
                    <th className="p-4 pr-6 text-right">Aggregated Net Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-semibold text-slate-800">
                  {analytics.productPerformance.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="p-4 pl-6 font-black text-slate-900 max-w-[280px] truncate border-r border-slate-200">
                        {product.title}
                      </td>
                      <td className="p-4 text-slate-700 font-mono border-r border-slate-200">
                        Rs. {product.price.toLocaleString()}
                      </td>
                      <td className="p-4 border-r border-slate-200">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-900 bg-slate-200 border border-slate-300 text-xs font-black px-2.5 py-1 rounded-md">
                            <span className="h-1 w-1 rounded-full bg-slate-600" />
                            {product.stock} Left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-800 bg-rose-100 text-xs font-black px-2.5 py-1 rounded-md border border-rose-300">
                            <span className="h-1 w-1 rounded-full bg-rose-600" />
                            Stock Cleared
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-700 font-bold border-r border-slate-200">{product.totalSold} sold</td>
                      <td className="p-4 pr-6 font-black text-emerald-700 text-right text-base font-mono">
                        Rs. {product.revenue.toLocaleString()}
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