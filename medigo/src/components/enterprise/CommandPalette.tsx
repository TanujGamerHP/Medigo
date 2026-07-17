"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Stethoscope, Shield, Settings, FileText, ArrowRight, X, Clock } from "lucide-react";
import { useRole } from "@/features/shared/RoleProvider";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { setRole } = useRole();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle Command Palette on Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    const handleCustomOpen = () => setIsOpen(true);
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearch("");
    }
  }, [isOpen]);

  const { currentRole } = useRole();

  const getRoleItems = () => {
    if (currentRole === "Patient") {
      return [
        { label: "Dashboard", desc: "Go to Dashboard", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard"); setIsOpen(false); } },
        { label: "Appointments", desc: "Go to Appointments", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/appointments"); setIsOpen(false); } },
        { label: "Assessments", desc: "Go to Assessments", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/assessments"); setIsOpen(false); } },
        { label: "Prescriptions", desc: "Go to Prescriptions", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/prescriptions"); setIsOpen(false); } },
        { label: "Membership", desc: "Go to Membership", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/membership"); setIsOpen(false); } },
        { label: "Orders", desc: "Go to Orders", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/orders"); setIsOpen(false); } },
        { label: "Notifications", desc: "Go to Notifications", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/notifications"); setIsOpen(false); } },
        { label: "Profile", desc: "Go to Profile", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/profile"); setIsOpen(false); } },
        { label: "Settings", desc: "Go to Settings", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/dashboard/settings"); setIsOpen(false); } },
      ];
    }
    
    if (currentRole === "Doctor") {
      return [
        { label: "Dashboard", desc: "Go to Dashboard", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/dashboard"); setIsOpen(false); } },
        { label: "Appointments", desc: "Go to Appointments", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/appointments"); setIsOpen(false); } },
        { label: "Patients", desc: "Go to Patients", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/patients"); setIsOpen(false); } },
        { label: "Assessments", desc: "Go to Assessments", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/assessments"); setIsOpen(false); } },
        { label: "Prescriptions", desc: "Go to Prescriptions", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/prescriptions"); setIsOpen(false); } },
        { label: "Availability", desc: "Go to Availability", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/availability"); setIsOpen(false); } },
        { label: "Notifications", desc: "Go to Notifications", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/notifications"); setIsOpen(false); } },
        { label: "Profile", desc: "Go to Profile", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/profile"); setIsOpen(false); } },
        { label: "Settings", desc: "Go to Settings", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/doctor/settings"); setIsOpen(false); } },
      ];
    }
    
    if (currentRole === "Admin") {
      return [
        { label: "Dashboard", desc: "Go to Dashboard", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/dashboard"); setIsOpen(false); } },
        { label: "Doctors", desc: "Go to Doctors", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/doctors"); setIsOpen(false); } },
        { label: "Patients", desc: "Go to Patients", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/patients"); setIsOpen(false); } },
        { label: "Operations", desc: "Go to Operations", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/operations"); setIsOpen(false); } },
        { label: "Finance", desc: "Go to Finance", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/finance"); setIsOpen(false); } },
        { label: "Reports", desc: "Go to Reports", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/reports"); setIsOpen(false); } },
        { label: "Security", desc: "Go to Security", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/security"); setIsOpen(false); } },
        { label: "Settings", desc: "Go to Settings", icon: <ArrowRight className="w-4 h-4 text-slate-500" />, action: () => { router.push("/admin/settings"); setIsOpen(false); } },
      ];
    }

    return [];
  };

  const items = getRoleItems();

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900]" onClick={() => setIsOpen(false)} />

      {/* Command Palette Modal */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white border border-border rounded-2xl shadow-2xl z-[950] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Search bar */}
        <div className="flex items-center border-b border-border px-4 py-3 bg-slate-50">
          <Search className="text-text-tertiary w-5 h-5 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search panels, roles, configurations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-text-primary placeholder-text-tertiary font-medium"
          />
          <span className="text-[10px] bg-slate-200 border border-slate-300 text-text-secondary px-1.5 py-0.5 rounded font-mono font-bold select-none mr-2">
            ESC
          </span>
          <button onClick={() => setIsOpen(false)} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto p-2 divide-y divide-slate-50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-text-tertiary text-xs">
              No actions found matching search queries.
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group border border-transparent hover:border-border-light"
              >
                <span className="mt-1 flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 border-t border-border p-3 flex items-center justify-between text-[10px] text-text-tertiary select-none">
          <span className="flex items-center gap-1 font-medium">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 border border-slate-300 bg-white rounded font-sans font-bold">Ctrl + K</kbd>
            <span>or</span>
            <kbd className="px-1.5 py-0.5 border border-slate-300 bg-white rounded font-sans font-bold">Cmd + K</kbd>
            <span>globally to toggle menu.</span>
          </span>
          <span className="font-semibold text-primary">MediGo Admin Shell</span>
        </div>
      </div>
    </>
  );
}
