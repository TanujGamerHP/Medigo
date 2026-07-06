"use client";

import React, { useState } from "react";
import { FileText, FileUp, Search, UserCheck, ShieldCheck, Check, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Drawer } from "@/components/enterprise/Drawer";

interface LabRequest {
  id: string;
  patient: string;
  age: number;
  gender: string;
  testName: string;
  priority: "Urgent" | "Routine";
  status: "Pending Collection" | "In Analysis" | "Completed";
  dateOrdered: string;
}

const initialLabs: LabRequest[] = [];

export function LabPortal() {
  const { addToast } = useToast();
  const [labs, setLabs] = useState<LabRequest[]>(initialLabs);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);

  // File Upload states
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      addToast({ type: "error", message: "Please specify report file name to upload." });
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setLabs(
        labs.map((l) =>
          l.id === selectedLabId ? { ...l, status: "Completed" } : l
        )
      );
      setIsUploading(false);
      setFileName("");
      setSelectedLabId(null);
      addToast({
        type: "success",
        message: "Patient metabolic panel PDF successfully matching-uploaded.",
      });
    }, 1000);
  };

  const selectedLab = labs.find((l) => l.id === selectedLabId);

  const columns: TableColumn<LabRequest>[] = [
    {
      key: "id",
      label: "Req ID",
      sortable: true,
      render: (row) => <span className="font-mono text-xs text-text-tertiary font-bold">#{row.id}</span>,
    },
    {
      key: "patient",
      label: "Patient Details",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-text-primary text-xs block">{row.patient}</span>
          <span className="text-[10px] text-text-secondary block mt-0.5">
            {row.age} yrs • {row.gender}
          </span>
        </div>
      ),
    },
    {
      key: "testName",
      label: "Required Lab Panel",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-text-secondary">{row.testName}</span>,
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          row.priority === "Urgent" ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50 border-slate-200 text-slate-500"
        }`}>
          {row.priority}
        </span>
      ),
    },
    {
      key: "status",
      label: "Process Status",
      sortable: true,
      render: (row) => {
        const styles = {
          "Pending Collection": "bg-amber-50 border-amber-200 text-amber-700 animate-pulse",
          "In Analysis": "bg-blue-50 border-blue-200 text-blue-700",
          Completed: "bg-emerald-50 border-emerald-200 text-emerald-700",
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
          onClick={() => setSelectedLabId(row.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Upload Results</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Security notice */}
      <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl select-none">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div>
          <h4 className="font-heading text-xs font-bold text-emerald-950 uppercase tracking-wider">
            Quest & LabCorp HIPAA Interface Secure
          </h4>
          <p className="text-xs text-emerald-800 mt-1 max-w-2xl leading-relaxed">
            All blood panel PDF documents undergo automatic patient matching. Patient metadata is encrypted under AES-256 protocols before sync transmission.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-5 select-none">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="font-heading text-sm font-bold text-text-primary">
            Lab Panel Requests
          </h3>
        </div>

        <AdvancedTable
          data={labs}
          columns={columns}
          rowKey={(row) => row.id}
          searchKeys={["patient", "testName", "status"]}
          searchPlaceholder="Search lab requests..."
        />
      </div>

      {/* Upload report drawer */}
      <Drawer
        isOpen={!!selectedLabId}
        onClose={() => setSelectedLabId(null)}
        title={selectedLab ? `Upload Lab Results: ${selectedLab.patient}` : "Upload Panel"}
        size="md"
      >
        {selectedLab && (
          <form onSubmit={handleUploadReport} className="space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-border-light space-y-2 text-xs font-medium">
              <div>
                <span className="text-text-tertiary block mb-0.5">Required Panel</span>
                <span className="text-text-primary font-bold">{selectedLab.testName}</span>
              </div>
              <div className="border-t border-border-light pt-2">
                <span className="text-text-tertiary block mb-0.5">Priority Clearance</span>
                <span className={`font-bold ${selectedLab.priority === "Urgent" ? "text-red-500" : "text-text-primary"}`}>
                  {selectedLab.priority} Priority
                </span>
              </div>
            </div>

            {/* Upload File Input */}
            <div className="space-y-3">
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1 select-none">
                Attach Report PDF
              </label>
              <div className="border-2 border-dashed border-border hover:bg-slate-50 rounded-xl p-8 text-center cursor-pointer transition-all">
                <FileUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold text-text-primary block">Drag & Drop Metabolic PDF Report</span>
                <span className="text-[10px] text-text-tertiary block mt-1">Files limited to 10MB</span>
                <input
                  type="text"
                  placeholder="Or type mockup filename (e.g. cmp_results_sarah.pdf)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full mt-4 p-2 border border-border rounded-lg text-xs bg-white text-text-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !fileName}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isUploading ? "Uploading Panel..." : "Complete & Transmit Lab Results"}
            </button>
          </form>
        )}
      </Drawer>
    </div>
  );
}
