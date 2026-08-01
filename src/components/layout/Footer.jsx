"use client";

import Link from "next/link";

export default function Footer() {
  const isLoggedIn = true; 
  const userRole = "ADMIN"; 

  const isBuyer = isLoggedIn && userRole === "BUYER";

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
           
            <span className="text-2xl font-black tracking-tight text-white">iShop</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            Your ultimate destination for modern shopping. Discover top-quality products from trusted sellers with seamless checkout.
          </p>
          <div className="inline-block bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Secure Platform
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">Quick Links</h3>
          <div className="space-y-2.5 text-xs sm:text-sm font-medium">
            <Link href="/" className="block hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/products" className="block hover:text-blue-400 transition-colors">Explore Products</Link>
            <Link href="/categories" className="block hover:text-blue-400 transition-colors">Categories</Link>
            <Link href="/about" className="block hover:text-blue-400 transition-colors">About Us</Link>
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">My Account</h3>
          <div className="space-y-2.5 text-xs sm:text-sm font-medium">
            <Link 
              href={isLoggedIn ? "#" : "/login"} 
              className={`block ${isLoggedIn ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:text-blue-400 transition-colors"}`}
              onClick={(e) => isLoggedIn && e.preventDefault()}
            >
              Login
            </Link>
            <Link 
              href={isLoggedIn ? "#" : "/signup"} 
              className={`block ${isLoggedIn ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:text-blue-400 transition-colors"}`}
              onClick={(e) => isLoggedIn && e.preventDefault()}
            >
              Sign Up
            </Link>
            <Link 
              href={isBuyer ? "/cart" : "#"} 
              className={`block ${isBuyer ? "hover:text-blue-400 transition-colors" : "opacity-40 cursor-not-allowed pointer-events-none"}`}
              onClick={(e) => !isBuyer && e.preventDefault()}
            >
              Shopping Cart
            </Link>
            <Link 
              href={isBuyer ? "/buyer/orders" : "#"} 
              className={`block ${isBuyer ? "hover:text-blue-400 transition-colors" : "opacity-40 cursor-not-allowed pointer-events-none"}`}
              onClick={(e) => !isBuyer && e.preventDefault()}
            >
              Order History
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">Customer Support</h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-medium">
            <p className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">Email:</span> support@ishop.com
            </p>
            <p className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">Phone:</span> +92 317 1324941
            </p>
            <p className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">Location:</span> Pakistan
            </p>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
          <p>© 2026 iShop. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Help Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
}