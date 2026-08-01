"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      console.log("USERS DATA:", data);
      setUsers(data.users || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleBlock(id, currentStatus) {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isBlocked: !currentStatus,
        }),
      });

      const data = await response.json();
      alert(data.message);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 px-4 sm:px-8 py-10 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              Access Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              Manage Users 👥
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              View all platform accounts, oversee roles, and manage user access permissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              Total Users: <span className="text-slate-900 font-bold">{users.length}</span>
            </span>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Registered Accounts</h2>
            <span className="text-xs text-slate-400 font-medium">Scroll horizontally on mobile if needed</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4 sm:px-6">Name</th>
                    <th className="p-4 sm:px-6">Email</th>
                    <th className="p-4 sm:px-6">Role</th>
                    <th className="p-4 sm:px-6">Status</th>
                    <th className="p-4 sm:px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-600">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-sky-50 transition-colors"
                      >
                        <td className="p-4 sm:px-6 font-bold text-slate-900">
                          {user.name}
                        </td>
                        <td className="p-4 sm:px-6 text-slate-500">
                          {user.email}
                        </td>
                        <td className="p-4 sm:px-6">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${user.role === "ADMIN" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 sm:px-6">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                              user.isBlocked
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="p-4 sm:px-6 text-center">
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => toggleBlock(user.id, user.isBlocked)}
                              className={`font-semibold text-xs px-3.5 py-1.5 rounded-lg transition shadow-2xs cursor-pointer ${
                                user.isBlocked
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : "bg-rose-600 hover:bg-rose-700 text-white"
                              }`}
                            >
                              {user.isBlocked ? "Unblock" : "Block"}
                            </button>
                          )}
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