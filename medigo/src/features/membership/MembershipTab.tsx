"use client";

import React, { useState } from "react";
import { CreditCard, Calendar, ShieldCheck, Download, AlertTriangle, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/features/shared/RoleProvider";
import Link from "next/link";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "failed";
}

export function MembershipTab() {
  const { user } = useRole();

  const memberships = user?.patient?.memberships || [];
  const hasMembership = memberships.length > 0;
  const activeMembership = memberships.find((m: any) => m.status === 'Active') || (hasMembership ? memberships[0] : null);

  const invoices: Invoice[] = [
    { id: "INV-2026-004", date: "June 25, 2026", amount: 149, status: "paid" },
    { id: "INV-2026-003", date: "May 25, 2026", amount: 149, status: "paid" },
    { id: "INV-2026-002", date: "April 25, 2026", amount: 149, status: "paid" },
    { id: "INV-2026-001", date: "March 25, 2026", amount: 149, status: "paid" },
  ];

  const handleDownloadInvoice = (invId: string, amount: number, date: string) => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.text("MediGo Billing Invoice", 20, 30);
      
      doc.setFontSize(12);
      doc.text("---------------------------------------------------------", 20, 40);
      doc.text(`Invoice ID: ${invId}`, 20, 50);
      doc.text(`Billing Date: ${date}`, 20, 60);
      doc.text(`Paid Amount: INR ${amount}.00`, 20, 70);
      doc.text(`Portal account: ${user?.patient?.firstName || ''} ${user?.patient?.lastName || ''}`, 20, 80);
      doc.text(`Status: Verified & Secure`, 20, 90);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Thank you for taking care of your health with MediGo!", 20, 110);
      
      doc.save(`medigo_${invId.toLowerCase()}.pdf`);
    }).catch(err => {
      console.error("Failed to load jsPDF", err);
    });
  };
  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Column: Active membership details or Empty State */}
        <div className="lg:col-span-12 space-y-6">
          
          {!hasMembership ? (
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-sm text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-xl text-text-primary">No Active Membership</h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto">
                  You need an active program membership to request medication refills, access your AI coach, and book physician consultations.
                </p>
              </div>
              <Link href="/pricing">
                <Button className="px-8 shadow-glow" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Buy Membership
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Plan overview card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider">
                      {activeMembership.status === 'Active' ? 'Active Member' : 'Pending Member'}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-text-primary">
                      {activeMembership.planName || "Starter Weight Loss Program"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-heading font-black text-text-primary">₹{activeMembership.price || "2499"}</span>
                    <span className="text-[10px] text-text-secondary block">
                      {activeMembership?.planName?.toLowerCase().includes("3-months") 
                        ? "/ 3 months" 
                        : activeMembership?.planName?.toLowerCase().includes("6-months")
                        ? "/ 6 months"
                        : "/ month"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border-light pt-6">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-tertiary uppercase font-bold block">Billing Period</span>
                    <span className="text-xs text-text-primary font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      {activeMembership?.planName?.toLowerCase().includes("3-months") 
                        ? "Quarterly renewal" 
                        : activeMembership?.planName?.toLowerCase().includes("6-months")
                        ? "Bi-annual renewal"
                        : "Monthly renewal"}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-tertiary uppercase font-bold block">Next Renewal Date</span>
                    <span className="text-xs text-text-primary font-semibold text-primary">
                      {new Date(activeMembership.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-light flex flex-col sm:flex-row justify-between gap-4 items-center">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <CreditCard className="w-4.5 h-4.5 text-primary shrink-0" />
                    <span>Card on file: VISA ending in **4242</span>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-text-primary">Included Plan Benefits</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary">
                  {(activeMembership?.planName?.toLowerCase().includes("6-months") ? [
                    "6 Months Continuous Doctor Care",
                    "Dedicated Care Coordinator",
                    "Weekly Progress Reviews",
                    "Unlimited Doctor Follow-up Messages",
                    "Personalised diet plan every week",
                    "Personalised workout plan every week",
                    "Advanced Nutrition Coaching",
                    "Lifestyle Coaching",
                    "Free Lab Report Reviews",
                    "Fast-Track Appointment Priority",
                    "Premium Customer Support",
                  ] : activeMembership?.planName?.toLowerCase().includes("3-months") ? [
                    "3 Months Continuous Doctor Care",
                    "Monthly Doctor Follow-ups",
                    "Unlimited AI Progress Check-ins",
                    "Personalised diet plan every 15 days",
                    "Personalised workout plan every 15 days",
                    "WhatsApp Priority Support",
                    "Prescription Renewals",
                    "Priority Appointment Booking",
                    "Progress Reports",
                  ] : [
                    "1x Monthly Doctor Consultation video check-ins",
                    "Unlimited asynchronous clinical secure chat support",
                    "Prescription routing (Semaglutide cold-chain shipments)",
                    "AI Coach log monitors & activity tracking",
                    "HIPAA encrypted lab diagnostics vault",
                    "Metabolic milestone achievement program",
                  ]).map((benefit, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
