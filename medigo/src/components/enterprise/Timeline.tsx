"use client";

import React from "react";
import { Check, Clipboard, MessageSquare, AlertCircle, Calendar } from "lucide-react";

export interface TimelineEvent {
  id: string;
  title: string;
  desc?: string;
  time: string;
  user?: string;
  type: "Assessment" | "Note" | "Assignment" | "System" | "StageChange";
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "Assessment":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Clipboard className="w-4 h-4" />
          </div>
        );
      case "Note":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case "Assignment":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case "System":
        return (
          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      case "StageChange":
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
            <Check className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative border-l border-border-light pl-6 ml-4 space-y-6 select-none">
      {events.map((event) => (
        <div key={event.id} className="relative">
          {/* Node Icon */}
          <span className="absolute -left-10 top-0.5">{getIcon(event.type)}</span>

          <div>
            <div className="flex items-center justify-between gap-4">
              <h5 className="text-xs font-bold text-text-primary leading-tight">
                {event.title}
              </h5>
              <span className="text-[10px] text-text-tertiary whitespace-nowrap">
                {event.time}
              </span>
            </div>
            {event.desc && (
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                {event.desc}
              </p>
            )}
            {event.user && (
              <span className="inline-flex items-center text-[10px] text-text-tertiary mt-2">
                By: {event.user}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
