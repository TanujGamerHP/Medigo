"use client";

import React, { useState } from "react";
import { ArrowLeft, Lock, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email address is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    // Mock API reset email delay
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center pt-24 pb-12">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-lg text-center space-y-6">
        
        {isSuccess ? (
          <div className="space-y-6 py-6">
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-xl text-text-primary">
                Reset Link Dispatched
              </h2>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                If the email <strong className="text-text-primary">{email}</strong> matches our clinical database, you will receive a secure password reset link shortly.
              </p>
            </div>
            <div className="pt-4">
              <Link
                id="forgot-back-login"
                href="/login"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full border border-border hover:border-primary hover:text-primary hover:bg-primary-50/10 text-text-primary text-xs font-bold transition-all"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading font-bold text-2xl text-text-primary">
                Forgot Password
              </h1>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                Enter your registered clinical email below, and we will send you a secure link to reset your account password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email-input" className="text-sm font-semibold text-text-primary">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="forgot-email-input"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. sarah@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                    error ? "border-error" : "border-border"
                  }`}
                />
                {error && <p className="text-xs text-error">{error}</p>}
              </div>

              <Button
                id="forgot-submit-btn"
                type="submit"
                isLoading={isSending}
                fullWidth
                className="py-3 text-sm font-bold gradient-cta text-white"
              >
                Send Reset Link
              </Button>
            </form>

            <div className="border-t border-border-light pt-5 text-center text-xs">
              <Link
                id="forgot-cancel-login"
                href="/login"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
