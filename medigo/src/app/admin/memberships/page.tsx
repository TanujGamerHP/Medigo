"use client";

import React, { useState } from "react";
import { CreditCard, Eye, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface MembershipRecord {
  id: string;
  planName: "Basic" | "Premium" | "Enterprise" | "None";
  activeMembers: number;
  expiredMembers: number;
  monthlyRenewalRate: string;
  price: string;
}

export default function AdminMembershipsPage() {
  const { show } = useToast();
  const [plans, setPlans] = useState<MembershipRecord[]>([]);

  const columns: TableColumn<MembershipRecord>[] = [
    {
      key: "planName",
      label: "Membership Program",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-xs">{row.planName} Plan</span>,
    },
    {
      key: "price",
      label: "Monthly Price",
      sortable: true,
      render: (row) => <span className="font-semibold text-text-primary text-xs">{row.price}</span>,
    },
    {
      key: "activeMembers",
      label: "Active Members",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-semibold font-mono">{row.activeMembers}</span>,
    },
    {
      key: "expiredMembers",
      label: "Expired Members",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-semibold font-mono">{row.expiredMembers}</span>,
    },
    {
      key: "monthlyRenewalRate",
      label: "Retention/Renewal Rate",
      sortable: true,
      render: (row) => <span className="text-xs text-primary font-bold">{row.monthlyRenewalRate}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => show(`Modifying membership plan settings for ${row.planName}...`, "info")}
            className="px-3 py-1.5 border border-border hover:border-primary text-text-primary hover:text-primary rounded-xl text-xs font-bold transition-all focus:outline-none bg-white"
          >
            Edit Plan
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
              data={plans}
              columns={columns}
              rowKey={(row) => row.id}
              searchKeys={["planName"]}
              searchPlaceholder="Search active plans..."
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
              <span className="font-bold text-text-primary">842 Patients</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span>Average Monthly Payout</span>
              <span className="font-bold text-text-primary">₹124,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
