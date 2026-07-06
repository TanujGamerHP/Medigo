"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Sparkles, HeartPulse, UserCheck, CheckCircle2, Heart } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function AboutPage() {
  const stats = [
    { value: "2024", label: "Founded Year" },
    { value: "50,000+", label: "Patients Served" },
    { value: "500+", label: "Licensed Providers" },
    { value: "50+", label: "States Covered" },
  ];

  const values = [
    {
      icon: HeartPulse,
      title: "Patient-First Care",
      description: "We prioritize patient safety, clinical efficacy, and individual needs over generic metrics.",
    },
    {
      icon: Shield,
      title: "Scientific Integrity",
      description: "Our weight management guidelines are designed by leading endocrinologists and obesity experts.",
    },
    {
      icon: Sparkles,
      title: "Radical Simplicity",
      description: "We remove clinical friction, making complex medical journeys straightforward and clear.",
    },
  ];

  const leaders = [
    { name: "Tanuj Sharma", role: "CEO & Co-founder", initials: "TS", bio: "Health-tech entrepreneur dedicated to scaling accessible, quality care." },
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            <Heart className="w-3.5 h-3.5" />
            Our Mission & Story
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary text-balance leading-tight">
            Reimagining Weight Loss Through <span className="gradient-text">Science & Care</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary">
            At MediGo, we believe metabolic health is a right, not a luxury. We connect patients with top medical specialists and proven therapies for safe, lasting results.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-border/40">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-5xl font-heading font-black gradient-text">
                  {stat.value}
                </div>
                <div className="text-text-secondary text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-20 container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
            Our Core Values
          </h2>
          <p className="text-text-secondary">
            The principles guiding how we treat our patients, build our platform, and advance healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white border border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-6">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-text-primary mb-3">
                {val.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white border-t border-border/40">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
              Our Leadership Team
            </h2>
            <p className="text-text-secondary">
              Obesity specialists, health-tech engineers, and clinical experts working together to support your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full gradient-primary-soft flex items-center justify-center text-primary-900 font-heading font-extrabold text-2xl mb-5 shadow-sm">
                  {leader.initials}
                </div>
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  {leader.name}
                </h3>
                <p className="text-primary font-medium text-xs md:text-sm mt-1">
                  {leader.role}
                </p>
                <p className="text-text-secondary text-sm mt-4 leading-relaxed line-clamp-3">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Accreditations */}
      <section className="py-20 bg-background">
        <div className="container-custom max-w-4xl text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
            A Platform Built on Absolute Trust
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-text-primary">HIPAA Protection</h4>
                <p className="text-text-secondary text-sm">We strictly encrypt all personal patient data and communication history.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-text-primary">FDA-Regulated Pharmacy Sourcing</h4>
                <p className="text-text-secondary text-sm">All programs use genuine therapies sourced from regulated providers.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-text-primary">100% Board-Certified Clinics</h4>
                <p className="text-text-secondary text-sm">Consultations are conducted exclusively by licensed obesity medical staff.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-text-primary">Direct Doctor Messaging</h4>
                <p className="text-text-secondary text-sm">Get real answers directly from your healthcare provider, anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark-green py-20 text-white relative overflow-hidden">
        <div className="relative z-10 container-custom text-center space-y-6 max-w-3xl">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-balance">
            Start Your Health Journey Today
          </h2>
          <p className="text-white/70 text-lg">
            Find out if you qualify for a doctor-led program in just a few minutes.
          </p>
          <div className="pt-4">
            <Link
              id="about-bottom-cta"
              href="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-dark-green font-bold text-lg shadow-2xl hover:scale-105 transition-transform duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
