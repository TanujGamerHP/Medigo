"use client";

import React, { useState } from "react";
import { Bell, X, ShieldAlert, Calendar, FileText, CheckCircle, Mail, MessageSquare, Check, Eye } from "lucide-react";

export interface SystemNotification {
  id: string;
  type: "System" | "Appointment" | "Prescription" | "Lab";
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
  deliveryReceipts: {
    email: "Sent" | "Delivered" | "Read";
    whatsapp: "Sent" | "Delivered" | "Read";
  };
}

const initialNotifications: SystemNotification[] = [];

import { api } from "@/lib/api";
import { useRole } from "@/features/shared/RoleProvider";

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useRole();
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<"All" | "Unread" | "System" | "Medical">("All");

  const mapNotification = (n: any): SystemNotification => ({
    id: n.id,
    type: n.type === "consultation" || n.type === "prescription" || n.type === "treatment" || n.type === "appointment" ? "Appointment" : "System",
    title: n.title || "Notification",
    desc: n.message,
    time: new Date(n.createdAt).toLocaleDateString() + " " + new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    isRead: n.isRead,
    deliveryReceipts: { email: "Delivered", whatsapp: "Delivered" },
  });

  React.useEffect(() => {
    if (!isOpen || !user) return;
    
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/v1/notifications");
        if (res.success && Array.isArray(res.data)) {
          setNotifications(res.data.map(mapNotification));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const sseUrl = `${baseUrl}/api/v1/realtime/events?userId=${user.id}&role=${user.role}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.event === 'notification.new') {
          const newNotif = mapNotification(parsed.data.notification);
          setNotifications(prev => [newNotif, ...prev]);
        }
      } catch (err) {
        console.error("Failed to parse SSE in Notification Center drawer", err);
      }
    };
    
    return () => eventSource.close();
  }, [isOpen, user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      const res = await api.patch("/api/v1/notifications/read-all", {});
      if (res.success) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "Unread") return !n.isRead;
    if (filter === "System") return n.type === "System";
    if (filter === "Medical") return n.type === "Appointment" || n.type === "Prescription" || n.type === "Lab";
    return true;
  });

  const getIcon = (type: SystemNotification["type"]) => {
    switch (type) {
      case "System":
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "Appointment":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "Prescription":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Lab":
        return <FileText className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStatusColor = (status: "Sent" | "Delivered" | "Read") => {
    switch (status) {
      case "Sent":
        return "text-slate-400";
      case "Delivered":
        return "text-blue-400";
      case "Read":
        return "text-emerald-500";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[450]" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white border-l border-border shadow-2xl z-[500] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-lg font-bold text-text-primary">
              Notification Center
            </h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-primary hover:text-primary-700 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border-light bg-slate-50 flex gap-2 overflow-x-auto">
          {(["All", "Unread", "System", "Medical"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === t
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-border-light text-text-secondary hover:text-text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-tertiary p-6">
              <Bell className="w-12 h-12 stroke-[1.5] mb-2" />
              <p className="text-sm font-semibold">No notifications</p>
              <p className="text-xs mt-1">You are all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex gap-4 ${
                  notif.isRead
                    ? "bg-transparent border-border-light"
                    : "bg-primary-50/20 border-primary/20 shadow-sm"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-text-primary leading-tight">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-text-tertiary whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {notif.desc}
                  </p>

                  {/* Delivery Status Logs */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dashed border-border-light text-[10px] text-text-tertiary">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email:</span>
                      <span className={`font-semibold ${getStatusColor(notif.deliveryReceipts.email)}`}>
                        {notif.deliveryReceipts.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp:</span>
                      <span className={`font-semibold ${getStatusColor(notif.deliveryReceipts.whatsapp)}`}>
                        {notif.deliveryReceipts.whatsapp}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRead(notif.id)}
                  title={notif.isRead ? "Mark unread" : "Mark read"}
                  className="flex-shrink-0 self-start p-1 rounded-lg hover:bg-slate-100 transition-colors text-text-tertiary hover:text-text-primary"
                >
                  {notif.isRead ? <Eye className="w-4 h-4" /> : <Check className="w-4 h-4 text-primary" />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
