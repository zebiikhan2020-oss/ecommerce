"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerNotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isRead: true,
        }),
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleNotificationClick(notification) {
    try {
      if (!notification.isRead) {
        await fetch(`/api/notifications/${notification.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRead: true,
          }),
        });
      }

      await fetchNotifications();

      if (notification.link) {
        router.push(notification.link);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white border-2 border-slate-300 p-8 rounded-2xl shadow-md text-center">
          <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-xl font-black text-slate-800 tracking-tight">Syncing Live Nodes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-100 px-4 sm:px-6 py-14 overflow-hidden selection:bg-emerald-700 selection:text-white">
      
      {/* Visual Contrast Ambient Accents */}
      <div className="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/0 blur-[120px]" />
      <div className="absolute -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Stream Configuration */}
        <div className="relative pb-6 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-800 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-sm">
              🛰️ Telemetry Alerts Pipeline
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Notification Center
            </h1>
          </div>
          
          {unreadCount > 0 && (
            <div className="bg-emerald-700 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-md border border-emerald-600 self-start sm:self-auto flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              {unreadCount} Actions Pending
            </div>
          )}
        </div>

        {/* Dynamic Inbox Validation Switch */}
        {notifications.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-3xl p-12 shadow-md text-center max-w-xl mx-auto space-y-4">
            <div className="text-4xl">📥</div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">System Logs Clear</h3>
              <p className="text-slate-600 text-sm font-bold mt-1">No asynchronous notifications or transaction updates discovered within current cache cycles.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`group border-2 rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-500 transition-all duration-300 relative overflow-hidden ${
                  !notification.isRead
                    ? "bg-gradient-to-r from-white via-emerald-50/10 to-emerald-50/20 border-emerald-600 shadow-emerald-900/5"
                    : "bg-white border-slate-300/80"
                }`}
              >
                {/* Structural Read Status Indicator Strip */}
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5 filter drop-shadow-xs">🔔</span>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                        {notification.title}
                      </h2>
                      
                      <div className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mt-1.5">
                        Type Matrix: {notification.type}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md self-start sm:self-auto">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Main Message Block */}
                <p className="mt-4 text-slate-700 text-sm font-semibold leading-relaxed pl-8">
                  {notification.message}
                </p>

                {/* Footer Controls Strip */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between pl-8">
                  <div>
                    {!notification.isRead ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100 border border-emerald-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                        Unresolved
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                        ✓ Audited Log
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    🗑️ Delete Payload
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