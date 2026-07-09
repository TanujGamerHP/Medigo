'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useRole } from '@/features/shared/RoleProvider';

/* -------------------------------------------------- */
/*  Types                                              */
/* -------------------------------------------------- */

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Programs', href: '/programs' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Knowledge Center', href: '/knowledge' },
  { label: 'Contact', href: '/contact' },
];

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */

export function Navbar() {
  const { user, currentRole } = useRole();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isPortalRoute = pathname.startsWith('/dashboard') || 
                        pathname.startsWith('/doctor') || 
                        pathname.startsWith('/admin') || 
                        pathname.startsWith('/pharmacy') || 
                        pathname.startsWith('/lab') ||
                        pathname === '/login' ||
                        pathname === '/register' ||
                        pathname === '/unauthorized' ||
                        pathname === '/session-expired';

  /* — Scroll listener — */
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* — Lock body scroll when drawer is open — */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  if (isPortalRoute) return null;

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="container-custom flex items-center justify-between h-16 lg:h-20"
        aria-label="Main navigation"
      >
        {/* ---- Logo ---- */}
        <Link
          href="/"
          id="navbar-logo"
          className="flex items-center gap-2 select-none"
          onClick={closeMobile}
        >
          <span className="text-xl lg:text-2xl font-heading font-bold gradient-text">
            MediGo
          </span>
        </Link>

        {/* ---- Desktop Links ---- */}
        <ul className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                id={`nav-link-${link.href.replace(/\//g, '') || 'home'}`}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-text-primary hover:text-primary'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* ---- Desktop Actions ---- */}
        <div className="hidden xl:flex items-center gap-3">
          {user ? (
            <Link
              id="navbar-dashboard"
              href={currentRole === 'Patient' ? '/dashboard' : `/${currentRole.toLowerCase()}/dashboard`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
            >
              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold text-xs">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span>Profile</span>
            </Link>
          ) : (
            <Link
              id="navbar-login"
              href="/login"
              className="px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
            >
              Login
            </Link>
          )}
          <Link
            id="navbar-cta"
            href="/assessment"
            className="gradient-cta text-white text-sm font-semibold rounded-full px-6 py-2.5 transition-all duration-300 hover:scale-105 hover:shadow-glow"
          >
            Get Started
          </Link>
        </div>

        {/* ---- Mobile Hamburger ---- */}
        <button
          id="navbar-mobile-toggle"
          type="button"
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
          className="xl:hidden relative z-50 p-2 -mr-2 text-text-primary hover:text-primary transition-colors duration-200"
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* ============================================ */}
      {/*  Mobile Drawer                                */}
      {/* ============================================ */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm xl:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={closeMobile}
      />

      {/* Drawer panel */}
      <aside
        id="navbar-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 h-full w-[min(85vw,360px)] bg-surface shadow-2xl xl:hidden flex flex-col transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={closeMobile}
          >
            <span className="text-xl font-heading font-bold gradient-text">MediGo</span>
          </Link>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto py-6 px-5">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  id={`mobile-nav-${link.href.replace(/\//g, '') || 'home'}`}
                  href={link.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary'
                      : 'text-text-primary hover:bg-primary-50/60 hover:text-primary'
                  }`}
                >
                  {isActive(link.href) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-border p-5 space-y-3">
          {user ? (
            <Link
              id="mobile-dashboard"
              href={currentRole === 'Patient' ? '/dashboard' : `/${currentRole.toLowerCase()}/dashboard`}
              onClick={closeMobile}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:text-primary hover:border-primary transition-colors duration-200"
            >
              My Profile
            </Link>
          ) : (
            <Link
              id="mobile-login"
              href="/login"
              onClick={closeMobile}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:text-primary hover:border-primary transition-colors duration-200"
            >
              Login
            </Link>
          )}
          <Link
            id="mobile-cta"
            href="/assessment"
            onClick={closeMobile}
            className="flex items-center justify-center w-full gradient-cta text-white text-sm font-semibold rounded-full px-6 py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
          >
            Get Started
          </Link>
        </div>
      </aside>
    </header>
  );
}
