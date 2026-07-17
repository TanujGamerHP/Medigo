"use client";

import React, { useState, useEffect } from "react";
import { FileText, ClipboardCheck, ArrowRight, Eye, User, FileEdit, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

interface AssessmentReviewItem {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  score: number;
  bmi: number;
  historySummary: string;
  lifestyleSummary: string;
  notes: string;
  status: "Pending" | "Reviewed";
}

export default function DoctorAssessmentsPage() {
  const { show } = useToast();
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentReviewItem[]>([]);
  const [selectedAsmId, setSelectedAsmId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await api.get('/api/v1/doctor/assessments');
        if (response.success && response.data) {
          const formatted = response.data.map((asm: any) => {
            const calculateAge = (dobString: string | null) => {
              if (!dobString) return 0;
              const dob = new Date(dobString);
              const diffMs = Date.now() - dob.getTime();
              const ageDt = new Date(diffMs);
              return Math.abs(ageDt.getUTCFullYear() - 1970);
            };
            
            return {
              id: asm.id,
              patientName: asm.patient ? `${asm.patient.firstName} ${asm.patient.lastName}` : "Unknown Patient",
              age: calculateAge(asm.patient?.dob),
              gender: asm.patient?.gender || "Not specified",
              score: asm.assessmentScore || 0,
              bmi: asm.bmi || 0,
              historySummary: asm.result || "No specific history provided.",
              lifestyleSummary: "Data from intake survey",
              notes: asm.recommendation || "",
              status: asm.recommendation ? "Reviewed" : "Pending",
            };
          });
          setAssessments(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch assessments", err);
        show("Failed to load patient assessments.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [show]);

  const activeAsm = assessments.find(a => a.id === selectedAsmId);

  const handleOpenReview = (asm: AssessmentReviewItem) => {
    setSelectedAsmId(asm.id);
    setEditingNotes(asm.notes);
  };

  const handleSaveNotes = () => {
    if (!selectedAsmId) return;
    setAssessments(assessments.map(a => 
      a.id === selectedAsmId 
        ? { ...a, notes: editingNotes, status: "Reviewed" } 
        : a
    ));
    setSelectedAsmId(null);
    show("Assessment review notes saved successfully.", "success");
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back
      </button>
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Patient Intake Assessments
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Review metabolic assessment surveys, BMI scores, and write clinical recommendation notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Assessments list */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 text-text-secondary">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-bold">Loading patient assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <Card padding="lg" className="flex flex-col items-center justify-center text-center space-y-3">
              <ClipboardCheck className="w-10 h-10 text-border" />
              <p className="text-sm font-bold text-text-primary">No Patient Assessments</p>
              <p className="text-xs text-text-secondary">
                There are no clinical intake assessments submitted by patients assigned to you yet.
              </p>
            </Card>
          ) : (
            assessments.map((asm) => (
              <Card key={asm.id} padding="md" className="hover">
                <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <span className="font-mono text-xs text-text-tertiary font-bold">#{asm.id.split('-')[0]}</span>
                  </div>
                  <Badge variant={asm.status === "Reviewed" ? "success" : "info"} size="sm">
                    {asm.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-text-secondary mb-4 leading-relaxed">
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Patient</span>
                    <span className="text-text-primary font-bold block mt-0.5">
                      {asm.patientName} ({asm.gender}, {asm.age} yrs)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Assessment Score</span>
                    <span className="text-text-primary font-bold block mt-0.5">{asm.score} / 100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase font-mono">BMI Index</span>
                    <span className="text-primary font-bold block mt-0.5">{asm.bmi}</span>
                  </div>
                </div>

                <div className="border-t border-border-light pt-3 mt-1 flex justify-between items-center">
                  <span className="text-[10px] text-text-secondary max-w-[70%] truncate italic" title={asm.notes}>
                    Notes: {asm.notes || "No notes written yet."}
                  </span>
                  <Button 
                    onClick={() => handleOpenReview(asm)}
                    size="sm" 
                    className="text-xs font-bold"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Assessment
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Right Column: Information Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <ClipboardCheck className="w-5 h-5" />
            <h3 className="font-heading text-sm font-bold text-text-primary">Clinical Audits</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Metabolic assessment reviews evaluate patient qualification score limits, lifestyle habits, and glucose metrics before clearing medical dispatches.
          </p>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedAsmId}
        onClose={() => setSelectedAsmId(null)}
        title={activeAsm ? `Clinical Intake Review — ${activeAsm.patientName}` : "Review"}
        size="md"
      >
        {activeAsm && (
          <div className="space-y-5 text-left text-xs text-text-secondary leading-relaxed">
            
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-border-light">
              <div>
                <span className="text-[9px] text-text-tertiary block font-bold uppercase">Assessment Score</span>
                <span className="text-text-primary font-bold block mt-0.5">{activeAsm.score} / 100</span>
              </div>
              <div>
                <span className="text-[9px] text-text-tertiary block font-bold uppercase">Patient BMI</span>
                <span className="text-text-primary font-bold block mt-0.5">{activeAsm.bmi}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-text-tertiary block font-bold uppercase">Medical History</span>
              <p className="text-text-primary font-semibold">{activeAsm.historySummary}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-text-tertiary block font-bold uppercase">Lifestyle Summary</span>
              <p className="text-text-primary font-semibold">{activeAsm.lifestyleSummary}</p>
            </div>

            <div className="space-y-1.5 border-t border-border-light pt-4">
              <label htmlFor="asm-notes-input" className="text-[9px] text-text-tertiary block font-bold uppercase flex items-center gap-1">
                <FileEdit className="w-3.5 h-3.5 text-primary shrink-0" />
                Doctor Recommendations & Vitals Notes
              </label>
              <textarea
                id="asm-notes-input"
                rows={3}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Write recommendations..."
                className="w-full p-3 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border-light">
              <Button 
                onClick={() => setSelectedAsmId(null)} 
                variant="outline" 
                size="sm" 
                className="font-bold border-border text-text-primary hover:bg-slate-50"
              >
                Close
              </Button>
              <Button onClick={handleSaveNotes} size="sm" className="font-bold">
                Clear & Approve
              </Button>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}
