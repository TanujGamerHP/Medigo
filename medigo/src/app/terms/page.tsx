import React from "react";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Legal Terms
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Terms & Conditions
          </h1>
          <p className="text-text-secondary text-xs md:text-sm font-semibold">
            Last Updated: July 3, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 container-custom max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-border/50 shadow-sm mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <h3 className="font-heading font-bold text-lg text-text-primary">
          1. Agreement to Terms
        </h3>
        <p>
          By creating a secure portal account with MediGo or completing our online health assessment, you acknowledge and agree to abide by these Terms of Service. If you disagree with any segment, please discontinue use.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary">
          2. Clinical Services Disclaimer
        </h3>
        <p>
          MediGo is a technology platform connecting patients with independent board-certified physicians. MediGo itself does not provide clinical medical advice. Telehealth consultations are subject to clinician evaluations.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary">
          3. Subscriptions & Payments
        </h3>
        <p>
          Starter, Premium, and Elite programs are billed on a recurring monthly cycle. You authorize MediGo to process these payments using card credentials on file. You can pause or terminate plans inside the portal dashboard.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary">
          4. Medication Policy
        </h3>
        <p>
          Prescription allocations, pharmacy selection, and dosing titration increments are dictated exclusively by independent medical practitioners. Program pricing covers medication shipping and platform access fees.
        </p>
      </section>
    </div>
  );
}
