"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  ClipboardCheck, 
  UserCheck, 
  Video, 
  TrendingDown, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  MessageSquare,
  Sparkles,
  Pill
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};


const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

function StepRow({ 
  step, 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  bullets, 
  isEven 
}: { 
  step: number; 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  subtitle: string; 
  description: string; 
  bullets: string[]; 
  isEven: boolean; 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-12 border-b border-border/40 last:border-b-0 ${
        isEven ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* 3D-like Icon Card */}
      <motion.div 
        variants={fadeInUp} 
        className="w-full lg:w-1/2 flex justify-center"
      >
        <div className="relative group w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gradient-to-tr from-primary-50 to-primary-100/50 flex items-center justify-center border border-primary-200/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary-dark blur-2xl animate-pulse" />
          </div>
          
          <div className="absolute top-6 left-6 text-6xl md:text-7xl font-heading font-black text-primary/10 select-none">
            {String(step).padStart(2, "0")}
          </div>

          <div className="p-8 rounded-2xl bg-white shadow-md border border-border/50 group-hover:scale-105 transition-transform duration-300 relative z-10">
            <Icon className="w-16 h-16 text-primary" />
          </div>
        </div>
      </motion.div>

      {/* Text Info */}
      <motion.div 
        variants={fadeInUp} 
        className="w-full lg:w-1/2 space-y-5"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
          Phase 0{step}
        </div>
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
          {title}
        </h3>
        <p className="text-primary font-medium text-lg">
          {subtitle}
        </p>
        <p className="text-text-secondary leading-relaxed">
          {description}
        </p>
        <ul className="space-y-3 pt-2">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span className="text-text-secondary text-sm md:text-base">{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      icon: ClipboardCheck,
      title: "Online Health Assessment",
      subtitle: "Evaluate your metabolic health profiles instantly",
      description: "Our comprehensive, AI-assisted health survey takes under 5 minutes. We collect vital information regarding your history, target goals, and metabolic markers to establish your baseline eligibility.",
      bullets: [
        "No credit card required to check initial eligibility",
        "Calculates your BMI status dynamically",
        "Assesses contraindications for GLP-1 medications",
        "Securely encrypted HIPAA-compliant database"
      ]
    },
    {
      step: 2,
      icon: UserCheck,
      title: "Board-Certified Medical Review",
      subtitle: "Personalized evaluations by weight management experts",
      description: "A licensed obesity medicine doctor reviews your assessment profile to design a custom weight loss pathway that aligns with your biology, lifestyle preferences, and health goals.",
      bullets: [
        "Licensed clinicians assigned within 24 hours",
        "Full review of existing medical history & diagnostics",
        "Direct chat portal access with your clinician",
        "Tailored dosing program selection"
      ]
    },
    {
      step: 3,
      icon: Video,
      title: "Virtual Consultation & Lab Work",
      subtitle: "Discuss details, dosing regimens, and target expectations",
      description: "Book an optional, secure video appointment to clarify program expectations. If clinical diagnostics are required, we coordinate local lab appointments near you for metabolic blood panels.",
      bullets: [
        "Seamless browser-based video visits (no app downloads)",
        "Coordination with 2,000+ Quest & Labcorp centers",
        "Complete metabolic diagnostics (A1C, lipid panel, thyroid)",
        "Direct guidance on managing potential side effects"
      ]
    },
    {
      step: 4,
      icon: TrendingDown,
      title: "Ongoing Treatment & Lifestyle Coaching",
      subtitle: "FDA-approved medications delivered discreetly with continuous support",
      description: "Your prescription is routed to our certified pharmacy partner. Medications arrive at your doorstep in temperature-controlled packaging. Track weight, log habits, and receive AI-backed daily coaching via your portal.",
      bullets: [
        "Genuine brand-name medications (Wegovy, Ozempic, Mounjaro)",
        "Cold-chain temperature-safe overnight shipping",
        "Automated monthly prescription renewals & clinician check-ins",
        "AI Health Coach chat for diet, nutrition, and motivation"
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary-light/20 blur-3xl" />
        </div>

        <div className="relative z-10 container-custom text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Simple & Transparent Process
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary text-balance leading-tight">
            How MediGo <span className="gradient-text">Works</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary text-balance">
            Our doctor-guided programs make premium medical weight management safe, convenient, and fully accessible from the comfort of your home.
          </p>
        </div>
      </section>

      {/* Main Process Timeline */}
      <section className="py-16 container-custom">
        <div className="max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <StepRow 
              key={step.step}
              step={step.step}
              icon={step.icon}
              title={step.title}
              subtitle={step.subtitle}
              description={step.description}
              bullets={step.bullets}
              isEven={idx % 2 === 1}
            />
          ))}
        </div>
      </section>

      {/* Quality Guarantees Banner */}
      <section className="bg-white border-y border-border/50 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-primary">HIPAA Secure</h4>
              <p className="text-text-secondary text-sm">
                Your medical data is fully encrypted using enterprise-grade health standard protocols.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-primary">Cancel Anytime</h4>
              <p className="text-text-secondary text-sm">
                Flexible subscriptions. No long-term commitments, no cancel fees. Control everything from dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary">
                <Pill className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-primary">Genuine Medications</h4>
              <p className="text-text-secondary text-sm">
                Medications are sourced exclusively from US licensed, FDA-regulated pharmacies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-dark-green py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-primary blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 container-custom text-center space-y-6 max-w-3xl">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-balance">
            Start Your Medical Assessment Today
          </h2>
          <p className="text-white/70 text-lg">
            See if you qualify for a doctor-led GLP-1 weight loss program in under 5 minutes.
          </p>
          <div className="pt-4">
            <Link
              id="how-it-works-bottom-cta"
              href="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-dark-green font-bold text-lg shadow-2xl hover:scale-105 transition-transform duration-200"
            >
              Check Eligibility
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-xs text-white/50">
            Initial check is free • No commitment • HIPAA-compliant portal
          </p>
        </div>
      </section>
    </div>
  );
}
