"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PaymentResult } from "@/features/payment/PaymentResult";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = (searchParams.get("status") as any) || "success";
  const doctor = searchParams.get("doctor") || "dr-sarah-mitchell";
  const date = searchParams.get("date") || "July 4, 2026";
  const time = searchParams.get("time") || "10:00 AM";
  const total = Number(searchParams.get("total") || "149");
  const mode = searchParams.get("mode") || "video";

  return (
    <div className="bg-background min-h-screen pt-12">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group ml-8"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back
      </button>
      <PaymentResult
        status={status}
        doctor={doctor}
        date={date}
        time={time}
        total={total}
        mode={mode}
      />
    </div>
  );
}

export default function ResultPage() {
  return (
    <React.Suspense fallback={<div className="pt-32 pb-12 text-center text-xs text-text-secondary">Loading receipt...</div>}>
      <ResultContent />
    </React.Suspense>
  );
}
