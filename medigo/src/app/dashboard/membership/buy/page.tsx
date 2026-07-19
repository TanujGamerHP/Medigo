"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, ArrowLeft, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useRole } from "@/features/shared/RoleProvider";

export default function BuyMembershipPage() {
  const router = useRouter();
  const { show } = useToast();
  const { user, refreshProfile } = useRole();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "premium">("starter");

  const memberships = user?.patient?.memberships || [];
  const activeMembership = memberships.find((m: any) => m.status === 'Active');

  const plans = {
    starter: {
      name: "Starter Weight Loss Program",
      price: 149,
      features: [
        "1x Monthly Doctor Consultation video check-ins",
        "Unlimited asynchronous clinical secure chat support",
        "Prescription routing (Semaglutide cold-chain shipments)",
        "AI Coach log monitors & activity tracking",
      ],
    },
    premium: {
      name: "Premium Metabolic Program",
      price: 249,
      features: [
        "2x Monthly Doctor Consultation video check-ins",
        "Priority 24/7 secure chat support",
        "Prescription routing + Priority cold-chain shipments",
        "AI Coach + Dedicated Human Nutritionist",
        "Advanced metabolic blood work analysis",
      ],
    },
  };

  const handleCheckout = async () => {
    if (activeMembership) {
      const expiry = new Date(activeMembership.expiryDate);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      show(`You already have an active plan. It will expire on ${expiry.toLocaleDateString()}. After this, you can purchase another plan.`, "error");
      return;
    }

    setLoading(true);
    // Simulate Razorpay Gateway
    setTimeout(async () => {
      try {
        const plan = plans[selectedPlan];
        const res = await api.post("/api/v1/users/membership", {
          planName: plan.name,
          price: plan.price,
        });

        if (res.success) {
          show("Payment successful! Membership activated.", "success");
          await refreshProfile();
          router.push("/dashboard/membership");
        } else {
          show("Payment failed. Please try again.", "error");
        }
      } catch (err: any) {
        show(err.message || "Payment failed. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h2 className="font-heading text-xl font-extrabold text-text-primary">
            Choose Your Program
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Select a clinical plan to start your weight loss journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starter Plan */}
        <div
          onClick={() => setSelectedPlan("starter")}
          className={`cursor-pointer bg-white rounded-3xl p-6 border-2 transition-all duration-300 relative ${
            selectedPlan === "starter"
              ? "border-primary shadow-lg shadow-primary/10"
              : "border-border/50 hover:border-primary/50"
          }`}
        >
          {selectedPlan === "starter" && (
            <div className="absolute top-4 right-4 text-primary">
              <CheckCircle2 className="w-6 h-6 fill-primary/10" />
            </div>
          )}
          <div className="space-y-1 mb-6">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <h3 className="font-heading font-bold text-xl text-text-primary">Starter Program</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-heading font-black text-text-primary">₹149</span>
              <span className="text-xs text-text-secondary">/ month</span>
            </div>
          </div>
          <div className="space-y-3">
            {plans.starter.features.map((feat, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Plan */}
        <div
          onClick={() => setSelectedPlan("premium")}
          className={`cursor-pointer bg-white rounded-3xl p-6 border-2 transition-all duration-300 relative ${
            selectedPlan === "premium"
              ? "border-primary shadow-lg shadow-primary/10"
              : "border-border/50 hover:border-primary/50"
          }`}
        >
          {selectedPlan === "premium" && (
            <div className="absolute top-4 right-4 text-primary">
              <CheckCircle2 className="w-6 h-6 fill-primary/10" />
            </div>
          )}
          <div className="space-y-1 mb-6">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
              Comprehensive
            </span>
            <h3 className="font-heading font-bold text-xl text-text-primary">Premium Program</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-heading font-black text-text-primary">₹299</span>
              <span className="text-xs text-text-secondary">/ month</span>
            </div>
          </div>
          <div className="space-y-3">
            {plans.premium.features.map((feat, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-border-light flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3395FF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">Secured by Razorpay</h4>
            <p className="text-[10px] text-text-secondary">Your payment is encrypted and fully secure.</p>
          </div>
        </div>
        
        <Button
          onClick={handleCheckout}
          isLoading={loading}
          disabled={loading}
          className="w-full sm:w-auto px-8 shadow-glow"
          rightIcon={!loading && <ArrowRight className="w-4 h-4" />}
        >
          {loading ? "Processing Payment..." : `Pay ₹${plans[selectedPlan].price} securely`}
        </Button>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-border/50 text-center space-y-4 max-w-sm w-full">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-[#3395FF] rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-text-primary">Processing Payment</h3>
              <p className="text-xs text-text-secondary">Please do not close this window...</p>
            </div>
            <div className="pt-4 flex items-center justify-center gap-2 text-[#3395FF] font-bold text-xl tracking-tight">
              Razorpay
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
