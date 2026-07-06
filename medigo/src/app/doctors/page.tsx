"use client";

import React from "react";
import { HeartPulse } from "lucide-react";
import { DoctorDiscovery } from "@/features/booking/DoctorDiscovery";
import { BackButton } from "@/components/ui/BackButton";

export default function DoctorsPage() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-12 relative">
      <div className="absolute top-24 left-4 md:left-8 z-10 hidden md:block">
        <BackButton variant="outline" size="sm" />
      </div>
      <div className="container-custom max-w-5xl mx-auto px-4 space-y-8">
        
        <div className="md:hidden -mt-4 mb-2">
          <BackButton variant="ghost" size="sm" className="-ml-2" />
        </div>
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider mx-auto">
            <HeartPulse className="w-3.5 h-3.5" />
            Board-Certified Providers
          </span>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-text-primary">
            Find Your Weight Loss Specialist
          </h1>
          <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
            Select a licensed clinician matching your state jurisdiction. Complete safe, virtual consultations from your home.
          </p>
        </div>

        {/* Doctor discovery component */}
        <DoctorDiscovery />

      </div>
    </div>
  );
}
