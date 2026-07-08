"use client";

import React, { useState } from "react";
import { Stethoscope, Calendar, Save, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function DoctorProfile() {
  const { addToast } = useToast();
  
  // Doctor profile fields
  const [qualifications, setQualifications] = useState("MD, Board-Certified in Obesity Medicine & Internal Medicine");
  const [languages, setLanguages] = useState("English, Spanish");
  const [consultationFee, setConsultationFee] = useState(150);
  const [isSaving, setIsSaving] = useState(false);

  // Slot scheduling states
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const toggleDay = (day: string) => {
    setSelectedDays(
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        type: "success",
        message: "Doctor professional settings updated successfully.",
      });
    }, 800);
  };

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Details Form */}
        <form onSubmit={handleSaveProfile} className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-2 select-none">
            <Stethoscope className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              Professional Credentials
            </h3>
          </div>

          <div>
            <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">
              Qualifications & Credentials
            </label>
            <input
              type="text"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">
              Languages Spoken
            </label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] text-text-tertiary block font-bold uppercase">
                Consultation Base Fee ($)
              </label>
              <span className="text-xs font-bold text-primary">₹{consultationFee} / consult</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={consultationFee}
              onChange={(e) => setConsultationFee(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="border-t border-border pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Credentials"}
            </button>
          </div>
        </form>

        {/* Slot Availability Scheduler */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-2 select-none">
            <Calendar className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              Clinic Slot Availability
            </h3>
          </div>

          <div>
            <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-2 select-none">
              Weekly Consultation Days
            </label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border-light pt-4">
            <div>
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">
                Start Time (Sync Call)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-border-light p-3.5 rounded-xl text-[10px] text-text-secondary leading-relaxed select-none">
            Slots will automatically be split into 30-minute consultation intervals. Patient booking queues will sync dynamically based on these settings.
          </div>
        </div>
      </div>
    </div>
  );
}
