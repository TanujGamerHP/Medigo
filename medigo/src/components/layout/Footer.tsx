"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';


/* -------------------------------------------------- */
/*  Inline SVG Social Icons (branded icons removed    */
/*  from lucide-react in recent versions)              */
/* -------------------------------------------------- */

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146a10 10 0 0 0-.916-.036c-1.3 0-1.804.491-1.804 1.77v2.563h3.593l-.617 3.668h-2.976v8.06A11.3 11.3 0 0 0 12 24c-.32 0-.636-.013-.949-.039a11 11 0 0 1-1.95-.27" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388A5.9 5.9 0 0 0 .607 4.16C.31 4.92.105 5.793.046 7.07.007 7.937 0 8.222 0 12s.007 4.063.046 4.93c.06 1.277.264 2.149.563 2.91.307.79.717 1.459 1.388 2.13a5.9 5.9 0 0 0 2.124 1.388c.76.297 1.633.502 2.91.563C7.937 23.993 8.222 24 12 24s4.063-.007 4.93-.046c1.277-.06 2.149-.264 2.91-.563a5.9 5.9 0 0 0 2.124-1.388 5.9 5.9 0 0 0 1.388-2.13c.297-.76.502-1.633.563-2.91.039-.867.046-1.152.046-4.93s-.007-4.063-.046-4.93c-.06-1.277-.264-2.149-.563-2.91a5.9 5.9 0 0 0-1.388-2.124A5.9 5.9 0 0 0 19.84.647C19.08.35 18.207.145 16.93.084 16.063.045 15.778.038 12 .038s-4.063.007-4.93.046zm.14 2.16c.856-.04 1.113-.047 3.283-.047h1.094c2.17 0 2.427.007 3.283.048 1.174.053 1.812.249 2.237.414.562.218.963.479 1.384.9.421.42.682.822.9 1.384.165.425.361 1.063.414 2.237.04.856.048 1.113.048 3.283s-.007 2.427-.048 3.283c-.053 1.174-.249 1.812-.414 2.237-.218.562-.479.963-.9 1.384a3.7 3.7 0 0 1-1.384.9c-.425.165-1.063.361-2.237.414-.856.04-1.113.048-3.283.048s-2.427-.007-3.283-.048c-1.174-.053-1.812-.249-2.237-.414a3.7 3.7 0 0 1-1.384-.9 3.7 3.7 0 0 1-.9-1.384c-.165-.425-.361-1.063-.414-2.237-.04-.856-.048-1.113-.048-3.283s.007-2.427.048-3.283c.053-1.174.249-1.812.414-2.237.218-.562.479-.963.9-1.384a3.7 3.7 0 0 1 1.384-.9c.425-.165 1.063-.361 2.237-.414M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881" />
  </svg>
);
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
return (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
  </svg>
);
}

/* -------------------------------------------------- */
/*  Types & Data                                       */
/* -------------------------------------------------- */

interface FooterLink {
label: string;
href: string;
}

interface FooterColumn {
title: string;
links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
{
  title: 'Quick Links',
  links: [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Knowledge Center', href: '/knowledge' },
  ],
},
{
  title: 'Programs',
  links: [
    { label: 'GLP-1 Programs', href: '/programs' },
    { label: 'AI Assessment', href: '/assessment' },
    { label: 'Book Consultation', href: '/consultation' },
    { label: 'Membership Plans', href: '/pricing#membership' },
  ],
},
{
  title: 'Support',
  links: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Medical Disclaimer', href: '/disclaimer' },
  ],
},
];

interface SocialLink {
label: string;
href: string;
icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const SOCIALS: SocialLink[] = [
{ label: 'Twitter', href: 'https://twitter.com', icon: XIcon },
{ label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
{ label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
{ label: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedinIcon },
];

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isPortalRoute = pathname.startsWith('/dashboard') || 
                        pathname.startsWith('/doctor') || 
                        pathname.startsWith('/admin') || 
                        pathname.startsWith('/pharmacy') || 
                        pathname.startsWith('/lab') ||
                        pathname === '/login' ||
                        pathname === '/register' ||
                        pathname === '/unauthorized' ||
                        pathname === '/session-expired';

  if (isPortalRoute) return null;

  return (
  <footer id="main-footer" className="relative bg-dark-green text-white" suppressHydrationWarning>
    {/* Top gradient accent line */}
    <div className="h-1 w-full gradient-primary" aria-hidden="true" suppressHydrationWarning />

    {/* ---- Newsletter Section ---- */}
    <section
      id="footer-newsletter"
      className="border-b border-white/10"
      suppressHydrationWarning
    >
      <div className="container-custom py-12 lg:py-16" suppressHydrationWarning>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8" suppressHydrationWarning>
          <div className="text-center lg:text-left max-w-md" suppressHydrationWarning>
            <h3 className="text-2xl lg:text-3xl font-heading font-bold mb-2">
              Stay Updated
            </h3>
            <p className="text-white/60 text-sm lg:text-base">
              Get the latest on GLP-1 research, health tips, and exclusive offers
              delivered to your inbox.
            </p>
          </div>

          <form
            id="footer-newsletter-form"
            className="flex w-full max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 min-w-0 rounded-l-full px-5 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <button
              id="footer-subscribe-btn"
              type="submit"
              className="gradient-cta text-white text-sm font-semibold rounded-r-full px-6 py-3 flex items-center gap-2 transition-all duration-300 hover:shadow-glow hover:brightness-110 shrink-0"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>

    {/* ---- Main Footer Grid ---- */}
    <div className="container-custom py-12 lg:py-16" suppressHydrationWarning>
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16" suppressHydrationWarning>
        {/* Column 1 — Brand */}
        <div className="w-full lg:w-2/5" suppressHydrationWarning>
          <Link
            href="/"
            id="footer-logo"
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="inline-flex h-3 w-3 rounded-full bg-primary" />
            <span className="text-xl font-heading font-bold text-white">
              MediGo
            </span>
          </Link>
          <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
            Doctor-led, AI-powered GLP-1 weight management — making premium
            healthcare accessible to everyone, everywhere.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3" suppressHydrationWarning>
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  id={`footer-social-${social.label.toLowerCase()}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 transition-all duration-200 hover:bg-primary hover:text-white hover:scale-110"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Columns 2-4 — Links */}
        <div className="w-full lg:w-3/5 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-10">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} suppressHydrationWarning>
              <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-white/80 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ---- Bottom Bar ---- */}
    <div className="border-t border-white/10" suppressHydrationWarning>
      <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-white/40" suppressHydrationWarning>
        <p>&copy; {currentYear} MediGo. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <span className="text-red-400">❤️</span> for better health
        </p>
      </div>
    </div>
  </footer>
);
}
