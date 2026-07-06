"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, UserCheck, Settings, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CompleteProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    timezone: "EST",
    insuranceProvider: "",
    policyNumber: "",
    wantsSmsAlerts: true,
    wantsEmailAlerts: true,
  });

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6 md:p-12">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-lg space-y-6">
        
        <div className="space-y-2 text-center">
          <h2 className="font-heading font-bold text-2xl text-text-primary">Complete Profile</h2>
          <p className="text-xs text-text-secondary">Enrich your clinical profile to optimize doctor check-ins.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          {/* Timezone */}
          <div className="space-y-1.5">
            <label htmlFor="complete-timezone-select" className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
              <Globe className="w-4.5 h-4.5 text-primary shrink-0" />
              Primary Timezone *
            </label>
            <select
              id="complete-timezone-select"
              value={profileData.timezone}
              onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none"
            >
              <option value="EST">Eastern Time (EST)</option>
              <option value="CST">Central Time (CST)</option>
              <option value="MST">Mountain Time (MST)</option>
              <option value="PST">Pacific Time (PST)</option>
            </select>
          </div>

          {/* Insurance Provider */}
          <div className="space-y-1.5">
            <label htmlFor="complete-insurance-input" className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
              Insurance Provider (Optional)
            </label>
            <input
              type="text"
              id="complete-insurance-input"
              value={profileData.insuranceProvider}
              onChange={(e) => setProfileData({ ...profileData, insuranceProvider: e.target.value })}
              placeholder="e.g. Aetna, BlueCross"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Policy Number */}
          <div className="space-y-1.5">
            <label htmlFor="complete-policy-input" className="text-sm font-semibold text-text-primary">
              Policy Number
            </label>
            <input
              type="text"
              id="complete-policy-input"
              value={profileData.policyNumber}
              onChange={(e) => setProfileData({ ...profileData, policyNumber: e.target.value })}
              placeholder="e.g. AB123456"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Alert checkboxes */}
          <div className="space-y-3 pt-2 border-t border-border-light">
            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-primary shrink-0" />
              Communication Settings
            </h4>

            <label htmlFor="complete-sms-check" className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                id="complete-sms-check"
                type="checkbox"
                checked={profileData.wantsSmsAlerts}
                onChange={(e) => setProfileData({ ...profileData, wantsSmsAlerts: e.target.checked })}
                className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
              />
              <span className="text-xs font-semibold text-text-secondary leading-relaxed">
                Receive SMS check-in alerts (titration alerts, shipping notices).
              </span>
            </label>

            <label htmlFor="complete-email-check" className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                id="complete-email-check"
                type="checkbox"
                checked={profileData.wantsEmailAlerts}
                onChange={(e) => setProfileData({ ...profileData, wantsEmailAlerts: e.target.checked })}
                className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
              />
              <span className="text-xs font-semibold text-text-secondary leading-relaxed">
                Receive email summary invoices and diagnostic logs.
              </span>
            </label>
          </div>

          <Button
            id="complete-profile-submit-btn"
            type="submit"
            isLoading={isSending}
            fullWidth
            className="py-3.5 text-sm font-bold gradient-cta text-white"
            rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
          >
            Save & Continue to Dashboard
          </Button>

        </form>

      </div>
    </div>
  );
}
