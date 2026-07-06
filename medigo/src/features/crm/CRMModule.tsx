"use client";

import React, { useState } from "react";
import { KanbanBoard, KanbanColumn, KanbanCard } from "@/components/enterprise/KanbanBoard";
import { Drawer } from "@/components/enterprise/Drawer";
import { Timeline, TimelineEvent } from "@/components/enterprise/Timeline";
import { MessageSquare, Phone, Mail, Calendar, Edit3, ClipboardList } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const initialColumns: KanbanColumn[] = [
  {
    id: "new",
    title: "New Leads",
    color: "bg-blue-500",
    cards: [
      { id: "lead01", title: "John Miller", subtitle: "Weight goal: -16kg • Age 45", priority: "High", date: "Jul 3", commentsCount: 2 },
      { id: "lead02", title: "Emma Watson", subtitle: "Weight goal: -9kg • Age 29", priority: "Medium", date: "Jul 2", commentsCount: 1 },
    ],
  },
  {
    id: "assessment",
    title: "Assessment Completed",
    color: "bg-purple-500",
    cards: [
      { id: "lead03", title: "Marcus Aurelius", subtitle: "BMI 31.4 • High risk HbA1c", priority: "High", date: "Jun 30", commentsCount: 4 },
    ],
  },
  {
    id: "consult",
    title: "Consultation Booked",
    color: "bg-amber-500",
    cards: [
      { id: "lead04", title: "Cleopatra Philopator", subtitle: "Video consult booked tomorrow", priority: "Low", date: "Jul 1", commentsCount: 0 },
    ],
  },
  {
    id: "prescribed",
    title: "Prescribed Queue",
    color: "bg-emerald-500",
    cards: [
      { id: "lead05", title: "Alexander Great", subtitle: "Semaglutide 0.25mg approved", priority: "Medium", date: "Jun 28", commentsCount: 3 },
    ],
  },
  {
    id: "active",
    title: "Active Member",
    color: "bg-teal-500",
    cards: [
      { id: "lead06", title: "Julius Caesar", subtitle: "Member since May 2026", priority: "Low", date: "May 15", commentsCount: 8 },
    ],
  },
];

const mockLeadTimelines: Record<string, TimelineEvent[]> = {
  lead01: [
    { id: "evt1", title: "Onboarding assessment started", desc: "Patient completed the first 3 wizard steps.", time: "2 hours ago", type: "Assessment" },
    { id: "evt2", title: "Lead logged in pipeline", desc: "Captured landing page UTM params.", time: "2 hours ago", type: "System" },
  ],
  lead03: [
    { id: "evt3", title: "AI Assessment Analyzed", desc: "Calculated BMI 31.4. Metabolic pre-diabetic risk flags triggered.", time: "3 days ago", type: "Assessment" },
    { id: "evt4", title: "Assigned Care Coordinator", desc: "Lead routed to Marc Peterson.", time: "3 days ago", type: "Assignment" },
  ],
};

export function CRMModule() {
  const { addToast } = useToast();
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Follow-up notes and calendar states
  const [internalNote, setInternalNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const handleMoveCard = (cardId: string, targetColId: string) => {
    let cardToMove: KanbanCard | null = null;
    
    // Find and remove card from source column
    const nextColumns = columns.map((col) => {
      const card = col.cards.find((c) => c.id === cardId);
      if (card) {
        cardToMove = card;
        return {
          ...col,
          cards: col.cards.filter((c) => c.id !== cardId),
        };
      }
      return col;
    });

    // Add card to target column
    if (cardToMove) {
      const targetColumns = nextColumns.map((col) => {
        if (col.id === targetColId) {
          return {
            ...col,
            cards: [...col.cards, cardToMove!],
          };
        }
        return col;
      });
      setColumns(targetColumns);
      addToast({
        type: "success",
        message: "Lead pipeline status updated successfully.",
      });
    }
  };

  const selectedLead = columns.flatMap((c) => c.cards).find((c) => c.id === selectedLeadId);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim()) return;

    if (selectedLeadId && mockLeadTimelines[selectedLeadId]) {
      const newEvt: TimelineEvent = {
        id: `evt-${Date.now()}`,
        title: "Internal Note Added",
        desc: internalNote,
        time: "Just now",
        user: "Marc Peterson (Coordinator)",
        type: "Note",
      };
      mockLeadTimelines[selectedLeadId] = [newEvt, ...mockLeadTimelines[selectedLeadId]];
      setInternalNote("");
      addToast({ type: "success", message: "Internal note saved to lead timeline." });
    }
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;
    
    if (selectedLeadId && mockLeadTimelines[selectedLeadId]) {
      const newEvt: TimelineEvent = {
        id: `evt-${Date.now()}`,
        title: "Follow-up Task Scheduled",
        desc: `Call queued for ${followUpDate}`,
        time: "Just now",
        user: "Marc Peterson",
        type: "Assignment",
      };
      mockLeadTimelines[selectedLeadId] = [newEvt, ...mockLeadTimelines[selectedLeadId]];
      setFollowUpDate("");
      addToast({ type: "success", message: "Follow-up task queued in calendar." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border select-none">
        <h3 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary-600" />
          CRM Lead Pipeline Manager
        </h3>
        <p className="text-[10px] text-text-secondary max-w-md hidden sm:block">
          Use the top-right arrows on cards to move leads between stages. Click a card to open detailed dossiers.
        </p>
      </div>

      <KanbanBoard
        columns={columns}
        onMoveCard={handleMoveCard}
        onCardClick={setSelectedLeadId}
      />

      {/* CRM Detailed Lead Drawer */}
      <Drawer
        isOpen={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        title={selectedLead ? `CRM Lead Profile: ${selectedLead.title}` : "Lead Profile"}
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Quick Contact bar */}
            <div className="bg-slate-50 border border-border-light p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between text-xs font-semibold select-none">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{selectedLead.title.toLowerCase().replace(" ", ".")}@example.com</span>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                Priority: {selectedLead.priority}
              </span>
            </div>

            {/* Note Scribe Form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <label className="text-[10px] text-text-tertiary block font-bold uppercase select-none">
                Add Coordinator Scribe Log
              </label>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Enter internal comment log (e.g. details from call, pre-screening feedback)..."
                rows={2}
                className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02]"
              >
                Log Internal Comment
              </button>
            </form>

            {/* Schedule Follow-up Form */}
            <form onSubmit={handleScheduleFollowUp} className="space-y-3 border-t border-border-light pt-4">
              <label className="text-[10px] text-text-tertiary block font-bold uppercase select-none">
                Schedule Task Follow-Up
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="p-2 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-600 text-slate-950 rounded-xl text-xs font-bold shadow transition-all"
                >
                  Schedule Call
                </button>
              </div>
            </form>

            {/* Activity History Timeline */}
            <div className="border-t border-border-light pt-4 space-y-4">
              <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider select-none">
                Lead Activity Timeline
              </h4>
              <Timeline events={mockLeadTimelines[selectedLead.id] || []} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
