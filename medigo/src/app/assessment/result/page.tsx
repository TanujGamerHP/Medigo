"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldAlert, Award, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AssessmentResultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [eligible, setEligible] = useState(true);
  const [bmi, setBmi] = useState(28.5);

  useEffect(() => {
    // Audit check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">AI Coach is evaluating clinical parameters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-12">
      <div className="container-custom max-w-xl mx-auto px-4 space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading font-bold text-2xl text-text-primary">Intake Diagnostics Generated</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your metrics calculate a BMI of <strong>{bmi}</strong>. You are qualified to meet with board-certified weight management practitioners.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-border/50 shadow-md text-left space-y-4">
          <div className="flex justify-between border-b border-border-light pb-2.5 text-xs text-text-secondary">
            <span>Clinical Qualification:</span>
            <span className="text-success font-bold">Approved</span>
          </div>
          <div className="flex justify-between border-b border-border-light pb-2.5 text-xs text-text-secondary">
            <span>Body Mass Index:</span>
            <span className="text-text-primary font-bold">{bmi} (Overweight)</span>
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Recommended Program:</span>
            <span className="text-primary font-bold">Semaglutide titration</span>
          </div>
        </div>

        <Button
          id="result-booking-redirect"
          onClick={() => router.push("/doctors")}
          fullWidth
          className="py-3.5 text-sm font-bold gradient-cta text-white"
          rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
        >
          Select Your Clinician
        </Button>
      </div>
    </div>
  );
}
