"use client";

import React, { useState } from "react";
import { useRole } from "@/features/shared/RoleProvider";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/Loader";
import { PharmacyPortal } from "@/features/pharmacy/PharmacyPortal";
import { NotificationCenter } from "@/features/shared/NotificationCenter";
import { Pill, Bell, LogOut, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function PharmacyDashboardPage() {
  const { currentRole, hasPermission } = useRole();
  const router = useRouter();
  const { show } = useToast();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Guard routing in client side
  React.useEffect(() => {
    if (!hasPermission(["Pharmacy", "Admin"])) {
      router.push("/unauthorized");
    }
  }, [currentRole, hasPermission, router]);

  if (!hasPermission(["Pharmacy", "Admin"])) {
    return <PageLoader text="Verifying clearance..." />;
  }

  const handleLogout = () => {
    show("Closing pharmacy portal session...", "info");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-left">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white p-4 select-none">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-sm sm:text-base tracking-tight">
              MediGo CVS Pharmacy Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white relative transition-colors"
              title="Open Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-xs font-semibold text-error hover:bg-primary hover:text-white transition-all text-left focus:outline-none"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>

            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-slate-950 font-bold text-xs shadow">
              PH
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <h2 className="font-heading text-xl font-bold text-text-primary">
            Prescription Compounding Terminal
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Clear incoming medical records and compounding requests.
          </p>
        </div>

        <PharmacyPortal />
      </main>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
}
