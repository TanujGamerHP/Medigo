"use client";

import React, { useState } from "react";
import { AdvancedTable, TableColumn } from "./AdvancedTable";
import { ShieldCheck, User, Globe, Tag } from "lucide-react";

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  status: "Success" | "Bypassed" | "Blocked";
}

const mockLogs: AuditLog[] = [
  {
    id: "101",
    user: "System",
    role: "Doctor",
    action: "Prescribed GLP-1 (Ozempic 0.5mg)",
    resource: "Patient (Sarah M.)",
    timestamp: "2026-07-03 14:32:10",
    ip: "192.168.10.45",
    status: "Success",
  },
  {
    id: "102",
    user: "Admin (Sarah K.)",
    role: "Admin",
    action: "Updated CMS (Knowledge Center Blog)",
    resource: "Article (GLP-1 FAQs)",
    timestamp: "2026-07-03 14:15:33",
    ip: "10.148.20.11",
    status: "Success",
  },
  {
    id: "103",
    user: "System Gatekeeper",
    role: "System",
    action: "Blocked access to /admin routing",
    resource: "Patient (Anonymous)",
    timestamp: "2026-07-03 13:58:02",
    ip: "185.22.44.91",
    status: "Blocked",
  },
  {
    id: "104",
    user: "Pharmacy CVS Terminal",
    role: "Pharmacy",
    action: "Updated Compound Order Status",
    resource: "Order #2893",
    timestamp: "2026-07-03 12:44:19",
    ip: "172.16.8.5",
    status: "Success",
  },
  {
    id: "105",
    user: "Lab Quest Technician",
    role: "Lab",
    action: "Uploaded Metabolic Panel PDF Report",
    resource: "Patient (John Doe)",
    timestamp: "2026-07-03 11:20:00",
    ip: "192.168.1.189",
    status: "Success",
  },
  {
    id: "106",
    user: "Developer Simulator",
    role: "Admin",
    action: "Bypassed Route Authorization Guards",
    resource: "Route (/pharmacy)",
    timestamp: "2026-07-03 10:05:44",
    ip: "127.0.0.1",
    status: "Bypassed",
  },
];

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs);

  const columns: TableColumn<AuditLog>[] = [
    {
      key: "id",
      label: "Log ID",
      sortable: true,
      render: (row) => <span className="font-mono text-xs font-semibold text-text-tertiary">#{row.id}</span>,
    },
    {
      key: "user",
      label: "Actor / Operator",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary flex-shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-text-primary text-xs block">{row.user}</span>
            <span className="text-[10px] text-text-tertiary block font-semibold uppercase">{row.role}</span>
          </div>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action Taken",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-text-primary text-xs">{row.action}</span>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-text-tertiary">
            <Tag className="w-3 h-3" />
            <span>Target: {row.resource}</span>
          </div>
        </div>
      ),
    },
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.timestamp}</span>,
    },
    {
      key: "ip",
      label: "Network Context",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-text-tertiary font-semibold font-mono">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.ip}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Audit Status",
      sortable: true,
      render: (row) => {
        const styles = {
          Success: "bg-emerald-50 border-emerald-200 text-emerald-700",
          Bypassed: "bg-amber-50 border-amber-200 text-amber-700",
          Blocked: "bg-red-50 border-red-200 text-red-700",
        };
        return (
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${styles[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary-600" />
          <h4 className="font-heading text-sm font-bold text-text-primary">
            HIPAA Security Access Audit Trail
          </h4>
        </div>
        <span className="text-[10px] bg-slate-100 text-text-secondary border border-border-light px-2.5 py-0.5 rounded font-mono font-bold">
          Compliance Level: ACTIVE
        </span>
      </div>

      <AdvancedTable
        data={logs}
        columns={columns}
        rowKey={(row) => row.id}
        searchKeys={["user", "action", "role", "resource", "ip"]}
        searchPlaceholder="Filter audit trails..."
        bulkActions={[
          {
            label: "Export Compliance Logs",
            icon: <ShieldCheck className="w-3.5 h-3.5" />,
            onClick: (selected) => {
              alert(`Selected ${selected.length} logs reported to HIPAA Compliance officer.`);
            },
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
