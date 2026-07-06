"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Plus, Lock, Calendar, AlertTriangle, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface ConfiguredSlot {
  id: string;
  day: string;
  time: string;
  type: "Regular" | "Extended";
  status: "Active" | "Blocked";
}

const initialSlots: ConfiguredSlot[] = [
  { id: "1", day: "Monday", time: "09:00 AM - 12:00 PM", type: "Regular", status: "Active" },
  { id: "2", day: "Tuesday", time: "01:00 PM - 05:00 PM", type: "Regular", status: "Active" },
  { id: "3", day: "Wednesday", time: "09:00 AM - 12:00 PM", type: "Regular", status: "Blocked" },
  { id: "4", day: "Thursday", time: "09:00 AM - 05:00 PM", type: "Extended", status: "Active" },
  { id: "5", day: "Friday", time: "09:00 AM - 12:00 PM", type: "Regular", status: "Active" },
];

export default function DoctorAvailabilityPage() {
  const router = useRouter();
  const { show } = useToast();
  const [slots, setSlots] = useState<ConfiguredSlot[]>(initialSlots);
  const [vacationDays, setVacationDays] = useState<string[]>(["July 10, 2026", "July 11, 2026"]);
  const [newVacationDay, setNewVacationDay] = useState("");

  const handleToggleSlotStatus = (id: string) => {
    setSlots(slots.map(s => 
      s.id === id 
        ? { ...s, status: s.status === "Active" ? "Blocked" : "Active" } 
        : s
    ));
    show("Weekly availability window updated.", "success");
  };

  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacationDay) return;
    if (vacationDays.includes(newVacationDay)) {
      show("Vacation day already marked on calendar.", "error");
      return;
    }
    setVacationDays([...vacationDays, newVacationDay]);
    setNewVacationDay("");
    show("Vacation/Blocked day registered.", "success");
  };

  const handleRemoveVacation = (day: string) => {
    setVacationDays(vacationDays.filter(d => d !== day));
    show("Vacation day removed from calendar.", "info");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </button>
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Clinical Availability Rules
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure your weekly session templates, block out slots, and log scheduled vacation days.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: Weekly Slots Configurer */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <h3 className="font-heading text-sm font-bold text-text-primary">Weekly Session Template</h3>
              <Badge variant="success" size="sm">Template Active</Badge>
            </div>

            <div className="space-y-3.5">
              {slots.map((s) => (
                <div 
                  key={s.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border-light text-xs font-semibold"
                >
                  <div className="space-y-1">
                    <span className="text-text-primary font-bold">{s.day}</span>
                    <span className="block text-[10px] text-text-secondary leading-none">
                      {s.time} • {s.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={s.status === "Active" ? "success" : "error"} size="sm">
                      {s.status}
                    </Badge>
                    <button
                      onClick={() => handleToggleSlotStatus(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                        s.status === "Active"
                          ? "border-red-200 hover:border-red-500 hover:text-red-500 text-text-secondary bg-white"
                          : "border-emerald-200 hover:border-emerald-500 hover:text-emerald-500 text-text-secondary bg-white"
                      }`}
                    >
                      {s.status === "Active" ? "Block" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Vacation Days & Blocked Calendars */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="md" className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
              Vacation & Blocked Days
            </h3>

            <form onSubmit={handleAddVacation} className="flex gap-2">
              <label htmlFor="vacation-date-input" className="sr-only">Vacation date</label>
              <input
                id="vacation-date-input"
                type="text"
                placeholder="e.g. July 12, 2026"
                value={newVacationDay}
                onChange={(e) => setNewVacationDay(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" size="sm" className="font-bold">
                Add
              </Button>
            </form>

            <div className="space-y-2 pt-2 text-xs">
              {vacationDays.map((day) => (
                <div key={day} className="flex items-center justify-between p-2.5 bg-slate-50 border border-border-light rounded-xl font-semibold">
                  <span className="text-text-primary">{day}</span>
                  <button 
                    onClick={() => handleRemoveVacation(day)}
                    className="text-[10px] text-red-500 hover:underline font-bold focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="sm" className="border-amber-100 bg-amber-50/15">
            <div className="flex gap-2.5 items-start text-xs text-text-secondary leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block">Schedule Blocks Notice</span>
                Blocking slots or adding vacation days will auto-notify patients with matching bookings to reschedule.
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
