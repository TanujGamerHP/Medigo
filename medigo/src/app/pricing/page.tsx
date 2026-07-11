"use client";

import React, { useState } from "react";
import { Check, X, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  price: number;
  tagline: string;
  badge: string;
  bestFor?: string;
  features: string[];
  popular: boolean;
  color: "green" | "blue" | "purple";
}

const PLANS_DATA: Plan[] = [
  {
    id: "1-month",
    name: "MediGo Care – 1 Month",
    price: 2499,
    tagline: "Perfect to get started",
    badge: "",
    bestFor: "Best For: First-time users",
    features: [
      "AI Health Assessment",
      "Initial Doctor Consultation",
      "Personalized Treatment Plan",
      "1 Follow-up Consultation",
      "Digital Prescription",
      "Patient Dashboard",
      "Weight & BMI Tracking",
      "Email Support",
    ],
    popular: false,
    color: "green",
  },
  {
    id: "3-months",
    name: "MediGo Care – 3 Months",
    price: 6999,
    tagline: "Most patients start seeing meaningful results in 3 months.",
    badge: "⭐ Most Popular",
    features: [
      "Everything in 1 Month, PLUS:",
      "3 Months Continuous Doctor Care",
      "Monthly Doctor Follow-ups",
      "Unlimited AI Progress Check-ins",
      "Personalized Diet Plan",
      "Personalized Exercise Plan",
      "WhatsApp Priority Support",
      "Prescription Renewals",
      "Priority Appointment Booking",
      "Progress Reports",
      "Save ₹500 compared to monthly",
    ],
    popular: true,
    color: "blue",
  },
  {
    id: "6-months",
    name: "MediGo Care – 6 Months",
    price: 12999,
    tagline: "Best value for long-term health transformation.",
    badge: "👑 Best Value",
    features: [
      "Everything in 3 Months, PLUS:",
      "6 Months Continuous Doctor Care",
      "Dedicated Care Coordinator",
      "Weekly Progress Reviews",
      "Unlimited Doctor Follow-up Messages",
      "Advanced Nutrition Coaching",
      "Lifestyle Coaching",
      "Free Lab Report Reviews",
      "Fast-Track Appointment Priority",
      "Premium Customer Support",
      "Personalized Long-Term Health Roadmap",
      "Exclusive Educational Content",
      "Save ₹2,000 compared to monthly",
    ],
    popular: false,
    color: "purple",
  },
];

const COMPARISON_FEATURES = [
  { name: "AI Health Assessment", month1: true, month3: true, month6: true },
  { name: "Doctor Consultation", month1: true, month3: true, month6: true },
  { name: "Personalized Treatment", month1: true, month3: true, month6: true },
  { name: "Progress Tracking", month1: true, month3: true, month6: true },
  { name: "Monthly Follow-ups", month1: false, month3: true, month6: true },
  { name: "Diet Plan", month1: false, month3: true, month6: true },
  { name: "Exercise Plan", month1: false, month3: true, month6: true },
  { name: "WhatsApp Support", month1: false, month3: true, month6: true },
  { name: "Priority Appointments", month1: false, month3: true, month6: true },
  { name: "Weekly Progress Review", month1: false, month3: false, month6: true },
  { name: "Dedicated Care Coordinator", month1: false, month3: false, month6: true },
  { name: "Lab Report Review", month1: false, month3: false, month6: true },
  { name: "Premium Support", month1: false, month3: false, month6: true },
];

export default function PricingPage() {
  const router = useRouter();

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
          
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary">
            Choose Your <span className="gradient-text">MediGo Care</span> Plan
          </h1>
          <p className="text-text-secondary text-lg">
            Start your weight loss journey with clinical care and ongoing support.
          </p>
        </div>
      </section>

      {/* Plan Cards Section */}
      <section className="py-12 container-custom max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS_DATA.map((plan) => {
            const colorClasses = {
              green: "border-[#25D366]/40 hover:border-[#25D366] shadow-[#25D366]/5",
              blue: "border-[#3B82F6]/60 hover:border-[#3B82F6] shadow-[#3B82F6]/15",
              purple: "border-[#9333EA]/40 hover:border-[#9333EA] shadow-[#9333EA]/5",
            };
            const btnColorClasses = {
              green: "bg-[#25D366] hover:bg-[#20bd5a] text-white",
              blue: "bg-[#3B82F6] hover:bg-[#2563EB] text-white",
              purple: "bg-[#9333EA] hover:bg-[#7E22CE] text-white",
            };

            return (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl bg-white border-2 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  colorClasses[plan.color]
                } ${plan.popular ? "md:scale-[1.03]" : ""}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wider shadow-sm ${btnColorClasses[plan.color]}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="font-heading font-bold text-2xl text-text-primary">
                      {plan.name}
                    </h3>
                    {plan.bestFor && (
                      <p className="text-sm font-semibold text-text-secondary mt-2 bg-gray-50 py-1 px-3 rounded-full inline-block">
                        {plan.bestFor}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center items-baseline pb-2">
                    <span className="text-4xl font-heading font-black text-text-primary">
                      ₹{plan.price}
                    </span>
                  </div>

                  {/* Powerful Subtext */}
                  <div className="text-center pb-4 border-b border-border-light">
                    <p className={`text-sm font-medium ${
                      plan.color === 'green' ? 'text-green-700' :
                      plan.color === 'blue' ? 'text-blue-700' :
                      'text-purple-700'
                    }`}>
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="pt-2 space-y-3.5">
                    {plan.features.map((feature, idx) => {
                      const isHighlight = feature.includes("Everything in") || feature.includes("Save ₹");
                      return (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <Check className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${
                            plan.color === 'green' ? 'text-[#25D366]' :
                            plan.color === 'blue' ? 'text-[#3B82F6]' :
                            'text-[#9333EA]'
                          }`} />
                          <span className={`text-sm leading-relaxed ${isHighlight ? 'font-bold text-gray-900' : 'text-text-secondary font-medium'}`}>
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/membership/checkout?plan=${plan.id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg ${btnColorClasses[plan.color]}`}
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
          <h3 className="font-heading font-bold text-xl text-text-primary text-center">
            Website Layout Feature Comparison
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 text-xs font-bold text-text-tertiary uppercase tracking-wider w-[40%]">Feature</th>
                <th className="pb-4 text-xs font-bold text-green-600 uppercase tracking-wider text-center w-[20%]">1 Month</th>
                <th className="pb-4 text-xs font-bold text-blue-600 uppercase tracking-wider text-center w-[20%]">3 Months</th>
                <th className="pb-4 text-xs font-bold text-purple-600 uppercase tracking-wider text-center w-[20%]">6 Months</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((feat, idx) => (
                <tr key={idx} className="border-b border-border-light last:border-b-0 hover:bg-background/40">
                  <td className="py-4 text-sm font-semibold text-text-primary">{feat.name}</td>
                  
                  {/* 1 Month */}
                  <td className="py-4 text-sm text-center">
                    {feat.month1 ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                  </td>

                  {/* 3 Months */}
                  <td className="py-4 text-sm text-center">
                    {feat.month3 ? <Check className="w-5 h-5 text-blue-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                  </td>

                  {/* 6 Months */}
                  <td className="py-4 text-sm text-center">
                    {feat.month6 ? <Check className="w-5 h-5 text-purple-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
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
                Our Clinical Guarantee
              </h4>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                If our medical team determines you are clinically ineligible for GLP-1 therapy based on your medical history, we issue a 100% full refund on payments instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
