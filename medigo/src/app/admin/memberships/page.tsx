"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Eye, Plus, Trash2, ArrowUpRight, CheckCircle2, Download } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import jsPDF from "jspdf";

interface MembershipRecord {
  id: string;
  patientName: string;
  planName: string;
  price: string;
  startDate: string;
  expiryDate: string;
  status: string;
}

export default function AdminMembershipsPage() {
  const { show } = useToast();
  const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
  const [metrics, setMetrics] = useState({ totalActive: 0, averageMonthlyPayout: "₹0" });

  useEffect(() => {
    const loadMemberships = async () => {
      try {
        const res = await api.get('/api/v1/admin/memberships');
        if (res.success && res.data) {
          setMemberships(res.data.memberships || []);
          setMetrics({
            totalActive: res.data.totalActive || 0,
            averageMonthlyPayout: res.data.averageMonthlyPayout || "₹0"
          });
        }
      } catch (err) {
        console.error("Failed to fetch admin memberships", err);
      }
    };
    loadMemberships();
  }, []);

  const handleDownloadPDF = (record: MembershipRecord) => {
    show("Generating payment receipt PDF...", "info");
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(15, 118, 110); // primary teal
      doc.text("Medigo - Payment Receipt", 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(`Patient Name: ${record.patientName}`, 20, 40);
      doc.text(`Membership Plan: ${record.planName} Plan`, 20, 50);
      doc.text(`Amount Paid: ${record.price}`, 20, 60);
      doc.text(`Validity: ${new Date(record.startDate).toLocaleDateString()} - ${new Date(record.expiryDate).toLocaleDateString()}`, 20, 70);
      doc.text(`Payment Status: Completed`, 20, 80);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 90);

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for choosing Medigo!", 20, 120);
      
      doc.save(`Receipt_${record.patientName.replace(/\s+/g, '_')}_${record.planName}.pdf`);
      show("Receipt downloaded successfully!", "success");
    } catch (err) {
      console.error(err);
      show("Failed to generate PDF.", "error");
    }
  };

  const columns: TableColumn<MembershipRecord>[] = [
    {
      key: "patientName",
      label: "Patient Name",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-xs">{row.patientName}</span>,
    },
    {
      key: "planName",
      label: "Membership Program",
      sortable: true,
      render: (row) => <span className="font-bold text-text-secondary text-xs">{row.planName} Plan</span>,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row) => <span className="font-semibold text-text-primary text-xs">{row.price}</span>,
    },
    {
      key: "validity",
      label: "Validity",
      sortable: false,
      render: (row) => (
        <span className="text-[10px] text-text-secondary font-mono">
          {new Date(row.startDate).toLocaleDateString()} - {new Date(row.expiryDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
            <CheckCircle2 className="w-4 h-4" />
            <span>Payment Done</span>
          </div>
          <button 
            title="Download Payment Receipt PDF"
            onClick={() => handleDownloadPDF(row)}
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Membership Program Control
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure tier structures pricing, view renewal percentages, and track active cohorts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Plans Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 border border-border rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-border mb-5 select-none">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Program Plans Management
              </h3>
            </div>

            <AdvancedTable
              data={memberships}
              columns={columns}
              rowKey={(row) => row.id}
              searchKeys={["patientName", "planName"]}
              searchPlaceholder="Search patients or plans..."
            />
          </div>
        </div>

        {/* Right Column: Total Cohort Revenue summary */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <ArrowUpRight className="w-5 h-5" />
            <h3 className="font-heading text-sm font-bold text-text-primary">Monthly Cohort Metrics</h3>
          </div>
          
          <div className="space-y-3.5 text-xs text-text-secondary font-medium">
            <div className="flex justify-between border-b border-border-light pb-2">
              <span>Total Active Members</span>
              <span className="font-bold text-text-primary">{metrics.totalActive} Patients</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span>Average Monthly Payout</span>
              <span className="font-bold text-text-primary">{metrics.averageMonthlyPayout}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
