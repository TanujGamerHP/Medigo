"use client";

import React, { useState } from "react";
import { Check, HelpCircle, ShieldCheck, ArrowRight, X, Sparkles, Percent, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  popular: boolean;
}

const PLANS_DATA: Plan[] = [
  {
    id: "starter",
    name: "Starter Program",
    monthlyPrice: 149,
    yearlyPrice: 119,
    description: "Doctor evaluations and digital prescription router, optimal for patients with existing coverage.",
    features: [
      "Initial physician metabolic audit",
      "Digital prescription routing to local pharmacy",
      "Ongoing portal check-ins (monthly)",
      "Secure HIPPA patient portal access",
      "Live support team ticket queue",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium Program",
    monthlyPrice: 299,
    yearlyPrice: 239,
    description: "Our complete package including direct pharmacy cold-pack shipping and medications.",
    features: [
      "All medical consultation & platform fees",
      "Genuine brand GLP-1 medications included",
      "Discrete cold-chain home delivery",
      "24/7 direct messaging with clinicians",
      "Full access to AI Health Coach tool",
      "Bi-weekly titration audits & checks",
    ],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite Concierge Program",
    monthlyPrice: 499,
    yearlyPrice: 399,
    description: "Personalized medical care featuring dedicated coordinators and unlimited doctor meetings.",
    features: [
      "All features of the Premium program",
      "Unlimited clinical consultation calls",
      "Dedicated, 1-on-1 Patient Coordinator",
      "Custom nutrition and fitness blueprints",
      "Metabolic blood labs ordered & paid",
      "Priority medication shipment router",
    ],
    popular: false,
  },
];

const COMPARISON_FEATURES = [
  { name: "Initial Doctor Review", starter: true, premium: true, elite: true },
  { name: "HIPAA Patient Portal", starter: true, premium: true, elite: true },
  { name: "Monthly Clinician Audits", starter: true, premium: true, elite: true },
  { name: "GLP-1 Medication Sourcing", starter: "Prescription only", premium: "Included in sub", elite: "Included in sub" },
  { name: "Temperature-Controlled Delivery", starter: false, premium: true, elite: true },
  { name: "24/7 Clinician Messaging", starter: false, premium: true, elite: true },
  { name: "AI Health Coach Access", starter: false, premium: true, elite: true },
  { name: "Custom Nutrition blueprints", starter: false, premium: false, elite: true },
  { name: "Metabolic Lab Panels Coordination", starter: false, premium: false, elite: true },
  { name: "Dedicated Concierge Support", starter: false, premium: false, elite: true },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-6 max-w-3xl">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <Percent className="w-3.5 h-3.5" />
            Clear & Direct Pricing
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary">
            Find the Perfect <span className="gradient-text">MediGo Plan</span>
          </h1>
          <p className="text-text-secondary text-lg">
            No contract terms, zero hidden platform surcharges, cancel subscription anytime with a simple click.
          </p>

          {/* Toggle Button Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${billingPeriod === "monthly" ? "text-text-primary" : "text-text-secondary"}`}>
              Bill Monthly
            </span>
            <button
              onClick={() => setBillingPeriod((p) => (p === "monthly" ? "yearly" : "monthly"))}
              className="relative w-12 h-6 bg-primary-200 rounded-full focus:outline-none transition-colors duration-200"
              aria-label="Toggle billing duration"
            >
              <div
                className={`absolute w-5 h-5 bg-primary rounded-full top-0.5 left-0.5 transition-transform duration-200 ${
                  billingPeriod === "yearly" ? "translate-x-6 bg-primary-dark" : ""
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1 ${billingPeriod === "yearly" ? "text-text-primary" : "text-text-secondary"}`}>
              Bill Yearly
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Plan Cards Section */}
      <section className="py-12 container-custom max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS_DATA.map((plan) => {
            const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl bg-white border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary shadow-glow shadow-primary-500/10 md:scale-[1.03]"
                    : "border-border/60"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-cta text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    Recommended
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-text-primary">
                      {plan.name}
                    </h3>
                    <p className="text-text-secondary text-xs mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-4xl font-heading font-black text-text-primary">
                      ₹{price}
                    </span>
                    <span className="text-text-secondary text-sm ml-1">
                      /month
                    </span>
                  </div>

                  <div className="border-t border-border-light pt-6 space-y-3.5">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <Check className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                        <span className="text-text-secondary text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    id={`pricing-btn-${plan.id}`}
                    href={`/membership/checkout?plan=${plan.id}&period=${billingPeriod}`}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:scale-[1.02] ${
                      plan.popular
                        ? "gradient-cta text-white shadow-glow"
                        : "bg-background border border-border text-text-primary hover:border-primary hover:text-primary hover:bg-primary-50/10"
                    }`}
                  >
                    Select Plan
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Matrix Table */}
      <section className="py-16 container-custom max-w-4xl mx-auto overflow-x-auto">
        <div className="min-w-[600px] bg-white rounded-3xl border border-border/50 shadow-sm p-6 md:p-8 space-y-6">
          <h3 className="font-heading font-bold text-xl text-text-primary">
            Detailed Program Feature Comparison
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 text-xs font-bold text-text-tertiary uppercase tracking-wider w-[40%]">Feature Name</th>
                <th className="pb-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center w-[20%]">Starter</th>
                <th className="pb-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center w-[20%]">Premium</th>
                <th className="pb-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center w-[20%]">Elite</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((feat, idx) => (
                <tr key={idx} className="border-b border-border-light last:border-b-0 hover:bg-background/40">
                  <td className="py-4 text-sm font-semibold text-text-primary">{feat.name}</td>
                  
                  {/* Starter Column */}
                  <td className="py-4 text-sm text-center">
                    {typeof feat.starter === "boolean" ? (
                      feat.starter ? <Check className="w-5 h-5 text-primary mx-auto" /> : <X className="w-5 h-5 text-text-tertiary/40 mx-auto" />
                    ) : (
                      <span className="text-xs font-semibold text-text-secondary">{feat.starter}</span>
                    )}
                  </td>

                  {/* Premium Column */}
                  <td className="py-4 text-sm text-center">
                    {typeof feat.premium === "boolean" ? (
                      feat.premium ? <Check className="w-5 h-5 text-primary mx-auto" /> : <X className="w-5 h-5 text-text-tertiary/40 mx-auto" />
                    ) : (
                      <span className="text-xs font-semibold text-primary">{feat.premium}</span>
                    )}
                  </td>

                  {/* Elite Column */}
                  <td className="py-4 text-sm text-center">
                    {typeof feat.elite === "boolean" ? (
                      feat.elite ? <Check className="w-5 h-5 text-primary mx-auto" /> : <X className="w-5 h-5 text-text-tertiary/40 mx-auto" />
                    ) : (
                      <span className="text-xs font-semibold text-text-primary">{feat.elite}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Money-Back Guarantee Details */}
      <section className="py-12 bg-white border-t border-border/40">
        <div className="container-custom max-w-4xl">
          <div className="p-8 rounded-3xl bg-primary-50/20 border border-primary-200/40 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-lg text-text-primary">
                Our 30-Day Clinical Satisfaction Guarantee
              </h4>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                If our medical team determines you are clinically ineligible for GLP-1 therapy based on your blood diagnostics or medical history, we issue a 100% full refund on platform payments instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
