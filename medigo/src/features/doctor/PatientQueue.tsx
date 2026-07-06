"use client";

import React, { useState } from "react";
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
}

const mockPatients: QueuePatient[] = [];

export function PatientQueue({ onSelectPatient }: { onSelectPatient: (patientId: string) => void }) {
  const [patients, setPatients] = useState<QueuePatient[]>(mockPatients);

  const columns: TableColumn<QueuePatient>[] = [
    {
      key: "name",
      label: "Patient Name",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-text-primary block text-sm">{row.name}</span>
          <span className="text-[10px] text-text-secondary block mt-0.5">
            {row.age} yrs • {row.gender}
          </span>
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
          <div>
            <span className="font-semibold text-text-primary text-xs">{row.bmi}</span>
            <span className={`text-[10px] block mt-0.5 font-bold ${isObese ? "text-red-500" : "text-amber-500"}`}>
              {isObese ? "Obese Category" : "Overweight"}
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
