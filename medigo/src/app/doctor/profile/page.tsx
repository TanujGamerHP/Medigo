"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, CheckCircle2, ShieldCheck, Stethoscope, Award, MapPin, Globe, LogOut, ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { show } = useToast();
  const { user, logoutUser } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const doctor = user?.doctor || {};
  const [profile, setProfile] = useState({
    name: doctor.firstName ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "",
    specialization: doctor.specialization || "General",
    qualification: doctor.qualification || "MD",
    experience: doctor.experience || "0 years",
    clinicInfo: doctor.clinicInfo || "MediGo Virtual Clinic",
    languages: doctor.languages || "English",
    consultationFee: doctor.consultationFee || 0
  });

  const initials = doctor.firstName ? `${doctor.firstName[0]}${doctor.lastName?.[0] || ""}` : "DR";

  const [form, setForm] = useState({ ...profile });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        show("Image must be under 5MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/api/v1/doctor/profile", form);
      setProfile({ ...form });
      setIsEditing(false);
      show("Clinician profile updated successfully.", "success");
    } catch (err) {
      show("Failed to update profile.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </button>
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Clinician Profile
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage your credentials details, licensing specialties, and contact listings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card padding="md" className="text-center space-y-4">
            <div className="relative group w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full bg-primary-100 text-primary font-heading font-extrabold text-3xl flex items-center justify-center shadow-inner overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : doctor.profileImage ? (
                  <img src={doctor.profileImage} alt={doctor.firstName} className="w-full h-full object-cover" />
                ) : initials}
              </div>
              {/* Camera overlay - always visible */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                title="Change profile photo"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-primary-dark transition-colors"
                title="Upload photo"
              >
                <Camera className="w-3.5 h-3.5" />
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
              <p className="text-[10px] text-text-secondary mt-0.5">{profile.specialization}</p>
            </div>

            <div className="border-t border-border-light pt-4 space-y-3.5 text-xs leading-relaxed text-left text-text-secondary font-medium">
              <div className="flex gap-2.5 items-start">
                <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-text-tertiary block font-bold uppercase">Qualifications</span>
                  <span className="text-text-primary font-bold">{profile.qualification}</span>
                </div>
              </div>
              
              <div className="flex gap-2.5 items-start">
                <Stethoscope className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-text-tertiary block font-bold uppercase">Experience</span>
                  <span className="text-text-primary font-bold">{profile.experience}</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-text-tertiary block font-bold uppercase">Clinic Info</span>
                  <span className="text-text-primary font-bold">{profile.clinicInfo}</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-text-tertiary block font-bold uppercase">Languages</span>
                  <span className="text-text-primary font-bold">{profile.languages}</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-text-tertiary block font-bold uppercase">Consultation Fee</span>
                  <span className="text-text-primary font-bold">₹{profile.consultationFee}</span>
                </div>
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
                  Edit Credentials Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="prof-name" className="text-xs font-bold text-text-secondary uppercase">Full Name</label>
                    <input
                      id="prof-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="prof-spec" className="text-xs font-bold text-text-secondary uppercase">Specialization</label>
                    <input
                      id="prof-spec"
                      type="text"
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="prof-qual" className="text-xs font-bold text-text-secondary uppercase">Qualifications</label>
                    <input
                      id="prof-qual"
                      type="text"
                      value={form.qualification}
                      onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="prof-exp" className="text-xs font-bold text-text-secondary uppercase">Experience</label>
                    <input
                      id="prof-exp"
                      type="text"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="prof-lang" className="text-xs font-bold text-text-secondary uppercase">Languages</label>
                    <input
                      id="prof-lang"
                      type="text"
                      value={form.languages}
                      onChange={(e) => setForm({ ...form, languages: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="prof-fee" className="text-xs font-bold text-text-secondary uppercase">Consultation Fee (₹)</label>
                    <input
                      id="prof-fee"
                      type="number"
                      value={form.consultationFee}
                      onChange={(e) => setForm({ ...form, consultationFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="prof-clinic" className="text-xs font-bold text-text-secondary uppercase">Clinic Address</label>
                    <input
                      id="prof-clinic"
                      type="text"
                      value={form.clinicInfo}
                      onChange={(e) => setForm({ ...form, clinicInfo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
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
                    Save Credentials
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <div className="bg-slate-50 border border-border p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-heading font-bold text-sm text-text-primary">HIPAA & AMA Licensing Verify</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your medical credentials are synced with state licensing database networks. Updates made to credentials trigger auto-reverification compliance workflows.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
