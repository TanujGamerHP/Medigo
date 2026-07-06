"use client";

import React from "react";
import { AreaChart, BarChart, FunnelChart, DonutChart } from "@/components/enterprise/SimpleCharts";
import { TrendingUp, BarChart2, PieChart, Download } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const conversionData = [
  { label: "Total Leads (Ad clicks)", value: 12400 },
  { label: "Assessments Completed", value: 8900 },
  { label: "Doctor Match Syncs", value: 4200 },
  { label: "Prescriptions Composed", value: 2800 },
  { label: "Active Members Base", value: 1980 },
];

const doctorLoadData = [
  { label: "Dr. Mitchell", value: 88 },
  { label: "Dr. Park", value: 72 },
  { label: "Dr. Chen", value: 94 },
  { label: "Dr. Rivera", value: 65 },
  { label: "Dr. Adams", value: 80 },
];

const revenueLogs = [
  { label: "Week 1", value: 12000 },
  { label: "Week 2", value: 15400 },
  { label: "Week 3", value: 14200 },
  { label: "Week 4", value: 18900 },
];

const tierDemographics = [
  { label: "Starter Tier (₹149)", value: 1450 },
  { label: "Premium Tier (₹299)", value: 1892 },
  { label: "Elite Tier (₹499)", value: 550 },
];

export function AnalyticsModule() {
  const { addToast } = useToast();

  const handleExportReport = () => {
    addToast({
      type: "success",
      message: "Comprehensive metrics database compiled and exported as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-border select-none">
        <div>
          <h3 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary-600" />
            Corporate Performance Analytics
          </h3>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Real-time conversion funnels, doctor load balancing, and tier demographics.
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl bg-white hover:bg-slate-50 text-text-primary text-xs font-semibold shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Export Global Analytics
        </button>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-border select-none">
            <TrendingUp className="w-4.5 h-4.5 text-primary-600" />
            <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider">Leads Onboarding Conversion Funnel</h4>
          </div>
          <FunnelChart data={conversionData} />
        </div>

        {/* Doctor Utilization */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center gap-1.5 pb-2 border-b border-border select-none">
            <BarChart2 className="w-4.5 h-4.5 text-primary-600" />
            <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider">Obesity Specialist Workload Utilization (%)</h4>
          </div>
          <div className="flex-1 flex items-center justify-center pt-4">
            <BarChart data={doctorLoadData} height={200} color="#3B82F6" />
          </div>
        </div>

        {/* Weekly Revenue Trends */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-border select-none">
            <TrendingUp className="w-4.5 h-4.5 text-primary-600" />
            <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider">Weekly Invoiced Revenue (₹)</h4>
          </div>
          <div className="pt-2">
            <AreaChart data={revenueLogs} height={180} color="#10B981" />
          </div>
        </div>

        {/* Membership Demographics */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center gap-1.5 pb-2 border-b border-border select-none">
            <PieChart className="w-4.5 h-4.5 text-primary-600" />
            <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider">Active Member Tiers distribution</h4>
          </div>
          <div className="flex-1 flex items-center justify-center pt-2">
            <DonutChart data={tierDemographics} size={150} />
          </div>
        </div>
      </div>
    </div>
  );
}
