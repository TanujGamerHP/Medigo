"use client";

import React, { useState, useEffect } from "react";
import { UserSquare2, Eye, CheckCircle2, AlertTriangle, ShieldCheck, Ban, ThumbsUp, Loader2, Hospital, GraduationCap, Award } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";

interface DoctorRecord {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experience: string;
  status: "Verified" | "PendingCredentials" | "Suspended";
  qualification: string | null;
  licenseNumber: string | null;
  hospital: string | null;
  bio: string | null;
  availabilityStatus: string;
}

export default function AdminDoctorsPage() {
  const { show } = useToast();
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchDoctors() {
    try {
      const response = await api.get("/api/v1/admin/doctors");
      if (response.success && response.data) {
        setDoctors(response.data);
      }
    } catch (err: any) {
      show(err.message || "Failed to fetch doctors registry.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleToggleVerification = async (id: string, currentStatus: string) => {
    // Verified -> Suspended; PendingCredentials/Suspended -> Verified
    const nextStatus = currentStatus === "Verified" ? "Suspended" : "Verified";
    try {
      const res = await api.patch(`/api/v1/doctors/${id}/status`, { status: nextStatus });
      if (res.success) {
        show(`Doctor verification status updated to ${nextStatus}.`, "success");
        fetchDoctors();
        if (selectedDoctor && selectedDoctor.id === id) {
          setSelectedDoctor({ ...selectedDoctor, status: nextStatus as any });
        }
      }
    } catch (err: any) {
      show(err.message || "Failed to update doctor status.", "error");
    }
  };

  const handleOpenCredentials = (doc: DoctorRecord) => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  };

  const columns: TableColumn<DoctorRecord>[] = [
    {
      key: "name",
      label: "Doctor Name",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-text-primary block text-sm">
            Dr. {row.firstName} {row.lastName}
          </span>
          <span className="text-[10px] text-text-secondary block mt-0.5">{row.specialization}</span>
        </div>
      ),
    },
    {
      key: "licenseNumber",
      label: "License Number",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-text-secondary font-mono font-bold">
          {row.licenseNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "experience",
      label: "Experience",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-semibold">{row.experience}</span>,
    },
    {
      key: "availabilityStatus",
      label: "Status",
      sortable: false,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.availabilityStatus}</span>,
    },
    {
      key: "status",
      label: "Verification Status",
      sortable: true,
      render: (row) => {
        const variantMap = {
          Verified: "success" as const,
          Suspended: "error" as const,
          PendingCredentials: "warning" as const
        };
        const labelMap = {
          Verified: "Verified",
          Suspended: "Suspended",
          PendingCredentials: "Pending Approval"
        };
        return <Badge variant={variantMap[row.status] || "neutral"} size="sm">{labelMap[row.status] || row.status}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenCredentials(row)}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
            title="View Credentials Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleVerification(row.id, row.status)}
            className={`p-1.5 rounded-lg border transition-all ${
              row.status === "Verified" 
                ? "border-red-100 text-red-500 hover:bg-red-50"
                : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
            }`}
            title={row.status === "Verified" ? "Suspend Doctor" : "Approve Doctor"}
          >
            {row.status === "Verified" ? <Ban className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-text-secondary font-bold">Retrieving medical directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Clinical Practitioner Directory
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Verify licenses, review qualifications credentials, audit scheduling blocks, and approve or suspend doctor accounts.
        </p>
      </div>

      <div className="space-y-4 text-left">
        <div className="bg-white p-5 border border-border rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-5 select-none">
            <UserSquare2 className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              All Platform Clinicians
            </h3>
          </div>

          <AdvancedTable
            data={doctors}
            columns={columns}
            rowKey={(row) => row.id}
            searchKeys={["firstName", "lastName", "specialization", "status", "licenseNumber"]}
            searchPlaceholder="Search doctors by name, specialty, license number..."
          />
        </div>
      </div>

      {/* Credentials Details Modal */}
      {selectedDoctor && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Clinical Practitioner Credentials Verification"
          size="md"
        >
          <div className="space-y-5 text-left py-2 select-none">
            <div>
              <h3 className="font-heading text-lg font-black text-text-primary">
                Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
              </h3>
              <p className="text-xs text-primary font-bold">{selectedDoctor.specialization}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-text-secondary">
              <div className="p-3.5 bg-slate-50 border border-border/50 rounded-xl space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase block">License State Status</span>
                <span className="text-text-primary block font-mono font-bold">{selectedDoctor.licenseNumber || "N/A"}</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-border/50 rounded-xl space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase block">Practice Experience</span>
                <span className="text-text-primary block">{selectedDoctor.experience}</span>
              </div>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-border-light text-xs text-text-secondary font-medium">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-text-tertiary uppercase block">Degree Qualifications</span>
                  <span className="text-text-primary">{selectedDoctor.qualification || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Hospital className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-text-tertiary uppercase block">Affiliated Hospital / Clinic</span>
                  <span className="text-text-primary">{selectedDoctor.hospital || "N/A"}</span>
                </div>
              </div>

              {selectedDoctor.bio && (
                <div className="flex items-start gap-2.5">
                  <Award className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-text-tertiary uppercase block">Clinician Background Bio</span>
                    <span className="text-text-primary text-[11px] leading-relaxed block mt-1">{selectedDoctor.bio}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border-light flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-tertiary font-bold uppercase">Status:</span>
                <Badge variant={selectedDoctor.status === "Verified" ? "success" : selectedDoctor.status === "Suspended" ? "error" : "warning"} size="sm">
                  {selectedDoctor.status === "Verified" ? "Verified Approved" : selectedDoctor.status === "Suspended" ? "Suspended" : "Verification Pending"}
                </Badge>
              </div>

              <Button
                onClick={() => handleToggleVerification(selectedDoctor.id, selectedDoctor.status)}
                variant={selectedDoctor.status === "Verified" ? "danger" : "primary"}
                size="sm"
                className="font-bold text-xs"
              >
                {selectedDoctor.status === "Verified" ? "Suspend Account" : "Approve License"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
