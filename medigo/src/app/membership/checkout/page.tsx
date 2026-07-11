"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Star,
  BrainCircuit,
  Truck,
  FileText,
  Headset,
  Shield
} from "lucide-react";

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
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Read raw plan name, but normalize it
  const rawPlanName = searchParams.get("plan") || "1-month";
  let planName = rawPlanName;
  let price = 2499;

  if (rawPlanName.toLowerCase() === "3-months") {
    planName = "3-Months";
    price = 6999;
  } else if (rawPlanName.toLowerCase() === "6-months") {
    planName = "6-Months";
    price = 12999;
  } else {
    planName = "1-Month";
    price = 2499;
  }

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      show("Please accept the Terms of Service and Privacy Policy", "error");
      return;
    }
    
    setIsSending(true);

    try {
      show("Initializing payment...", "info");
      
      const orderRes = await api.post("/api/v1/payments/create-order", {
        amount: price, 
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
            
            const res = await api.post("/api/v1/membership/subscribe", {
              planName, 
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
          color: "#22c55e", // Primary green color
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

  const features = [
    { icon: <BrainCircuit />, title: "AI Health Coaching", desc: "Personalized insights and guidance." },
    { icon: <Truck />, title: "Direct Pharmacy Shipping", desc: "Medicines delivered to your doorstep." },
    { icon: <FileText />, title: "Health Records", desc: "Securely store and manage your records." },
    { icon: <Headset />, title: "Priority Support", desc: "Get faster responses from our team." }
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen pt-24 pb-16 font-sans">
      <div className="container-custom max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-sm font-semibold border border-green-100">
            <CheckCircle className="w-4 h-4" />
            STEP 2 OF 2
          </div>
          <h1 className="font-heading text-4xl md:text-[40px] font-bold text-slate-900 tracking-tight">
            Confirm Your {planName} Membership
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base">
            Get exclusive access to clinical consultations, AI health coaching, and<br className="hidden md:block"/> direct pharmacy shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8 max-w-5xl mx-auto">
          
          {/* Left Panel - Checkout Form */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
            <div className="space-y-8">
              
              {/* Your Plan */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Your Plan</h3>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shrink-0">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-500 text-lg">{planName} Plan</h4>
                      <p className="text-sm text-slate-500">Billed monthly • Cancel anytime</p>
                    </div>
                  </div>
                  {planName === "3-Months" && (
                    <div className="hidden sm:block px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Summary */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Summary</h3>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="font-medium text-slate-700">{planName} Plan</span>
                  <span className="font-bold text-slate-900">₹{price}.00</span>
                </div>
              </div>

              {/* Total Due Today */}
              <div>
                <div className="flex items-center justify-between pt-2">
                  <h3 className="text-xl font-bold text-slate-900">Total Due Today</h3>
                  <span className="text-3xl font-bold text-green-500">₹{price}.00</span>
                </div>
              </div>

              {/* Secure Checkout Alert */}
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex items-start gap-4">
                <Lock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-900 text-sm">Secure & Safe Checkout</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Your payment information is encrypted and secure.</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white border border-green-100 rounded-full text-green-600 text-xs font-bold whitespace-nowrap">
                  <Lock className="w-3 h-3" />
                  256-bit SSL
                </div>
              </div>

              {/* Form & Actions */}
              <form onSubmit={handleSubscribe} className="space-y-6 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-5 h-5 text-green-500 bg-white border-slate-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer accent-green-500"
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm text-slate-500 leading-relaxed cursor-pointer">
                    By clicking Subscribe & Pay, you agree to our <a href="#" className="text-green-500 underline hover:text-green-600">Terms of Service</a> and acknowledge our <a href="#" className="text-green-500 underline hover:text-green-600">Privacy Policy</a>. You will be charged ₹{price}.00 monthly until canceled.
                  </label>
                </div>

                <Button
                  type="submit"
                  isLoading={isSending}
                  fullWidth
                  className="py-4 h-auto rounded-xl font-bold text-lg bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-between px-6 transition-all shadow-md shadow-green-500/20"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Subscribe & Pay Securely
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4" />
                  Cancel anytime from your dashboard. No hidden fees.
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel - Features */}
          <div className="bg-[#f2fbf5] rounded-3xl p-8 md:p-10 border border-[#e6f4eb] h-fit">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-500 mb-4 shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 9.5l3 3l4.5-9l4.5 9l3-3V19h-15V9.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">What You Get with {planName}</h3>
            </div>

            <div className="space-y-6">
              {features.map((feat, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#e2f5e8] flex items-center justify-center text-green-600">
                    {React.cloneElement(feat.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px]">{feat.title}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-green-900/5 text-center">
              <p className="text-sm font-semibold text-slate-900 mb-4">Trusted by 10,000+ users</p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  4.8/5
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3 font-medium">Your health. Our priority.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-500" />
            256-bit Secure Checkout
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            HIPAA Compliant
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function MembershipCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#fafafa] min-h-screen pt-32 pb-12 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-green-500 rounded-full animate-spin"></div>
        <div className="text-slate-500 font-medium animate-pulse">Loading secure checkout...</div>
      </div>
    }>
      <MembershipCheckoutContent />
    </Suspense>
  );
}
