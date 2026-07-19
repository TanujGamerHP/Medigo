"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CreditCard, FileText, Download, CheckCircle, ArrowLeft, Stethoscope, IndianRupee, Activity, Calendar } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { api } from "@/lib/api";
import { useRole } from "@/features/shared/RoleProvider";
import { Button } from "@/components/ui/Button";

interface InvoiceRecord {
  id: string;
  doctorName: string;
  patientName: string;
  consultationType: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Refunded";
  transactionId: string;
  specialization?: string;
  licenseNumber?: string;
}

export default function PatientInvoicesPage() {
  const router = useRouter();
  const { user } = useRole();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // PDF Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<InvoiceRecord | null>(null);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await api.get('/api/v1/appointments');
        if (res.success && Array.isArray(res.data)) {
          const paidAppointments = res.data.filter((a: any) => a.paymentStatus === 'Paid');
          const records: InvoiceRecord[] = paidAppointments.map((a: any) => ({
            id: a.id,
            doctorName: `Dr. ${a.doctor?.user?.firstName || a.doctor?.firstName || ''} ${a.doctor?.user?.lastName || a.doctor?.lastName || ''}`.trim() || 'Unknown Doctor',
            patientName: `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`.trim() || 'Unknown Patient',
            consultationType: a.consultationType,
            amount: a.doctor?.consultationFee || 0,
            date: new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: "Paid",
            transactionId: a.paymentId || `pay_${a.id.substring(0, 8)}`,
            specialization: a.doctor?.specialization || "General Consultation",
            licenseNumber: a.doctor?.licenseNumber || "N/A"
          }));
          setInvoices(records);
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const columns: TableColumn<InvoiceRecord>[] = [
    {
      key: "doctorName",
      label: "Doctor Name",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-sm">{row.doctorName}</span>
    },
    {
      key: "amount",
      label: "Amount Paid",
      sortable: true,
      render: (row) => (
        <span className="text-primary-700 font-extrabold flex items-center gap-1 text-sm">
          ₹{row.amount}
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        </span>
      )
    },
    {
      key: "consultationType",
      label: "Consultation Type",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.consultationType}</span>
    },
    {
      key: "date",
      label: "Payment Date",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.date}</span>
    },
    {
      key: "actions",
      label: "Proof of Payment",
      sortable: false,
      render: (row) => (
        <button
          onClick={() => setSelectedReceipt(row)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-slate-50 text-xs font-bold text-text-primary transition-all active:scale-95"
        >
          <FileText className="w-3.5 h-3.5 text-primary" />
          View PDF
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in print-hide-container">
      {/* Hide the main UI during print */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #receipt-modal-content, #receipt-modal-content * { visibility: visible; }
          #receipt-modal-content { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; margin: 0; }
          .print-hide { display: none !important; }
        }
      `}} />

      <div className="text-left flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group print-hide"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl border border-primary-200 shadow-sm">
              <CreditCard className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-text-primary tracking-tight">
                Billing & Invoices
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                View your payment history, manage billing details, and download consultation receipts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print-hide">
        <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-3xl border border-border/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <IndianRupee className="w-20 h-20" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Spent</span>
          </div>
          <h3 className="text-3xl font-heading font-black text-text-primary">
            ₹{loading ? "..." : invoices.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </h3>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">On healthcare services</p>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-3xl border border-border/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Activity className="w-20 h-20" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Paid Invoices</span>
          </div>
          <h3 className="text-3xl font-heading font-black text-text-primary">
            {loading ? "..." : invoices.length}
          </h3>
          <p className="text-[10px] text-text-secondary font-medium mt-1">Successful transactions</p>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-3xl border border-border/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Calendar className="w-20 h-20" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Latest Payment</span>
          </div>
          <h3 className="text-xl mt-1 font-heading font-black text-text-primary">
            {loading ? "..." : invoices.length > 0 ? invoices[invoices.length - 1].date : "N/A"}
          </h3>
          <p className="text-[10px] text-text-secondary font-medium mt-1">Most recent transaction date</p>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-5 border border-border/80 rounded-3xl shadow-sm max-w-full overflow-x-auto print-hide">
        {loading ? (
          <div className="py-12 text-center text-xs text-text-secondary animate-pulse font-medium">
            Loading your invoices...
          </div>
        ) : (
          <AdvancedTable
            data={invoices}
            columns={columns}
            rowKey={(r) => r.id}
            searchKeys={["doctorName", "transactionId", "consultationType"]}
            searchPlaceholder="Search by doctor name or transaction ID..."
          />
        )}
      </div>

      {/* PDF Receipt Modal Overlay */}
      {selectedReceipt && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print-hide">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up relative">
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between print-hide">
              <h3 className="font-bold text-sm text-text-primary">Invoice Preview</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handlePrint} className="gap-2" rightIcon={<Download className="w-4 h-4" />}>
                  Save PDF
                </Button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-2 text-text-tertiary hover:text-text-primary hover:bg-slate-200 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div id="receipt-modal-content" className="p-10 space-y-8 bg-white text-left relative overflow-hidden">
              
              {/* Decorative Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <Stethoscope className="w-96 h-96" />
              </div>

              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 flex items-center justify-center rounded-xl">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-heading font-extrabold text-slate-800 tracking-tight">MediGo</span>
                  </div>
                  <p className="text-[10px] text-primary-600 uppercase tracking-widest font-black mt-2">Official Invoice Receipt</p>
                </div>
                <div className="text-right space-y-1.5 pt-1">
                  <h4 className="text-sm font-bold text-slate-800">{selectedReceipt.doctorName}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedReceipt.specialization}</p>
                  <p className="text-[10px] text-slate-400">License: {selectedReceipt.licenseNumber}</p>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-8 text-sm border-b border-slate-100 pb-8 relative z-10">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Billed To</p>
                  <p className="font-bold text-slate-800 text-base">{selectedReceipt.patientName}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Payment Details</p>
                  <p className="font-semibold text-slate-700 text-xs">Date: {selectedReceipt.date}</p>
                  <p className="font-medium text-slate-500 text-[11px]">Txn ID: <span className="font-mono bg-slate-50 px-1 rounded">{selectedReceipt.transactionId}</span></p>
                  <p className="font-bold text-emerald-600 text-xs mt-1 uppercase tracking-wider flex justify-end items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {selectedReceipt.status}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 pb-8 relative z-10">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-100 pb-3">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between items-center text-sm py-3">
                  <span className="font-bold text-slate-700">{selectedReceipt.consultationType} Consultation Session</span>
                  <span className="font-bold text-slate-800">₹{selectedReceipt.amount}</span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-2xl flex justify-between items-center border border-slate-200 shadow-sm relative z-10">
                <span className="font-black text-slate-500 uppercase text-[11px] tracking-widest">Total Paid</span>
                <span className="text-3xl font-heading font-black text-primary-700">₹{selectedReceipt.amount}</span>
              </div>

              {/* Footer */}
              <div className="text-center text-[10px] text-slate-400 pt-6 mt-8 relative z-10 border-t border-slate-100">
                <p className="font-medium">This is a system generated proof of payment and requires no signature.</p>
                <p className="mt-1">Generated securely by MediGo Clinic Platform.</p>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
