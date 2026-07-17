"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Star, ShieldCheck, Calendar, Clock, Award, CheckCircle2, ChevronRight, Video, PhoneCall, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRole } from "@/features/shared/RoleProvider";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  imageInitials: string;
  imageUrl?: string;
  bio: string;
  fee: number;
  education: string[];
  certifications: string[];
  slots: { [date: string]: string[] };
}

// Removed generateDefaultSlots

const DEFAULT_DOCTOR: Doctor = {
  id: "dr-sarah-mitchell",
  name: "Dr. Sarah Mitchell",
  specialty: "Internal Medicine",
  experience: "Verified",
  rating: 4.9,
  reviewsCount: 0,
  imageInitials: "DR",
  bio: "Clinical specialist providing virtual care and consultations.",
  fee: 149,
  education: [],
  certifications: ["Board Certified"],
  slots: {}
};

export function DoctorProfileHero({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const { user } = useRole();
  const [doctor, setDoctor] = useState<Doctor>(DEFAULT_DOCTOR);
  
  React.useEffect(() => {
    async function loadDoctor() {
      try {
        const res = await api.get(`/api/v1/doctors/${doctorId}`);
        if (res.success && res.data) {
          const docData = res.data;
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const formatDate = (d: Date) => d.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' });

          setDoctor({
            id: docData.id,
            name: `Dr. ${docData.firstName} ${docData.lastName}`,
            specialty: docData.specialization || "Medical Professional",
            experience: docData.experience || "Verified",
            rating: 4.8,
            reviewsCount: 124,
            imageInitials: `${docData.firstName?.[0] || ""}${docData.lastName?.[0] || ""}`.toUpperCase() || "DR",
            imageUrl: docData.profileImage,
            bio: docData.bio || "Compassionate care provider.",
            fee: docData.consultationFee || 0,
            education: [],
            certifications: ["Board Certified"],
            slots: {}
          });

          // Fetch real availability slots
          const slotsRes = await api.get(`/api/v1/doctors/${doctorId}/slots`);
          if (slotsRes.success && slotsRes.data) {
            setDoctor(prev => ({ ...prev, slots: slotsRes.data }));
            const availableDates = Object.keys(slotsRes.data);
            if (availableDates.length > 0 && !selectedDate) {
              setSelectedDate(availableDates[0]);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (doctorId && doctorId !== 'null') {
      loadDoctor();
    }

    if (user) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const sseUrl = `${baseUrl}/api/v1/realtime/events?userId=${user.id}&role=${user.role}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "doctor.updated" && parsed.payload?.doctor) {
            const docData = parsed.payload.doctor;
            if (docData.id === doctorId) {
              setDoctor(prev => ({
                ...prev,
                name: `Dr. ${docData.firstName} ${docData.lastName}`,
                specialty: docData.specialization || prev.specialty,
                experience: docData.experience || prev.experience,
                imageUrl: docData.profileImage,
                bio: docData.bio || prev.bio,
                fee: docData.consultationFee !== undefined ? docData.consultationFee : prev.fee,
              }));
            }
          }
        } catch (e) {
          // Ignore
        }
      };

      return () => {
        eventSource.close();
      };
    }
  }, [doctorId, user]);

  const dates = Object.keys(doctor.slots);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [consultMode, setConsultMode] = useState<"video" | "audio" | "chat">("video");

  const timeSlots = useMemo(() => {
    return doctor.slots[selectedDate] || [];
  }, [selectedDate, doctor.slots]);

  const handleBookingClick = () => {
    if (!selectedTime) return;
    router.push(
      `/consultation?doctor=${doctor.id}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(
        selectedTime
      )}&mode=${consultMode}`
    );
  };

  const consultModes = [
    { id: "video", label: "Video Call", icon: Video, desc: "Secure WebRTC telehealth visit" },
    { id: "audio", label: "Voice Call", icon: PhoneCall, desc: "Telephone consultations" },
    { id: "chat", label: "Text Chat", icon: MessageSquare, desc: "Asynchronous portal messaging" },
  ] as const;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main details */}
        <div className="lg:col-span-8 space-y-8 text-left">
          
          {/* Card Hero */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-50 to-primary-100/50 border border-primary-200/30 text-primary-950 font-heading font-extrabold text-3xl flex items-center justify-center shadow-md shrink-0 overflow-hidden relative">
              {doctor.imageUrl ? (
                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                doctor.imageInitials
              )}
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h2 className="font-heading font-bold text-2xl text-text-primary">
                  {doctor.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold mx-auto md:mx-0 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Board-Certified
                </span>
              </div>
              <p className="text-primary font-semibold text-xs md:text-sm">
                {doctor.specialty} • {doctor.experience}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-text-secondary">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="font-bold text-text-primary">{doctor.rating}</span>
                <span>({doctor.reviewsCount} patient reviews)</span>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-text-primary">Consultation Mode</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {consultModes.map((mode) => {
                const isSelected = consultMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setConsultMode(mode.id)}
                    className={`p-4 rounded-2xl border text-left flex gap-3 items-center transition-all ${
                      isSelected
                        ? "bg-primary-50 border-primary ring-2 ring-primary/10"
                        : "bg-background border-border/60 hover:bg-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isSelected ? "text-primary" : "text-text-secondary"}`} />
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-text-primary leading-tight">{mode.label}</span>
                      <span className="block text-[9px] text-text-tertiary font-medium">{mode.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio & credentials */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-base text-text-primary">Biography</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{doctor.bio}</p>
            </div>

            <div className="border-t border-border-light pt-6 space-y-4">
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wide">Education</h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                {doctor.education.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border-light pt-6 space-y-4">
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wide">Accreditations</h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                {doctor.certifications.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Right side booking slots card */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-md sticky top-28 space-y-6 text-left">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">Telehealth Fee</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading font-black text-text-primary">₹{doctor.fee}</span>
              <span className="text-xs text-text-secondary">/ visit</span>
            </div>
          </div>

          {/* Date pick */}
          <div className="space-y-2 border-t border-border-light pt-4">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">Pick Date</span>
            <div className="grid grid-cols-3 gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                  className={`py-2 rounded-xl border text-center text-[10px] font-bold transition-all ${
                    selectedDate === date
                      ? "bg-primary-100 border-primary text-primary-800"
                      : "bg-background border-border/60 text-text-primary hover:bg-white"
                  }`}
                >
                  {date.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Time slot picker */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">Available Slots ({selectedDate.split(",")[0]})</span>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                    selectedTime === time
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background border-border/60 text-text-primary hover:border-primary/50"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {time}
                </button>
              ))}
            </div>
          </div>

          <Button
            id="profile-booking-submit-btn"
            onClick={handleBookingClick}
            disabled={!selectedTime}
            fullWidth
            className="py-3 text-xs font-bold gradient-cta text-white"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Select Slot
          </Button>

          <p className="text-[10px] text-text-tertiary text-center leading-relaxed">
            HIPAA-compliant, secure calls. Adjust schedule up to 24 hours prior.
          </p>

        </div>

      </div>

    </div>
  );
}
