"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DoctorProfileHero } from "@/features/booking/DoctorProfileHero";

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = (params?.id as string) || "dr-sarah-mitchell";

  return (
    <div className="bg-background min-h-screen pt-24 pb-12">
      <div className="container-custom max-w-5xl mx-auto px-4 space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => router.push("/doctors")}
          className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors focus:outline-none text-left"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctors Discovery
        </button>

        {/* Profile details */}
        <DoctorProfileHero doctorId={doctorId} />

      </div>
    </div>
  );
}
