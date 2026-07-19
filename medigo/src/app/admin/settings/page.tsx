"use client";

import React, { useState } from "react";
import { Settings, Bell, Lock, Globe, KeyRound, LogOut, ShieldAlert, ArrowLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const { show } = useToast();
  const router = useRouter();
  
  // Settings States
  const [darkMode, setDarkMode] = useState(false);

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

  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
    
    setIsChangingPassword(true);
    try {
      await api.post('/api/v1/auth/change-password', {
        oldPassword,
        newPassword
      });
      show("Password changed successfully.", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      show(err.message || "Failed to change password. Please check your current password.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    show("Closing administrative session...", "info");
    sessionStorage.removeItem("admin_authenticated");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-5xl mx-auto">

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Portal Language</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-secondary text-xs cursor-not-allowed select-none">
                      English (Locked)
                    </div>
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
                          !darkMode ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-border text-text-secondary hover:text-text-primary"
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
                          darkMode ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-border text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications Setup */}
                <div className="pt-6 space-y-3">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none mb-3">Alert Preferences</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label htmlFor="settings-audit-check" className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
                      <div className="pr-4">
                        <span className="text-xs font-bold text-text-primary block">Licensing Audit Alerts</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5 leading-relaxed">Notify when State Licensing check fails for practitioners.</span>
                      </div>
                      <input
                        id="settings-audit-check"
                        type="checkbox"
                        checked={alertAudit}
                        onChange={(e) => setAlertAudit(e.target.checked)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </label>

                    <label htmlFor="settings-reg-check" className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
                      <div className="pr-4">
                        <span className="text-xs font-bold text-text-primary block">Registration Updates</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5 leading-relaxed">Notify immediately when new practitioners apply to join.</span>
                      </div>
                      <input
                        id="settings-reg-check"
                        type="checkbox"
                        checked={alertRegistration}
                        onChange={(e) => setAlertRegistration(e.target.checked)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Security Configs */}
                <div className="pt-6 space-y-3">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none mb-3">EHR Security Clearance</span>

                  <label htmlFor="settings-2fa-clearance" className="flex items-center justify-between p-4 bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors shadow-sm">
                    <div className="pr-4">
                      <span className="text-xs font-bold text-white block">Require Two-Factor (2FA)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-relaxed">Mandate authenticator codes at login for administrative roles.</span>
                    </div>
                    <input
                      id="settings-2fa-clearance"
                      type="checkbox"
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/20 cursor-pointer"
                    />
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

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label htmlFor="old-pass" className="text-xs font-bold text-text-secondary uppercase">Current Password</label>
                  <input
                    id="old-pass"
                    type="password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="new-pass" className="text-xs font-bold text-text-secondary uppercase">New Password</label>
                  <input
                    id="new-pass"
                    type="password"
                    placeholder="Create new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="confirm-pass" className="text-xs font-bold text-text-secondary uppercase">Confirm New Password</label>
                  <input
                    id="confirm-pass"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border-light">
                <Button type="submit" size="sm" className="font-bold" disabled={isChangingPassword}>
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Danger actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="lg" className="space-y-6 flex flex-col items-center text-center bg-gradient-to-b from-white to-slate-50">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-black text-text-primary">
                Active Session
              </h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                You are currently logged in with Super Administrator privileges. Closing your session will require re-authentication.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-sm font-bold border border-red-200 flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none group shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out of Console
            </button>
          </Card>
        </div>

      </div>
    </div>
  );
}
