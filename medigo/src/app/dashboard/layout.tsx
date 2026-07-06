"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Pill, 
  CreditCard, 
  ShoppingBag, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Stethoscope
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { BackButton } from "@/components/ui/BackButton";
import { useRole } from "@/features/shared/RoleProvider";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { label: "Assessments", href: "/dashboard/assessments", icon: FileText },
  { label: "Prescriptions", href: "/dashboard/prescriptions", icon: Pill },
  { label: "Membership", href: "/dashboard/membership", icon: CreditCard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { show } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useRole();
  
  const patient = user?.patient || {};
  const name = patient.firstName ? `${patient.firstName} ${patient.lastName}` : "Patient";
  const initials = patient.firstName ? `${patient.firstName[0]}${patient.lastName ? patient.lastName[0] : ''}`.toUpperCase() : "P";

  const handleLogout = () => {
    show("Logging out of your account...", "info");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="bg-background min-h-screen flex flex-col pt-16">
      
      {/* Top Header */}
      <header className="bg-surface border-b border-border/80 h-16 flex items-center justify-between px-6 z-40 fixed top-0 left-0 right-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen((o) => !o)}
            className="p-2 rounded-xl hover:bg-slate-50 text-text-secondary xl:hidden focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2 select-none">
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            <span className="text-xl font-heading font-bold text-text-primary">
              MediGo
            </span>
          </Link>
          <div className="hidden sm:block ml-4 border-l border-border pl-4">
            <BackButton variant="ghost" size="sm" className="text-text-secondary" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/notifications"
            className="relative p-2 rounded-xl hover:bg-slate-50 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface animate-pulse" />
          </Link>

          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary font-heading font-extrabold text-xs flex items-center justify-center shadow-inner shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-text-primary leading-none">{name}</p>
              <p className="text-[10px] text-text-secondary mt-1 leading-none">Standard Care</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace container */}
      <div className="flex flex-1 relative">
        
        {/* Desktop Sidebar */}
        <aside className="hidden xl:flex bg-surface border-r border-border/80 w-[280px] flex-col justify-between fixed bottom-0 top-16 left-0 z-30">
          <nav className="p-5 space-y-1.5 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-button text-xs font-semibold transition-all ${
                    active
                      ? "bg-slate-100 text-primary border-l-4 border-primary pl-3"
                      : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-5 border-t border-border/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-xs font-semibold text-error hover:bg-red-50/50 transition-all text-left focus:outline-none focus:ring-2 focus:ring-error/20"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile / Tablet Drawer Sidebar */}
        <aside
          className={`xl:hidden bg-surface border-r border-border/80 w-[280px] flex flex-col justify-between fixed bottom-0 top-16 left-0 z-30 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-5 space-y-1.5 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-button text-xs font-semibold transition-all ${
                    active
                      ? "bg-slate-100 text-primary border-l-4 border-primary pl-3"
                      : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-5 border-t border-border/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-xs font-semibold text-error hover:bg-primary hover:text-white transition-all text-left focus:outline-none"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Sidebar Backdrop Overlay on mobile/tablet */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs xl:hidden z-20"
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 xl:pl-[280px] p-6 sm:p-8 overflow-y-auto bg-background min-h-screen">
          <div className="max-w-7xl mx-auto w-full pb-20 xl:pb-0">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Mobile Only) */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border/80 h-16 flex items-center justify-around z-40 px-2 shadow-lg">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname === "/dashboard" ? "text-primary" : "text-text-secondary"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/dashboard/appointments"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/dashboard/appointments") ? "text-primary" : "text-text-secondary"
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Appointments</span>
        </Link>
        <Link
          href="/assessment"
          className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-text-secondary"
        >
          <div className="w-10 h-10 rounded-full gradient-cta text-white flex items-center justify-center shadow-glow -mt-5 border-4 border-surface">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="mt-1">Assessment</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/dashboard/profile") ? "text-primary" : "text-text-secondary"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-text-secondary focus:outline-none"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </nav>

    </div>
  );
}
