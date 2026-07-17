"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Users, Clock, AlertTriangle, ArrowRight, Star } from "lucide-react";

export interface QueuePatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bmi: number;
  type: "Consultation" | "Chart Review" | "Refill Check";
  status: "Waiting" | "In Consult" | "Labs Needed" | "Completed";
  waitingTime: string;
  profileImage?: string | null;
  hasActiveMembership?: boolean;
  membershipPlan?: string | null;
}

const mockPatients: QueuePatient[] = [];

export function PatientQueue({ onSelectPatient }: { onSelectPatient: (patientId: string) => void }) {
  const [patients, setPatients] = useState<QueuePatient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.request("/api/v1/doctors/my-patients");
        if (response.data) {
          const queue = response.data.map((p: any) => {
            let age = 35;
            if (p.dob) {
              const diff = new Date().getTime() - new Date(p.dob).getTime();
              age = Math.floor(diff / 31557600000);
            }

            let bmi = 22.5;
            if (p.weight && p.height) {
              const heightM = p.height / 100;
              bmi = Number((p.weight / (heightM * heightM)).toFixed(1));
            }

            return {
              id: p.id,
              name: `${p.user?.firstName || p.firstName || 'Unknown'} ${p.user?.lastName || p.lastName || ''}`.trim(),
              age,
              gender: p.gender || "Unspecified",
              bmi,
              type: "Consultation",
              status: "Waiting",
              waitingTime: "10 mins", // Mocked waiting time for now
              profileImage: p.profileImage || null,
              hasActiveMembership: p.memberships?.some((m: any) => m.status === 'Active') || false,
              membershipPlan: p.memberships?.find((m: any) => m.status === 'Active')?.planName || null,
            };
          });
          setPatients(queue);
        }
      } catch (err) {
        console.error("Failed to load patient queue:", err);
      }
    };
    fetchPatients();
  }, []);

  const columns: TableColumn<QueuePatient>[] = [
    {
      key: "name",
      label: "Patient Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.profileImage ? (
            <img src={row.profileImage} alt={row.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
              {row.name.charAt(0)}
            </div>
          )}
          <div>
            <span className="font-bold text-text-primary flex items-center gap-2 text-sm">
              {row.name}
              {row.hasActiveMembership && (
                <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <Star className="w-2.5 h-2.5" />
                  {row.membershipPlan}
                </span>
              )}
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">
              {row.age} yrs • {row.gender}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "bmi",
      label: "BMI Index",
      sortable: true,
      render: (row) => {
        const isObese = row.bmi >= 30;
        return (
          <div className="flex flex-col">
            <span className="text-text-primary font-bold">{row.bmi}</span>
            <span className={`text-[10px] block mt-0.5 font-bold ${isObese ? "text-red-500" : "text-amber-500"}`}>
              {isObese ? "Severe Overweight" : "Overweight"}
            </span>
          </div>
        );
      },
    },
    {
      key: "type",
      label: "Consult Category",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-text-secondary">{row.type}</span>,
    },
    {
      key: "waitingTime",
      label: "Wait Duration",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.waitingTime}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Queue Status",
      sortable: true,
      render: (row) => {
        const styles = {
          Waiting: "bg-blue-50 border-blue-200 text-blue-700 animate-pulse",
          "In Consult": "bg-emerald-50 border-emerald-200 text-emerald-700",
          "Labs Needed": "bg-amber-50 border-amber-200 text-amber-700",
          Completed: "bg-slate-50 border-slate-200 text-slate-500",
        };
        return (
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${styles[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      render: (row) => (
        <button
          onClick={() => onSelectPatient(row.id)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Examine</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Alert Header Banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl select-none">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-heading text-xs font-bold text-amber-900 uppercase tracking-wider">
            Patient Queue Compliance Alert
          </h4>
          <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
            Ensure secure video consult session validation and patient identification verification before prescribing compounding GLP-1 medications. HIPAA regulations require all sessions to be logged in the Security Audit logs.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-5 select-none">
          <Users className="w-5 h-5 text-primary-600" />
          <h3 className="font-heading text-sm font-bold text-text-primary">
            Active Doctor Queue
          </h3>
        </div>

        <AdvancedTable
          data={patients}
          columns={columns}
          rowKey={(row) => row.id}
          searchKeys={["name", "type", "status"]}
          searchPlaceholder="Search active queue..."
        />
      </div>
    </div>
  );
}
