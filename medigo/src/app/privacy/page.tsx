import React from "react";
import { ShieldCheck, HeartPulse } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Compliance Protocols
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-xs md:text-sm font-semibold">
            Last Updated: July 3, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 container-custom max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-border/50 shadow-sm mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <div className="flex gap-3 items-start p-4 rounded-xl bg-primary-50/20 border border-primary-200/40 text-text-primary mb-6">
          <HeartPulse className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <p className="text-xs">
            <strong>HIPAA Statement:</strong> MediGo operates in strict adherence to the Health Insurance Portability and Accountability Act (HIPAA). All medical profiles, clinical notes, laboratory outcomes, and communications are fully encrypted.
          </p>
        </div>

        <h3 className="font-heading font-bold text-lg text-text-primary mt-6">
          1. Information We Collect
        </h3>
        <p>
          We collect personal identification details (name, email address, telephone contact) during portal registrations, combined with metabolic health indicators, physical parameters, prior history checks, and clinical data gathered during your assessment.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary mt-6">
          2. How We Use Your Information
        </h3>
        <p>
          All collected indicators are used exclusively to evaluate suitability for GLP-1 programs, match you with licensed telemedicine providers, direct prescriptions to licensed pharmacies, coordinate Quest or Labcorp blood panels, and provide clinical support check-ins.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary mt-6">
          3. Security Measures
        </h3>
        <p>
          We employ SSL 256-bit encryption for all data transit and AES 256-bit encryption for stored databases. Access is strictly audited and limited to authorizing clinicians and support staff.
        </p>

        <h3 className="font-heading font-bold text-lg text-text-primary mt-6">
          4. Your Rights
        </h3>
        <p>
          You retain full rights to inspect your clinical files, download diagnostic outcomes, request data rectification, or delete your secure portal account at any time by contacting our privacy compliance coordinator at privacy@medigo.com.
        </p>
      </section>
    </div>
  );
}
