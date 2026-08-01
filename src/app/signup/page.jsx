"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BUYER",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "BUYER",
        });
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 font-sans">

      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl shadow-slate-200/60 rounded-2xl p-8">

        <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-1">
          Create Account
        </h1>

        <p className="text-center text-slate-500 font-medium text-sm mb-8">
          Welcome to iShop ✨
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
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
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="pt-1">
            <p className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2.5">
              Select Account Type
            </p>

            <div className="flex gap-4">

              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition text-sm font-semibold ${formData.role === "BUYER" ? "bg-blue-50 text-blue-700 border-blue-500 shadow-2xs" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
                <input
                  type="radio"
                  name="role"
                  value="BUYER"
                  checked={formData.role === "BUYER"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Buyer
              </label>

              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition text-sm font-semibold ${formData.role === "SELLER" ? "bg-blue-50 text-blue-700 border-blue-500 shadow-2xs" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
                <input
                  type="radio"
                  name="role"
                  value="SELLER"
                  checked={formData.role === "SELLER"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Seller
              </label>

            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition shadow-lg shadow-blue-600/20 cursor-pointer mt-2"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-bold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}