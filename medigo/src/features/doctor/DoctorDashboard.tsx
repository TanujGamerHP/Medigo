"use client";

import React from "react";
import { useRole } from "@/features/shared/RoleProvider";
import { Users, Clock, ClipboardCheck, Star, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { AreaChart } from "@/components/enterprise/SimpleCharts";

const mockOverviewStats = [
  { label: "Today's Queue", value: "0 Patients", desc: "No upcoming consults", icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
  { label: "Pending Approvals", value: "0 Tasks", desc: "All caught up", icon: <ClipboardCheck className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
  { label: "Average Rating", value: "-- / 5.0", desc: "No reviews yet", icon: <Star className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
  { label: "Hours Utilized", value: "0%", desc: "0 hours booked", icon: <Clock className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
];

const mockAppointments: any[] = [];

const revenueTrend = [
  { label: "Jan", value: 4500 },
  { label: "Feb", value: 5800 },
  { label: "Mar", value: 6200 },
  { label: "Apr", value: 7500 },
  { label: "May", value: 9100 },
  { label: "Jun", value: 8900 },
];

export function DoctorDashboard({ onSelectTab }: { onSelectTab: (tab: string) => void }) {
  const { currentRole } = useRole();

  return (
    <div className="space-y-6">
      {/* Header greeting */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl select-none">
        <div>
          <span className="bg-primary/20 text-primary-400 text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            Obesity Specialist Panel
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2">
            Welcome Back, Doctor
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            You have 0 consults scheduled today.
          </p>
        </div>
        <button
          onClick={() => onSelectTab("queue")}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary hover:bg-primary-600 text-slate-950 font-bold text-sm shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 self-start sm:self-center"
        >
          <span>Open Patient Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockOverviewStats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-white border border-border hover:shadow-md transition-all duration-300 flex items-start gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg} flex-shrink-0`}>{stat.icon}</div>
            <div>
              <span className="text-xs text-text-tertiary block font-semibold uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-xl font-bold text-text-primary block mt-1">
                {stat.value}
              </span>
              <span className="text-[10px] text-text-secondary block mt-0.5 font-medium leading-relaxed">
                {stat.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule & Analytics Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-2 select-none">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Today's Virtual Appointments
              </h3>
            </div>
            <span className="text-[10px] text-primary bg-primary-50/50 border border-primary-200 px-2 py-0.5 rounded font-bold">
              3 Remaining
            </span>
          </div>

          <div className="divide-y divide-border-light">
            {mockAppointments.length > 0 ? mockAppointments.map((app) => (
              <div key={app.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{app.patient}</h4>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {app.type} • {app.reason}
                  </p>
                  <span className="inline-block bg-slate-100 text-text-secondary text-[10px] px-2 py-0.5 rounded font-mono font-bold mt-1.5">
                    {app.time}
                  </span>
                </div>
                <button
                  onClick={() => onSelectTab("queue")}
                  className="px-4 py-2 border border-border hover:border-primary/40 rounded-xl bg-white text-xs font-bold text-text-primary hover:text-primary transition-all shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-center"
                >
                  Join Call
                </button>
              </div>
            )) : (
              <div className="py-8 text-center text-text-tertiary text-xs">
                No appointments scheduled for today
              </div>
            )}
          </div>
        </div>

        {/* Doctor Consultation Revenue trend */}
        <div className="bg-white rounded-2xl border border-border p-5 flex flex-col">
          <div className="pb-3 border-b border-border mb-4 select-none">
            <h3 className="font-heading text-sm font-bold text-text-primary">
              Consultation Fees Generated
            </h3>
            <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
              Dr. Mitchell's payout trajectory (monthly payouts).
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <AreaChart data={revenueTrend} height={180} color="#3B82F6" />
          </div>
        </div>
      </div>
    </div>
  );
}
