"use client";

import React, { useState } from "react";
import { ShieldCheck, User, Bell, Lock, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ProfileSettingsTab() {
  const [profile, setProfile] = useState({
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    phone: "(555) 234-5678",
    language: "English",
    twoFactor: true,
    hipaaAgreement: true,
    alertTitration: true,
    alertShipping: true,
  });

  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-3xl border border-border/50 shadow-sm">
      
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <User className="w-5 h-5 text-primary shrink-0" />
        <h3 className="font-heading font-bold text-lg text-text-primary">Profile Parameters & Settings</h3>
      </div>

      {/* Profile inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="space-y-1.5">
          <label htmlFor="settings-name-input" className="text-xs font-bold text-text-secondary uppercase">Full Name</label>
          <input
            id="settings-name-input"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settings-email-input" className="text-xs font-bold text-text-secondary uppercase">Email Address</label>
          <input
            id="settings-email-input"
            type="email"
            value={profile.email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 text-text-secondary text-xs cursor-not-allowed focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settings-phone-input" className="text-xs font-bold text-text-secondary uppercase">Phone Number</label>
          <input
            id="settings-phone-input"
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-text-secondary uppercase flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
            Language
          </span>
          <p className="text-sm font-semibold text-text-primary px-1 pt-1">English</p>
        </div>

      </div>

      {/* HIPAA & Security settings */}
      <div className="border-t border-border-light pt-6 space-y-4">
        
        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-primary shrink-0" />
          HIPAA & Platform Security
        </h4>

        <div className="space-y-3 text-xs text-text-secondary">
          
          <label htmlFor="settings-hipaa-check" className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              id="settings-hipaa-check"
              type="checkbox"
              checked={profile.hipaaAgreement}
              onChange={(e) => setProfile({ ...profile, hipaaAgreement: e.target.checked })}
              className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
            />
            <span className="font-semibold text-text-secondary">
              Encrypt medical history logs and diagnostic titration notes under HIPAA compliance rules.
            </span>
          </label>

          <label htmlFor="settings-2fa-check" className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              id="settings-2fa-check"
              type="checkbox"
              checked={profile.twoFactor}
              onChange={(e) => setProfile({ ...profile, twoFactor: e.target.checked })}
              className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
            />
            <span className="font-semibold text-text-secondary">
              Enable two-factor authentication (2FA) for secure logins via SMS codes.
            </span>
          </label>

        </div>

      </div>

      {/* Alerts */}
      <div className="border-t border-border-light pt-6 space-y-4">
        
        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-primary shrink-0" />
          Intake & Shipping Alerts
        </h4>

        <div className="space-y-3 text-xs text-text-secondary">
          
          <label htmlFor="settings-titration-check" className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              id="settings-titration-check"
              type="checkbox"
              checked={profile.alertTitration}
              onChange={(e) => setProfile({ ...profile, alertTitration: e.target.checked })}
              className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
            />
            <span className="font-semibold text-text-secondary">
              Titration schedules notification (weekly dosage prompts).
            </span>
          </label>

          <label htmlFor="settings-shipping-check" className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              id="settings-shipping-check"
              type="checkbox"
              checked={profile.alertShipping}
              onChange={(e) => setProfile({ ...profile, alertShipping: e.target.checked })}
              className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
            />
            <span className="font-semibold text-text-secondary">
              Refills dispatch alerts (temperature-controlled courier shipping updates).
            </span>
          </label>

        </div>

      </div>

      <div className="border-t border-border-light pt-6 flex justify-between items-center gap-4">
        {success && (
          <div className="flex gap-1.5 items-center text-xs text-success font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Saved!
          </div>
        )}

        <Button
          id="settings-save-btn"
          type="submit"
          className="py-2.5 px-6 text-xs font-bold gradient-cta text-white ml-auto"
        >
          Save Settings
        </Button>
      </div>

    </form>
  );
}
