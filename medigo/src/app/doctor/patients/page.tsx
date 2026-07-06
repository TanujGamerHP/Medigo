"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PatientQueue } from "@/features/doctor/PatientQueue";
import { ConsultationWorkspace } from "@/features/doctor/ConsultationWorkspace";

export default function DoctorPatientsPage() {
  const router = useRouter();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  if (selectedPatientId) {
    return (
      <div className="animate-fade-in text-left">
        <ConsultationWorkspace
          patientId={selectedPatientId}
          onBack={() => setSelectedPatientId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-left">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </button>
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Clinical Patient Queue
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Select a waiting patient to review their AI assessment file and start their live consultation session.
        </p>
      </div>

      <PatientQueue onSelectPatient={setSelectedPatientId} />
    </div>
  );
}
