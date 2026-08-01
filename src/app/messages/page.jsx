"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const response = await fetch("/api/messages", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setConversations(data.conversations || []);
        setCurrentUserId(data.currentUserId);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Loading Conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Messages Center
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Active Client & Store Conversations
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
            Inbox ({conversations.length})
          </span>
        </div>

        {conversations.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.02)] p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              💬
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                No Conversations Yet
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                Your customer chats and direct store inquiries will seamlessly appear here once initiated.
              </p>
            </div>
          </div>
        ) : (
          /* Conversations List Stack */
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const isUnread =
                conversation.messages?.[0] &&
                !conversation.messages[0].isRead &&
                conversation.messages[0].senderId !== currentUserId;

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="block group"
                >
                  <div
                    className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200 border ${
                      isUnread
                        ? "bg-blue-50/60 border-blue-300 shadow-[0_4px_20px_rgba(59,130,246,0.06)]"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_24px_rgba(15,23,42,0.05)]"
                    }`}
                  >
                    {/* Product Image Thumbnail */}
                    <div className="w-full sm:w-16 h-36 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                      <img
                        src={
                          conversation.product?.image
                            ? `/images/${conversation.product.image}`
                            : "/images/no-image.png"
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt="product"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      
                      {/* Top Row: Name & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate flex items-center gap-2">
                            {conversation.seller
                              ? conversation.seller.name
                              : conversation.admin
                              ? conversation.admin.name
                              : conversation.buyer?.name}

                            {(conversation.seller ||
                              conversation.admin ||
                              conversation.buyer)?.isOnline && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Online"></span>
                            )}
                          </h2>

                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-wider shrink-0">
                            {conversation.admin
                              ? "Support"
                              : conversation.seller
                              ? "Seller"
                              : "Buyer"}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {conversation.messages?.[0]?.createdAt
                            ? new Date(conversation.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ""}
                        </span>
                      </div>

                      {/* Product Title & Price Indicator */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-600 truncate">
                          {conversation.product?.title || "General Inquiry"}
                        </p>
                        {conversation.product?.price && (
                          <span className="text-xs font-black text-emerald-600 font-mono shrink-0">
                            Rs {conversation.product.price}
                          </span>
                        )}
                      </div>

                      {/* White Text Box Container with Simple Black Text inside */}
                      <div className="mt-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-2xs">
                        <p
                          className={`text-xs truncate ${
                            isUnread ? "font-bold text-black" : "font-medium text-slate-800"
                          }`}
                        >
                          {conversation.messages?.[0]?.text || "Start conversation..."}
                        </p>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Message Delivery / Read Status ticks */}
                          {conversation.messages?.[0]?.senderId === currentUserId && (
                            <span className="text-xs font-mono font-bold">
                              {conversation.messages[0].isRead ? (
                                <span className="text-emerald-600" title="Read">✓✓</span>
                              ) : conversation.messages[0].isDelivered ? (
                                <span className="text-slate-400" title="Delivered">✓✓</span>
                              ) : (
                                <span className="text-slate-400" title="Sent">✓</span>
                              )}
                            </span>
                          )}

                          {/* Unread Red Indicator Dot */}
                          {isUnread && (
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}