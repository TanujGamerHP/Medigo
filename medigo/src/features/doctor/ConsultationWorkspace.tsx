"use client";

import React, { useState } from "react";
import { ChevronLeft, ShieldAlert, Video, Plus, Check, Printer, FileText, CheckCircle, FileUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ConsultationWorkspaceProps {
  patientId: string;
  onBack: () => void;
}

export function ConsultationWorkspace({ patientId, onBack }: ConsultationWorkspaceProps) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"history" | "labs">("history");
  
  // Clinical Notes state
  const [clinicalNotes, setClinicalNotes] = useState("");
  
  // Prescription Composer state
  const [medication, setMedication] = useState("Semaglutide (Compounded)");
  const [dosage, setDosage] = useState("0.25mg");
  const [refills, setRefills] = useState("3");
  const [directions, setDirections] = useState("Inject 0.25mg subcutaneously once weekly for 4 weeks. Increase to 0.5mg weekly thereafter as tolerated.");
  const [signature, setSignature] = useState("");
  const [isPrescriptionSigned, setIsPrescriptionSigned] = useState(false);

  // Labs matching state
  const [labStatus, setLabStatus] = useState<"Pending Match" | "Matched" | "Approved">("Pending Match");

  const handleSignPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature.trim()) {
      addToast({
        type: "error",
        message: "Electronic signature name is required to transmit prescription.",
      });
      return;
    }
    setIsPrescriptionSigned(true);
    addToast({
      type: "success",
      message: "Prescription electronically signed and queued for CVS Pharmacy.",
    });
  };

  const handleApproveLabs = () => {
    setLabStatus("Approved");
    addToast({
      type: "success",
      message: "Patient metabolic panel verified. Eligibility cleared.",
    });
  };

  const handlePrintNote = () => {
    window.print();
  };

  // Mock patient dossier based on ID
  const patientDossier = {
    name: "Sarah Miller",
    age: 34,
    gender: "Female",
    height: "5 feet 6 inches",
    weight: "87 kg",
    bmi: 31.0,
    history: ["Type 2 Diabetes Risk", "Hypertension", "Gestational Diabetes (2021)"],
    allergies: "Penicillin",
    medications: "Metformin 500mg daily",
    recentLabs: {
      date: "2026-06-25",
      a1c: "5.8%",
      creatinine: "0.85 mg/dL",
      alt: "24 U/L",
      ast: "19 U/L",
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action back */}
      <div className="flex items-center justify-between pb-3 border-b border-border select-none">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Patient Queue</span>
        </button>
        <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded font-bold flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          HIPAA Encryption Status: ACTIVE
        </span>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Patient Medical Dossier */}
        <div className="space-y-6">
          {/* Patient Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">Patient Dossier</span>
                <h3 className="font-heading text-xl font-bold text-text-primary mt-1">{patientDossier.name}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{patientDossier.gender} • {patientDossier.age} Years Old</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold font-mono">
                BMI: {patientDossier.bmi} (Class I Obesity)
              </span>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-border-light text-center">
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase">Height</span>
                <span className="text-sm font-bold text-text-primary mt-0.5 block">{patientDossier.height}</span>
              </div>
              <div className="border-x border-border">
                <span className="text-[10px] text-text-tertiary block font-bold uppercase">Weight</span>
                <span className="text-sm font-bold text-text-primary mt-0.5 block">{patientDossier.weight}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase">Allergies</span>
                <span className="text-sm font-bold text-red-600 mt-0.5 block truncate" title={patientDossier.allergies}>
                  {patientDossier.allergies}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed History Tabs */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-border flex bg-slate-50">
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === "history"
                    ? "border-primary text-primary bg-white"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                Clinical History
              </button>
              <button
                onClick={() => setActiveTab("labs")}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === "labs"
                    ? "border-primary text-primary bg-white"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                Metabolic Lab Reports
              </button>
            </div>

            <div className="p-5 flex-1 min-h-[300px]">
              {activeTab === "history" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Comorbidities & Risk Profiles</h4>
                    <div className="flex flex-wrap gap-2">
                      {patientDossier.history.map((h) => (
                        <span key={h} className="px-3 py-1 rounded-lg bg-slate-100 text-text-primary text-xs font-semibold">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border-light pt-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Current Medications</h4>
                      <p className="text-xs text-text-primary font-medium mt-1">{patientDossier.medications}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-border-light pb-3">
                    <div>
                      <span className="text-xs font-bold text-text-primary">Quest Diagnostics Panel</span>
                      <p className="text-[10px] text-text-tertiary mt-0.5">Uploaded on {patientDossier.recentLabs.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        labStatus === "Approved" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}>
                        {labStatus}
                      </span>
                      {labStatus !== "Approved" && (
                        <button
                          onClick={handleApproveLabs}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow transition-all"
                        >
                          Approve Labs
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-50 p-3 rounded-xl border border-border-light">
                      <span className="text-[10px] text-text-tertiary block font-bold">HbA1c</span>
                      <span className="text-sm font-bold text-text-primary mt-1 block">{patientDossier.recentLabs.a1c}</span>
                      <span className="text-[9px] text-amber-600 block mt-0.5 font-semibold">Pre-diabetic</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-border-light">
                      <span className="text-[10px] text-text-tertiary block font-bold">Creatinine</span>
                      <span className="text-sm font-bold text-text-primary mt-1 block">{patientDossier.recentLabs.creatinine}</span>
                      <span className="text-[9px] text-emerald-600 block mt-0.5 font-semibold">Normal</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-border-light">
                      <span className="text-[10px] text-text-tertiary block font-bold">ALT (Liver)</span>
                      <span className="text-sm font-bold text-text-primary mt-1 block">{patientDossier.recentLabs.alt}</span>
                      <span className="text-[9px] text-emerald-600 block mt-0.5 font-semibold">Normal</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-border-light">
                      <span className="text-[10px] text-text-tertiary block font-bold">AST (Liver)</span>
                      <span className="text-sm font-bold text-text-primary mt-1 block">{patientDossier.recentLabs.ast}</span>
                      <span className="text-[9px] text-emerald-600 block mt-0.5 font-semibold">Normal</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Virtual Consult & Notes Scribe */}
        <div className="space-y-6">
          {/* Virtual Call Room Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative shadow-lg h-64 flex flex-col items-center justify-center text-white">
            <Video className="w-12 h-12 text-slate-500 animate-pulse mb-3" />
            <span className="text-sm font-semibold">Patient Room Awaiting Connection</span>
            <p className="text-[10px] text-slate-400 mt-1">Jane Doe has logged into the meeting portal.</p>
            <button className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary-600 text-slate-950 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-lg transition-transform hover:scale-[1.03]">
              <Video className="w-4 h-4" />
              Establish Audio/Video Sync
            </button>
          </div>

          {/* Medical Notes & Prescription Composer */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-heading text-sm font-bold text-text-primary">Clinical Scribe Notes</h4>
              <button
                onClick={handlePrintNote}
                className="p-1.5 rounded-lg hover:bg-slate-50 border border-border text-text-secondary hover:text-text-primary transition-all"
                title="Print Consultation Notes"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            <textarea
              placeholder="Record clinical notes (e.g. general patient vitals, side-effects reported, titration plan details)..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={4}
              className="w-full p-4 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary placeholder-text-tertiary bg-white"
            />

            {/* Prescription Composer Composer */}
            <form onSubmit={handleSignPrescription} className="border-t border-border pt-4 space-y-4">
              <h4 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-primary-600" />
                Compounding Prescription Composer
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Medication Selection</label>
                  <select
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
                  >
                    <option value="Semaglutide (Compounded)">Semaglutide (Compounded)</option>
                    <option value="Tirzepatide (Compounded)">Tirzepatide (Compounded)</option>
                    <option value="Wegovy (Brand)">Wegovy (Brand)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Starting Dosage</label>
                  <select
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
                  >
                    <option value="0.25mg">0.25mg weekly (titration)</option>
                    <option value="0.5mg">0.5mg weekly</option>
                    <option value="1.0mg">1.0mg weekly</option>
                    <option value="2.4mg">2.4mg weekly (max)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Refill Allowances</label>
                <select
                  value={refills}
                  onChange={(e) => setRefills(e.target.value)}
                  className="w-24 p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
                >
                  <option value="0">0 Refills</option>
                  <option value="3">3 Refills</option>
                  <option value="6">6 Refills</option>
                  <option value="12">12 Refills</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Usage Directions (SIG)</label>
                <textarea
                  value={directions}
                  onChange={(e) => setDirections(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
                />
              </div>

              {/* Signature Composer */}
              <div className="border-t border-dashed border-border-light pt-4 space-y-3">
                <div className="flex items-center gap-1 bg-slate-50 border border-border-light p-2.5 rounded-lg text-[10px] text-text-secondary select-none">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>By signing, you warrant that laboratory metabolic data has been matching-cleared.</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Doctor E-Signature</label>
                    <input
                      type="text"
                      placeholder="Type Full Professional Name (e.g. Dr. John Doe)"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      disabled={isPrescriptionSigned}
                      className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium disabled:bg-slate-50 disabled:text-text-tertiary"
                    />
                  </div>

                  {!isPrescriptionSigned ? (
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                      Sign & Transmit
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl whitespace-nowrap">
                      <Check className="w-4 h-4" />
                      Prescription Transmitted
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
