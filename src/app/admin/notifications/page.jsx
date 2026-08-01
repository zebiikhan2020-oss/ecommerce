"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();

      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-8 py-10 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              Activity Stream
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              Notifications 🔔
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Stay updated with your latest alerts, messages, and system logs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              Unread: <span className="text-slate-900 font-bold">{unreadCount}</span>
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              No notifications found
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={async () => {
                    if (!item.isRead) {
                      await fetch(`/api/notifications/${item.id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          isRead: true,
                        }),
                      });
                      fetchNotifications();
                    }

                    if (item.link) {
                      router.push(item.link);
                    }
                  }}
                  className={`p-5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                    !item.isRead
                      ? "bg-sky-50/70 border-sky-200 border-l-4 border-l-sky-600 hover:bg-sky-100/60"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                      <span>🔔</span> {item.title}
                    </h2>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {item.type}
                    </span>
                    {!item.isRead && (
                      <span className="text-xs font-semibold text-sky-700">
                        Unread • Click to mark as read
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}