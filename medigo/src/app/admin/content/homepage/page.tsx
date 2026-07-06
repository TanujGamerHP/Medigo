"use client";

import React, { useState } from "react";
import { Home, ArrowRight, Eye, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
}

export default function HomepageCMSPage() {
  const { show } = useToast();
  
  // Section states
  const [sections, setSections] = useState<SectionConfig[]>([
    { id: "hero", name: "Hero Banner (Title, Subtitle, CTA)", enabled: true },
    { id: "features", name: "Features & Programs Grid", enabled: true },
    { id: "how-it-works", name: "Clinical Intake Walkthrough", enabled: true },
    { id: "testimonials", name: "Patient Verification Testimonials", enabled: true },
    { id: "stats", name: "Diagnostic Cohorts Stats", enabled: true },
  ]);

  // Fields states
  const [heroTitle, setHeroTitle] = useState("Your Doctor-Led GLP-1 Weight Management Companion");
  const [heroSubtitle, setHeroSubtitle] = useState("Access doctor consultations, tailored weekly Semaglutide/Tirzepatide dispatches, and secure titration logging.");
  const [ctaText, setCtaText] = useState("Start Free Assessment");

  const handleToggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    show("Homepage section visibility updated.", "success");
  };

  const handleSaveHomepageConfig = (e: React.FormEvent) => {
    e.preventDefault();
    show("Homepage hero banners configurations updated successfully.", "success");
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Hero configuration */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <form onSubmit={handleSaveHomepageConfig} className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border-light">
                <Home className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading text-sm font-bold text-text-primary">Hero Banner Customization</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label htmlFor="hero-title-input" className="text-xs font-bold text-text-secondary uppercase">Hero Main Title</label>
                  <input
                    id="hero-title-input"
                    type="text"
                    required
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="hero-subtitle-input" className="text-xs font-bold text-text-secondary uppercase">Hero Subtitle</label>
                  <textarea
                    id="hero-subtitle-input"
                    rows={3}
                    required
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5 sm:w-64">
                  <label htmlFor="hero-cta-input" className="text-xs font-bold text-text-secondary uppercase">Primary CTA Text</label>
                  <input
                    id="hero-cta-input"
                    type="text"
                    required
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border-light">
                <Button type="submit" size="sm" className="font-bold">
                  Save Homepage
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Toggle active homepage sections */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
            Active Homepage Sections
          </h3>

          <div className="space-y-3 text-xs">
            {sections.map((s) => (
              <div 
                key={s.id} 
                className="flex items-center justify-between p-3 border border-border-light rounded-xl font-semibold text-text-secondary"
              >
                <span>{s.name}</span>
                <button
                  onClick={() => handleToggleSection(s.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${
                    s.enabled
                      ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                      : "border-red-200 text-red-600 bg-red-50"
                  }`}
                >
                  {s.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
