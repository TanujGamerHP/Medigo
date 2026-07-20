"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Activity, FileText } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";

export default function AdminPatientDossierPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPatientDetails() {
      if (!patientId) return;
      try {
        setIsLoading(true);
        // Specifically fetching this exact patient's full history from the patient endpoint
        const res = await api.get(`/api/v1/patients/${patientId}`);
        if (res.success && res.data) {
          setPatient(res.data);
        } else {
          setError("Failed to load patient dossier data.");
        }
      } catch (err: any) {
        console.error(err);
        setError("An error occurred while fetching patient details.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPatientDetails();
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-secondary text-sm font-semibold">
        Decrypting & loading patient dossier...
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-error text-sm font-bold">{error || "Patient not found."}</p>
        <button onClick={() => router.back()} className="text-primary text-xs hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const membership = patient.memberships?.find((m: any) => m.status === 'Active') || patient.memberships?.[0];

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center gap-4 border-b border-border/60 pb-4">
        <BackButton variant="outline" size="sm" />
        <div>
          <h2 className="font-heading text-xl font-extrabold text-text-primary flex items-center gap-2">
            Patient Dossier <Badge variant="neutral" size="sm">#{patient.id.substring(0, 8)}</Badge>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Full clinical profile, metadata, and history for {patient.firstName} {patient.lastName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 bg-white border border-border rounded-3xl shadow-sm text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-4">
              {patient.user?.avatar ? (
                <img src={patient.user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <h3 className="font-heading font-black text-lg text-text-primary">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-xs text-text-tertiary mb-4">Joined {new Date(patient.createdAt).toLocaleDateString()}</p>
            
            <div className="inline-block">
              <Badge variant={patient.user?.status === "Deactivated" ? "error" : "success"}>
                {patient.user?.status || "Active"} Account
              </Badge>
            </div>
          </Card>

          {/* Contact Details */}
          <Card className="p-5 bg-white border border-border rounded-3xl shadow-sm space-y-4 text-left">
            <h4 className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Contact Info</h4>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate text-xs font-medium text-text-secondary">{patient.user?.email || "N/A"}</div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium text-text-secondary">{patient.phone || "N/A"}</div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium text-text-secondary">
                DOB: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "Not provided"}
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed History */}
        <div className="md:col-span-2 space-y-6 text-left">
          {/* Medical Summary */}
          <Card className="p-6 bg-white border border-border rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
              <Activity className="w-5 h-5 text-rose-500" />
              <h4 className="font-heading text-sm font-bold text-text-primary">Medical Profile</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Blood Type</p>
                <p className="text-sm font-semibold text-text-secondary">{patient.bloodType || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Gender</p>
                <p className="text-sm font-semibold text-text-secondary capitalize">{patient.gender || "Not specified"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Allergies & Conditions</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {patient.medicalHistory?.allergies?.length > 0 ? (
                    patient.medicalHistory.allergies.map((a: string, i: number) => (
                      <Badge key={i} variant="error" size="sm">{a}</Badge>
                    ))
                  ) : (
                    <span className="text-xs text-text-secondary italic">No known allergies logged.</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Membership Status */}
          <Card className="p-6 bg-white border border-border rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
              <Shield className="w-5 h-5 text-indigo-500" />
              <h4 className="font-heading text-sm font-bold text-text-primary">Membership Status</h4>
            </div>
            {membership ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-border">
                  <div>
                    <p className="font-bold text-sm text-text-primary">{membership.planName}</p>
                    <p className="text-xs text-text-secondary">Valid until {new Date(membership.endDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={membership.status === "Active" ? "success" : "warning"}>{membership.status}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-secondary py-2 italic">No active memberships on file.</p>
            )}
          </Card>
          
          {/* Recent Consultations (Placeholder array if none) */}
          <Card className="p-6 bg-white border border-border rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
              <FileText className="w-5 h-5 text-teal-500" />
              <h4 className="font-heading text-sm font-bold text-text-primary">Recent Clinical History</h4>
            </div>
            
            {patient.appointments?.length > 0 ? (
              <div className="space-y-3">
                {patient.appointments.map((apt: any) => (
                  <div key={apt.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-border text-xs">
                    <div>
                      <p className="font-bold text-text-primary">Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</p>
                      <p className="text-text-secondary mt-0.5">{new Date(apt.scheduledAt).toLocaleString()}</p>
                    </div>
                    <Badge variant="neutral" size="sm">{apt.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-border text-xs text-text-secondary">
                No recent appointments or clinical history found for this patient.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
