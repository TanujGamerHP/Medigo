import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RoleProvider } from "@/features/shared/RoleProvider";
import { CommandPalette } from "@/components/enterprise/CommandPalette";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MediGo — Doctor-Led GLP-1 Weight Management",
    template: "%s | MediGo",
  },
  description:
    "Get personalized GLP-1 weight management programs from board-certified doctors. AI-powered health assessments, expert consultations, and ongoing support — all from the comfort of your home.",
  keywords: [
    "GLP-1",
    "weight management",
    "telemedicine",
    "online doctor",
    "Ozempic",
    "Wegovy",
    "Mounjaro",
    "weight loss",
    "healthcare",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MediGo",
    title: "MediGo — Doctor-Led GLP-1 Weight Management",
    description:
      "Personalized GLP-1 programs from board-certified doctors. Start your free assessment today.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediGo — Doctor-Led GLP-1 Weight Management",
    description:
      "Personalized GLP-1 programs from board-certified doctors. Start your free assessment today.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col bg-background text-text-primary font-body" suppressHydrationWarning>
        <RoleProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CommandPalette />
          </ToastProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
