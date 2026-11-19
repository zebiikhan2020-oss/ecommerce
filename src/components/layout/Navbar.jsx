"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  
  // States for Account Dropdowns
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Refs for Click Outside handling
  const categoriesRef = useRef(null);
  const accountRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Categories sirf ek baar fetch hongi jab Navbar pehli baar load hoga
  useEffect(() => {
    fetchCategories();
  }, []);

  // User ke login hone ya page change hone par Cart, Notifications aur Messages fetch honge
  useEffect(() => {
    if (user) {
      if (user.role === "BUYER") {
        fetchCart();
      }
      fetchNotifications();
      fetchMessages();
    }
  }, [user, pathname]);

  // Messages ka interval automatic update ke liye
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  async function fetchCart() {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) return;
      const data = await response.json();
      setCartCount(data.cart?.items?.length || 0);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = await response.json();
      setNotificationCount(data.unreadCount || 0);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMessages() {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) return;
      const data = await response.json();
      setMessageCount(data.unreadCount || 0);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/category");
      if (!response.ok) return;
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.log(error);
    }
  }

  function getCategoryIcon(name) {
    const category = name.toLowerCase();
    if (category.includes("mobile") || category.includes("phone")) return "📱";
    if (category.includes("laptop")) return "💻";
    if (category.includes("watch")) return "⌚";
    if (category.includes("audio") || category.includes("headphone")) return "🎧";
    if (category.includes("fashion") || category.includes("clothes")) return "👕";
    if (category.includes("camera")) return "📷";
    if (category.includes("gaming")) return "🎮";
    if (category.includes("book")) return "📚";
    if (category.includes("shoe")) return "👟";
    return "📦";
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const data = await response.json();
      alert(data.message);
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  function handleSearch() {
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search)}`);
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-full mx-auto h-16 md:h-20 px-3 md:px-4 lg:px-5 flex items-center justify-between gap-1.5 lg:gap-3">
        
        {/* Logo Container */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-2xl text-blue-600 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            ☰
          </button>

          <Link href="/" className="text-xl md:text-3xl font-black tracking-wide flex-shrink-0">
            <span className="text-blue-600">i</span>
            <span className="text-blue-600">Shop</span>
          </Link>

          {/* Mobile Cart Icon */}
          {user?.role === "BUYER" && (
            <div className="md:hidden ml-1">
              <Link href="/cart" className="relative text-xl p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Cart">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Menu Links */}
        {user && (
          <div className="hidden md:flex items-center gap-3 lg:gap-4 text-base lg:text-lg font-bold flex-shrink-0 text-gray-800">
            <Link href="/" className={pathname === "/" ? "text-blue-600 font-extrabold border-b-2 border-blue-600 pb-1" : "transition-all duration-300 hover:text-blue-600 hover:scale-105"}>
              Home
            </Link>
            <Link href="/products" className={pathname === "/products" ? "text-blue-600 font-extrabold border-b-2 border-blue-600 pb-1" : "transition-all duration-300 hover:text-blue-600 hover:scale-105"}>
              Products
            </Link>

            <div className="relative" ref={categoriesRef}>
              <button 
                onClick={() => {
                  setShowCategories(!showCategories);
                  setShowAccountDropdown(false);
                }}
                className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                Categories ▾
              </button>
              {showCategories && (
                <div className="absolute top-10 left-0 w-72 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-2xl z-50 py-3">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/products?category=${category.id}`} onClick={() => setShowCategories(false)} className="flex items-center justify-between mx-2 px-5 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1 group">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                        <div>
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <p className="text-xs text-gray-500">{category.products?.length || 0} Products</p>
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-blue-600">→</span>
                    </Link>
                  ))}
                  <hr className="my-2 border-gray-200" />
                  <Link href="/categories" onClick={() => setShowCategories(false)} className="block mx-2 rounded-xl px-5 py-4 text-center font-bold text-sm text-blue-600 bg-gray-100 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    View All Categories →
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className={pathname === "/about" ? "text-blue-600 font-extrabold border-b-2 border-blue-600 pb-1" : "transition-all duration-300 hover:text-blue-600 hover:scale-105"}>
              About
            </Link>
            <Link href="/contact" className={pathname === "/contact" ? "text-blue-600 font-extrabold border-b-2 border-blue-600 pb-1" : "transition-all duration-300 hover:text-blue-600 hover:scale-105"}>
              Contact
            </Link>
          </div>
        )}

        {/* Search Bar Container */}
        {user && (
          <div className="hidden xl:flex flex-1 max-w-[220px] min-w-[120px] mx-1">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              className="w-full rounded-l-xl border border-gray-300 bg-gray-50 px-3 py-2 outline-none text-sm"
            />
            <button onClick={handleSearch} className="rounded-r-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-white font-semibold text-sm">
              Search
            </button>
          </div>
        )}

        {/* Right Side Panels (Desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 justify-end">
          {!loading && !user && (
            <>
              <Link href="/login" className="hover:text-blue-600 font-semibold text-sm lg:text-base">Login</Link>
              <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm lg:text-base">Signup</Link>
            </>
          )}

          {/* SHARED HANDLER FOR LOGGED IN USERS (BUYER, SELLER, ADMIN) */}
          {!loading && user && (
            <div className="flex items-center gap-3 lg:gap-4 font-semibold text-sm lg:text-base">
              
              <div 
                className="relative"
                ref={accountRef}
              >
                <button 
                  onClick={() => {
                    setShowAccountDropdown(!showAccountDropdown);
                    setShowCategories(false);
                  }}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                >
                  👤 My Account ▾
                </button>

                {showAccountDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-2 font-medium text-gray-700">
                    <Link href="/profile" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      👤 My Profile
                    </Link>
                    
                    {/* Role Based Dashboards */}
                    {user.role === "BUYER" && (
                      <Link href="/buyer" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        📊 Buyer Dashboard
                      </Link>
                    )}
                    {user.role === "SELLER" && (
                      <Link href="/seller" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        🏪 Seller Dashboard
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        ⚙️ Admin Dashboard
                      </Link>
                    )}

                    {/* Buyer Wishlist */}
                    {user.role === "BUYER" && (
                      <Link href="/buyer/wishlist" onClick={() => setShowAccountDropdown(false)} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <span>❤️ Wishlist</span>
                      </Link>
                    )}
                    
                    {/* Notifications (Dynamic Link based on Role) */}
                    <Link 
                      href={user.role === "BUYER" ? "/buyer/notifications" : user.role === "SELLER" ? "/seller/notifications" : "/admin/notifications"} 
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <span>🔔 Notifications</span>
                      {notificationCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {notificationCount}
                        </span>
                      )}
                    </Link>
                    
                    {/* Global Messages */}
                    <Link href="/messages" onClick={() => setShowAccountDropdown(false)} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      <span>💬 Messages</span>
                      {messageCount > 0 && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {messageCount}
                        </span>
                      )}
                    </Link>
                    
                    <hr className="my-1.5 border-gray-200" />
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Button only for Buyers */}
              {user.role === "BUYER" && (
                <Link href="/cart" className={pathname === "/cart" ? "relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md flex-shrink-0" : "relative bg-gray-100 hover:bg-blue-50 text-gray-700 px-4 py-2 rounded-xl transition-all flex-shrink-0"}>
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
         <div className={`fixed top-0 left-0 h-screen w-1/2 max-w-[50vw] min-w-[160px] bg-white shadow-2xl z-50 md:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-blue-600">iShop</h2>
              <button onClick={() => setMobileOpen(false)} className="text-2xl p-2 hover:bg-gray-200 rounded-lg">✕</button>
            </div>

            <div className="flex flex-col p-4 gap-1 min-h-screen">
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { handleSearch(); setMobileOpen(false); } }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none text-sm"
                />
                <button onClick={() => { handleSearch(); setMobileOpen(false); }} className="w-full mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white font-semibold text-sm">
                  Search
                </button>
              </div>

              <div className="h-px bg-gray-200 my-3" />

              <div className="space-y-1">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">🏠 Home</Link>
                <Link href="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">🛍 Products</Link>
                
                <div className="px-4 py-2">
                  <div className="font-semibold text-gray-700 mb-2 text-sm">📂 Categories</div>
                  <div className="flex flex-col gap-1 pl-4">
                    {categories.map((category) => (
                      <Link key={category.id} href={`/products?category=${category.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-sm">
                        <span>{getCategoryIcon(category.name)}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                    <Link href="/categories" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-600">View All →</Link>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Link href="/about" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">ℹ About</Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">📞 Contact</Link>
              </div>

              <div className="h-px bg-gray-200 my-3" />

              <div className="space-y-1">
                {user?.role === "BUYER" && (
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">
                    🛒 Cart {cartCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
                  </Link>
                )}

                {user && (
                  <>
                    <Link 
                      href={user.role === "BUYER" ? "/buyer/notifications" : user.role === "SELLER" ? "/seller/notifications" : "/admin/notifications"} 
                      onClick={() => setMobileOpen(false)} 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium"
                    >
                      🔔 Notifications {notificationCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{notificationCount}</span>}
                    </Link>
                    {user.role === "BUYER" && (
                      <Link href="/buyer/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">❤️ Wishlist</Link>
                    )}
                    <Link href="/messages" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">
                      💬 Messages {messageCount > 0 && <span className="ml-auto bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{messageCount}</span>}
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">👤 Profile</Link>
                  </>
                )}
              </div>

              <div className="h-px bg-gray-200 my-3" />

              <div className="space-y-1">
                {user ? (
                  <>
                    {user.role === "BUYER" && <Link href="/buyer" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">📊 Buyer Dashboard</Link>}
                    {user.role === "SELLER" && <Link href="/seller" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">🏪 Seller Dashboard</Link>}
                    {user.role === "ADMIN" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">⚙️ Admin Dashboard</Link>}
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 text-left w-full text-sm font-medium">🚪 Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-sm font-medium">🔐 Login</Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium">✍️ Signup</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}