"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TrendingDown, Scale, Plus, Award, History, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";

interface Log {
  date: string;
  weight: number;
}

export function WeightTracker() {
  const { user } = useRole();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [inputWeight, setInputWeight] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await api.get("/api/v1/patient/weight-logs");
      if (data.data) {
        const fetchedLogs = data.data.map((l: any) => ({
          date: new Date(l.date).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
          weight: l.weight
        }));
        setLogs(fetchedLogs);
        
        if (fetchedLogs.length > 0) {
          setInputWeight(fetchedLogs[fetchedLogs.length - 1].weight.toString());
        } else if (user?.patient?.weight) {
          setInputWeight(user.patient.weight.toString());
        }
      }
    } catch (err) {
      console.error("Error fetching weight logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    if (isNaN(w) || w <= 20 || w >= 300) {
      alert("Please enter a valid weight (20-300 kg).");
      return;
    }

    try {
      const res = await api.post("/api/v1/patient/weight", { weight: w });
      
      if (res.success) {
        setSuccessMsg("Weight logged successfully!");
        fetchLogs();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert("Failed to log weight");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server");
    }
  };

  const stats = useMemo(() => {
    // Use the weight from the patient profile (captured during initial assessment) as the starting weight
    const start = user?.patient?.weight || (logs.length > 0 ? logs[0].weight : 0);
    const current = logs.length > 0 ? logs[logs.length - 1].weight : start;
    const lost = Math.round((start - current) * 10) / 10;
    
    // Estimate BMI based on standard height of 5ft 6in (66 inches) if patient height isn't available
    const heightInches = user?.patient?.height ? (user.patient.height / 0.0254) : 66;
    const heightMeters = heightInches * 0.0254;
    const bmiVal = Math.round((current / (heightMeters * heightMeters)) * 10) / 10;

    return { start, current, lost, bmi: bmiVal };
  }, [logs, user]);

  const chartData = useMemo(() => {
    const data: Array<{label: string, weight: number}> = [];
    if (user?.patient?.weight) {
      data.push({ label: "Start", weight: user.patient.weight });
    }
    logs.forEach(l => data.push({ label: l.date.split(" ")[0] || "Log", weight: l.weight }));
    return data;
  }, [logs, user]);

  // Compute SVG coordinates for the custom weight chart (width: 500, height: 180)
  const chartPath = useMemo(() => {
    if (chartData.length < 2) return "";
    const minW = Math.min(...chartData.map((l) => l.weight)) - 5;
    const maxW = Math.max(...chartData.map((l) => l.weight)) + 5;
    const range = maxW - minW || 10;

    const width = 500;
    const height = 180;
    const padding = 20;

    const points = chartData.map((log, idx) => {
      const x = padding + (idx / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((log.weight - minW) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [chartData]);

  const badges = [
    { name: "Metabolic Kickoff", desc: "First titration dose verified", active: true },
    { name: "Consistent Logger", desc: "Logged weight 4 weeks straight", active: logs.length >= 4 },
    { name: "First 2 kg Down", desc: "Achieved 2 kg fat loss milestone", active: stats.lost >= 2 },
    { name: "5 kg Club", desc: "Achieved 5 kg fat loss", active: stats.lost >= 5 },
  ];

  if (loading) return <div className="text-center py-10">Loading progress...</div>;

  return (
    <div className="space-y-8 text-left">
      
      {/* Daily reminder banner */}
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 border border-blue-100">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-0.5 rounded">medigo</span>
        <span>Reminder: Please update your weight daily to accurately track your current weight loss progress and BMI.</span>
      </div>

      {/* Metrics overview widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-tertiary uppercase block">Starting Weight</span>
            <span className="text-lg font-heading font-black text-text-primary">{stats.start} kg</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-tertiary uppercase block">Current Weight</span>
            <span className="text-lg font-heading font-black text-text-primary">{stats.current} kg</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-primary flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-tertiary uppercase block">Total Weight Lost</span>
            <span className="text-lg font-heading font-black text-primary">
              {stats.lost > 0 ? `-${stats.lost} kg` : "0 kg"}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-tertiary uppercase block">Current BMI</span>
            <span className="text-lg font-heading font-black text-blue-600">{stats.bmi}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SVG line chart panel */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
          
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-base text-text-primary flex items-center gap-1.5">
              <Scale className="w-5 h-5 text-primary shrink-0" />
              Weight Progression Timeline
            </h3>
            <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Weekly logs</span>
          </div>

          {/* SVG Line chart wrapper */}
          <div className="p-4 rounded-2xl bg-background border border-border-light overflow-x-auto">
            <div className="min-w-[480px]">
              <svg viewBox="0 0 500 180" className="w-full h-auto overflow-visible">
                {/* Grid guidelines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />
                <line x1="20" y1="90" x2="480" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />
                <line x1="20" y1="160" x2="480" y2="160" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3" />

                {/* Main line path */}
                {chartPath && (
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                
                {/* Dots on points */}
                {chartData.length > 0 && chartData.map((log, idx) => {
                  const minW = Math.min(...chartData.map((l) => l.weight)) - 5;
                  const maxW = Math.max(...chartData.map((l) => l.weight)) + 5;
                  const range = maxW - minW || 10;
                  // If there is only 1 point, place it in the center (x = 250)
                  const x = chartData.length === 1 
                    ? 250 
                    : 20 + (idx / (chartData.length - 1)) * (500 - 40);
                  const y = 180 - 20 - ((log.weight - minW) / range) * (180 - 40);
                  return (
                    <g key={idx} className="group/dot cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        className="fill-white stroke-primary stroke-[3.5] hover:r-7 transition-all"
                      />
                      {/* Value tooltips */}
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="text-[9px] font-bold fill-text-primary opacity-0 group-hover/dot:opacity-100 transition-opacity"
                      >
                        {log.weight} kg ({log.label})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Add log form */}
          <form onSubmit={handleAddLog} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <label htmlFor="log-weight-input" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Log Today&apos;s Weight</label>
              <input
                id="log-weight-input"
                type="number"
                step="0.1"
                placeholder="Enter weight in kg (e.g. 95.4)"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <Button
              id="log-weight-submit"
              type="submit"
              className="py-3 px-5 text-xs font-bold gradient-cta text-white w-full sm:w-auto shrink-0"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Log Weight
            </Button>
          </form>

          {successMsg && (
            <div className="flex gap-2 items-center text-xs text-success font-semibold">
              <CheckCircle2 className="w-4.5 h-4.5" />
              <span>{successMsg}</span>
            </div>
          )}

        </div>

        {/* Milestones & Badges Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Achievement badges */}
          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-text-primary flex items-center gap-1.5">
              <Award className="w-5 h-5 text-primary shrink-0" />
              Earned Badges
            </h3>
            
            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={`p-3.5 rounded-xl border flex gap-3 items-start transition-all ${
                    badge.active
                      ? "bg-gradient-to-br from-green-50/50 to-primary-50/20 border-primary-200/50"
                      : "bg-background border-border-light opacity-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    badge.active ? "bg-primary-100 text-primary border-primary-200" : "bg-white text-text-tertiary border-border"
                  }`}>
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-text-primary">{badge.name}</span>
                    <span className="block text-[9px] text-text-secondary leading-tight">{badge.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History Timeline */}
          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-text-primary flex items-center gap-1.5">
              <History className="w-5 h-5 text-primary shrink-0" />
              Logs History
            </h3>

            <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
              {logs.slice().reverse().map((log, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-text-secondary border-b border-border-light pb-2.5 last:border-0 last:pb-0">
                  <span>{log.date}</span>
                  <strong className="text-text-primary font-bold">{log.weight} kg</strong>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
