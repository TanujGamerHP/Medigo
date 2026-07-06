"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingDown, 
  Calendar, 
  FileText, 
  Pill, 
  ShoppingBag, 
  Bell, 
  ChevronRight, 
  ArrowRight, 
  Plus, 
  Video,
  Download,
  ShieldCheck,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function DashboardOverview() {
  const { user } = useRole();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic data from user profile
  const patient = user?.patient || {};
  const currentWeight = patient.weight ? `${patient.weight} kg` : "Not set";
  const name = patient.firstName ? `${patient.firstName} ${patient.lastName}` : "Patient";
  const initials = patient.firstName ? `${patient.firstName[0]}${patient.lastName ? patient.lastName[0] : ''}`.toUpperCase() : "P";
  const age = patient.dob ? Math.floor((new Date().getTime() - new Date(patient.dob).getTime()) / 3.15576e+10) : "--";

  const healthData = {
    weight: { current: currentWeight, lastUpdated: "Recent", trend: "Stable" },
    bmi: { value: patient.height && patient.weight ? (patient.weight / ((patient.height/100) * (patient.height/100))).toFixed(1) : "--", status: "Healthy" as const },
    goal: { current: patient.weight || 0, target: patient.weight ? patient.weight - 5 : 0, start: patient.weight ? patient.weight + 5 : 0, percentage: 50 },
    membership: { plan: "Basic Care", renewal: "--", status: "Active" as const }
  };

  // Dynamic states
  const [appointment, setAppointment] = useState<any>(null);
  const [latestAssessment, setLatestAssessment] = useState<any>(null);
  const prescription: any = null;
  const recentOrder: any = null;
  const notifications: any[] = [];

  const loadDashboard = async () => {
    try {
      const [apptsRes, assessRes] = await Promise.all([
        api.get('/api/v1/appointments'),
        api.get('/api/v1/assessment/history')
      ]);
      
      if (apptsRes.success && apptsRes.data && apptsRes.data.length > 0) {
        const appt = apptsRes.data[0];
        setAppointment({
          doctorName: `Dr. ${appt.doctor?.firstName || ''} ${appt.doctor?.lastName || ''}`.trim(),
          specialization: appt.doctor?.specialization || "General",
          date: appt.appointmentDate,
          time: appt.appointmentTime,
          type: appt.consultationType,
          initials: `${appt.doctor?.firstName?.[0] || 'D'}${appt.doctor?.lastName?.[0] || 'R'}`.toUpperCase()
        });
      }
      
      if (assessRes.success && assessRes.data && assessRes.data.length > 0) {
        const assessData = assessRes.data[0];
        setLatestAssessment({
          score: assessData.assessmentScore || 0,
          eligibility: assessData.result || "Under Review",
          program: assessData.recommendation || "Pending Evaluation"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    // Subscribe to SSE realtime events
    if (user?.id) {
      const sseUrl = `http://localhost:5000/api/v1/realtime/events?userId=${user.id}&role=${user.role}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === "patient.updated" || payload.event === "admin.updated") {
            loadDashboard();
            show("Patient dashboard synchronized in real-time.", "info");
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

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        {/* Header Loading */}
        <div className="h-16 w-64 bg-slate-200 rounded-lg" />
        
        {/* KPI Grid Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-card" />
          ))}
        </div>

        {/* Splits Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-48 bg-slate-200 rounded-card" />
            <div className="h-48 bg-slate-200 rounded-card" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-64 bg-slate-200 rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h3 className="font-heading text-lg font-bold text-text-primary">Unable to load dashboard</h3>
        <p className="text-sm text-text-secondary max-w-sm">
          A connection issue occurred while syncing your metabolic metrics database.
        </p>
        <Button onClick={handleRetry} className="px-6 py-2.5">
          Retry Sync Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      
      {/* 1. Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">Good Morning</span>
          <h2 className="font-heading text-2xl font-extrabold text-text-primary mt-1">{name}</h2>
          <p className="text-xs text-text-secondary mt-0.5">Welcome back to your healthcare dashboard.</p>
        </div>
        
        {/* Date / Quick CTA Header Block */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-text-secondary bg-slate-100 border border-border px-3.5 py-2 rounded-xl">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <Link href="/doctors">
            <Button variant="outline" size="sm" className="font-bold border-border text-text-primary hover:bg-slate-50">
              Book Appointment
            </Button>
          </Link>
          <Link href="/assessment">
            <Button size="sm" className="font-bold">
              Start New Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Health Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Weight Card */}
        <Card className="hover" padding="sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-text-tertiary font-bold uppercase">Current Weight</span>
              <span className="text-2xl font-extrabold text-text-primary block mt-1">{healthData.weight.current}</span>
              <span className="text-[10px] text-text-secondary block mt-1">{healthData.weight.lastUpdated}</span>
            </div>
            <div className="p-2 rounded-xl bg-green-50 border border-green-100 text-green-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-border-light mt-4 pt-3 flex justify-between items-center select-none">
            <span className="text-[10px] text-text-secondary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Trend: {healthData.weight.trend}
            </span>
            <Link href="/dashboard/assessments" className="text-[10px] font-bold text-primary hover:underline">
              View Progress
            </Link>
          </div>
        </Card>

        {/* BMI Card */}
        <Card className="hover" padding="sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-text-tertiary font-bold uppercase">Body Mass Index</span>
              <span className="text-2xl font-extrabold text-text-primary block mt-1">{healthData.bmi.value}</span>
              <span className="text-[10px] text-text-secondary block mt-1">Class I Normal Range</span>
            </div>
            <div className="mt-1">
              <Badge variant="success" size="sm">
                {healthData.bmi.status}
              </Badge>
            </div>
          </div>
          <div className="border-t border-border-light mt-4 pt-3 text-right">
            <Link href="/dashboard/assessments" className="text-[10px] font-bold text-primary hover:underline">
              View Details
            </Link>
          </div>
        </Card>

        {/* Goal Progress Card */}
        <Card className="hover" padding="sm">
          <div className="space-y-2">
            <span className="text-[10px] text-text-tertiary font-bold uppercase">Weight Goal Progress</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-base font-bold text-text-primary">
                {healthData.goal.current} kg → {healthData.goal.target} kg
              </span>
              <span className="text-[10px] font-bold text-primary">{healthData.goal.percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                style={{ width: `${healthData.goal.percentage}%` }} 
                className="h-full bg-primary rounded-full" 
              />
            </div>
          </div>
          <div className="border-t border-border-light mt-4 pt-3 text-right">
            <Link href="/dashboard/assessments" className="text-[10px] font-bold text-primary hover:underline">
              View Progress
            </Link>
          </div>
        </Card>

        {/* Membership Plan Card */}
        <Card className="hover" padding="sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-text-tertiary font-bold uppercase">Membership</span>
              <span className="text-sm font-bold text-text-primary block mt-1 truncate max-w-[150px]" title={healthData.membership.plan}>
                {healthData.membership.plan}
              </span>
              <span className="text-[10px] text-text-secondary block mt-1">Renews {healthData.membership.renewal}</span>
            </div>
            <div>
              <Badge variant="success" size="sm">
                {healthData.membership.status}
              </Badge>
            </div>
          </div>
          <div className="border-t border-border-light mt-4 pt-3 text-right">
            <Link href="/membership/checkout?plan=Premium" className="text-[10px] font-bold text-primary hover:underline">
              Upgrade Membership
            </Link>
          </div>
        </Card>

      </div>

      {/* 3. Splits: Main panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Appointments, Assessments, Orders, Prescriptions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upcoming Appointment */}
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <h3 className="font-heading text-sm font-bold text-text-primary">Upcoming Consultation</h3>
              {appointment && <Badge variant="info" size="sm">Scheduled</Badge>}
            </div>
            
            {appointment ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary font-bold text-xs flex items-center justify-center">
                      {appointment.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">{appointment.doctorName}</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5">{appointment.specialization}</p>
                    </div>
                  </div>

                  <div className="text-xs text-text-secondary sm:text-right space-y-0.5">
                    <p className="font-semibold text-text-primary">{appointment.date}</p>
                    <p>{appointment.time} • <span className="text-primary font-semibold">{appointment.type}</span></p>
                  </div>
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-border-light">
                  <Link href="/dashboard/appointments" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                      Reschedule
                    </Button>
                  </Link>
                  <Link href="/dashboard/appointments" className="flex-1">
                    <Button size="sm" className="w-full text-xs font-bold">
                      View Details
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-text-tertiary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">No upcoming appointments</p>
                  <p className="text-xs text-text-secondary mt-1">Book a consultation with a specialist.</p>
                </div>
                <Link href="/assessment" className="mt-2">
                  <Button size="sm" className="text-xs font-bold px-6">Book Now</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Assessment History */}
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <h3 className="font-heading text-sm font-bold text-text-primary">Latest Health Assessment</h3>
              {latestAssessment && <span className="text-[10px] text-text-secondary font-bold">Completed {latestAssessment.date}</span>}
            </div>

            {latestAssessment ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-text-secondary leading-relaxed">
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Assessment Score</span>
                    <span className="text-text-primary font-bold block mt-0.5">{latestAssessment.score}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Eligibility Status</span>
                    <span className="text-primary font-bold block mt-0.5">{latestAssessment.eligibility}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Recommended Therapy Program</span>
                    <span className="text-text-primary font-bold block mt-0.5">{latestAssessment.program}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-border-light">
                  <Link href="/assessment" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                      Take New Assessment
                    </Button>
                  </Link>
                  <Link href="/dashboard/assessments" className="flex-1">
                    <Button size="sm" className="w-full text-xs font-bold">
                      View Full Report
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-text-tertiary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">No assessments taken</p>
                  <p className="text-xs text-text-secondary mt-1">Complete your first assessment to check eligibility.</p>
                </div>
                <Link href="/assessment" className="mt-2">
                  <Button size="sm" className="text-xs font-bold px-6">Start Assessment</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Prescription Summary */}
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <h3 className="font-heading text-sm font-bold text-text-primary">Active Prescription</h3>
              {prescription && <span className="text-[10px] text-text-secondary font-bold">Issued {prescription.date}</span>}
            </div>

            {prescription ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-text-primary">{prescription.medication}</h4>
                  <p className="text-[10px] text-text-secondary">
                    Authorized by: {prescription.doctor} • {prescription.medicineCount} active vial kit
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button className="p-2 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors" title="Download PDF copy">
                    <Download className="w-4 h-4" />
                  </button>
                  <Link href="/dashboard/prescriptions">
                    <Button variant="outline" size="sm" className="text-[10px] font-bold border-border text-text-primary hover:bg-slate-50">
                      View Prescription
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-text-tertiary">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-text-primary">No active prescriptions</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Prescriptions will appear here once approved.</p>
                </div>
              </div>
            )}
          </Card>

          {/* Recent Orders */}
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <h3 className="font-heading text-sm font-bold text-text-primary">Pharmacy Shipping Order</h3>
              {recentOrder && <Badge variant="info" size="sm">{recentOrder.status}</Badge>}
            </div>

            {recentOrder ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{recentOrder.medicine}</h4>
                  <p className="text-[10px] text-text-secondary mt-1">
                    Ordered: {recentOrder.date} • Expected delivery: <span className="font-semibold text-text-primary">{recentOrder.delivery}</span>
                  </p>
                </div>

                <Link href="/pharmacy/checkout">
                  <Button size="sm" className="text-xs font-bold shrink-0">
                    New Pharmacy Order
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-4 text-center flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-text-tertiary">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-text-primary">No recent orders</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Your medication orders will be tracked here.</p>
                </div>
              </div>
            )}
          </Card>

        </div>

        {/* Right Column: Notification Panel & Profile Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Notifications Panel */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-light">
              <h3 className="font-heading text-sm font-bold text-text-primary">Notification center</h3>
              {notifications.length > 0 && (
                <span className="text-[10px] bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded font-bold">
                  {notifications.length} New
                </span>
              )}
            </div>

            <div className="space-y-3.5">
              {notifications.length > 0 ? notifications.map((notif) => (
                <div key={notif.id} className="text-xs flex gap-2.5 pb-3 border-b border-dashed border-border-light last:border-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-text-primary leading-normal">{notif.text}</p>
                    <span className="text-[9px] text-text-tertiary block">{notif.time}</span>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-text-tertiary text-xs">
                  <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  No new notifications
                </div>
              )}
            </div>

            <Link href="/dashboard/notifications" className="block w-full">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                View All Notifications
              </Button>
            </Link>
          </Card>

          {/* Profile Summary */}
          <Card padding="md" className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary font-heading font-extrabold text-lg flex items-center justify-center shadow-inner mx-auto">
              {initials}
            </div>
            
            <div>
              <h4 className="font-heading text-base font-bold text-text-primary">{name}</h4>
              <p className="text-[10px] text-text-secondary mt-0.5">{user?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-border-light text-left leading-relaxed">
              <div>
                <span className="text-[9px] text-text-tertiary block font-bold uppercase">Age / Gender</span>
                <span className="font-bold text-text-primary block mt-0.5">{age} yrs • {patient.gender || '--'}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-tertiary block font-bold uppercase">Blood Group</span>
                <span className="font-bold text-text-primary block mt-0.5">{patient.bloodGroup || '--'}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-tertiary block font-bold uppercase">Height</span>
                <span className="font-bold text-text-primary block mt-0.5">{patient.height ? `${patient.height} cm` : '--'}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-tertiary block font-bold uppercase">Weight</span>
                <span className="font-bold text-text-primary block mt-0.5">{currentWeight}</span>
              </div>
            </div>

            <Link href="/dashboard/profile" className="block w-full">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                Edit Profile
              </Button>
            </Link>
          </Card>

        </div>

      </div>
    </div>
  );
}
