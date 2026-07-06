"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Pill, 
  ShieldCheck, 
  BadgeAlert, 
  Star,
  Activity,
  HeartPulse,
  TrendingDown,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function ProgramsPage() {
  const router = useRouter();
  const medications = [
    {
      name: "Semaglutide",
      brand: "Wegovy / Ozempic",
      frequency: "Once-weekly injection",
      loss: "Up to 15%",
      lossSub: "average body weight loss",
      desc: "Semaglutide mimics the GLP-1 hormone to control appetite, delay digestion, and enhance glycemic regulation, supporting steady, long-term weight reduction.",
      benefits: [
        "Significantly decreases persistent food cravings",
        "Extensively documented and FDA-approved",
        "Calms post-meal blood sugar fluctuations",
        "Gradual titration to minimize nausea side effects"
      ],
      color: "from-green-50 to-primary-100/30",
      badgeColor: "bg-primary-100 text-primary-800"
    },
    {
      name: "Tirzepatide",
      brand: "Mounjaro / Zepbound",
      frequency: "Once-weekly injection",
      loss: "Up to 20.9%",
      lossSub: "average body weight loss",
      desc: "Tirzepatide is a dual GIP and GLP-1 receptor agonist. By targeting two metabolic pathways, it offers enhanced efficiency for weight reduction and blood sugar stability.",
      benefits: [
        "Dual hormone action for maximum metabolic support",
        "Higher average weight loss results in clinical trials",
        "Excellent support for insulin-resistant profiles",
        "Once-weekly self-injection pen format"
      ],
      color: "from-blue-50 to-blue-100/20",
      badgeColor: "bg-blue-100 text-blue-800"
    }
  ];

  const eligibilityChecklist = [
    "You have a BMI of 30 or greater (Obese classification)",
    "You have a BMI of 27 or greater with a weight-related co-morbidity (e.g. hypertension, Type 2 diabetes, high cholesterol)",
    "You do not have a personal or family history of medullary thyroid cancer (MTC)",
    "You do not have Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)",
    "You are not currently pregnant or breastfeeding"
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary-light/20 blur-3xl" />
        </div>

        <div className="relative z-10 container-custom text-center space-y-6 max-w-4xl">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            <Pill className="w-3.5 h-3.5" />
            FDA-Approved GLP-1 Programs
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary text-balance leading-tight">
            Clinically Proven <span className="gradient-text">Weight Loss</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary">
            Explore premium weight management therapies customized to your biological makeup. We coordinate direct pharmacist shipping, doctor guidance, and dosage titration support.
          </p>
        </div>
      </section>

      {/* Medication Cards */}
      <section className="py-20 container-custom max-w-5xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {medications.map((med, idx) => (
            <div 
              key={idx} 
              className={`p-8 rounded-3xl bg-gradient-to-br ${med.color} border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-text-primary">
                      {med.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1 font-medium">
                      ({med.brand})
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${med.badgeColor}`}>
                    {med.frequency}
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-white shadow-sm border border-border/30">
                  <div className="text-4xl font-heading font-black gradient-text">
                    {med.loss}
                  </div>
                  <p className="text-text-secondary text-xs font-semibold mt-1">
                    {med.lossSub}
                  </p>
                </div>

                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  {med.desc}
                </p>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-text-primary uppercase tracking-wide">Key Efficacy:</h4>
                  {med.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex gap-2.5 items-start">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  id={`program-btn-${med.name.toLowerCase()}`}
                  href="/assessment"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gradient-cta text-white font-bold text-sm shadow-glow"
                >
                  Check Eligibility
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Qualification Check */}
      <section className="py-20 bg-white border-y border-border/40">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                <BadgeAlert className="w-3.5 h-3.5" />
                Safety Standards
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
                Am I Eligible for GLP-1 Therapy?
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                GLP-1 medications are highly effective prescription therapies. Clinicians evaluate your health indicators against established FDA criteria for chronic weight management.
              </p>
              
              <div className="space-y-3 pt-2">
                {eligibilityChecklist.map((check, cIdx) => (
                  <div key={cIdx} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-sm leading-relaxed">{check}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Interactive Panel */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-background border border-border/60 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center mx-auto shadow-sm">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text-primary">
                Calculate Eligibility instantly
              </h3>
              <p className="text-text-secondary text-xs leading-relaxed px-4">
                Our AI-assisted clinical wizard compiles your history, BMI status, and health goals to establish immediate diagnostic suitability.
              </p>
              <div className="pt-2">
                <Link
                  id="eligibility-flow-cta"
                  href="/assessment"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full gradient-cta text-white font-bold"
                >
                  Start Clinical Assessment
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Support Guarantees */}
      <section className="py-20 container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-primary">Metabolic Lab Work</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                We coordinate comprehensive diagnostic testing through Quest and Labcorp to ensure liver, thyroid, and cardiac panels support safe medication usage.
              </p>
            </div>

            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-primary">Dosage Titration</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Doctors guide you through month-to-month dosage increases. This controlled titration ensures maximum tolerance while mitigating side effects.
              </p>
            </div>

            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-primary">Prescription Renewals</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Clinicians monitor progress through the dashboard. Routine refills are coordinated automatically, eliminating long pharmacy queues.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
