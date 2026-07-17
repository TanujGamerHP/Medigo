"use client";

import React from "react";
import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { RegisterFlow } from "@/features/auth/RegisterFlow";

export default function SignupPage() {
  return (
    <div className="bg-background min-h-screen pt-16 lg:pt-20 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      
      {/* Left side brand banner (hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-dark-green to-primary p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-white blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-[120px]" />
        </div>

        <div className="relative z-10 pt-4">
          <Link href="/" className="flex items-center gap-2 select-none invisible">
            <span className="inline-flex h-3.5 w-3.5 rounded-full bg-white animate-ping" />
            <span className="text-2xl font-heading font-bold text-white">MediGo</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold">
            <HeartPulse className="w-3.5 h-3.5" />
            Start Onboarding
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold leading-tight">
            Begin Your Medical Intake
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Fill out your basic demographics, verify your mobile connection, and get matched to clinical professionals today.
          </p>
        </div>

        <div className="relative z-10 text-[10px] text-white/40 text-left">
          © {new Date().getFullYear()} MediGo. HIPAA Secure, 256-bit encrypted data protocols.
        </div>
      </div>

      {/* Right side form block */}
      <div className="lg:col-span-7 flex items-center justify-center pt-16 lg:pt-0 bg-white">
        <div className="w-full">
          <RegisterFlow />
        </div>
      </div>

    </div>
  );
}
