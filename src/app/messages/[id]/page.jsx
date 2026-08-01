"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage({ params }) {
  const router = useRouter();  
  const { id } = use(params);
  
  const [conversation, setConversation] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchConversation();
  }, [id]);

  useEffect(() => {
    async function updatePresence() {
      try {
        await fetch("/api/user/presence", {
          method: "PUT",
        });
      } catch (error) {
        console.log(error);
      }
    }

    updatePresence();
    const interval = setInterval(() => {
      updatePresence();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function fetchConversation() {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setConversation(data.conversation);
        setCurrentUserId(data.currentUserId);
        await fetch(`/api/messages/${id}/read`, {
          method: "PUT",
        });
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
          });
        }, 100);
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
          <div className="w-5 h-5 border-2 border-[#0084FF] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-600 tracking-wider">Opening Messenger...</span>
        </div>
      </div>
    );
  }

  const chatUser =
    currentUserId === conversation?.buyerId
      ? (conversation?.admin || conversation?.seller)
      : conversation?.buyer;

  if (!conversation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-slate-800">
        <div className="text-center space-y-3">
          <h2 className="text-lg font-bold">Conversation not found</h2>
          <button onClick={() => router.back()} className="text-xs font-bold bg-[#0084FF] text-white px-4 py-2 rounded-full">Go Back</button>
        </div>
      </div>
    );
  }

  async function sendMessage() {
    if (!message.trim() && !selectedImage) return;

    try {
      setSending(true);
      let imageUrl = "";

      if (selectedImage) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await fetch("/api/upload/chat-image", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          setUploadingImage(false);
          alert(uploadData.message);
          return;
        }

        imageUrl = uploadData.image;
        setUploadingImage(false);
      }

      const response = await fetch(`/api/messages/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          image: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setMessage("");
      setSelectedImage(null);
      setUploadingImage(false);

      await fetchConversation();

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-screen sm:h-[92vh] sm:my-4 sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-lg overflow-hidden bg-white">

        {/* Messenger Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all font-bold shrink-0"
            >
              ←
            </button>

            {/* Profile Avatar / Product Image */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-200">
                <img
                  src={
                    conversation.product?.image
                      ? `/images/${conversation.product.image}`
                      : "/images/no-image.png"
                  }
                  className="w-full h-full object-cover"
                  alt="product"
                />
              </div>
              {(() => {
                const lastSeen = chatUser?.lastSeen ? new Date(chatUser.lastSeen) : null;
                const isRecentlyActive = lastSeen && (new Date() - lastSeen) < 90000;
                if (isRecentlyActive) {
                  return (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Active"></span>
                  );
                }
              })()}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate">
                  {chatUser?.name}
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {conversation.product?.title} • <span className="text-[#0084FF] font-semibold">Rs {conversation.product?.price}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-[#0084FF] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {chatUser?.role === "ADMIN" ? "Support" : chatUser?.role || "Buyer"}
            </span>
          </div>
        </div>

        {/* Messages Stream Area (Clean White Messenger Background) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {conversation.messages?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
              <div className="text-4xl">👋</div>
              <p className="text-sm font-semibold text-slate-700">Start your conversation with {chatUser?.name}</p>
              <p className="text-xs text-slate-400">Send a greeting or discuss product details.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversation.messages?.map((msg) => {
                const isMe = msg.senderId === currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl shadow-2xs space-y-1 ${
                        isMe
                          ? "bg-[#0084FF] text-white rounded-br-xs"
                          : "bg-[#F0F2F5] text-slate-900 rounded-bl-xs"
                      }`}
                    >
                      {msg.image && (
                        <div className="rounded-xl overflow-hidden bg-black/5 max-h-64 my-1">
                          <img
                            src={msg.image}
                            alt="Attachment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {msg.text && (
                        <p className={`text-sm leading-normal ${isMe ? "text-white" : "text-slate-900"}`}>
                          {msg.text}
                        </p>
                      )}
                    </div>

                    {/* Timestamp & Read Status below bubble */}
                    <div className={`flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {isMe && (
                        <span className="font-bold">
                          {msg.isRead ? (
                            <span className="text-[#0084FF]" title="Seen">✓✓</span>
                          ) : msg.isDelivered ? (
                            <span className="text-slate-400" title="Delivered">✓✓</span>
                          ) : (
                            <span className="text-slate-300" title="Sent">✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef}></div>
            </div>
          )}
        </div>

        {/* Selected Image Preview Bar */}
        {selectedImage && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-300 bg-white">
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">Image attached</p>
                <p className="text-[10px] text-slate-500 truncate max-w-xs">{selectedImage.name}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedImage(null)}
              className="text-xs font-semibold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Messenger Bottom Bar Style */}
        <div className="border-t border-slate-200 p-3 bg-white flex items-center gap-2 shrink-0">
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedImage(e.target.files[0]);
              }
            }}
          />

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#0084FF] transition-all shrink-0 cursor-pointer text-xl"
            title="Attach Photo"
          >
            🖼️
          </button>

          <div className="flex-1 bg-[#F0F2F5] rounded-full px-4 py-2 flex items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Aa"
              rows="1"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-hidden resize-none max-h-20"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={sending || uploadingImage}
            className="text-[#0084FF] hover:bg-blue-50 font-bold text-sm px-4 py-2 rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-40"
          >
            {uploadingImage ? "..." : sending ? "..." : "Send"}
          </button>
        </div>

      </div>
    </div>
  );
}