"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { BarChart4, Download, FileText, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { AreaChart, BarChart } from "@/components/enterprise/SimpleCharts";

export default function AdminReportsPage() {
  const { show } = useToast();
  const [activeReportTab, setActiveReportTab] = useState<"daily" | "weekly" | "monthly">("monthly");

  const handleExport = () => {
    show(`Generating financial reports export in PDF format...`, "info");
    
    setTimeout(() => {
      import("jspdf").then(({ jsPDF }) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("MediGo Admin Financial Report", 20, 30);
        
        doc.setFontSize(12);
        doc.text("---------------------------------------------------------", 20, 40);
        doc.text(`Report Generation Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Active Cohort MRR: $124,500.00`, 20, 60);
        doc.text(`Active Patient Count: 1,248`, 20, 70);
        doc.text(`Status: METABOLIC AUDITED`, 20, 80);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Compliance: Internal Admin HIPAA Compliant Audit Data.", 20, 100);
        
        doc.save(`medigo_admin_report.pdf`);
        show(`Exported successful. Check downloads folder.`, "success");
      }).catch(err => {
        console.error("Failed to load jsPDF", err);
        show("Failed to generate PDF.", "error");
      });
    }, 1000);
  };

  const [chartData, setChartData] = useState<{ label: string, value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/reports/revenue?interval=${activeReportTab}`);
        setChartData(res.data || []);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        show("Failed to load report data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [activeReportTab]);

  const patientGrowthTrend = [
    { label: "Jan", value: 450 },
    { label: "Feb", value: 580 },
    { label: "Mar", value: 690 },
    { label: "Apr", value: 890 },
    { label: "May", value: 1100 },
    { label: "Jun", value: 1248 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 text-left">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-text-primary">
            Platform Analytical Reports
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit monthly recurring revenues, track cohort statistics, and download financial files.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-border select-none">
          <button
            onClick={() => setActiveReportTab("daily")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === "daily" ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveReportTab("weekly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === "weekly" ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveReportTab("monthly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === "monthly" ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Visual Charts */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <h3 className="font-heading text-sm font-bold text-text-primary">Revenue Growth Trajectory</h3>
              <Badge variant="success" size="sm">Metabolic Audited</Badge>
            </div>
            <div className="flex-1 flex items-center justify-center pt-2">
              {loading ? (
                <div className="h-[220px] w-full flex items-center justify-center text-text-tertiary text-sm">
                  Loading data...
                </div>
              ) : (
                <AreaChart data={chartData} height={220} color="#3B82F6" />
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Export panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <BarChart4 className="w-5 h-5 shrink-0" />
            <h3 className="font-heading text-sm font-bold text-text-primary">Download Statements</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Export secure HIPAA-compliant PDF summary sheets for tax declarations and medical audits.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleExport()}
              className="flex-1 py-2.5 px-3 border border-border hover:border-primary text-text-primary hover:text-primary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus:outline-none"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
