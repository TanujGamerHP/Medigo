"use client";

import React, { useState } from "react";
import { Pill, Calendar, Clock, Download, ArrowRight, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/features/shared/RoleProvider";
import Link from "next/link";

interface Med {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refillsRemaining: number;
  prescribedBy: string;
  datePrescribed: string;
  instructions: string;
}

export function PrescriptionsTab() {
  const { user } = useRole();
  const [downloading, setDownloading] = useState(false);
  const [refillOrdered, setRefillOrdered] = useState(false);

  const hasMembership = (user?.patient?.memberships?.length || 0) > 0;

  const activeMeds: Med[] = [];

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate file download by creating a fake text anchor
      const element = document.createElement("a");
      const file = new Blob([
        `MEDI GO PRESCRIPTION CARD\n` +
        `------------------------\n` +
        `Prescription ID: MG-RX-98210\n` +
        `Patient Name: Sarah Miller\n` +
        `Prescribed Date: ${activeMeds[0].datePrescribed}\n` +
        `Clinician: ${activeMeds[0].prescribedBy}\n` +
        `Medication: ${activeMeds[0].name}\n` +
        `Dosage: ${activeMeds[0].dosage} (${activeMeds[0].frequency})\n` +
        `Instructions: ${activeMeds[0].instructions}\n` +
        `Refills Remaining: ${activeMeds[0].refillsRemaining}\n` +
        `Compliance: HIPAA Protected, Certified Pharmacy Dispatch.\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `medigo_rx_prescription.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  const handleOrderRefill = () => {
    setRefillOrdered(true);
    setTimeout(() => setRefillOrdered(false), 4000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      {activeMeds.length > 0 ? activeMeds.map((med) => (
        <div key={med.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Med detail card */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
            
            <div className="flex gap-4 items-start border-b border-border-light pb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center shrink-0 border border-primary-200/30">
                <Pill className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold uppercase tracking-wider">
                  Active Prescription
                </span>
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  {med.name}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-0.5">
                <span className="text-[10px] text-text-tertiary uppercase font-bold block">Current Dosage</span>
                <span className="text-xs text-text-primary font-semibold">
                  {med.dosage}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-text-tertiary uppercase font-bold block">Dosing Schedule</span>
                <span className="text-xs text-text-primary font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  {med.frequency}
                </span>
              </div>

              <div className="space-y-0.5 border-t border-border-light pt-4 sm:border-0 sm:pt-0">
                <span className="text-[10px] text-text-tertiary uppercase font-bold block">Prescribed By</span>
                <span className="text-xs text-text-primary font-semibold">
                  {med.prescribedBy}
                </span>
              </div>

              <div className="space-y-0.5 border-t border-border-light pt-4 sm:border-0 sm:pt-0">
                <span className="text-[10px] text-text-tertiary uppercase font-bold block">Date Issued</span>
                <span className="text-xs text-text-primary font-semibold flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  {med.datePrescribed}
                </span>
              </div>

            </div>

            <div className="border-t border-border-light pt-5 space-y-2">
              <span className="text-[10px] text-text-tertiary uppercase font-bold block">Clinical Directions</span>
              <p className="text-xs text-text-secondary leading-relaxed bg-background p-4 rounded-xl border border-border-light">
                {med.instructions}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-between gap-4 items-center border-t border-border-light pt-5">
              <span className="text-xs text-text-secondary">
                Refills Remaining: <strong className="text-text-primary font-bold">{med.refillsRemaining}</strong>
              </span>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="py-2.5 px-4 rounded-xl border border-border hover:border-primary text-text-primary hover:text-primary flex items-center justify-center gap-1.5 text-xs font-bold transition-all w-full sm:w-auto focus:outline-none"
                >
                  <Download className="w-4 h-4" />
                  {downloading ? "Saving..." : "Save PDF RX"}
                </button>

                {!hasMembership ? (
                  <Link href="/dashboard/membership/buy" className="w-full sm:w-auto">
                    <Button
                      id="order-med-refill-btn"
                      className="py-2.5 px-5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto shadow-sm"
                      rightIcon={<Lock className="w-4 h-4" />}
                    >
                      Upgrade to Order
                    </Button>
                  </Link>
                ) : (
                  <Button
                    id="order-med-refill-btn"
                    onClick={handleOrderRefill}
                    className="py-2.5 px-5 text-xs font-bold gradient-cta text-white w-full sm:w-auto shadow-sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Order Refill
                  </Button>
                )}
              </div>
            </div>

            {!hasMembership && (
              <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-xl flex items-start gap-2">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Active membership required to order medication refills.{" "}
                  <Link href="/dashboard/membership/buy" className="underline font-bold">
                    Upgrade Now
                  </Link>
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Refill timeline & Pharmacy alerts */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-text-primary">Titration Timeline</h3>
            
            <div className="space-y-4 border-l-2 border-border-light pl-4 relative text-xs text-text-secondary">
              
              <div className="relative">
                <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-primary ring-4 ring-primary-50" />
                <span className="block font-bold text-text-primary">Weeks 1-4 (Initiation)</span>
                <span className="block text-[10px] text-text-tertiary mt-0.5">0.25 mg dosage (Current)</span>
              </div>

              <div className="relative pt-2">
                <div className="absolute -left-6 top-2 w-3 h-3 rounded-full bg-border" />
                <span className="block font-bold text-text-tertiary">Weeks 5-8 (Titration)</span>
                <span className="block text-[10px] text-text-tertiary mt-0.5">0.50 mg dosage</span>
              </div>

              <div className="relative pt-2">
                <div className="absolute -left-6 top-2 w-3 h-3 rounded-full bg-border" />
                <span className="block font-bold text-text-tertiary">Weeks 9-12 (Therapeutic)</span>
                <span className="block text-[10px] text-text-tertiary mt-0.5">1.0 mg dosage</span>
              </div>

            </div>

          </div>

        </div>
      )) : (
        <div className="bg-white p-8 rounded-3xl border border-border/50 text-center space-y-4 max-w-4xl mx-auto">
          <Pill className="w-12 h-12 text-text-tertiary mx-auto" />
          <h4 className="font-heading font-bold text-lg text-text-primary">No active prescriptions</h4>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            You do not have any active medication prescriptions. Complete your clinical assessment and consultation to get started.
          </p>
        </div>
      )}

      {refillOrdered && (
        <div className="p-3.5 bg-green-50 border border-success-200 text-success text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>Refill request routed successfully! Medication will ship via temperature-controlled courier (3-5 business days).</span>
        </div>
      )}

      <div className="flex justify-center gap-4 text-[10px] text-text-tertiary">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
          HIPAA & VIPPS Accredited Pharmacy Network
        </span>
      </div>

    </div>
  );
}
