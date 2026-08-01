"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerNotificationsPage() {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.isRead)
          .map((n) =>
            fetch(`/api/notifications/${n.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isRead: true }),
            })
          )
      );
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this notification?")) return;

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

  function getNotificationIcon(type) {
    switch (type) {
      case "ORDER":
        return "📦";
      case "PROMO":
        return "🎉";
      case "REVIEW":
        return "⭐";
      default:
        return "🔔";
    }
  }

  function getNotificationColor(type) {
    switch (type) {
      case "ORDER":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "PROMO":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "REVIEW":
        return "bg-amber-100 text-amber-600 border-amber-200";
      default:
        return "bg-slate-200 text-slate-600 border-slate-300";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Loading Notifications...</span>
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
              Activity Stream
            </span>
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Stay updated with your order statuses, updates, and promos.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 text-center"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-blue-100">
              🔔
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">No notifications</p>
              <p className="text-xs text-slate-500 mt-0.5">You're all caught up! Check back later for updates.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all shadow-sm hover:shadow-md flex items-start justify-between gap-4 ${
                  !notification.isRead
                    ? "bg-blue-50 border-blue-200 shadow-sm" // Poora card blue rahega jab tak unread hai
                    : "bg-white border-slate-200 hover:border-slate-300" // Read hone par simple clean white ho jayega
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                          New
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-medium leading-relaxed ${!notification.isRead ? "text-slate-800 font-semibold" : "text-slate-600"}`}>
                      {notification.message}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium pt-1">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification.id);
                  }}
                  className="w-9 h-9 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-slate-200 hover:border-rose-200 shrink-0 shadow-2xs"
                  title="Delete notification"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}