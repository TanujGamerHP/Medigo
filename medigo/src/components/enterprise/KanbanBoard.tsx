"use client";

import React from "react";
import { MessageSquare, Calendar, ChevronRight, ChevronLeft, User } from "lucide-react";

export interface KanbanCard {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  date?: string;
  commentsCount?: number;
  priority?: "Low" | "Medium" | "High";
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveCard: (cardId: string, targetColId: string) => void;
  onCardClick?: (cardId: string) => void;
}

export function KanbanBoard({ columns, onMoveCard, onCardClick }: KanbanBoardProps) {
  const getPriorityBadge = (p?: KanbanCard["priority"]) => {
    if (!p) return null;
    const colors = {
      Low: "bg-slate-100 text-slate-700",
      Medium: "bg-amber-50 text-amber-700 border-amber-200",
      High: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[p]}`}>
        {p}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 overflow-x-auto pb-4">
      {columns.map((col, colIdx) => (
        <div
          key={col.id}
          className="bg-slate-50 border border-border-light rounded-2xl p-4 flex flex-col min-w-[250px] max-h-[750px]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4 select-none">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
              <h4 className="font-heading text-sm font-bold text-text-primary">
                {col.title}
              </h4>
            </div>
            <span className="bg-slate-200 text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
              {col.cards.length}
            </span>
          </div>

          {/* Cards Container */}
          <div className="flex-1 overflow-y-auto space-y-3 min-h-[150px]">
            {col.cards.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-6 text-center text-xs text-text-tertiary">
                No leads in queue.
              </div>
            ) : (
              col.cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => onCardClick?.(card.id)}
                  className="bg-white border border-border rounded-xl p-3.5 hover:border-primary/40 hover:shadow-md cursor-pointer transition-all duration-200 group relative"
                >
                  {/* Card Title */}
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                      {card.title}
                    </h5>
                  </div>

                  {card.subtitle && (
                    <p className="text-[10px] text-text-secondary mt-1">
                      {card.subtitle}
                    </p>
                  )}

                  {/* Tags */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-100 text-text-secondary text-[9px] px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Footer Actions & Metadata */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light text-[10px] text-text-tertiary">
                    <div className="flex items-center gap-2">
                      {card.date && (
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" />
                          {card.date}
                        </span>
                      )}
                      {card.commentsCount !== undefined && (
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {card.commentsCount}
                        </span>
                      )}
                    </div>
                    {getPriorityBadge(card.priority)}
                  </div>

                  {/* Manual Column Shift Buttons for Accessibility & Mock Control */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 bg-slate-900 text-white rounded p-0.5 shadow">
                    {colIdx > 0 && (
                      <button
                        title="Move left"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveCard(card.id, columns[colIdx - 1].id);
                        }}
                        className="hover:text-primary-400 p-0.5"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {colIdx < columns.length - 1 && (
                      <button
                        title="Move right"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveCard(card.id, columns[colIdx + 1].id);
                        }}
                        className="hover:text-primary-400 p-0.5"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
