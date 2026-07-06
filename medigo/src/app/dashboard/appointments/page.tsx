"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppointmentsTab } from "@/features/appointments/AppointmentsTab";

export default function AppointmentsPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back
      </button>
      <div>
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Clinical Appointments
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Schedule and manage your live video consultations with obesity medicine specialists.
        </p>
      </div>

      <AppointmentsTab />
    </div>
  );
}
