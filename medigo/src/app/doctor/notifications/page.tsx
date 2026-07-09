"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Trash2, Calendar, Pill, AlertTriangle, ShieldCheck, Mail, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  category: "Alert" | "Booking" | "Refill" | "All";
  isRead: boolean;
}

const initialNotifications: NotificationItem[] = [];

import { api } from "@/lib/api";

export default function DoctorNotificationsPage() {
  const router = useRouter();
  const { show } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<"All" | "Alert" | "Booking" | "Refill">("All");

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/notifications");
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((n: any) => ({
          id: n.id,
          text: n.message,
          time: new Date(n.createdAt).toLocaleDateString() + " " + new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          category: n.type === "appointment" ? "Booking" : n.type === "consultation" ? "Alert" : "Refill",
          isRead: n.isRead,
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await api.patch("/api/v1/notifications/read-all", {});
      if (res.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        show("All clinic notifications marked as read.", "success");
      }
    } catch (err) {
      show("Failed to mark read.", "error");
    }
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    show("Notification dismissed.", "info");
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === "All") return true;
    return n.category === activeCategory;
  });

  const categories: ("All" | "Alert" | "Booking" | "Refill")[] = ["All", "Alert", "Booking", "Refill"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 text-left">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <h2 className="font-heading text-xl font-extrabold text-text-primary">
            Clinic Notifications
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Monitor patient intake forms queue alerts, pharmacy dispatch notes, and lab collection alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Notifications List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] text-text-secondary font-bold font-mono">
              {filteredNotifications.length} Alerts Logged
            </span>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-primary hover:underline focus:outline-none"
              >
                Mark all as read
              </button>
            )}
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <Card 
                  key={notif.id} 
                  padding="sm" 
                  className={`relative flex gap-4 items-start ${!notif.isRead ? "bg-primary-50/10 border-primary/20" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.isRead ? "bg-primary" : "bg-slate-200"}`} />
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-text-primary font-medium leading-relaxed">
                      {notif.text}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-text-secondary">
                      <span>{notif.time}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{notif.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 rounded-lg border border-border-light hover:border-red-200 text-text-tertiary hover:text-red-500 transition-colors"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white border border-border rounded-3xl">
              <Bell className="w-12 h-12 text-text-tertiary" />
              <h4 className="font-heading font-bold text-base text-text-primary">Clinic Inbox Clean</h4>
              <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                No active notifications in this category. Patient queue updates and pharmacy dispatches will alert here.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Alerts Delivery Channels */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-heading text-sm font-bold text-text-primary">EHR Alerts System</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Clinician warnings and patient status changes are logged directly to the audit system compliance trails.
          </p>
        </div>
      </div>
    </div>
  );
}
