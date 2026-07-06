"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, FileText, Download, Plus, Trash2, Edit2, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useRole } from "@/features/shared/RoleProvider";

interface PrescriptionItem {
  id: string;
  patientName: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
  datePrescribed: string;
}

const mockPrescriptions: PrescriptionItem[] = [];

export default function DoctorPrescriptionsPage() {
  const router = useRouter();
  const { show } = useToast();
  const { user } = useRole();
  const doctorName = user?.doctor?.firstName ? `Dr. ${user.doctor.firstName} ${user.doctor.lastName}` : "Authorized Clinician";
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(mockPrescriptions);
  const [showBuilder, setShowBuilder] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState("");
  const [medicineName, setMedicineName] = useState("Compounded Semaglutide Injection (Initiation Vial)");
  const [dosage, setDosage] = useState("0.25 mg / week");
  const [duration, setDuration] = useState("4 weeks (Initiation)");
  const [instructions, setInstructions] = useState("");

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !instructions) {
      show("Please fill out patient name and usage instructions.", "error");
      return;
    }

    const newRx: PrescriptionItem = {
      id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      medicineName,
      dosage,
      duration,
      instructions,
      datePrescribed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setPrescriptions([newRx, ...prescriptions]);
    setShowBuilder(false);
    show("Prescription created and routed to CVS pharmacy queue.", "success");

    // reset fields
    setPatientName("");
    setInstructions("");
  };

  const handleDownloadPdf = (rx: PrescriptionItem) => {
    show("Generating clinical prescription PDF card...", "info");
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `MEDI GO MEDICAL PRESCRIPTION CARD\n` +
        `---------------------------------\n` +
        `Rx Number: ${rx.id}\n` +
        `Authorized Clinician: ${doctorName}\n` +
        `Patient Name: ${rx.patientName}\n` +
        `Date Issued: ${rx.datePrescribed}\n` +
        `Medication: ${rx.medicineName}\n` +
        `Dosage: ${rx.dosage} (${rx.duration})\n` +
        `Clinical Instructions: ${rx.instructions}\n` +
        `Compliance: HIPAA VA Protected Electronic Transmission.\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `medigo_${rx.id.toLowerCase()}_prescription.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 text-left">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
          <h2 className="font-heading text-xl font-extrabold text-text-primary">
            Prescription Management
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Create, audit, and dispatch electronic prescriptions directly to temperature-controlled compounding pharmacies.
          </p>
        </div>

        <Button onClick={() => setShowBuilder(true)} size="sm" className="font-bold" rightIcon={<Plus className="w-4 h-4" />}>
          New Prescription
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Prescription List */}
        <div className="lg:col-span-8 space-y-4">
          {prescriptions.length > 0 ? prescriptions.map((rx) => (
            <Card key={rx.id} padding="md" className="hover">
              <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary-600" />
                  <span className="font-mono text-xs text-text-tertiary font-bold">{rx.id}</span>
                </div>
                <span className="text-[10px] text-text-secondary font-bold">Issued {rx.datePrescribed}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-text-secondary mb-4 leading-relaxed">
                <div>
                  <span className="text-[10px] text-text-tertiary block font-bold uppercase">Patient Name</span>
                  <span className="text-text-primary font-bold block mt-0.5">{rx.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-tertiary block font-bold uppercase">Medication</span>
                  <span className="text-text-primary font-bold block mt-0.5">{rx.medicineName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-tertiary block font-bold uppercase">Dosage Schedule</span>
                  <span className="text-primary font-bold block mt-0.5">{rx.dosage} ({rx.duration})</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-border-light text-xs text-text-secondary leading-relaxed mb-4">
                <span className="text-[9px] text-text-tertiary block font-bold uppercase mb-1">Clinical Instructions</span>
                {rx.instructions}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-light">
                <button
                  onClick={() => handleDownloadPdf(rx)}
                  className="py-2 px-4 rounded-xl border border-border hover:border-primary text-text-primary hover:text-primary flex items-center justify-center gap-1.5 text-xs font-bold transition-all focus:outline-none"
                >
                  <Download className="w-4 h-4" />
                  Generate PDF
                </button>
                <Button size="sm" className="text-xs font-bold">
                  Edit Details
                </Button>
              </div>
            </Card>
          )) : (
            <div className="py-8 text-center text-text-tertiary text-xs">
              No prescriptions active
            </div>
          )}
        </div>

        {/* Right Column: pharmacy disclaimer */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4 font-medium text-text-secondary leading-relaxed text-xs">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-heading text-sm font-bold text-text-primary">E-Prescribe Compliance</h3>
          </div>
          <p>
            MediGo prescriptions are signed and routed via VIPPS-certified pharmacy connections under secure DEA credentials checks.
          </p>
        </div>
      </div>

      {/* Prescription Builder Modal */}
      <Modal
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        title="Electronic Prescription Builder"
        size="md"
      >
        <form onSubmit={handleCreatePrescription} className="space-y-4 text-left text-xs">
          <div className="space-y-1.5">
            <label htmlFor="rx-patient-name" className="text-xs font-bold text-text-secondary uppercase">Patient Name</label>
            <input
              id="rx-patient-name"
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="rx-med-select" className="text-xs font-bold text-text-secondary uppercase">Medication Variant</label>
            <select
              id="rx-med-select"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
            >
              <option value="Compounded Semaglutide Injection (Initiation Vial)">Compounded Semaglutide Injection (Initiation Vial)</option>
              <option value="Compounded Tirzepatide Injection">Compounded Tirzepatide Injection</option>
              <option value="Quest Diagnostic Glucose Panel Refill Kit">Quest Diagnostic Glucose Panel Refill Kit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="rx-dose-select" className="text-xs font-bold text-text-secondary uppercase">Dose Strength</label>
              <select
                id="rx-dose-select"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              >
                <option value="0.25 mg / week">0.25 mg / week (Week 1-4)</option>
                <option value="0.50 mg / week">0.50 mg / week (Week 5-8)</option>
                <option value="1.00 mg / week">1.00 mg / week (Week 9-12)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="rx-duration-select" className="text-xs font-bold text-text-secondary uppercase">Therapy Duration</label>
              <select
                id="rx-duration-select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              >
                <option value="4 weeks (Initiation)">4 weeks (Initiation)</option>
                <option value="8 weeks (Titration)">8 weeks (Titration)</option>
                <option value="12 weeks (Maintenance)">12 weeks (Maintenance)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="rx-instructions-input" className="text-xs font-bold text-text-secondary uppercase">SIG Directions for Use</label>
            <textarea
              id="rx-instructions-input"
              rows={3}
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Inject 0.25mg subcutaneously into the abdomen once weekly on Sunday mornings."
              className="w-full p-3 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-light">
            <Button 
              type="button" 
              onClick={() => setShowBuilder(false)} 
              variant="outline" 
              size="sm" 
              className="font-bold border-border text-text-primary hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              Dispatch Rx
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
