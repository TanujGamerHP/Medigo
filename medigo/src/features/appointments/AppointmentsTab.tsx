"use client";

import React, { useState, useEffect } from "react";
import { Video, Calendar, Clock, AlertTriangle, ArrowRight, CheckCircle2, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  meetingLink?: string;
  profileImage?: string | null;
  initials?: string;
}

export function AppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("July 5, 2026");
  const [rescheduleTime, setRescheduleTime] = useState("1:30 PM");
  const [successMsg, setSuccessMsg] = useState("");
  const { show } = useToast();

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/v1/appointments");
      if (res.success && res.data) {
        // Map backend appointment format to UI format
        const mapped = res.data.map((apt: any) => {
          return {
            id: apt.id,
            doctorName: apt.doctor ? `Dr. ${apt.doctor.user?.firstName || apt.doctor.firstName} ${apt.doctor.user?.lastName || apt.doctor.lastName}` : "Unknown Doctor",
            specialty: apt.doctor ? apt.doctor.specialization : "General",
            date: new Date(apt.appointmentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
            time: apt.appointmentTime,
            status: (apt.status === "Pending" || apt.status === "Scheduled" || apt.status === "Confirmed") ? "upcoming" : apt.status.toLowerCase(),
            meetingLink: apt.meetingLink,
            profileImage: apt.doctor?.profileImage || null,
            initials: apt.doctor ? `${apt.doctor.user?.firstName?.[0] || apt.doctor.firstName?.[0] || 'D'}${apt.doctor.user?.lastName?.[0] || apt.doctor.lastName?.[0] || 'R'}`.toUpperCase() : "DR"
          };
        });
        setAppointments(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const userStr = localStorage.getItem("medigo_user");
    if (!userStr) return;
    const userObj = JSON.parse(userStr);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const sseUrl = `${baseUrl}/api/v1/realtime/events?userId=${userObj.id}&role=${userObj.role}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.event === "consultation.doctor_waiting") {
          show("The doctor is waiting for you in the consultation room! Please join now.", "success");
        } else if (parsed.event === "consultation.link_shared") {
          show("Your doctor has shared a meeting link for your consultation.", "success");
          fetchAppointments();
        } else if (parsed.event === "appointment.rescheduled") {
          show("Your appointment has been rescheduled by the doctor.", "warning");
          fetchAppointments();
        }
      } catch (e) {}
    };

    return () => eventSource.close();
  }, [show]);

  const handleConfirmReschedule = () => {
    const updated = appointments.map((apt) => {
      if (apt.id === "APT-98201") {
        return { ...apt, date: rescheduleDate, time: rescheduleTime };
      }
      return apt;
    });
    setAppointments(updated);
    setShowReschedule(false);
    setSuccessMsg("Appointment rescheduled successfully!");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleConfirmCancel = () => {
    const updated = appointments.map((apt) => {
      if (apt.id === "APT-98201") {
        return { ...apt, status: "cancelled" as const };
      }
      return apt;
    });
    setAppointments(updated);
    setShowCancel(false);
    setSuccessMsg("Appointment canceled successfully.");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const activeApt = appointments.find((apt) => apt.status === "upcoming");
  const historical = appointments.filter((apt) => apt.status !== "upcoming");

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
        {/* Main Column: Upcoming visit */}
        <div className="space-y-6">
          
          {loading ? (
            <div className="bg-white p-8 rounded-3xl border border-border/50 text-center">
              Loading appointments...
            </div>
          ) : activeApt ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
              
              <div className="flex justify-between items-start border-b border-border-light pb-5">
                <div className="flex items-start gap-4">
                  {activeApt.profileImage ? (
                    <img src={activeApt.profileImage} alt={activeApt.doctorName} className="w-12 h-12 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                      {activeApt.initials}
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider">
                      Next Consultation
                    </span>
                    <h3 className="font-heading font-bold text-lg text-text-primary mt-1">
                      {activeApt.doctorName}
                    </h3>
                    <p className="text-[10px] text-text-secondary">
                      {activeApt.specialty} • 15 Minute titration audit
                    </p>
                  </div>
                </div>
                
                <span className="inline-flex items-center gap-1 text-xs text-primary font-bold">
                  <Video className="w-4 h-4 shrink-0" />
                  Video Call
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block">Appointment Date</span>
                  <span className="text-xs text-text-primary font-semibold flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    {activeApt.date}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block">Scheduled Time</span>
                  <span className="text-xs text-text-primary font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    {activeApt.time}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border-light flex flex-col sm:flex-row justify-between gap-4 items-center">
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowCancel(true)}
                    className="py-2.5 px-4 rounded-xl border border-border hover:border-error text-xs font-bold text-text-secondary hover:text-error transition-all focus:outline-none w-full sm:w-auto"
                  >
                    Cancel visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReschedule(true)}
                    className="py-2.5 px-4 rounded-xl border border-border hover:border-primary text-xs font-bold text-text-primary hover:text-primary transition-all focus:outline-none w-full sm:w-auto"
                  >
                    Reschedule
                  </button>
                </div>

                <button
                  onClick={() => window.location.href = `/consultation/room/${activeApt.id}`}
                  className="py-2.5 px-6 rounded-xl gradient-cta text-white text-xs font-bold hover:shadow-glow transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <Video className="w-4 h-4" />
                  Join Consultation Room
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-border/50 text-center space-y-4">
              <Calendar className="w-12 h-12 text-text-tertiary mx-auto" />
              <h4 className="font-heading font-bold text-lg text-text-primary">No upcoming appointments</h4>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                You do not have any pending doctor visits scheduled. Clinicians suggest booking consultations monthly.
              </p>
              <button
                onClick={() => window.location.href = "/doctors"}
                className="py-2.5 px-6 rounded-xl gradient-cta text-white text-xs font-bold hover:shadow-glow transition-all inline-block"
              >
                Browse Clinicians
              </button>
            </div>
          )}

        </div>

      {successMsg && (
        <div className="p-3.5 bg-green-50 border border-success-200 text-success text-xs font-semibold rounded-xl text-center">
          {successMsg}
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showReschedule && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowReschedule(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 border border-border/50 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border-light pb-3">
              <h4 className="font-heading font-bold text-base text-text-primary">Reschedule Appointment</h4>
              <button onClick={() => setShowReschedule(false)} className="text-text-tertiary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="resched-date-select" className="text-xs font-bold text-text-secondary uppercase">Select Date</label>
                <select
                  id="resched-date-select"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs"
                >
                  <option value="July 5, 2026">July 5, 2026</option>
                  <option value="July 6, 2026">July 6, 2026</option>
                  <option value="July 7, 2026">July 7, 2026</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="resched-time-select" className="text-xs font-bold text-text-secondary uppercase">Select Time</label>
                <select
                  id="resched-time-select"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs"
                >
                  <option value="9:30 AM">9:30 AM</option>
                  <option value="1:30 PM">1:30 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="5:30 PM">5:30 PM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReschedule(false)}
                className="py-2.5 rounded-xl border border-border text-xs font-bold text-text-secondary hover:bg-background"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="py-2.5 rounded-xl gradient-cta text-white text-xs font-bold"
              >
                Confirm Change
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CANCELLATION WARNING MODAL */}
      {showCancel && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCancel(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 border border-border/50 shadow-2xl space-y-6 text-center">
            
            <div className="w-12 h-12 rounded-full bg-red-100 text-error flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-lg text-text-primary">Cancel Appointment?</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Canceling your consultation will disrupt your weekly Semaglutide dosage titration reviews. Refund policies apply.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancel(false)}
                className="py-2.5 rounded-xl border border-border text-xs font-bold text-text-secondary hover:bg-background"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="py-2.5 rounded-xl bg-error text-white text-xs font-bold hover:bg-error-dark"
              >
                Confirm Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
