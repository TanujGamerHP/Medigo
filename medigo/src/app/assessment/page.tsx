"use client";

import React, { useEffect } from "react";
import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { AssessmentWizard } from "@/features/assessment/AssessmentWizard";
import { BackButton } from "@/components/ui/BackButton";

export default function AssessmentPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('redirectAfterLogin', '/assessment');
    }
  }, []);

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 relative">
      <div className="absolute top-24 left-4 md:left-8 z-10 hidden md:block">
        <BackButton variant="outline" size="sm" />
      </div>
      <div className="container-custom max-w-3xl mx-auto px-4 space-y-8">
        
        <div className="md:hidden -mt-4 mb-2">
          <BackButton variant="ghost" size="sm" className="-ml-2" />
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider mx-auto">
            <HeartPulse className="w-3.5 h-3.5" />
            AI Clinical Intake
          </span>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-text-primary">
            GLP-1 Eligibility Assessment
          </h1>
          <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
            Provide baseline health indicators to check therapy options. Takes roughly 2 minutes. HIPAA secure.
          </p>
        </div>

        {/* Wizard */}
        <AssessmentWizard />

      </div>
    </div>
  );
}
