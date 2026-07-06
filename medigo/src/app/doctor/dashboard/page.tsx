"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Calendar, ClipboardCheck, Clock, ArrowRight, Video, FileText, CheckCircle2, ChevronRight, ShieldAlert, BadgeCheck, Loader2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useRole } from "@/features/shared/RoleProvider";

interface DoctorDashboardData {
  profile: {
    name: string;
    specialization: string;
    availabilityStatus: string;
    status: string;
  };
  metrics: {
    totalAppointments: number;
    pendingApprovals: number;
    allTimeRevenue?: number;
    monthlyRevenue?: number;
  };
  upcomingConsultations: Array<{
    id: string;
    patientName: string;
    date: string;
    time: string;
    status: string;
  }>;
}

export default function DoctorDashboardOverview() {
  const router = useRouter();
  const { user } = useRole();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DoctorDashboardData | null>(null);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/api/v1/doctor/dashboard");
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err: any) {
      console.warn("Doctor dashboard endpoint not ready, using local data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Subscribe to SSE realtime events
    if (user?.id) {
      const sseUrl = `http://localhost:5000/api/v1/realtime/events?userId=${user.id}&role=${user.role}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === "doctor.updated" || payload.event === "admin.updated") {
            fetchDashboard();
            show("Dashboard synchronized in real-time.", "info");
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-text-secondary font-bold">Synchronizing medical workspace...</p>
      </div>
    );
  }

  const doctor = user?.doctor || {};
  const name = doctor.firstName ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Dr. Clinician";
  
  const profile = {
    name: name,
    specialization: doctor.specialization || "Obesity Medicine",
    availabilityStatus: doctor.availabilityStatus || "Available",
    status: doctor.status || "Verified",
  };

  // Check verification status
  const isVerified = profile.status === "Verified";

  if (!isVerified) {
    return (
      <div className="space-y-8 text-left max-w-4xl mx-auto animate-fade-in py-6">
        
        {/* Clinician Review Header */}
        <div className="flex flex-col gap-2 pb-4 border-b border-border/60">
          <span className="text-[10px] text-error font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Medical Portal Access Restricted
          </span>
          <h2 className="font-heading text-2xl font-extrabold text-text-primary mt-1">
            Welcome, {profile.name}
          </h2>
          <p className="text-xs text-text-secondary">
            Obesity Specialty: <span className="font-bold text-text-primary">{profile.specialization}</span>
          </p>
        </div>

        {/* Credentials Verification Card */}
        <Card padding="lg" className="glass bg-white/70 shadow-xl border border-primary/10">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
              <ShieldAlert className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-lg font-black text-text-primary">
                State License & Credentials Review In Progress
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
                Your medical registration profile has been successfully recorded. Under HIPAA and federal telehealth regulations, all clinical practitioners must be fully verified against state licensing registries before conducting consultations.
              </p>

              {/* Steps timeline */}
              <div className="border-l-2 border-primary/20 pl-5 ml-2.5 space-y-5 py-2">
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white ring-2 ring-primary/20"></span>
                  <h4 className="text-xs font-bold text-text-primary">Clinical Registry Record Created</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Account submission and terms accepted.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white ring-2 ring-amber-400/20"></span>
                  <h4 className="text-xs font-bold text-text-primary">Medical License Verification</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">NPI validation & state board credentials check in progress.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></span>
                  <h4 className="text-xs font-bold text-text-secondary">Administrative Board Activation</h4>
                  <p className="text-[10px] text-text-tertiary mt-0.5">Provider profile activated in the patient scheduling queues.</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/50 text-[10px] text-amber-800 leading-relaxed max-w-xl">
                <strong>Clinical Coordinator Support:</strong> Verification takes approximately 24 to 48 business hours. You will receive an email confirmation once your profile is approved. For immediate escalation, contact <span className="underline font-bold">clinical-network@medigo.com</span>.
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Active verified clinician screen
  const stats = [
    { label: "Today's Appointments", value: String(data?.metrics.totalAppointments || 0), desc: "Direct video calls", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Approvals", value: String(data?.metrics.pendingApprovals || 0), desc: "Require titration audit", icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Monthly Revenue", value: `₹${data?.metrics.monthlyRevenue || 0}`, desc: "Earned this month", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "All-Time Revenue", value: `₹${data?.metrics.allTimeRevenue || 0}`, desc: "Lifetime earnings", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  const upcomingConsultations = data?.upcomingConsultations || [];

  return (
    <div className="space-y-8 text-left animate-fade-in">
      
      {/* Clinician Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5 text-primary" />
            Verified Medical Practitioner
          </span>
          <h2 className="font-heading text-2xl font-extrabold text-text-primary mt-1">{profile.name}</h2>
          <p className="text-xs text-text-secondary mt-0.5">Welcome back. Specialty: {profile.specialization}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-secondary bg-slate-100 border border-border px-3.5 py-2 rounded-xl">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <Link href="/doctor/patients">
            <Button size="sm" className="font-bold shadow-sm">
              Open Patient Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Today's Schedule & Patient Queue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Today's Schedule Panel */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-sm font-bold text-text-primary">Today&apos;s Appointments</h3>
              </div>
              <Link href="/doctor/appointments">
                <span className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                  View Full Schedule
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {upcomingConsultations.length === 0 ? (
              <p className="text-xs text-text-secondary py-6 text-center select-none">No consultations scheduled for today.</p>
            ) : (
              <div className="divide-y divide-border-light">
                {upcomingConsultations.map((app) => (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-text-primary">{app.patientName}</h4>
                        <Badge variant={app.status === "Pending" ? "warning" : "success"} size="sm">
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1">
                        Consultation • Scheduled Date: <span className="font-semibold text-text-primary">{app.date}</span>
                      </p>
                      <span className="inline-block bg-slate-100 text-text-secondary text-[9px] px-2 py-0.5 rounded font-mono font-bold mt-2">
                        {app.time}
                      </span>
                    </div>

                    <div className="flex gap-2 self-start sm:self-center shrink-0">
                      <Link href={`/doctor/patients`}>
                        <Button variant="outline" size="sm" className="text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                          View Profile
                        </Button>
                      </Link>
                      <Link href={`/consultation/room/${app.id}`}>
                        <Button size="sm" className="text-xs font-bold" rightIcon={<Video className="w-3.5 h-3.5" />}>
                          Start Consult
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-light">
              <h3 className="font-heading text-sm font-bold text-text-primary">Quick Actions</h3>
            </div>

            <div className="space-y-3">
              <Link href="/doctor/appointments" className="block w-full group">
                <Button variant="outline" size="sm" className="w-full text-xs font-bold border-primary text-text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-between">
                  <span>Manage Schedule</span>
                  <ChevronRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </Button>
              </Link>
              <Link href="/doctor/patients" className="block w-full group">
                <Button variant="outline" size="sm" className="w-full text-xs font-bold border-primary text-text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-between">
                  <span>Prescribe Medication</span>
                  <ChevronRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
