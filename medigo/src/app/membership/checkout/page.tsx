"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, Lock } from "lucide-react";

function MembershipCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [isSending, setIsSending] = useState(false);

  const planName = searchParams.get("plan") || "Premium";
  const price = planName === "Elite" ? 499 : planName === "Premium" ? 299 : 149;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await api.post("/api/v1/membership/subscribe", {
        planName,
        price,
      });

      if (res.success || res.id) {
        show("Successfully subscribed to Membership plan!", "success");
        router.push("/dashboard");
      }
    } catch (err: any) {
      show(err.message || "Failed to process subscription", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-12">
      <div className="container-custom max-w-xl mx-auto space-y-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          Confirm Your {planName} Membership
        </h1>
        <p className="text-sm text-text-secondary">
          Get exclusive access to clinical consultations, AI health coaching, and direct pharmacy shipping.
        </p>

        <div className="bg-white p-8 rounded-3xl border border-border/50 shadow-md text-left space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border-light">
            <span className="font-bold text-text-primary">Plan Selected</span>
            <span className="text-primary font-bold">{planName}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-border-light">
            <span className="font-bold text-text-primary">Monthly Total</span>
            <span className="text-2xl font-heading font-black text-text-primary">${price}</span>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4 pt-4">
            <p className="text-xs text-text-secondary text-center italic">
              By clicking subscribe, you agree to monthly recurring billing. Cancel anytime from your dashboard.
            </p>
            <Button
              type="submit"
              isLoading={isSending}
              fullWidth
              className="py-3 font-bold gradient-cta text-white"
            >
              Subscribe & Pay
            </Button>
          </form>
        </div>
        <div className="flex justify-center gap-4 text-[10px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
            256-bit Secure Checkout
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            HIPAA Compliant
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MembershipCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen pt-32 pb-12 flex items-center justify-center">
        <div className="text-text-secondary">Loading checkout...</div>
      </div>
    }>
      <MembershipCheckoutContent />
    </Suspense>
  );
}
