"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  FolderOpen, 
  HelpCircle, 
  Home, 
  Image, 
  Images, 
  Globe, 
  Search, 
  Plus, 
  LayoutGrid,
  ChevronRight
} from "lucide-react";

interface SubNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SUB_NAV_ITEMS: SubNavItem[] = [
  { label: "Blogs", href: "/admin/content/blogs", icon: FileText },
  { label: "Categories", href: "/admin/content/categories", icon: FolderOpen },
  { label: "FAQs", href: "/admin/content/faq", icon: HelpCircle },
  { label: "Homepage", href: "/admin/content/homepage", icon: Home },
  { label: "Banners", href: "/admin/content/banners", icon: Images },
  { label: "Media Library", href: "/admin/content/media", icon: Image },
  { label: "SEO", href: "/admin/content/seo", icon: Globe },
  { label: "Static Pages", href: "/admin/content/pages", icon: LayoutGrid },
];

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className="space-y-6 text-left">
      {/* CMS Module Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-text-primary flex items-center gap-1.5">
            Website Content Management System (CMS)
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your marketing blogs, clinical FAQs, dynamic homepage sections, and media assets.
          </p>
        </div>
      </div>

      {/* Sub Nav Tab Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border-light pb-2 select-none">
        {SUB_NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                active
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-white border-border text-text-secondary hover:text-text-primary hover:bg-slate-50"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Child Route Container */}
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
}
