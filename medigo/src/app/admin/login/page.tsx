"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useRole } from "@/features/shared/RoleProvider";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const { show } = useToast();
  
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode !== "admin123") {
      show("Invalid administration passcode credentials.", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRole("Admin");
      sessionStorage.setItem("admin_authenticated", "true");
      show("Access granted. Loading Super Admin console...", "success");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Glow Backdrops */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-sm w-full bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 text-center text-white text-xs">
        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mx-auto shadow-glow">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-1.5 text-left">
          <h2 className="font-heading text-lg font-black tracking-tight text-center text-white">Admin Clearance Portal</h2>
          <p className="text-xs text-white/60 leading-relaxed text-center">
            Restricted access portal for MediGo Super Administrators. Enter authentication passcode to decrypt system modules.
          </p>
          <div className="text-center mt-2 select-none">
            <span className="inline-block bg-white/10 text-primary px-2.5 py-0.5 rounded text-[9px] font-mono font-bold">
              Passcode: admin123
            </span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label htmlFor="admin-login-pass" className="text-[10px] font-bold text-white/50 uppercase select-none">Access Passcode</label>
            <div className="relative">
              <input
                id="admin-login-pass"
                type={showPassword ? "text" : "password"}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode credentials"
                className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all text-center"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-white/40 hover:text-white/70"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            fullWidth
            className="py-3.5 text-xs font-bold"
          >
            Authorize Access
          </Button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center select-none">
          <Link href="/" className="text-white/40 hover:text-white/70 font-semibold hover:underline">
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
