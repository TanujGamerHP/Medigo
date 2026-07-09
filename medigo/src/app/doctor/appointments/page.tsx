"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Video, Lock, ShieldCheck, Plus, Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface ScheduledTimeSlot {
  id: string;
  time: string;
  patientName?: string;
  status: "Available" | "Booked" | "Blocked";
  type?: "Video" | "Chart Review";
}

export default function DoctorAppointmentsPage() {
  const { show } = useToast();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState("Loading...");
  const [calendarDays, setCalendarDays] = useState<{name: string, date: string, fullDate: string}[]>([]);

  useEffect(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
    });
    setCalendarDays(days);
    setSelectedDay(days[0].fullDate);
  }, []);
  const [slots, setSlots] = useState<ScheduledTimeSlot[]>([
    { id: "1", time: "09:00 AM", status: "Available" },
    { id: "2", time: "10:00 AM", status: "Available" },
    { id: "3", time: "11:15 AM", status: "Available" },
    { id: "4", time: "01:30 PM", status: "Available" },
    { id: "5", time: "03:00 PM", status: "Blocked" },
    { id: "6", time: "04:30 PM", status: "Available" }
  ]);

  const handleToggleStatus = (id: string, currentStatus: "Available" | "Booked" | "Blocked") => {
    if (currentStatus === "Booked") {
      show("Cannot toggle booked appointment slots. Page administrator permission is required.", "error");
      return;
    }

    const nextStatus = currentStatus === "Available" ? "Blocked" as const : "Available" as const;
    setSlots(slots.map(s => s.id === id ? { ...s, status: nextStatus } : s));
    show(`Slot status updated to ${nextStatus}.`, "success");
  };

  const handleUpdateSchedule = () => {
    show("Weekly clinical availability updated successfully.", "success");
  };



  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back
      </button>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-text-primary">
            Clinical Calendar & Availability
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Configure your active weekly slots, block booking sessions, and track patient consults.
          </p>
        </div>

        <Button onClick={handleUpdateSchedule} size="sm" className="font-bold">
          Update Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Weekly Calendar & Available Slots */}
        <div className="lg:col-span-8 space-y-6">
          {/* Week Selector Grid */}
          <Card padding="sm">
            <div className="grid grid-cols-7 gap-2 text-center select-none">
              {calendarDays.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(d.fullDate)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    d.fullDate === selectedDay
                      ? "bg-slate-900 text-white font-bold"
                      : "hover:bg-slate-50 text-text-secondary"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold">{d.name}</span>
                  <span className="text-xs">{d.date.split(" ")[1]}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Time Slots List */}
          <Card padding="md">
            <h3 className="font-heading text-sm font-bold text-text-primary pb-3 border-b border-border-light mb-4">
              Schedule Slots for {selectedDay}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {slots.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleToggleStatus(s.id, s.status)}
                  className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer select-none ${
                    s.status === "Booked"
                      ? "bg-slate-50 border-border opacity-85 cursor-not-allowed"
                      : s.status === "Blocked"
                      ? "bg-red-50/20 border-red-100 text-red-600"
                      : "bg-white border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${s.status === "Blocked" ? "text-red-500" : "text-primary"}`} />
                    <span>{s.time}</span>
                  </div>

                  <div>
                    {s.status === "Booked" ? (
                      <div className="text-right space-y-0.5">
                        <Badge variant="info" size="sm">Booked</Badge>
                        <span className="block text-[10px] text-text-primary font-bold">{s.patientName}</span>
                      </div>
                    ) : s.status === "Blocked" ? (
                      <Badge variant="error" size="sm">Blocked</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Available</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Schedule Legend & Notices */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Lock className="w-5 h-5 shrink-0" />
            <h3 className="font-heading text-sm font-bold text-text-primary">Clearance Controls</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Clicking on any *Available* or *Blocked* slot will instantly toggle its active state for booking matches. Booked slots cannot be modified manually.
          </p>

          <div className="border-t border-border-light pt-4 space-y-2.5 text-xs text-text-secondary font-medium">
            <div className="flex items-center justify-between">
              <span>Blocked Vacation Days</span>
              <span className="font-bold text-text-primary">0 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Weekly Booking Load</span>
              <span className="font-bold text-text-primary">88% Capacity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
