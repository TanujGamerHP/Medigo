"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/features/shared/RoleProvider";
import { PageLoader } from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2,
  Calendar, 
  CreditCard,
  CircleDollarSign,
  FileSpreadsheet, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Search,
  Lock,
  Eye,
  EyeOff,
  BarChart4,
  ShoppingBag,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "Doctors", href: "/admin/doctors", icon: UserSquare2 },
  { label: "Appointments", href: "/admin/appointments", icon: Calendar },
  { label: "Memberships", href: "/admin/memberships", icon: CreditCard },
  { label: "Payments", href: "/admin/payments", icon: CircleDollarSign },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Content Management", href: "/admin/content", icon: FileSpreadsheet },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Reports", href: "/admin/reports", icon: BarChart4 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, hasPermission } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const { show } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Secret Passcode Screen States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredItems = SIDEBAR_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync session authentication
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authState = sessionStorage.getItem("admin_authenticated");
      if (authState === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Guard view immediately in client side if role lacks scope
  useEffect(() => {
    if (!hasPermission(["Admin"])) {
      router.push("/unauthorized");
    }
  }, [currentRole, hasPermission, router]);

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    
    setTimeout(() => {
      setVerifying(false);
      // Hardcoded administrative access code
      if (passwordInput === "admin123") {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
        show("Secret passcode verified. Admin panel unlocked.", "success");
      } else {
        show("Incorrect administrative passcode credentials.", "error");
      }
    }, 800);
  };

  const handleLogout = () => {
    show("Closing administrative session...", "info");
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
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

  if (!hasPermission(["Admin"])) {
    return <PageLoader text="Verifying clearance credentials..." />;
  }

  // Passcode Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl max-w-sm w-full backdrop-blur-xl shadow-2xl space-y-6 text-center text-white">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mx-auto shadow-glow">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading text-lg font-black tracking-tight">Secret Admin Panel</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              This area is restricted to administrators. Enter the secret access code to decrypt system metrics.
            </p>
            <span className="inline-block bg-white/10 text-primary px-2.5 py-0.5 rounded text-[9px] font-mono font-bold mt-1">
              Secret Code: admin123
            </span>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <div className="relative">
              <input
                id="admin-passcode-input"
                type={showPassword ? "text" : "password"}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
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

            <Button
              type="submit"
              disabled={verifying}
              fullWidth
              className="py-3 text-xs font-bold"
            >
              {verifying ? "Decrypting..." : "Unlock Console"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col overflow-x-hidden">
      
      {/* Top Header */}
      <header className="bg-surface border-b border-border/80 h-16 flex items-center justify-between px-4 sm:px-6 z-40 fixed top-0 left-0 right-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen((o) => !o)}
            className="p-2 rounded-xl hover:bg-slate-50 text-text-secondary xl:hidden focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2 select-none">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="text-xl font-heading font-bold text-text-primary">
              MediGo <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold ml-1">Admin</span>
            </span>
          </Link>
          <div className="hidden sm:block ml-4 border-l border-border pl-4">
            <BackButton variant="ghost" size="sm" className="text-text-secondary" />
          </div>
        </div>

        {/* Global Search - Desktop Only */}
        <div className="hidden md:flex items-center relative w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
          <input
            type="search"
            placeholder="Search sections..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(e.target.value.length > 0);
            }}
            onFocus={() => setIsSearchOpen(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
          />
          {isSearchOpen && (
            <div 
              className="absolute top-full mt-2 left-0 right-0 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto"
              onMouseDown={(e) => e.preventDefault()}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-border last:border-0"
                  >
                    <item.icon className="w-4 h-4 text-text-secondary" />
                    <span className="text-xs font-semibold text-text-primary">{item.label}</span>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-xs text-text-secondary text-center">
                  No sections found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/notifications"
            className="relative p-2 rounded-xl hover:bg-slate-50 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface animate-pulse" />
          </Link>

          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary font-heading font-extrabold text-xs flex items-center justify-center shadow-inner shrink-0">
              LM
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-text-primary leading-none">Lucky Malik</p>
              <p className="text-[10px] text-text-secondary mt-1 leading-none">Super Administrator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace container */}
      <div className="flex flex-1 relative pt-16">
        
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
        <main className="flex-1 xl:pl-[280px] p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-background w-full">
          <div className="max-w-7xl mx-auto w-full pb-20 xl:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Mobile Only) */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border/80 h-16 flex items-center justify-around z-40 px-2 shadow-lg">
        <Link
          href="/admin/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname === "/admin/dashboard" ? "text-primary" : "text-text-secondary"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/patients"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/admin/patients") ? "text-primary" : "text-text-secondary"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Users</span>
        </Link>
        <Link
          href="/admin/reports"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/admin/reports") ? "text-primary" : "text-text-secondary"
          }`}
        >
          <BarChart4 className="w-5 h-5 mb-0.5" />
          <span>Reports</span>
        </Link>
        <Link
          href="/admin/settings"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold ${
            pathname.startsWith("/admin/settings") ? "text-primary" : "text-text-secondary"
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span>Settings</span>
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
