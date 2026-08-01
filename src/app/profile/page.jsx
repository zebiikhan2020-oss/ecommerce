"use client";

import { useEffect, useState } from "react";

function ProfileForm({ user, onUpdated }) {
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Keep local form name in sync when user changes.
  // If user changes (rare), reload page instead of syncing via effect to avoid lint warnings.

  async function handleSubmit(e) {

    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name?.trim() || "",
          password: password || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to update profile");
        return;
      }

      setPassword("");
      setNewPassword("");
      onUpdated?.();
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-500 mb-2">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3 bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 mb-2">Email Address</label>
            <div className="border rounded-lg p-3 bg-gray-50">{user.email}</div>
          </div>

          <div>
            <label className="block text-gray-500 mb-2">Role</label>
            <div className="border rounded-lg p-3 bg-gray-50">{user.role}</div>
          </div>

          <div>
            <label className="block text-gray-500 mb-2">User ID</label>
            <div className="border rounded-lg p-3 bg-gray-50">#{user.id}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="text-xl font-bold mb-3">Change Password (optional)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 mb-2">Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg p-3 bg-gray-50"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Leave password fields empty to update only your name.
          </p>
        </div>

        {error && <div className="text-red-600 font-semibold">{error}</div>}

        <div className="flex items-center gap-4">
          <button
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Profile...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">User not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-8 text-center">
          <div className="w-24 h-24 bg-white text-blue-600 rounded-full mx-auto flex items-center justify-center text-4xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold mt-4">{user.name}</h1>
          <p className="mt-2">{user.role}</p>
        </div>

        <div className="p-8">
          <ProfileForm user={user} onUpdated={fetchProfile} />
        </div>
      </div>
    </div>
  );
}

