"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import { OtpInput } from "@/components/ui/OtpInput";
import Link from "next/link";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleComplete = (code: string) => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      if (code === "123456") {
        router.push("/dashboard");
      } else {
        setError("Invalid verification pin. Enter 123456.");
      }
    }, 1500);
  };

  const handleResend = () => {
    alert("New verification OTP resent to your phone.");
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-lg text-center space-y-6">
        
        <Link
          href="/login"
          className="flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-primary transition-colors inline-block w-fit text-left focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <div className="w-14 h-14 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto shadow-sm">
          <Mail className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-bold text-2xl text-text-primary">
            Verify Your Account
          </h1>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            Enter the 6-digit security code. (Use <strong>123456</strong> for testing).
          </p>
        </div>

        <OtpInput
          onComplete={handleComplete}
          onResend={handleResend}
          error={error}
          isSending={isSending}
        />

        <div className="flex justify-center gap-4 text-[10px] text-text-tertiary pt-4 border-t border-border-light">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            Secure HIPAA Connection
          </span>
        </div>

      </div>
    </div>
  );
}
