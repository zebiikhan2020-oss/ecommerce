import Link from "next/link";

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-blue-50">
              Buyer Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
              Buyer Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium">
              Welcome back! Manage your orders, tracking, wishlist, and account settings seamlessly.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-md transition-all shrink-0"
          >
            Explore Store 🛍️
          </Link>
        </div>

        {/* Dashboard Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <Link
            href="/"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏠
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              Home
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Go back to main store home page.
            </p>
          </Link>

          <Link
            href="/products"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🛍️
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              Products
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Browse all available store items.
            </p>
          </Link>

          <Link
            href="/cart"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🛒
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              My Cart
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              View items in your shopping bag.
            </p>
          </Link>

          <Link
            href="/buyer/orders"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📦
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              My Orders
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Track live shipment statuses.
            </p>
          </Link>

          <Link
            href="/buyer/wishlist"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ❤️
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              Wishlist
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Check your saved favorite products.
            </p>
          </Link>

          <Link
            href="/buyer/addresses"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📍
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              Addresses
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage delivery drop locations.
            </p>
          </Link>

          <Link
            href="/buyer/payment-methods"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💳
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              Payment Methods
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Update billing and card details.
            </p>
          </Link>

          <Link
            href="/buyer/notifications"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🔔
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              Notifications
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              View alerts and status updates.
            </p>
          </Link>

          <Link
            href="/profile"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.06)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👤
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
              Profile
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Edit your account credentials.
            </p>
          </Link>

        </div>

        {/* Shopping Flow Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>⚡</span> Shopping Flow Guide
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              <span className="text-2xl">🛍️</span>
              <p className="mt-2 text-xs font-bold text-slate-800">
                Browse Products
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              <span className="text-2xl">➕</span>
              <p className="mt-2 text-xs font-bold text-slate-800">
                Add To Cart
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              <span className="text-2xl">🛒</span>
              <p className="mt-2 text-xs font-bold text-slate-800">
                Review Cart
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              <span className="text-2xl">💳</span>
              <p className="mt-2 text-xs font-bold text-slate-800">
                Secure Checkout
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-2xl">📦</span>
              <p className="mt-2 text-xs font-bold text-slate-800">
                Track Orders
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}