"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrescriptionsTab } from "@/features/prescriptions/PrescriptionsTab";

export default function PrescriptionsPage() {
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
          My Prescriptions
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          View active prescriptions, titration schedules, and request CVS medication refills.
        </p>
      </div>

      <PrescriptionsTab />
    </div>
  );
}
