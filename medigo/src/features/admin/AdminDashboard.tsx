"use client";

import React, { useState } from "react";
import { Shield, Users, CreditCard, Stethoscope, CheckCircle2, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "CareCoordinator" | "Pharmacist" | "LabTechnician";
  status: "Active" | "Suspended";
}

const initialTeam: TeamMember[] = [
  { id: "t01", name: "Lucky Malik", email: "lucky.m@medigo.com", role: "Admin", status: "Active" },
  { id: "t02", name: "Marc Peterson", email: "marc.p@medigo.com", role: "CareCoordinator", status: "Active" },
  { id: "t03", name: "Emily Watson", email: "emily.w@medigo.com", role: "Pharmacist", status: "Active" },
  { id: "t04", name: "David Vance", email: "david.v@medigo.com", role: "LabTechnician", status: "Active" },
];

export function AdminDashboard() {
  const { addToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  
  // Add Member form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<TeamMember["role"]>("CareCoordinator");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      addToast({
        type: "error",
        message: "Full name and email are required to invite team members.",
      });
      return;
    }

    const member: TeamMember = {
      id: `t0${team.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: "Active",
    };

    setTeam([...team, member]);
    setNewName("");
    setNewEmail("");
    addToast({
      type: "success",
      message: `Access invitation sent to ${newEmail} for role: ${newRole}.`,
    });
  };

  const toggleStatus = (id: string) => {
    setTeam(
      team.map((member) =>
        member.id === id
          ? { ...member, status: member.status === "Active" ? "Suspended" : "Active" }
          : member
      )
    );
    addToast({
      type: "info",
      message: "Team member status modified.",
    });
  };

  const removeMember = (id: string) => {
    setTeam(team.filter((m) => m.id !== id));
    addToast({
      type: "success",
      message: "Team member access credentials revoked.",
    });
  };

  const businessKPIs = [
    { label: "Monthly Recurring Revenue", value: "₹412,850", change: "+12.4% MoM", icon: <CreditCard className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Active Member Base", value: "3,892 Patients", change: "+410 this week", icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
    { label: "Clinical Specialists", value: "84 Doctors", change: "4 pending approval", icon: <Stethoscope className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
    { label: "Completed Deliveries", value: "1,240 Shipments", change: "98.5% on-time", icon: <CheckCircle2 className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {businessKPIs.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-all duration-300 flex items-start gap-4"
          >
            <div className={`p-3 rounded-xl ${kpi.bg} flex-shrink-0`}>{kpi.icon}</div>
            <div>
              <span className="text-[10px] text-text-tertiary block font-semibold uppercase tracking-wider">
                {kpi.label}
              </span>
              <span className="text-xl font-bold text-text-primary block mt-1">
                {kpi.value}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Role Management Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Team Grid */}
        <div className="xl:col-span-2 bg-white border border-border rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-2 select-none">
            <Shield className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              System Accounts & Permissions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-[10px] text-text-secondary uppercase font-bold tracking-wider select-none">
                  <th className="p-3">Team Member</th>
                  <th className="p-3">Role / Clearance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs text-text-primary">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 align-middle">
                      <div className="font-bold text-text-primary">{member.name}</div>
                      <div className="text-[10px] text-text-secondary mt-0.5">{member.email}</div>
                    </td>
                    <td className="p-3 align-middle font-semibold text-text-secondary">
                      {member.role === "Admin" ? "Admin (Clearance Level 3)" : member.role}
                    </td>
                    <td className="p-3 align-middle">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                        member.status === "Active" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-3 align-middle text-right flex items-center justify-end gap-2 h-14">
                      <button
                        onClick={() => toggleStatus(member.id)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                          member.status === "Active" ? "hover:bg-slate-100" : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                        }`}
                      >
                        {member.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete credentials"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Member form */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-2 select-none">
            <UserPlus className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              Invite Team Member
            </h3>
          </div>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Marc Peterson"
                className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. marc.p@medigo.com"
                className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">
                Assign System Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as TeamMember["role"])}
                className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
              >
                <option value="CareCoordinator">Care Coordinator (CRM Leads)</option>
                <option value="Pharmacist">Pharmacist (Compounding Queue)</option>
                <option value="LabTechnician">Lab Partner (Blood Panels Matching)</option>
                <option value="Admin">System Admin (Full Access)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Send Access Invitation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
