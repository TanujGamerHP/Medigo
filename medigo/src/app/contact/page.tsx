"use client";

import React, { useState } from "react";
import { Mail, Phone, Clock, Send, MessageSquare, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    // Mock API delay
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "general", message: "" });
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            24/7 Dedicated Support
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary">
            Contact <span className="gradient-text">MediGo Support</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Have questions about clinical eligibility, pricing, or prescription shipping? Our support team is here to assist.
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-16 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-text-primary">
                Reach Out Directly
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Connect with our patient experience team or find clinical support numbers for emergencies.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border/60">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm">General & Support Email</h4>
                  <p className="text-text-secondary text-sm mt-1">support@medigo.com</p>
                  <p className="text-text-tertiary text-xs mt-0.5">Average reply time: Under 2 hours</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border/60">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm">Patient Care Line</h4>
                  <p className="text-text-secondary text-sm mt-1">+1 (800) 555-0199</p>
                  <p className="text-text-tertiary text-xs mt-0.5">Mon–Fri: 8am–8pm EST</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border/60">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm">Clinical Hours</h4>
                  <p className="text-text-secondary text-sm mt-1">Chat available 24/7 inside the portal</p>
                  <p className="text-text-tertiary text-xs mt-0.5">Emergency clinician paging is active 24/7</p>
                </div>
              </div>
            </div>

            {/* Medical Disclaimer Card */}
            <div className="p-5 rounded-2xl bg-red-50/50 border border-error-200 text-error-800 flex gap-4">
              <ShieldAlert className="w-6 h-6 text-error shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-text-primary">Emergency Notice</h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  If you are experiencing a medical emergency, please call 911 immediately or visit the nearest emergency room. MediGo support is not an emergency triage line.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-md">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-text-primary">
                  Message Sent Successfully!
                </h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  Thank you for contacting MediGo. A patient coordinator will review your request and reply to you via email shortly.
                </p>
                <div className="pt-4">
                  <Button
                    id="contact-reset-btn"
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-bold text-text-primary">
                    Send a Message
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Fill out the form below and our patient care team will get back to you right away.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name-input" className="text-sm font-semibold text-text-primary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name-input"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Miller"
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                        errors.name ? "border-error" : "border-border"
                      }`}
                    />
                    {errors.name && <p className="text-xs text-error">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email-input" className="text-sm font-semibold text-text-primary">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sarah@example.com"
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                        errors.email ? "border-error" : "border-border"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="phone-input" className="text-sm font-semibold text-text-primary">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone-input"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject-select" className="text-sm font-semibold text-text-primary">
                      Subject
                    </label>
                    <select
                      id="subject-select"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="eligibility">Clinical Eligibility</option>
                      <option value="pricing">Billing & Subscriptions</option>
                      <option value="shipping">Prescription Shipping</option>
                      <option value="technical">Portal Access Support</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message-input" className="text-sm font-semibold text-text-primary">
                    Message *
                  </label>
                  <textarea
                    id="message-input"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe how we can help you..."
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${
                      errors.message ? "border-error" : "border-border"
                    }`}
                  />
                  {errors.message && <p className="text-xs text-error">{errors.message}</p>}
                </div>

                <Button
                  id="contact-submit-btn"
                  type="submit"
                  isLoading={isSending}
                  fullWidth
                  className="py-3 text-sm font-bold gradient-cta text-white"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
