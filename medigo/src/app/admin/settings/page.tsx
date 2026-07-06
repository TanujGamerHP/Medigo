"use client";

import React, { useState } from "react";
import { Settings, Bell, Lock, Globe, KeyRound, LogOut, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const { show } = useToast();
  const router = useRouter();
  
  // Settings States
  const [language, setLanguage] = useState("English");
  const [alertAudit, setAlertAudit] = useState(true);
  const [alertRegistration, setAlertRegistration] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    show("Platform configuration settings saved successfully.", "success");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      show("Please fill out all password fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      show("Passwords do not match.", "error");
      return;
    }
    show("Password changed successfully.", "success");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    show("Closing administrative session...", "info");
    sessionStorage.removeItem("admin_authenticated");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back
      </button>

      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Platform Admin Settings
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure security authorization credentials, alert preferences, and language templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-border-light">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading text-sm font-bold text-text-primary">Platform Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="set-lang" className="text-xs font-bold text-text-secondary uppercase">Portal Language</label>
                  <select
                    id="set-lang"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                  </select>
                </div>

                {/* Notifications Setup */}
                <div className="border-t border-border-light pt-5 space-y-3">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none">Alert Preferences</span>
                  
                  <label htmlFor="settings-audit-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-audit-check"
                      type="checkbox"
                      checked={alertAudit}
                      onChange={(e) => setAlertAudit(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Audit alert (notify when State Licensing check fails).</span>
                  </label>

                  <label htmlFor="settings-reg-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-reg-check"
                      type="checkbox"
                      checked={alertRegistration}
                      onChange={(e) => setAlertRegistration(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Registration updates (notify when new practitioners apply).</span>
                  </label>
                </div>

                {/* Security Configs */}
                <div className="border-t border-border-light pt-5 space-y-3">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none">EHR Security Clearance</span>

                  <label htmlFor="settings-2fa-clearance" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-2fa-clearance"
                      type="checkbox"
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Require two-factor authenticator (2FA) codes at login.</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border-light">
                <Button type="submit" size="sm" className="font-bold">
                  Save Settings
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card padding="md">
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border-light">
                <KeyRound className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading text-sm font-bold text-text-primary">Update Secure Password</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="old-pass" className="text-xs font-bold text-text-secondary uppercase">Current Password</label>
                  <input
                    id="old-pass"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="new-pass" className="text-xs font-bold text-text-secondary uppercase">New Password</label>
                  <input
                    id="new-pass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="confirm-pass" className="text-xs font-bold text-text-secondary uppercase">Confirm New</label>
                  <input
                    id="confirm-pass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border-light">
                <Button type="submit" size="sm" className="font-bold">
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Danger actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="md" className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
              Admin Session
            </h3>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-50 hover:bg-primary text-red-600 hover:text-white rounded-xl text-xs font-bold border border-red-200 hover:border-primary flex items-center justify-center gap-1.5 transition-all duration-300 focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of Console
            </button>
          </Card>
        </div>

      </div>
    </div>
  );
}
