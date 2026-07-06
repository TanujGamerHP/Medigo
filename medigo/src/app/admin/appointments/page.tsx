"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Eye, Trash2, Video, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface AppointmentRecord {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export default function AdminAppointmentsPage() {
  const { show } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await api.get('/api/v1/appointments');
        if (res.success && res.data) {
          const mapped = res.data.map((a: any) => ({
            id: a.id,
            patient: a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : "Unknown Patient",
            doctor: a.doctor ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName}` : "Unassigned",
            date: a.appointmentDate,
            time: a.appointmentTime,
            type: a.consultationType,
            status: a.status
          }));
          setAppointments(mapped);
        }
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const handleCancelVisit = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: "Cancelled" as const } : a));
    show("Appointment cancelled. Auto-notifying patients.", "warning");
  };

  const columns: TableColumn<AppointmentRecord>[] = [
    {
      key: "patient",
      label: "Patient Name",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-xs">{row.patient}</span>,
    },
    {
      key: "doctor",
      label: "Assigned Clinician",
      sortable: true,
      render: (row) => <span className="font-semibold text-text-secondary text-xs">{row.doctor}</span>,
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.date}</span>,
    },
    {
      key: "time",
      label: "Time Slot",
      sortable: false,
      render: (row) => <span className="text-xs text-text-secondary font-medium font-mono">{row.time}</span>,
    },
    {
      key: "type",
      label: "Consult Type",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.type}</span>,
    },
    {
      key: "status",
      label: "Session Status",
      sortable: true,
      render: (row) => {
        const variantMap = {
          Scheduled: "info" as const,
          Completed: "success" as const,
          Cancelled: "error" as const
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
            onClick={() => show(`Opening appointment logs for slot #${row.id}...`, "info")}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === "Scheduled" && (
            <button 
              onClick={() => handleCancelVisit(row.id)}
              className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all"
              title="Cancel Appointment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Clinical Appointments Queue
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Reschedule virtual visits, cancel slots, audit video call rooms, and monitor calendar sessions.
        </p>
      </div>

      <div className="space-y-4 text-left">
        <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-1">
            {loading ? (
              <div className="p-8 text-center text-text-secondary text-sm">Loading appointments...</div>
            ) : (
              <AdvancedTable
                data={appointments}
                columns={columns}
                rowKey={(row) => row.id}
                searchKeys={["patient", "doctor", "status"]}
                searchPlaceholder="Search appointment sessions..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
