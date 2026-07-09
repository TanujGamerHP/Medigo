"use client";

import React, { useState, useRef } from "react";
import { User, CheckCircle2, ShieldCheck, LogOut, ArrowLeft, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { show } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, logoutUser, refreshProfile } = useRole();
  const patient = user?.patient || {};
  
  const [profile, setProfile] = useState({
    name: patient.firstName ? `${patient.firstName} ${patient.lastName}` : "",
    email: user?.email || "",
    phone: patient.phone || "",
    age: patient.dob ? Math.floor((new Date().getTime() - new Date(patient.dob).getTime()) / 3.15576e+10).toString() : "",
    gender: patient.gender || "",
    height: patient.height ? `${patient.height} cm` : "",
    weight: patient.weight ? `${patient.weight} kg` : "",
    bloodGroup: patient.bloodGroup || ""
  });

  const initials = profile.name ? `${profile.name.split(' ')[0]?.[0] || ''}${profile.name.split(' ')[1]?.[0] || ''}`.toUpperCase() : "P";

  const [form, setForm] = useState({ ...profile });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        show("Image must be under 5MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
        try {
          await api.patch("/api/v1/users/profile", { profileImage: base64 });
          await refreshProfile();
          show("Profile photo updated successfully.", "success");
        } catch (err) {
          show("Failed to save profile photo.", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch("/api/v1/users/profile", {
        firstName: form.name.split(" ")[0] || "",
        lastName: form.name.split(" ").slice(1).join(" ") || "",
        phone: form.phone,
        gender: form.gender,
        height: form.height.replace(" cm", ""),
        weight: form.weight.replace(" kg", ""),
      });
      await refreshProfile();
      setProfile({ ...form });
      setIsEditing(false);
      show("Profile updated successfully.", "success");
    } catch (err) {
      show("Failed to update profile.", "error");
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
            My Medical Profile
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your personal healthcare files, demographic statistics, and vitals details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card padding="md" className="text-center space-y-4">
            <div className="relative group w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary-100 text-primary font-heading font-extrabold text-2xl flex items-center justify-center shadow-inner overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : patient.profileImage ? (
                  <img src={patient.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              {/* Camera hover overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                title="Change profile photo"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              {/* Badge button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-primary-dark transition-colors"
                title="Upload photo"
              >
                <Camera className="w-3 h-3" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            
            <div>
              <h4 className="font-heading text-base font-bold text-text-primary">{profile.name}</h4>
              <p className="text-[10px] text-text-secondary mt-0.5">{profile.email}</p>
            </div>

            <div className="border-t border-border-light pt-4 space-y-3 text-xs leading-relaxed text-left text-text-secondary font-medium">
              <div className="flex justify-between border-b border-border-light pb-2">
                <span className="text-text-tertiary font-bold uppercase text-[9px]">Age</span>
                <span className="text-text-primary font-bold">{profile.age} yrs</span>
              </div>
              <div className="flex justify-between border-b border-border-light pb-2">
                <span className="text-text-tertiary font-bold uppercase text-[9px]">Gender</span>
                <span className="text-text-primary font-bold">{profile.gender}</span>
              </div>
              <div className="flex justify-between border-b border-border-light pb-2">
                <span className="text-text-tertiary font-bold uppercase text-[9px]">Height</span>
                <span className="text-text-primary font-bold">{profile.height}</span>
              </div>
              <div className="flex justify-between border-b border-border-light pb-2">
                <span className="text-text-tertiary font-bold uppercase text-[9px]">Weight</span>
                <span className="text-text-primary font-bold">{profile.weight}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-text-tertiary font-bold uppercase text-[9px]">Blood Group</span>
                <span className="text-text-primary font-bold">{profile.bloodGroup}</span>
              </div>
            </div>

            {!isEditing && (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex-1 font-bold border-primary text-text-primary rounded-xl btn-hover-brand transition-all duration-300">
                  Edit Profile
                </Button>
                <Button onClick={logoutUser} variant="outline" size="sm" leftIcon={<LogOut className="w-4 h-4" />} className="font-bold border-red-500 text-red-500 rounded-xl btn-hover-brand transition-all duration-300">
                  Logout
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-8">
          {isEditing ? (
            <Card padding="md">
              <form onSubmit={handleSave} className="space-y-4">
                <h3 className="font-heading text-sm font-bold text-text-primary pb-3 border-b border-border-light">
                  Edit Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="profile-name-input" className="text-xs font-bold text-text-secondary uppercase">Full Name</label>
                    <input
                      id="profile-name-input"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-phone-input" className="text-xs font-bold text-text-secondary uppercase">Phone Number</label>
                    <input
                      id="profile-phone-input"
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-age-input" className="text-xs font-bold text-text-secondary uppercase">Age</label>
                    <input
                      id="profile-age-input"
                      type="number"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-gender-input" className="text-xs font-bold text-text-secondary uppercase">Gender</label>
                    <input
                      id="profile-gender-input"
                      type="text"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-height-input" className="text-xs font-bold text-text-secondary uppercase">Height</label>
                    <input
                      id="profile-height-input"
                      type="text"
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-weight-input" className="text-xs font-bold text-text-secondary uppercase">Weight</label>
                    <input
                      id="profile-weight-input"
                      type="text"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                  <Button 
                    type="button" 
                    onClick={() => {
                      setForm({ ...profile });
                      setIsEditing(false);
                    }} 
                    variant="outline" 
                    size="sm" 
                    className="font-bold border-border text-text-primary hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="font-bold">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <div className="bg-slate-50 border border-border p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-heading font-bold text-sm text-text-primary">HIPAA Secure Records</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your medical files and personal details are encrypted. Only authorized clinicians matched with your weight loss plan have clearance to inspect these metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
