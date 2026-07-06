"use client";

import React, { useState } from "react";
import { Globe, ShieldCheck, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SEOCMSPage() {
  const { show } = useToast();
  
  // SEO fields states
  const [page, setPage] = useState("Home Page");
  const [seoTitle, setSeoTitle] = useState("Doctor-Led GLP-1 Weight Management Programs | MediGo");
  const [metaDesc, setMetaDesc] = useState("Access doctor consultations, tailored weekly Semaglutide/Tirzepatide dispatches, and secure titration logging under HIPAA privacy rules.");
  const [keywords, setKeywords] = useState("glp-1 weight loss, semaglutide compounding, online doctor weight loss, wegovy alternatives");
  const [canonicalUrl, setCanonicalUrl] = useState("https://medigo.com/");
  const [robots, setRobots] = useState("index, follow");

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    show(`SEO Meta Tags for ${page} updated successfully.`, "success");
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <form onSubmit={handleSaveSEO} className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-border-light">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading text-sm font-bold text-text-primary">SEO Meta Tags Editor</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5 sm:w-64">
                  <label htmlFor="seo-page-select" className="text-xs font-bold text-text-secondary uppercase">Page Route</label>
                  <select
                    id="seo-page-select"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  >
                    <option value="Home Page">Home Page ( / )</option>
                    <option value="About Page">About Page ( /about )</option>
                    <option value="GLP-1 Programs">GLP-1 Programs ( /glp1-programs )</option>
                    <option value="FAQ Page">FAQ Page ( /faq )</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="seo-title-input" className="text-xs font-bold text-text-secondary uppercase">Meta Title Tag</label>
                  <input
                    id="seo-title-input"
                    type="text"
                    required
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="seo-desc-input" className="text-xs font-bold text-text-secondary uppercase">Meta Description Tag</label>
                  <textarea
                    id="seo-desc-input"
                    rows={3}
                    required
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="seo-keys-input" className="text-xs font-bold text-text-secondary uppercase">SEO Keywords (Comma Separated)</label>
                  <input
                    id="seo-keys-input"
                    type="text"
                    required
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="seo-canonical-input" className="text-xs font-bold text-text-secondary uppercase">Canonical URL</label>
                    <input
                      id="seo-canonical-input"
                      type="url"
                      required
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="seo-robots-input" className="text-xs font-bold text-text-secondary uppercase">Robots Meta tag</label>
                    <input
                      id="seo-robots-input"
                      type="text"
                      required
                      value={robots}
                      onChange={(e) => setRobots(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border-light">
                <Button type="submit" size="sm" className="font-bold">
                  Save SEO Configuration
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Search Preview */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
            Google Search Preview
          </h3>

          <div className="p-4 bg-slate-50 border border-border-light rounded-xl space-y-1.5 text-xs font-medium leading-relaxed">
            <span className="text-emerald-800 text-[10px] block truncate font-mono">{canonicalUrl}</span>
            <span className="text-blue-700 font-bold block text-sm hover:underline cursor-pointer">
              {seoTitle}
            </span>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              {metaDesc}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
