"use client";

import React from "react";
import { Check } from "lucide-react";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface RadioCardProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (val: string) => void;
  name: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function RadioCard({
  options,
  selectedValue,
  onChange,
  name,
  columns = 2,
  className = "",
}: RadioCardProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        const Icon = opt.icon;
        return (
          <label
            key={opt.value}
            htmlFor={`radio-${name}-${opt.value}`}
            className={`relative p-5 rounded-2xl border text-left cursor-pointer select-none flex gap-4 items-start transition-all duration-200 ${
              isSelected
                ? "bg-primary-50/40 border-primary ring-2 ring-primary/10"
                : "bg-white border-border/60 hover:border-primary/30"
            }`}
          >
            <input
              type="radio"
              id={`radio-${name}-${opt.value}`}
              name={name}
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {Icon && (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border transition-colors ${
                isSelected ? "bg-primary-100 text-primary border-primary-200" : "bg-background text-text-secondary border-border"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-1 pr-6">
              <span className="block text-xs font-bold text-text-primary leading-tight truncate whitespace-normal break-words">
                {opt.label}
              </span>
              {opt.description && (
                <span className="block text-[11px] text-text-secondary leading-relaxed break-words whitespace-normal">
                  {opt.description}
                </span>
              )}
            </div>

            {/* Checkmark bubble */}
            <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
              isSelected ? "bg-primary border-primary text-white scale-110" : "border-border text-transparent bg-background"
            }`}>
              <Check className="w-3 h-3" />
            </div>
          </label>
        );
      })}
    </div>
  );
}
