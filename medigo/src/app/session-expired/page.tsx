"use client";

import React, { useState } from "react";
import { useRole } from "@/features/shared/RoleProvider";
import { KeyRound, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SessionExpiredPage() {
  const { resetSession, currentRole } = useRole();
  const { addToast } = useToast();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReauth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      resetSession();
      addToast({
        type: "success",
        message: "Simulated token refreshed. Active session restored.",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-border rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            Session Expired
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            For security compliance (HIPAA token timeout), your active session for <span className="font-bold text-slate-800">{currentRole}</span> was suspended due to inactivity.
          </p>
        </div>

        <form onSubmit={handleReauth} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1.5 select-none">
              Confirm Credentials (Simulated Re-auth)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type any password to unlock..."
              className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            {isSubmitting ? "Unlocking Session..." : "Restore Active Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
