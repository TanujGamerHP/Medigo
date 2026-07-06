"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useRole } from "@/features/shared/RoleProvider";

export default function UnauthorizedPage() {
  const { currentRole } = useRole();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-border rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            Access Verification Failed
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Your simulated clearance role (<span className="font-bold text-slate-800">{currentRole}</span>) does not have credentials to view this system route.
          </p>
        </div>

        <div className="bg-slate-50 border border-border-light p-4 rounded-xl text-xs text-text-tertiary leading-relaxed text-left">
          <strong>HIPAA Access Guard Policy:</strong> Direct URL overrides are blocked. To inspect this screen under a different permission scope, toggle the simulator widget in the bottom-right corner.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 border-t border-border pt-4">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-border rounded-xl text-xs font-bold text-text-primary hover:bg-slate-50 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={() => {
              window.history.back();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
