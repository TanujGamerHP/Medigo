import React from "react";
import { ShieldCheck } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Clinical Safeguards
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Medical Disclaimer
          </h1>
          <p className="text-text-secondary text-xs md:text-sm font-semibold">
            Last Updated: July 3, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 container-custom max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-border/50 shadow-sm mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <h3 className="font-heading font-bold text-lg text-text-primary">
          1. Technology Platform Only
        </h3>
        <p>
          MediGo is a technology platform connecting patients with independent board-certified clinicians. MediGo itself is not a healthcare provider and does not furnish medical diagnostics, nursing, or prescriptions.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary">
          2. No Emergency Services
        </h3>
        <p>
          Our platform, portal messaging, support lines, and clinicians are not equipped to handle acute medical crises. If you are experiencing serious side effects or a medical emergency, call 911 or visit the nearest emergency room immediately.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary">
          3. Educational Content
        </h3>
        <p>
          Publications, blog articles, and tools (including BMI calculators or food trackers) within the Knowledge Center are intended exclusively for general metabolic education. They are not substitutes for professional clinical diagnoses.
        </p>
      </section>
    </div>
  );
}
