"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerPaymentMethodsPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  const [formData, setFormData] = useState({
    type: "CARD",
    label: "",
    last4: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  async function fetchPaymentMethods() {
    try {
      const response = await fetch("/api/payment-methods");
      const data = await response.json();
      setPaymentMethods(data.paymentMethods || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingMethod
        ? `/api/payment-methods/${editingMethod.id}`
        : "/api/payment-methods";
      const method = editingMethod ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setShowForm(false);
        setEditingMethod(null);
        setFormData({
          type: "CARD",
          label: "",
          last4: "",
          isDefault: false,
        });
        fetchPaymentMethods();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleEdit(method) {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      label: method.label,
      last4: method.last4 || "",
      isDefault: method.isDefault,
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        fetchPaymentMethods();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleSetDefault(id) {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isDefault: true }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchPaymentMethods();
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 bg-white px-8 py-6 rounded-2xl shadow-md border border-slate-200">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Loading Wallet...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Secure Wallet & Billing
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              Payment Methods 💳
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Seamlessly manage your saved cards, digital accounts, and billing preferences.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMethod(null);
              setFormData({
                type: "CARD",
                label: "",
                last4: "",
                isDefault: false,
              });
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-sm text-center shrink-0"
          >
            + Add Payment Method
          </button>
        </div>

        {/* Add/Edit Form Card */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {editingMethod ? "Edit Payment Method" : "New Payment Method"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Fill in the details below securely.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMethod(null);
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600 transition-all"
                  required
                >
                  <option value="CARD">Credit/Debit Card</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Label</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="e.g., My Visa Card"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all"
                  required
                />
              </div>

              {formData.type === "CARD" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Last 4 Digits
                  </label>
                  <input
                    type="text"
                    name="last4"
                    value={formData.last4}
                    onChange={handleChange}
                    placeholder="1234"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-semibold font-mono tracking-widest text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isDefault" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Set as default payment method for future orders
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-sm text-center"
                >
                  {editingMethod ? "Update Method" : "Save Payment Method"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMethod(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods Grid */}
        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-blue-100">
              💳
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">No payment methods found</p>
              <p className="text-xs text-slate-500 mt-0.5">Add your card or payment option for a smooth checkout.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm inline-block"
            >
              Add Your First Payment Method
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                {method.isDefault && (
                  <span className="absolute top-5 right-5 bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    Default
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {method.type === "CARD" ? "💳" : method.type === "COD" ? "💵" : "🏦"}
                    </div>
                    <div className="min-w-0 pr-14">
                      <h3 className="font-bold text-sm text-slate-900 tracking-tight truncate">
                        {method.label}
                      </h3>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">
                        {method.type === "CARD"
                          ? "Credit / Debit Card"
                          : method.type === "COD"
                          ? "Cash on Delivery"
                          : "Bank Transfer"}
                      </p>
                    </div>
                  </div>

                  {method.last4 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-4 flex items-center justify-between text-xs text-slate-700">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Card Number</span>
                      <span className="font-bold font-mono tracking-widest text-slate-900">•••• {method.last4}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(method)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer border border-slate-200 text-center"
                  >
                    Edit
                  </button>
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer border border-blue-200 text-center"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="w-9 h-9 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-slate-200 hover:border-rose-200 shrink-0"
                    title="Delete payment method"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}