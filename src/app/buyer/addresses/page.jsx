"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerAddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const response = await fetch("/api/addresses");
      const data = await response.json();
      setAddresses(data.addresses || []);
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
      const url = editingAddress
        ? `/api/addresses/${editingAddress.id}`
        : "/api/addresses";
      const method = editingAddress ? "PUT" : "POST";

      const payload = {
        label: formData.label || "Home",
        fullName: formData.fullName,
        phone: String(formData.phone),
        street: formData.street,
        city: formData.city,
        state: formData.state ? String(formData.state) : null,
        zipCode: String(formData.zipCode),
        country: formData.country || "Pakistan",
        isDefault: Boolean(formData.isDefault),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setShowForm(false);
        setEditingAddress(null);
        setFormData({
          label: "Home",
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Pakistan",
          isDefault: false,
        });
        fetchAddresses();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleEdit(address) {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state || "",
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handleSetDefault(id) {
    try {
      const address = addresses.find((a) => a.id === id);
      if (!address) return;

      const response = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          isDefault: true,
        }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Loading Addresses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Account Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              My Addresses
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage your delivery locations for fast and secure checkouts.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null);
              setFormData({
                label: "Home",
                fullName: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "Pakistan",
                isDefault: false,
              });
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 text-center"
          >
            + Add New Address
          </button>
        </div>

        {/* Form Modal / Section */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingAddress ? "Edit Address Details" : "Add New Delivery Address"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Please provide accurate contact and location details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    placeholder="Home, Office, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    placeholder="+92 300 1234567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  placeholder="House #123, Street #4, Area"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    placeholder="Islamabad"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    placeholder="Punjab"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    placeholder="44000"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-blue-100">
              📍
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">No saved addresses found</p>
              <p className="text-xs text-slate-500 mt-0.5">Add your delivery location to speed up checkouts.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer inline-block mt-2"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-2xl border-2 p-5 relative shadow-sm flex flex-col justify-between transition-all ${
                  address.isDefault ? "border-blue-600 bg-blue-50/20" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {address.isDefault && (
                  <span className="absolute top-5 right-5 bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                    Default
                  </span>
                )}
                
                <div className="space-y-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <span>🏠</span> {address.label}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-600 font-medium leading-relaxed">
                    <p className="font-bold text-slate-900 text-sm">
                      {address.fullName}
                    </p>
                    <p className="text-slate-500">{address.phone}</p>
                    <p className="pt-1">{address.street}</p>
                    <p>
                      {address.city}
                      {address.state && `, ${address.state}`} ({address.zipCode})
                    </p>
                    <p className="text-slate-500 font-semibold">{address.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer text-center border border-emerald-200"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer text-center border border-rose-200"
                  >
                    Delete
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