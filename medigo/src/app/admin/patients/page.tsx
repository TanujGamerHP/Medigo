"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, AlertTriangle, ArrowRight, Eye, UserX, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

interface PatientRecord {
  id: string;
  originalId: string;
  name: string;
  email: string;
  phone: string;
  membership: string;
  status: "Active" | "Deactivated" | "Pending Intake";
  joinedDate: string;
}

const initialPatients: PatientRecord[] = [];

export default function AdminPatientsPage() {
  const { show } = useToast();
  const router = useRouter();
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        setIsLoading(true);
        const res = await api.get('/api/v1/admin/patients');
        if (res.success && res.data) {
          const mapped: PatientRecord[] = res.data.map((p: any) => ({
            id: p.id.substring(0, 8),
            originalId: p.id,
            name: `${p.firstName} ${p.lastName || ""}`.trim(),
            email: p.user?.email || "N/A",
            phone: p.phone || "N/A",
            membership: p.memberships?.find((m: any) => m.status === 'Active')?.planName || (p.memberships?.length > 0 ? p.memberships[0].planName : "None"),
            status: p.user?.status === "Deactivated" ? "Deactivated" : (p.memberships?.find((m: any) => m.status === 'Active') ? "Active" : "Pending Intake"),
            joinedDate: new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          }));
          setPatients(mapped);
        }
      } catch (err) {
        show("Failed to fetch patients", "error");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const handleToggleDeactivate = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Deactivated" as const : "Active" as const;
    setPatients(patients.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    show(`Patient account status updated to ${nextStatus}.`, "success");
  };

  const columns: TableColumn<PatientRecord>[] = [
    {
      key: "id",
      label: "Patient ID",
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-text-secondary text-xs">#{row.id}</span>,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-text-primary block text-sm">{row.name}</span>
          <span className="text-[10px] text-text-secondary block mt-0.5">{row.email}</span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
      render: (row) => <span className="text-xs text-text-secondary font-semibold">{row.phone}</span>,
    },
    {
      key: "membership",
      label: "Membership",
      sortable: true,
      render: (row) => (
        <Badge variant={row.membership === "None" ? "neutral" : "success"} size="sm">
          {row.membership}
        </Badge>
      ),
    },
    {
      key: "joinedDate",
      label: "Joined Date",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.joinedDate}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => {
        const variantMap = {
          Active: "success" as const,
          Deactivated: "error" as const,
          "Pending Intake": "warning" as const
        };
        return <Badge variant={variantMap[row.status]} size="sm">{row.status}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => router.push(`/admin/patients/${row.originalId}`)}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
            title="View Dossier"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleDeactivate(row.id, row.status)}
            className={`p-1.5 rounded-lg border transition-all ${
              row.status === "Active" 
                ? "border-red-100 text-red-500 hover:bg-red-50"
                : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
            }`}
            title={row.status === "Active" ? "Deactivate Account" : "Activate Account"}
          >
            {row.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-text-primary">
            Patient Profiles Directory
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            View full clinical history, configure memberships, suspend accounts, and search logs.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-left">
        <div className="bg-white p-3 sm:p-5 border border-border rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-3 sm:mb-5 select-none">
            <Users className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              All Platform Patients
            </h3>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-text-secondary">Loading patients directory...</div>
          ) : (
            <AdvancedTable
              data={patients}
              columns={columns}
              rowKey={(row) => row.id}
              searchKeys={["name", "email", "membership", "status"]}
              searchPlaceholder="Search patients database..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
