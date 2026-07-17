"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, UserSquare2, Calendar, CreditCard, CircleDollarSign, ClipboardCheck, ArrowRight, Activity, TrendingUp, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AreaChart, BarChart } from "@/components/enterprise/SimpleCharts";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

import { useRole } from "@/features/shared/RoleProvider";

export default function AdminDashboardOverview() {
  const { user } = useRole();
  const { show } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);

  const loadStats = async () => {
    try {
      const res = await api.get('/api/v1/admin/dashboard');
      if (res.success && res.data) {
        setStatsData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Subscribe to SSE realtime events
    if (user?.id) {
      const sseUrl = `http://localhost:5000/api/v1/realtime/events?userId=${user.id}&role=${user.role}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === "admin.updated" || payload.event === "consultation.completed" || payload.event === "prescription.generated") {
            loadStats();
            show("Admin dashboard synchronized in real-time.", "info");
          }
        } catch (err) {
          console.error("Failed to parse SSE payload", err);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user]);

  const stats = [
    { label: "Total Patients", value: statsData?.totalPatients ?? "0", desc: "Registered on platform", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Verified Doctors", value: statsData?.totalDoctors ?? "0", desc: `${statsData?.pendingDoctors ?? "0"} pending approval`, icon: UserSquare2, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Users", value: statsData?.totalUsers ?? "0", desc: "All system roles", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Memberships", value: statsData?.earnings?.activeSubscribers ?? "0", desc: "₹149 monthly average", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Verification", value: statsData?.pendingDoctors ?? "0", desc: "Credentials check needed", icon: ClipboardCheck, color: "text-red-600", bg: "bg-red-50" },
    { label: "Monthly Revenue", value: `₹${statsData?.earnings?.totalCollected?.toLocaleString() ?? "0"}`, desc: "Total collected", icon: CircleDollarSign, color: "text-cyan-600", bg: "bg-cyan-50" }
  ];

  const patientGrowthTrend: any[] = statsData?.patientGrowthTrend || [];
  const monthlyRevenueTrend: any[] = statsData?.monthlyRevenueTrend || [];

  const recentRegistrations: any[] = statsData?.recentRegistrations || [];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-16 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-64 bg-slate-200 rounded-card" />
          <div className="lg:col-span-4 h-64 bg-slate-200 rounded-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back
      </button>

      {/* Admin Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">Super Administrator</span>
          <h2 className="font-heading text-2xl font-extrabold text-text-primary mt-1">{user?.email || "Admin User"}</h2>
          <p className="text-xs text-text-secondary mt-0.5">Welcome back to the secret administrative control console.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-secondary bg-slate-100 border border-border px-3.5 py-2 rounded-xl">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick Statistics Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} padding="sm" className="hover">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider truncate">
                  {stat.label}
                </span>
                <span className="text-2xl font-extrabold text-text-primary block mt-1">
                  {stat.value}
                </span>
                <span className="text-[10px] text-text-secondary block mt-0.5 truncate">
                  {stat.desc}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Patient Growth trend */}
        <Card padding="md" className="flex flex-col">
          <div className="pb-3 border-b border-border mb-4 select-none">
            <h3 className="font-heading text-sm font-bold text-text-primary">Patient Cohort Growth</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Cumulative registered patients database count.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <AreaChart data={patientGrowthTrend} height={200} color="#10B981" />
          </div>
        </Card>

        {/* Revenue Growth Trend */}
        <Card padding="md" className="flex flex-col">
          <div className="pb-3 border-b border-border mb-4 select-none">
            <h3 className="font-heading text-sm font-bold text-text-primary">Monthly Recurring Revenue (MRR)</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Active program memberships pay loads.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <BarChart data={monthlyRevenueTrend} height={200} color="#3B82F6" />
          </div>
        </Card>

      </div>

      {/* System activity & splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Audit / Registrations */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-sm font-bold text-text-primary">Recent Registrations Activity</h3>
              </div>
              <Link href="/admin/patients">
                <span className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                  View All Patients
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

              {recentRegistrations.length > 0 ? recentRegistrations.map((reg, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-text-primary block">{reg.name}</span>
                    <span className="block text-[10px] text-text-secondary">{reg.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={reg.role === "Doctor" ? "info" : "success"} size="sm">
                      {reg.role}
                    </Badge>
                    <Badge variant={reg.status === "Active" ? "success" : "neutral"} size="sm">
                      {reg.status}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-text-tertiary text-xs">
                  No recent registrations
                </div>
              )}
          </Card>
        </div>

        {/* Quick action triggers */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
            Quick Actions Console
          </h3>

          <div className="space-y-2.5">
            <Link href="/admin/doctors" className="block w-full">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                Verify Pending Doctors
              </Button>
            </Link>
            <Link href="/admin/content" className="block w-full">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                Manage Marketing Content
              </Button>
            </Link>
            <Link href="/admin/reports" className="block w-full">
              <Button size="sm" className="w-full text-xs font-bold">
                Export Analytical Reports
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
