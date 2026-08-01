"use client";

import { useEffect, useState } from "react";

export default function AddressesPage() {

  const emptyForm = {
    label: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    isDefault: false,
  };

  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {

    try {

      const response = await fetch("/api/addresses");

      const data = await response.json();

      if (response.ok) {
        setAddresses(data.addresses || []);
      }

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

    setSaving(true);
    setMessage("");

    try {

      let response;

      if (editingId) {

        response = await fetch(`/api/addresses/${editingId}`, {

          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),

        });

      } else {

        response = await fetch("/api/addresses", {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),

        });

      }

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {

        setFormData(emptyForm);

        setEditingId(null);

        fetchAddresses();

      }

    } catch (error) {

      console.log(error);

      setMessage("Something went wrong");

    } finally {

      setSaving(false);

    }

  }

  function editAddress(address) {

    setEditingId(address.id);

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }

  async function deleteAddress(id) {

    if (!confirm("Delete this address?")) return;

    try {

      const response = await fetch(`/api/addresses/${id}`, {

        method: "DELETE",

      });

      const data = await response.json();

      alert(data.message);

      fetchAddresses();

    } catch (error) {

      console.log(error);

    }

  }
    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading Addresses...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-8">
          My Addresses
        </h1>

        {message && (
          <div className="mb-6 bg-green-100 text-green-700 border border-green-300 rounded-lg p-4">
            {message}
          </div>
        )}

        {/* Form */}

        <div className="bg-white shadow-xl rounded-xl p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Update Address" : "Add New Address"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5"
          >

            <input
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Label (Home / Office)"
              className="border rounded-lg p-3"
            />

            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border rounded-lg p-3"
              required
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border rounded-lg p-3"
              required
            />

            <input
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street Address"
              className="border rounded-lg p-3"
              required
            />

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="border rounded-lg p-3"
              required
            />

            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="border rounded-lg p-3"
            />

            <input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Zip Code"
              className="border rounded-lg p-3"
              required
            />

            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="border rounded-lg p-3"
            />

            <div className="md:col-span-2 flex items-center gap-3">

              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />

              <span>
                Make this my default address
              </span>

            </div>

            <div className="md:col-span-2 flex gap-4">

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Address"
                  : "Save Address"}
              </button>

              {editingId && (

                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(emptyForm);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg"
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

        {/* Address List */}

        <div className="grid md:grid-cols-2 gap-8">

          {addresses.length === 0 && (

            <div className="col-span-2 text-center text-gray-500 text-xl">
              No Address Found
            </div>

          )}

          {addresses.map((address) => (

            <div
              key={address.id}
              className="bg-white rounded-xl shadow-lg p-6"
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold">

                  {address.label}

                </h2>

                {address.isDefault && (

                  <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                    Default
                  </span>

                )}

              </div>

              <p>
                <strong>{address.fullName}</strong>
              </p>

              <p>{address.phone}</p>

              <p>{address.street}</p>

              <p>
                {address.city}, {address.state}
              </p>

              <p>
                {address.zipCode}
              </p>

              <p>
                {address.country}
              </p>

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => editAddress(address)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAddress(address.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );

}