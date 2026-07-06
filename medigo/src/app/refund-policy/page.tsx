import React from "react";
import { ShieldCheck } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Billing Disclosures
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Refund Policy
          </h1>
          <p className="text-text-secondary text-xs md:text-sm font-semibold">
            Last Updated: July 3, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 container-custom max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-border/50 shadow-sm mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <h3 className="font-heading font-bold text-lg text-text-primary">
          1. Clinical Ineligibility Refunds
        </h3>
        <p>
          If your assigned board-certified doctor determines you are clinically ineligible for GLP-1 therapy (based on blood diagnostics, health history checks, or contraindications), MediGo issues a 100% full refund on initial platform fees immediately.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary">
          2. Medication Shipments
        </h3>
        <p>
          Once a prescription is dispatched to our compounding or retail pharmacy partners, those prescription medications cannot be returned, exchanged, or refunded under US federal safety laws.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary">
          3. Subscriptions & Cancel Cycles
        </h3>
        <p>
          Plans are month-to-month and can be paused or cancelled at any time inside the portal dashboard. If you cancel your membership, no future payments will be drafted. We do not issue partial refunds for active billing cycles.
        </p>
      </section>
    </div>
  );
}
