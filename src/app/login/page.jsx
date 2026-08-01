"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        setLoading(false);
        return;
      }

      setMessage(data.message);
      await fetchUser();
      router.push(data.redirectTo);
      router.refresh();

    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 font-sans">

      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl shadow-slate-200/60 rounded-2xl p-8">

        <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-1">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 font-medium text-sm mb-6">
          Login to your iShop account ✨
        </p>

        {message && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-center text-xs font-semibold text-red-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-blue-600 text-xs font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition shadow-lg shadow-blue-600/25 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}