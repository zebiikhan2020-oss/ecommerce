"use client";

import { useEffect, useState } from "react";

export default function CouriersPage() {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    estimatedDays: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function fetchCouriers() {
    try {
      setLoading(true);
      const response = await fetch("/api/couriers");
      const data = await response.json();

      if (response.ok) {
        setCouriers(data.couriers);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCouriers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/couriers/${editingId}` : "/api/couriers";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          basePrice: Number(formData.basePrice),
          estimatedDays: Number(formData.estimatedDays),
          isActive: true,
        }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setFormData({
          name: "",
          description: "",
          basePrice: "",
          estimatedDays: "",
        });
        setEditingId(null);
        fetchCouriers();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  function handleEdit(courier) {
    setEditingId(courier.id);
    setFormData({
      name: courier.name,
      description: courier.description || "",
      basePrice: courier.basePrice,
      estimatedDays: courier.estimatedDays,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    const confirmDelete = confirm("Are you sure you want to delete this courier?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/couriers/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        fetchCouriers();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans px-4 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Courier Management 🚚
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Add, update and manage shipping partners & delivery rates easily.
            </p>
          </div>
          <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg self-start sm:self-auto">
            Total Couriers: <span className="text-purple-600 font-bold">{couriers.length}</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            {editingId ? "✏️ Edit Courier Details" : "➕ Add New Courier"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Courier Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. TCS, Leopards"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Base Price (Rs.)</label>
              <input
                type="number"
                name="basePrice"
                placeholder="e.g. 250"
                value={formData.basePrice}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Estimated Days</label>
              <input
                type="number"
                name="estimatedDays"
                placeholder="e.g. 3"
                value={formData.estimatedDays}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Description</label>
              <textarea
                name="description"
                placeholder="Enter details or coverage notes..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                rows="3"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition shadow-sm w-full sm:w-auto"
              >
                {editingId ? "Update Courier" : "Save Courier"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      basePrice: "",
                      estimatedDays: "",
                    });
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-lg transition w-full sm:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">All Couriers List</h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500 font-medium">Loading data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
                    <th className="p-3.5 sm:px-6">Name</th>
                    <th className="p-3.5 sm:px-6">Base Price</th>
                    <th className="p-3.5 sm:px-6">Days</th>
                    <th className="p-3.5 sm:px-6">Description</th>
                    <th className="p-3.5 sm:px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm font-medium text-slate-700">
                  {couriers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        No couriers found.
                      </td>
                    </tr>
                  ) : (
                    couriers.map((courier) => (
                      <tr key={courier.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 sm:px-6 font-bold text-slate-900">{courier.name}</td>
                        <td className="p-3.5 sm:px-6 font-semibold text-purple-700">Rs. {courier.basePrice}</td>
                        <td className="p-3.5 sm:px-6">
                          <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1 rounded-md text-xs font-bold">
                            {courier.estimatedDays} Days
                          </span>
                        </td>
                        <td className="p-3.5 sm:px-6 text-slate-600 max-w-xs truncate">{courier.description || "-"}</td>
                        <td className="p-3.5 sm:px-6 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(courier)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-xs px-3 py-1.5 rounded-md mr-2 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(courier.id)}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs px-3 py-1.5 rounded-md transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}