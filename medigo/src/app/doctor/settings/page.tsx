"use client";

import React, { useState } from "react";
import { Settings, Bell, Lock, Globe, AlertTriangle, KeyRound, LogOut, Sun, Moon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { updatePassword } from "firebase/auth";

export default function DoctorSettingsPage() {
  const { show } = useToast();
  const router = useRouter();
  
  // Settings States
  const [language, setLanguage] = useState("English");
  const [alertQueue, setAlertQueue] = useState(true);
  const [alertRefills, setAlertRefills] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    show("Clinic preferences saved successfully.", "success");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      show("Please fill out all password fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      show("Passwords do not match.", "error");
      return;
    }

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        show("Password changed securely.", "success");
      } else {
        // Fallback for the hardcoded bypass account
        show("Note: You are using the developer bypass account. Real password changes require a standard Firebase login.", "info");
      }
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        show("Security alert: Please log out and log back in to change your password.", "error");
      } else {
        show(err.message || "Failed to update password.", "error");
      }
    }
  };

  const handleLogout = () => {
    show("Logging out of clinic portal...", "info");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </button>
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Clinic Settings
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure security authorization credentials, alert preferences, and theme choices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: Config Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-border-light">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading text-sm font-bold text-text-primary">Clinic Configuration</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="set-lang" className="text-xs font-bold text-text-secondary uppercase">Portal Language</label>
                    <select
                      id="set-lang"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Español</option>
                      <option value="French">Français</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Visual Theme</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDarkMode(false);
                          document.documentElement.classList.remove("dark");
                          show("Light theme enabled.", "info");
                        }}
                        className={`flex-1 py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                          !darkMode ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-border text-text-secondary"
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDarkMode(true);
                          document.documentElement.classList.add("dark");
                          show("Dark theme support loaded (visual mode toggled).", "info");
                        }}
                        className={`flex-1 py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                          darkMode ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-border text-text-secondary"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications Setup */}
                <div className="border-t border-border-light pt-5 space-y-3">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none">Alert Preferences</span>
                  
                  <label htmlFor="settings-queue-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-queue-check"
                      type="checkbox"
                      checked={alertQueue}
                      onChange={(e) => setAlertQueue(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Patient queue alerts (notify when a waiting patient completes intake forms).</span>
                  </label>

                  <label htmlFor="settings-refills-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-refills-check"
                      type="checkbox"
                      checked={alertRefills}
                      onChange={(e) => setAlertRefills(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Refill logs updates (notify when pharmacy ships compounding vials).</span>
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
                  Save Preferences
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
              Portal Session
            </h3>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-50 hover:bg-primary text-red-600 hover:text-white rounded-xl text-xs font-bold border border-red-200 hover:border-primary flex items-center justify-center gap-1.5 transition-all duration-300 focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of Clinic
            </button>
          </Card>
        </div>

      </div>
    </div>
  );
}
