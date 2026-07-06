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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const items = [
    {
      label: "Switch to Patient Role",
      desc: "Simulate patient experience dashboard",
      icon: <Clock className="w-4 h-4 text-emerald-500" />,
      action: () => {
        setRole("Patient");
        setIsOpen(false);
      },
    },
    {
      label: "Switch to Doctor Role",
      desc: "Simulate doctor queue, clinic notes and prescriptions",
      icon: <Stethoscope className="w-4 h-4 text-blue-500" />,
      action: () => {
        setRole("Doctor");
        setIsOpen(false);
      },
    },
    {
      label: "Switch to Admin Role",
      desc: "Simulate analytics, CMS editor & CRM pipelines",
      icon: <Shield className="w-4 h-4 text-purple-500" />,
      action: () => {
        setRole("Admin");
        setIsOpen(false);
      },
    },
    {
      label: "Go to Doctor Workspace",
      desc: "Open clinical clinic workspace",
      icon: <ArrowRight className="w-4 h-4 text-slate-500" />,
      action: () => {
        router.push("/doctor");
        setIsOpen(false);
      },
    },
    {
      label: "Go to Admin Portal",
      desc: "Open operations analytics hub",
      icon: <ArrowRight className="w-4 h-4 text-slate-500" />,
      action: () => {
        router.push("/admin");
        setIsOpen(false);
      },
    },
    {
      label: "Go to Pharmacy Terminal",
      desc: "Open compounding status queue",
      icon: <ArrowRight className="w-4 h-4 text-slate-500" />,
      action: () => {
        router.push("/pharmacy");
        setIsOpen(false);
      },
    },
    {
      label: "Go to Lab Partner Portal",
      desc: "Open lab reports matching queue",
      icon: <ArrowRight className="w-4 h-4 text-slate-500" />,
      action: () => {
        router.push("/lab");
        setIsOpen(false);
      },
    },
    {
      label: "Medical Disclaimer Guidelines",
      desc: "View corporate health regulations disclaimer",
      icon: <FileText className="w-4 h-4 text-red-500" />,
      action: () => {
        router.push("/disclaimer");
        setIsOpen(false);
      },
    },
  ];

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
