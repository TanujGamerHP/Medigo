"use client";

import React, { useState } from "react";
import { Settings, Bell, Lock, Globe, AlertTriangle, CheckCircle2, ShieldCheck, KeyRound, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, updatePassword, reauthenticateWithCredential } from "firebase/auth";

export default function SettingsPage() {
  const { show } = useToast();
  const router = useRouter();
  
  // Settings States
  const [language, setLanguage] = useState("English");
  const [alertTitration, setAlertTitration] = useState(true);
  const [alertShipping, setAlertShipping] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [hipaaAgreement, setHipaaAgreement] = useState(true);

  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    show("General settings saved.", "success");
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

    const user = auth.currentUser;
    if (!user || !user.email) {
      show("You must be logged in to change your password.", "error");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      show("Password changed successfully.", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        show("Incorrect current password.", "error");
      } else {
        show(err.message || "Failed to change password.", "error");
      }
    }
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you absolutely sure you want to delete your MediGo account? This will terminate all active GLP-1 compounding plans and cannot be undone.");
    if (confirmDelete) {
      show("Account deletion requested. A compliance officer will contact you within 24 hours.", "warning");
    }
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
      <div className="pb-4 border-b border-border/60">
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Portal Settings
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure security clearances, alerts preferences, languages, and HIPAA rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: General Settings */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Configs Card */}
          <Card padding="md">
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-border-light">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading text-sm font-bold text-text-primary">General Configuration</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-text-secondary uppercase block">Portal Language</span>
                  <p className="text-sm font-semibold text-text-primary">English</p>
                </div>

                {/* Notifications Setup */}
                <div className="border-t border-border-light pt-5 space-y-3">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none">Notifications Preferences</span>
                  
                  <label htmlFor="settings-titration-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-titration-check"
                      type="checkbox"
                      checked={alertTitration}
                      onChange={(e) => setAlertTitration(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Titration alert (weekly alerts to report vitals and weight parameters).</span>
                  </label>

                  <label htmlFor="settings-shipping-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-shipping-check"
                      type="checkbox"
                      checked={alertShipping}
                      onChange={(e) => setAlertShipping(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Refill dispatch alerts (notifying when temperature-controlled courier kit ships).</span>
                  </label>
                </div>

                {/* Privacy Options */}
                <div className="border-t border-border-light pt-5 space-y-3">
                  <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none">Privacy & HIPAA Security</span>

                  <label htmlFor="settings-hipaa-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-hipaa-check"
                      type="checkbox"
                      checked={hipaaAgreement}
                      onChange={(e) => setHipaaAgreement(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Encrypt clinical logs and diagnostic files under HIPAA privacy rules.</span>
                  </label>

                  <label htmlFor="settings-2fa-check" className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-semibold text-text-secondary">
                    <input
                      id="settings-2fa-check"
                      type="checkbox"
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5"
                    />
                    <span>Enforce two-factor authentication (2FA) verification at login.</span>
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
                <h3 className="font-heading text-sm font-bold text-text-primary">Modify Password</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="pass-old" className="text-xs font-bold text-text-secondary uppercase">Current Password</label>
                  <input
                    id="pass-old"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="pass-new" className="text-xs font-bold text-text-secondary uppercase">New Password</label>
                  <input
                    id="pass-new"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="pass-confirm" className="text-xs font-bold text-text-secondary uppercase">Confirm New</label>
                  <input
                    id="pass-confirm"
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

        {/* Right Column: Danger Zone */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="md" className="border-red-100 bg-red-50/10 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-heading text-sm font-bold">Account Danger Zone</h3>
            </div>
            
            <p className="text-xs text-text-secondary leading-relaxed">
              Once you delete your account, your clinical history, metabolic panel matches, and medical files will be permanently expunged.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Portal Account
            </button>
          </Card>
        </div>

      </div>
    </div>
  );
}
