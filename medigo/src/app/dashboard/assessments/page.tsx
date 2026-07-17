"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole } from "@/features/shared/RoleProvider";
import { WeightTracker } from "@/features/progress/WeightTracker";
import { FileText, Stethoscope, FileCheck, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";

interface AssessmentRecord {
  id: string;
  date: string;
  score: number;
  eligibility: string;
  program: string;
  status: "Completed" | "Pending Review";
}

export default function AssessmentsPage() {
  const [activeSubTab, setActiveSubTab] = useState<"weight" | "reports">("weight");
  const router = useRouter();
  const { user } = useRole();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (activeSubTab === "reports") {
      fetchAssessments();
    }
  }, [activeSubTab]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/v1/assessment/history");
      if (data.data) {
        setAssessments(data.data.map((a: any) => ({
          id: a.id.substring(0, 8),
          date: new Date(a.submittedAt || a.createdAt).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
          score: Math.round(a.assessmentScore),
          eligibility: a.result,
          program: a.recommendation,
          status: "Completed"
        })));
      }
    } catch (err) {
      console.error("Error fetching assessments:", err);
    } finally {
      setLoading(false);
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-text-primary">
            Health Progress & Assessments
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Monitor your weight journey, BMI index charts, and metabolic eligibility reports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-border select-none">
          <button
            onClick={() => setActiveSubTab("weight")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "weight"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Weight Progress
          </button>
          <button
            onClick={() => setActiveSubTab("reports")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "reports"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Clinical Reports
          </button>
        </div>
      </div>

      {activeSubTab === "weight" ? (
        <WeightTracker />
      ) : (
        <div className="space-y-6 text-left animate-fade-in">
          {/* Assessment Overview List */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-8 text-center text-text-tertiary text-xs">Loading clinical reports...</div>
            ) : assessments.length > 0 ? assessments.map((asm) => (
              <Card key={asm.id} padding="md" className="hover">
                <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <span className="font-mono text-xs text-text-tertiary font-bold">#{asm.id}</span>
                  </div>
                  <Badge variant="success" size="sm">
                    {asm.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-text-secondary leading-relaxed">
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Assessment Date</span>
                    <span className="text-text-primary font-bold block mt-0.5">{asm.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Assessment Score</span>
                    <span className="text-text-primary font-bold block mt-0.5">{asm.score} / 100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Metabolic Status</span>
                    <span className="text-primary font-bold block mt-0.5">{asm.eligibility}</span>
                  </div>
                  <div className="sm:col-span-3 border-t border-border-light pt-3 mt-1">
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Recommended Program</span>
                    <span className="text-text-primary font-bold block mt-0.5">{asm.program}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-light">
                  <Button variant="outline" size="sm" className="text-xs font-bold border-border text-text-primary hover:bg-slate-50">
                    Download PDF Report
                  </Button>
                  <Button size="sm" className="text-xs font-bold">
                    View Full Details
                  </Button>
                </div>
              </Card>
            )) : (
              <div className="py-8 text-center text-text-tertiary text-xs">
                No past clinical reports found. Start an assessment to get your personalized weight loss plan.
              </div>
            )}
          </div>

          {/* New Assessment Callout */}
          <div className="bg-slate-50 border border-border p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-text-primary">Need a dosage adjustments review?</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  If you are reporting side-effects or seeking to titration-up your GLP-1 dose, take a new assessment.
                </p>
              </div>
            </div>
            <Link href="/assessment">
              <Button size="sm" className="font-bold shrink-0 shadow-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start New Assessment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
