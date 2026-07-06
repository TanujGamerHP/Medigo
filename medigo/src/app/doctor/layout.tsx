"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/features/shared/RoleProvider";
import { PageLoader } from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Pill, 
  Clock, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Stethoscope,
  Search
} from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/doctor/appointments", icon: Calendar },
  { label: "Patients", href: "/doctor/patients", icon: Users },
  { label: "Assessments", href: "/doctor/assessments", icon: FileText },
  { label: "Prescriptions", href: "/doctor/prescriptions", icon: Pill },
  { label: "Availability", href: "/doctor/availability", icon: Clock },
  { label: "Notifications", href: "/doctor/notifications", icon: Bell },
  { label: "Profile", href: "/doctor/profile", icon: User },
  { label: "Settings", href: "/doctor/settings", icon: Settings },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, hasPermission, user } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const { show } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Guard view immediately in client side if role lacks scope
  useEffect(() => {
    if (!hasPermission(["Doctor", "Admin"])) {
      router.push("/unauthorized");
    }
  }, [currentRole, hasPermission, router]);

  const handleLogout = () => {
    show("Logging out of clinic portal...", "info");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const isActive = (href: string) => {
    if (href === "/doctor/dashboard") {
      return pathname === "/doctor/dashboard";
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

  if (!hasPermission(["Doctor", "Admin"])) {
    return <PageLoader text="Verifying clinical credentials..." />;
  }

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
            <Stethoscope className="w-6 h-6 text-primary" />
            <span className="text-xl font-heading font-bold text-text-primary">
              MediGo <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold ml-1">Clinic</span>
            </span>
          </Link>
          <div className="hidden sm:block ml-4 border-l border-border pl-4">
            <BackButton variant="ghost" size="sm" className="text-text-secondary" />
          </div>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:flex items-center relative w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
          <input
            type="search"
            placeholder="Search patient, prescriptions..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/doctor/notifications"
            className="relative p-2 rounded-xl hover:bg-slate-50 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface animate-pulse" />
          </Link>

          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary font-heading font-extrabold text-xs flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
              {user?.doctor?.profileImage ? (
                <img src={user.doctor.profileImage} alt={user.doctor.firstName} className="w-full h-full object-cover" />
              ) : (
                (user?.doctor?.firstName?.[0] || "") + (user?.doctor?.lastName?.[0] || "") || "DR"
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-text-primary leading-none">Dr. {user?.doctor?.firstName} {user?.doctor?.lastName}</p>
              <p className="text-[10px] text-text-secondary mt-1 leading-none">{user?.doctor?.specialization || "General"}</p>
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
          href="/doctor/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname === "/doctor/dashboard" ? "text-primary" : "text-text-secondary"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/doctor/appointments"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/doctor/appointments") ? "text-primary" : "text-text-secondary"
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Schedule</span>
        </Link>
        <Link
          href="/doctor/patients"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/doctor/patients") ? "text-primary" : "text-text-secondary"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Patients</span>
        </Link>
        <Link
          href="/doctor/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/doctor/profile") ? "text-primary" : "text-text-secondary"
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
