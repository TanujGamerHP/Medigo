"use client";

import React, { useState } from "react";

interface ChartDataPoint {
  label: string;
  value: number;
}

// 1. Area Chart (used for Revenue or Weight Tracking trends)
export function AreaChart({ data, height = 240, color = "#22C55E" }: { data: ChartDataPoint[]; height?: number; color?: string }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = max - min;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.value - min) / range) * 80 - 10; // keep padding top/bottom
      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[20, 50, 80].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#F1F5F9"
            strokeWidth="0.5"
            strokeDasharray="2"
          />
        ))}

        {/* Fill Area */}
        <polygon points={fillPoints} fill="url(#areaGradient)" />

        {/* Path Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active Point Highlight */}
        {activeIdx !== null && (
          <circle
            cx={(activeIdx / (data.length - 1)) * 100}
            cy={100 - ((data[activeIdx].value - min) / range) * 80 - 10}
            r="2"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="0.5"
          />
        )}
      </svg>

      {/* Axis Labels & Interaction */}
      <div className="absolute inset-0 flex">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 h-full cursor-pointer group relative"
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {/* Tooltip */}
            {activeIdx === i && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md whitespace-nowrap z-30 pointer-events-none">
                <span className="block text-slate-400 font-semibold">{d.label}</span>
                <span className="text-sm font-bold text-primary-400">${d.value.toLocaleString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* X Axis labels */}
      <div className="flex justify-between mt-2 px-1 text-[10px] text-text-tertiary font-bold uppercase tracking-wider select-none">
        {data.map((d, i) => (
          <span key={i} className={i % 2 !== 0 && data.length > 6 ? "hidden sm:inline" : ""}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// 2. Bar Chart (used for Doctor Utilization or Active Tasks)
export function BarChart({ data, height = 240, color = "#3B82F6" }: { data: ChartDataPoint[]; height?: number; color?: string }) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 100);

  return (
    <div className="flex items-end justify-between gap-3 px-2" style={{ height: `${height}px` }}>
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center group">
            {/* Value Tooltip on Hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow whitespace-nowrap">
              {d.value}%
            </div>
            <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-40 relative flex items-end">
              <div
                style={{ height: `${pct}%`, backgroundColor: color }}
                className="w-full rounded-t-lg transition-all duration-500"
              />
            </div>
            <span className="text-[10px] text-text-tertiary font-bold mt-2 text-center truncate w-full">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// 3. Funnel Chart (used for Lead Conversion tracking)
export function FunnelChart({ data }: { data: ChartDataPoint[] }) {
  const max = data[0]?.value || 100;

  return (
    <div className="space-y-4">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const prevVal = i > 0 ? data[i - 1].value : max;
        const drop = i > 0 ? Math.round(((prevVal - d.value) / prevVal) * 100) : 0;

        return (
          <div key={d.label} className="relative space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-text-primary font-bold">{d.label}</span>
              <span className="text-text-secondary">
                {d.value.toLocaleString()} <span className="text-text-tertiary">({Math.round(pct)}%)</span>
              </span>
            </div>
            <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${pct}%` }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 flex items-center pl-3 text-[10px] text-white font-bold"
              >
                {Math.round(pct)}%
              </div>
            </div>
            {i > 0 && (
              <div className="text-[10px] text-red-500 font-bold pl-4">
                ↓ {drop}% drop-off from previous step
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 4. Donut Chart (used for Membership tiers or inventory segments)
export function DonutChart({ data, size = 160 }: { data: ChartDataPoint[]; size?: number }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const colors = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

  let currentOffset = 0;
  const segments = data.map(d => {
    const pct = (d.value / total) * 100;
    const offset = 100 - currentOffset;
    currentOffset += pct;
    return { ...d, pct, strokeDasharray: `${pct} ${100 - pct}`, strokeDashoffset: offset };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3" />
          {segments.map((seg, i) => (
              <circle
                key={seg.label}
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="3"
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-500"
              />
            ))}
        </svg>

        {/* Centered Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-text-primary">{total.toLocaleString()}</span>
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-bold">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="font-semibold text-text-primary">{d.label}:</span>
            <span className="text-text-secondary">
              {d.value.toLocaleString()} ({Math.round((d.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
