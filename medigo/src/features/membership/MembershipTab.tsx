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
  const [autoRenew, setAutoRenew] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);

  const memberships = user?.patient?.memberships || [];
  const hasMembership = memberships.length > 0;
  const activeMembership = hasMembership ? memberships[0] : null;

  const invoices: Invoice[] = [
    { id: "INV-2026-004", date: "June 25, 2026", amount: 149, status: "paid" },
    { id: "INV-2026-003", date: "May 25, 2026", amount: 149, status: "paid" },
    { id: "INV-2026-002", date: "April 25, 2026", amount: 149, status: "paid" },
    { id: "INV-2026-001", date: "March 25, 2026", amount: 149, status: "paid" },
  ];

  const handleDownloadInvoice = (invId: string, amount: number, date: string) => {
    // Generate simple invoice text file to download
    const element = document.createElement("a");
    const file = new Blob([
      `MEDI GO BILLING INVOICE\n` +
      `-----------------------\n` +
      `Invoice ID: ${invId}\n` +
      `Billing Date: ${date}\n` +
      `Paid Amount: $${amount}.00\n` +
      `Portal account: Sarah Miller\n` +
      `Status: SUCCESS / PAID\n` +
      `Thank you for taking care of your health with MediGo!\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `medigo_${invId.toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCancelAutoRenew = () => {
    setAutoRenew(false);
    setShowCancelModal(false);
    setCancelConfirmed(true);
    setTimeout(() => setCancelConfirmed(false), 4000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active membership details or Empty State */}
        <div className="lg:col-span-8 space-y-6">
          
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
              <Link href="/dashboard/membership/buy">
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
                    <span className="text-2xl font-heading font-black text-text-primary">₹{activeMembership.price || "149"}</span>
                    <span className="text-[10px] text-text-secondary block">/ month</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border-light pt-6">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-tertiary uppercase font-bold block">Billing Period</span>
                    <span className="text-xs text-text-primary font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      Monthly renewal
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

                  {autoRenew ? (
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="text-xs font-bold text-error hover:underline focus:outline-none"
                    >
                      Cancel auto-renew
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-amber-500">
                      Auto-renew disabled
                    </span>
                  )}
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-text-primary">Included Plan Benefits</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary">
                  {[
                    "1x Monthly Doctor Consultation video check-ins",
                    "Unlimited asynchronous clinical secure chat support",
                    "Prescription routing (Semaglutide cold-chain shipments)",
                    "AI Coach log monitors & activity tracking",
                    "HIPAA encrypted lab diagnostics vault",
                    "Metabolic milestone achievement program",
                  ].map((benefit, idx) => (
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

        {/* Right Column Invoices history list */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-text-primary">Invoices History</h3>
          
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between border-b border-border-light pb-3 last:border-0 last:pb-0 text-xs"
              >
                <div>
                  <span className="block font-bold text-text-primary">{inv.id}</span>
                  <span className="block text-[10px] text-text-secondary">{inv.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-primary">₹{inv.amount}.00</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(inv.id, inv.amount, inv.date)}
                    className="p-1.5 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-primary transition-all focus:outline-none"
                    aria-label={`Download invoice ${inv.id}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {cancelConfirmed && (
        <div className="p-3.5 bg-green-50 border border-success-200 text-success text-xs font-semibold rounded-xl text-center">
          Auto-renewal canceled successfully! Your membership will remain active until July 25, 2026.
        </div>
      )}

      {/* AUTO-RENEW CANCELLATION WARNING DIALOG OVERLAY */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 border border-border/50 shadow-2xl space-y-6 text-center">
            
            <div className="w-12 h-12 rounded-full bg-red-100 text-error flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-lg text-text-primary">Cancel Subscription?</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Canceling auto-renew will prevent monthly doctor visits and dispatching further titration doses. You will lose access on July 25, 2026.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl border border-border text-xs font-bold text-text-secondary hover:bg-background"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleCancelAutoRenew}
                className="py-2.5 rounded-xl bg-error text-white text-xs font-bold hover:bg-error-dark"
              >
                Confirm Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
