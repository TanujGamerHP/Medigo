"use client";

import React from "react";

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  step?: number;
  className?: string;
  formatValue?: (val: number) => React.ReactNode;
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  unit = "",
  step = 1,
  className = "",
  formatValue,
}: SliderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-text-primary">{label}</span>
        <span className="text-primary font-bold">
          {formatValue ? formatValue(value) : <>{value} <span className="text-text-secondary font-medium">{unit}</span></>}
        </span>
      </div>
      <div className="relative flex items-center select-none">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-background border border-border/60 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
        />
      </div>
      <div className="flex justify-between text-[10px] text-text-tertiary font-bold">
        <span>{formatValue ? formatValue(min) : `${min} ${unit}`}</span>
        <span>{formatValue ? formatValue(max) : `${max} ${unit}`}</span>
      </div>
    </div>
  );
}
