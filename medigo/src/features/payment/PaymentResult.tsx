"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, Clock, RefreshCw, Calendar, Download, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import Link from "next/link";

interface PaymentResultProps {
  status: "success" | "failed" | "pending";
  doctor: string;
  date: string;
  time: string;
  total: number;
  mode: string;
}

export function PaymentResult({ status, doctor, date, time, total, mode }: PaymentResultProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const [doctorName, setDoctorName] = useState("Clinical Specialist");
  const [invoiceId, setInvoiceId] = useState("");

  React.useEffect(() => {
    setInvoiceId(`MG-${Math.floor(Math.random() * 89999 + 10000)}`);
  }, []);

  React.useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await api.get(`/api/v1/doctors`);
        if (res.success && res.data) {
          const doc = res.data.find((d: any) => d.id === doctor);
          if (doc) {
            setDoctorName(`Dr. ${doc.firstName} ${doc.lastName}`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch doctor", err);
      }
    }
    if (doctor) fetchDoctor();
  }, [doctor]);

  const handleDownloadInvoice = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      
      import("jspdf").then(({ jsPDF }) => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text("MediGo Invoice Receipt", 20, 30);
        
        doc.setFontSize(12);
        doc.text("---------------------------------------------------------", 20, 40);
        doc.text(`Invoice Reference ID: ${invoiceId || "MG-XXXXX"}`, 20, 50);
        doc.text(`Patient Name: ${user?.patient?.firstName || ''} ${user?.patient?.lastName || ''}`, 20, 60);
        doc.text(`Transaction Ref: ${paymentId || "TXN-9382-771"}`, 20, 70);
        doc.text(`Appointment: ${date} at ${time} (${mode} mode)`, 20, 80);
        doc.text(`Paid Amount: INR ${total}.00`, 20, 90);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Compliance: HIPAA Protected, Paid via secure Stripe endpoint.", 20, 110);
        
        doc.save(`medigo_invoice_${doctor}.pdf`);
      }).catch(err => {
        console.error("Failed to load jsPDF", err);
      });
    }, 1200);
  };

  const handleExportCalendar = () => {
    // Generate simple standard ICS formatted calendar file to download
    const element = document.createElement("a");
    const icsContent = 
      "BEGIN:VCALENDAR\n" +
      "VERSION:2.0\n" +
      "BEGIN:VEVENT\n" +
      `SUMMARY:MediGo Consultation: ${doctorName}\n` +
      `DESCRIPTION:Telehealth virtual ${mode} check-in slot.\n` +
      `DTSTART:20260704T150000Z\n` +
      `DTEND:20260704T151500Z\n` +
      "END:VEVENT\n" +
      "END:VCALENDAR";
    const file = new Blob([icsContent], { type: 'text/calendar' });
    element.href = URL.createObjectURL(file);
    element.download = `medigo_visit_${doctor}.ics`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6 md:p-12">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-lg text-center space-y-6">
        
        {/* ==================================================== */}
        {/*  1. SUCCESS STATE                                    */}
        {/* ==================================================== */}
        {status === "success" && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl text-text-primary">Appointment Confirmed!</h2>
              <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                Payment authorized successfully. Your telehealth booking details are summarized below.
              </p>
            </div>

            {/* Receipt invoice card details */}
            <div className="p-5 rounded-2xl bg-background border border-border-light text-left space-y-3.5 text-xs text-text-secondary">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="font-semibold text-text-primary">Invoice ID:</span>
                <span>{invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span>Clinician:</span>
                <span className="text-text-primary font-semibold">{doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span>Schedule:</span>
                <span className="text-text-primary font-semibold">{date} at {time}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Charge:</span>
                <span className="text-text-primary font-bold">₹{total}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="py-2.5 rounded-xl border border-border hover:border-primary text-text-primary hover:text-primary flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Saving..." : "Save Invoice"}
              </button>
              
              <button
                type="button"
                onClick={handleExportCalendar}
                className="py-2.5 rounded-xl border border-border hover:border-primary text-text-primary hover:text-primary flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
              >
                <Calendar className="w-4 h-4" />
                Export ICS
              </button>
            </div>

            <Button
              id="success-dashboard-redirect"
              onClick={() => router.push("/dashboard")}
              fullWidth
              className="py-3.5 text-sm font-bold gradient-cta text-white"
              rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
            >
              Enter Patient Dashboard
            </Button>
          </div>
        )}

        {/* ==================================================== */}
        {/*  2. FAILED STATE                                     */}
        {/* ==================================================== */}
        {status === "failed" && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-100 text-error flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl text-text-primary">Payment Failed</h2>
              <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                Stripe reported card credentials could not be verified. Your slot was not booked.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-50/50 border border-error-200 text-left text-xs text-error-800 space-y-1">
              <p className="font-bold text-text-primary">Common Solutions:</p>
              <ul className="list-disc pl-4 space-y-1 text-text-secondary text-[11px] leading-relaxed">
                <li>Check card number & CVV inputs.</li>
                <li>Verify billing zip code settings.</li>
                <li>Use Apple Pay / Google Pay wallets.</li>
              </ul>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <Link
                href={`/consultation/checkout?doctor=${doctor}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&mode=${mode}`}
                className="py-3 rounded-xl border border-border hover:border-primary text-text-primary hover:text-primary hover:bg-primary-50/10 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Booking
              </Link>
              <Link
                href="/doctors"
                className="py-3 rounded-xl gradient-cta text-white text-xs font-bold transition-all text-center"
              >
                Browse Doctors
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/*  3. PENDING STATE                                    */}
        {/* ==================================================== */}
        {status === "pending" && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-primary flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-10 h-10 animate-spin" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl text-text-primary">Authorization Pending</h2>
              <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                We are currently waiting for banking verification endpoints to finalize transactions.
              </p>
            </div>

            <p className="text-[10px] text-text-tertiary leading-relaxed">
              Do not refresh this screen. We will automatically log updates into your secure dashboard alerts within 2 minutes.
            </p>

            <Button
              id="pending-dashboard-btn"
              onClick={() => router.push("/dashboard")}
              fullWidth
              className="py-3.5 text-sm font-bold gradient-cta text-white"
            >
              Go to Dashboard Overview
            </Button>
          </div>
        )}

        <div className="flex justify-center gap-4 text-[10px] text-text-tertiary pt-4 border-t border-border-light">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            HIPAA Encryption Safeguards
          </span>
        </div>

      </div>
    </div>
  );
}
