"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, Lock, CheckCircle, ArrowRight, CreditCard, Stethoscope, Pill, MessageSquare } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function MembershipCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [isSending, setIsSending] = useState(false);

  // Read raw plan name, but normalize it to capitalized form for API validation
  const rawPlanName = searchParams.get("plan") || "Premium";
  const planName = rawPlanName.charAt(0).toUpperCase() + rawPlanName.slice(1).toLowerCase();
  
  const price = planName === "Elite" ? 499 : planName === "Premium" ? 299 : 149;

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      show("Initializing payment...", "info");
      
      // Create Razorpay Order
      // Price is in USD, converting to INR roughly (83) and then to paise (100)
      const orderRes = await api.post("/api/v1/payments/create-order", {
        amount: price * 83 * 100, 
        currency: "INR"
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error("Failed to create order with payment gateway");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TYe468qX4mG7Fh",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "MediGo Health",
        description: `${planName} Membership Subscription`,
        order_id: orderRes.data.id,
        handler: async function (response: any) {
          try {
            show("Processing your subscription...", "info");
            
            // On success, activate membership in our database
            const res = await api.post("/api/v1/membership/subscribe", {
              planName, // Now it's properly capitalized
              price,
            });

            if (res.success || res.id) {
              show(`Welcome to MediGo ${planName}!`, "success");
              router.push("/dashboard");
            }
          } catch (err: any) {
            show(err.message || "Failed to process subscription", "error");
          }
        },
        theme: {
          color: "#059669", // Primary green color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        show(response.error.description || "Payment failed", "error");
      });
      rzp.open();
      
    } catch (err: any) {
      show(err.message || "Checkout failed", "error");
    } finally {
      setIsSending(false);
    }
  };

  const features = planName === "Elite" ? [
    { icon: <Stethoscope />, title: "Unlimited Consultations", desc: "24/7 access to top-tier specialists" },
    { icon: <Pill />, title: "Free Next-Day Rx", desc: "Medications delivered at no extra cost" },
    { icon: <MessageSquare />, title: "Dedicated AI Concierge", desc: "Personalized daily health monitoring" }
  ] : planName === "Premium" ? [
    { icon: <Stethoscope />, title: "Monthly Consultations", desc: "Up to 4 specialist visits per month" },
    { icon: <Pill />, title: "Free Standard Rx", desc: "Medications delivered in 3-5 days" },
    { icon: <MessageSquare />, title: "AI Health Coaching", desc: "Weekly check-ins and insights" }
  ] : [
    { icon: <Stethoscope />, title: "Basic Access", desc: "1 general consultation per month" },
    { icon: <Pill />, title: "Discounted Pharmacy", desc: "15% off all medication deliveries" },
    { icon: <MessageSquare />, title: "Health Portal", desc: "Access to medical records and AI bot" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Upgrade
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
            You're just one step away from unlocking premium healthcare features. Securely complete your purchase to access MediGo {planName}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Benefits & Value */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="bg-primary/10 text-primary p-2 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </span>
                What's included in {planName}
              </h2>
              
              <div className="space-y-6">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                      {React.cloneElement(feat.icon as React.ReactElement, { className: "w-6 h-6" })}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{feat.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col gap-4">
                <h3 className="font-heading text-2xl font-bold">100% Satisfaction Guarantee</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We're confident in the quality of our care. If you're not completely satisfied with your {planName} membership within the first 30 days, we'll refund your payment in full. No questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-32">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {planName} Tier
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-4 border-b border-dashed border-slate-200">
                  <span className="text-slate-600 font-medium">{planName} Membership (Monthly)</span>
                  <span className="font-bold text-slate-900">${price}.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 text-sm">Setup Fee</span>
                  <span className="text-primary font-medium text-sm">Waived</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 text-sm">Taxes</span>
                  <span className="text-slate-500 text-sm">Calculated at checkout</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex items-center justify-between border border-slate-100">
                <span className="font-bold text-slate-900 text-lg">Total Today</span>
                <div className="text-right">
                  <span className="text-3xl font-heading font-black text-primary">${price}</span>
                  <span className="text-slate-500 text-sm block">/month</span>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <Button
                  type="submit"
                  isLoading={isSending}
                  fullWidth
                  className="py-4 rounded-2xl font-bold text-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </Button>
                
                <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs mx-auto">
                  By clicking proceed, you agree to our Terms of Service and monthly recurring billing. You can cancel anytime.
                </p>
              </form>

              <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400" />
                  256-bit Secure
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  HIPAA Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MembershipCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen pt-32 pb-12 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <div className="text-slate-500 font-medium animate-pulse">Loading secure checkout...</div>
      </div>
    }>
      <MembershipCheckoutContent />
    </Suspense>
  );
}
