"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, UserCheck, ShieldCheck, ArrowLeft, ArrowRight, User, Video, PhoneCall, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

interface Doctor {
  name: string;
  specialty: string;
  initials: string;
  slots: string[];
  consultationFee: number;
}

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 4; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
      month: "long",
      day: "numeric",
      year: "numeric"
    }));
  }
  return dates;
};

const AVAILABLE_DATES = generateDates();

function ConsultationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected Clinician from parameters
  const queryDoctorId = searchParams.get("doctor") || "dr-sarah-mitchell";
  const queryDate = searchParams.get("date") || AVAILABLE_DATES[0];
  const queryTime = searchParams.get("time") || "";
  const queryMode = (searchParams.get("mode") as any) || "video";

  const [selectedDoctorId, setSelectedDoctorId] = useState(queryDoctorId);
  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [selectedTime, setSelectedTime] = useState(queryTime);
  const [consultMode, setConsultMode] = useState<"video" | "audio" | "chat">(queryMode);

  // Patient details state
  const [symptoms, setSymptoms] = useState("");
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await api.get('/api/v1/doctors');
        if (res.success && res.data) {
          const mapped = res.data.map((d: any) => ({
            id: d.id,
            name: `Dr. ${d.firstName} ${d.lastName}`,
            specialty: d.specialization || "General Medicine",
            initials: `${d.firstName[0]}${d.lastName[0]}`.toUpperCase(),
            slots: ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM", "5:00 PM"],
            consultationFee: d.consultationFee || 0
          }));
          setDoctorsList(mapped);

          if (!queryDoctorId || !mapped.find((doc: Doctor) => doc.id === queryDoctorId)) {
            if (mapped.length > 0) {
              setSelectedDoctorId(mapped[0].id);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadDoctors();
  }, []);

  const selectedDoctor = useMemo(() => {
    return doctorsList.find(d => d.id === selectedDoctorId) || doctorsList[0];
  }, [selectedDoctorId, doctorsList]);

  const handleCheckoutRedirect = async () => {
    if (!selectedTime || !selectedDoctorId) return;

    setIsProcessing(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Failed to load payment gateway. Are you online?");
        setIsProcessing(false);
        return;
      }

      const fee = selectedDoctor.consultationFee || 0;

      if (fee === 0) {
        try {
          await api.post("/api/v1/appointments", {
            doctorId: selectedDoctorId,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
            consultationType: consultMode
          });
          router.push(`/consultation/result?status=success&doctor=${selectedDoctorId}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&total=0&mode=${consultMode}`);
        } catch (err) {
          alert("Failed to book free consultation. Please try again.");
        } finally {
          setIsProcessing(false);
        }
        return;
      }

      // 1. Create Order
      const orderRes = await api.post("/api/v1/payments/create-order", {
        amount: fee,
        currency: "INR"
      });
      const order = orderRes.data;

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890",
        amount: order.amount,
        currency: order.currency,
        name: "MediGo",
        description: "Telehealth Consultation",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await api.post("/api/v1/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentDetails: {
                doctorId: selectedDoctorId,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                consultationType: consultMode
              }
            });

            router.push(`/consultation/result?status=success&doctor=${selectedDoctorId}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&total=${fee}&mode=${consultMode}`);
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#0F766E",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const modeIcons = {
    video: Video,
    audio: PhoneCall,
    chat: MessageSquare,
  };

  const ModeIcon = modeIcons[consultMode];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-4 max-w-2xl">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <CalendarIcon className="w-3.5 h-3.5" />
            Telehealth Scheduler
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Book Virtual Consultation
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Schedule a secure, HIPAA-compliant 15-minute video meeting with a board-certified weight management expert.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-8 container-custom max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Doctor Selection, Dates, Times */}
          <div className="lg:col-span-8 space-y-8 text-left">

            {/* 1. Doctor Pick */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-primary animate-pulse" />
                1. Select Healthcare Provider
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctorsList.length === 0 ? (
                  <p className="text-sm text-text-secondary">No healthcare providers available right now.</p>
                ) : (
                  doctorsList.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${selectedDoctorId === doc.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-slate-50"
                        }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center font-heading font-extrabold text-sm shadow-inner shrink-0">
                        {doc.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary">{doc.name}</h4>
                        <p className="text-[10px] text-text-secondary mt-0.5">{doc.specialty}</p>
                      </div>
                    </button>
                  )))}
              </div>
            </div>

            {/* 2. Consultation Mode */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                2. Select consultation Mode
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "video", label: "Video Call", icon: Video },
                  { id: "audio", label: "Voice Call", icon: PhoneCall },
                  { id: "chat", label: "Text Chat", icon: MessageSquare }
                ].map((mode) => {
                  const isSelected = consultMode === mode.id;
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setConsultMode(mode.id as any)}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${isSelected
                        ? "bg-primary-50 border-primary ring-2 ring-primary/10"
                        : "bg-background border-border hover:bg-white"
                        }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-text-secondary"}`} />
                      <span className="text-xs font-bold text-text-primary">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Date Pick */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                3. Select Appointment Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVAILABLE_DATES.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime("");
                    }}
                    className={`py-3 rounded-xl border text-center text-xs font-bold transition-all ${selectedDate === date
                      ? "bg-primary-100 text-primary-800 border-primary"
                      : "bg-background border-border text-text-primary hover:bg-white"
                      }`}
                  >
                    {date.split(",")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Time Pick */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                4. Choose Available Time Slot
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedDoctor?.slots?.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl border text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${selectedTime === time
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background border-border text-text-primary hover:border-primary/50"
                      }`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Patient Notes */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
              <label htmlFor="booking-notes-area" className="text-sm font-bold text-text-tertiary uppercase tracking-wider block">
                5. Patient Symptoms & Consultation Notes (Optional)
              </label>
              <textarea
                id="booking-notes-area"
                rows={3}
                placeholder={`Describe current symptoms, conditions, or questions for ${selectedDoctor?.name || 'the clinician'}...`}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-4 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

          </div>

          {/* Right Column: Summary block */}
          <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-md space-y-6 sticky top-28 text-left">
            <h3 className="font-heading font-bold text-lg text-text-primary flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Booking Summary
            </h3>

            {/* Line details */}
            <div className="space-y-3.5 border-b border-border-light pb-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Clinician:</span>
                <span className="text-text-primary font-bold text-right">{selectedDoctor?.name || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Schedule:</span>
                <span className="text-text-primary font-semibold">{selectedDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Time Slot:</span>
                <span className="text-text-primary font-semibold">{selectedTime || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Meeting Mode:</span>
                <span className="text-text-primary font-semibold capitalize flex items-center gap-1">
                  <ModeIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                  {consultMode} call
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-border-light">
                <span className="text-text-secondary font-medium">Total Charge:</span>
                <span className="text-text-primary font-black">₹{selectedDoctor?.consultationFee || 0}</span>
              </div>
            </div>

            {/* CTA action */}
            <Button
              id="confirm-checkout-btn"
              onClick={handleCheckoutRedirect}
              disabled={!selectedTime || isProcessing}
              fullWidth
              className="py-3.5 text-sm font-bold gradient-cta text-white"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isProcessing ? "Processing..." : "Proceed to payment"}
            </Button>

            <div className="flex justify-center gap-4 text-[10px] text-text-tertiary">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                HIPAA Secure Telehealth
              </span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <React.Suspense fallback={<div className="pt-32 pb-12 text-center text-xs text-text-secondary">Loading booking schedule...</div>}>
      <ConsultationContent />
    </React.Suspense>
  );
}
