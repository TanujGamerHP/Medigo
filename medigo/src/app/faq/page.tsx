"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Sparkles, MessageCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "general",
    question: "What is MediGo?",
    answer: "MediGo is a premium telemedicine platform that connects patients with licensed obesity medicine specialists. We specialize in providing doctor-led GLP-1 weight management programs, complete with AI health profiling, clinical diagnostics, and ongoing pharmacy coordination.",
  },
  {
    category: "general",
    question: "How does the virtual assessment work?",
    answer: "Our AI-powered health assessment collects your metrics (height, weight, age), lifestyle details, and clinical history to determine your preliminary suitability for GLP-1 therapy. A board-certified physician then reviews this profile within 24 hours to design your customized prescription pathway.",
  },
  {
    category: "medications",
    question: "What GLP-1 medications do you offer?",
    answer: "Our pharmacy network supports brand-name GLP-1 receptor agonists, including Wegovy (semaglutide), Ozempic (semaglutide), and Mounjaro (tirzepatide), as well as compounding alternatives based on clinical necessity, drug shortages, and insurance coverages.",
  },
  {
    category: "medications",
    question: "Are these medications FDA-approved?",
    answer: "Yes, Wegovy, Ozempic, and Mounjaro are fully FDA-approved therapies. Wegovy is explicitly approved for chronic weight management in adults with obesity or overweight conditions, while Ozempic and Mounjaro are approved for Type 2 Diabetes treatment and are sometimes prescribed off-label by clinicians based on clinical evaluations.",
  },
  {
    category: "medications",
    question: "How is the medication shipped?",
    answer: "Medications are dispatched directly from our accredited pharmacy partners in state-of-the-art temperature-controlled cold packs via overnight shipping, ensuring the GLP-1 proteins remain active and stable during transit.",
  },
  {
    category: "pricing",
    question: "How much does the program cost?",
    answer: "We offer three monthly plans: Starter (₹149/mo), Premium (₹299/mo), and Elite (₹499/mo). All plans include virtual physician check-ins, portal access, and clinical support. GLP-1 medications are shipped directly and are included in the Premium and Elite subscription costs.",
  },
  {
    category: "pricing",
    question: "Can I use my insurance?",
    answer: "Yes, our team works with major insurance plans to help secure coverage for your GLP-1 prescription. If covered, your out-of-pocket costs at local pharmacies can decrease substantially. Consultations and platform access fees are subscription-based.",
  },
  {
    category: "pricing",
    question: "Is there a cancellation fee?",
    answer: "No, all subscription agreements are month-to-month. You can cancel or pause your program at any time directly through your dashboard with no cancellation fees, contracts, or hidden terms.",
  },
  {
    category: "treatment",
    question: "What are the common side effects of GLP-1s?",
    answer: "Common side effects include mild nausea, diarrhea, vomiting, constipation, and abdominal discomfort. These side effects are typically transient, mild-to-moderate, and fade over the first few weeks as the dosage is gradually adjusted.",
  },
  {
    category: "treatment",
    question: "Do I need to do blood work?",
    answer: "In most cases, yes. A baseline metabolic panel (including HbA1c, lipids, thyroid markers, renal function) is required within the last 3-6 months. If you don't have recent tests, your MediGo doctor can order Quest Diagnostics or Labcorp tests near you.",
  },
  {
    category: "privacy",
    question: "Is my personal data secure?",
    answer: "Absolutely. MediGo operates a fully HIPAA-compliant portal. Your medical records, chat history, and diagnostic data are secured using industry-standard AES 256-bit encryption.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General & Platform" },
  { id: "medications", label: "Medications & Delivery" },
  { id: "pricing", label: "Pricing & Insurance" },
  { id: "treatment", label: "Treatment & Health" },
  { id: "privacy", label: "Privacy & HIPAA" },
];

function FAQAccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden hover:border-primary/20 transition-all duration-200">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-heading font-bold text-text-primary text-base md:text-lg pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] border-t border-border-light bg-primary-50/10" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="p-6 text-text-secondary leading-relaxed text-sm md:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            Knowledge Base
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Find answers to commonly asked questions regarding GLP-1 weight management, platform subscriptions, and pharmacy distribution.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-4">
            <div className="absolute inset-y-0 left-4 top-4 flex items-center pointer-events-none text-text-tertiary">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search questions, medications, side effects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null);
              }}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-white text-text-primary text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 container-custom max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Categories Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-sm font-bold text-text-tertiary uppercase tracking-wider px-3 mb-4">
              Categories
            </h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-3 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2.5 rounded-full lg:rounded-xl text-sm font-semibold text-left transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-primary-100 text-primary-700"
                      : "text-text-secondary hover:bg-white border border-transparent hover:border-border/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="lg:col-span-8 space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <FAQAccordionItem
                  key={faq.question}
                  item={faq}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-border/40 space-y-4">
                <HelpCircle className="w-12 h-12 text-text-tertiary mx-auto" />
                <h4 className="font-heading font-bold text-lg text-text-primary">
                  No matches found
                </h4>
                <p className="text-text-secondary text-sm max-w-sm mx-auto">
                  We couldn&apos;t find any FAQs matching &ldquo;{searchQuery}&rdquo;. Try using different terms or browse by category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Help */}
      <section className="bg-white border-t border-border/40 py-16 text-center">
        <div className="container-custom space-y-4 max-w-xl mx-auto">
          <h3 className="text-xl font-heading font-bold text-text-primary">
            Still Have Questions?
          </h3>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Our medical coordination team is available to help resolve any concerns regarding program access or prescriptions.
          </p>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-cta text-white font-semibold text-sm shadow-glow"
            >
              Contact support coordinator
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
