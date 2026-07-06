"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Activity, AlertCircle } from "lucide-react";
import { ProfilePhotoUpload } from "@/components/ui/ProfilePhotoUpload";

export default function PatientProfileSetup() {
  const router = useRouter();
  const { user } = useRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    profileImage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.patch("/api/v1/users/profile", formData);
      if (response.success) {
        // Force a page reload to re-fetch the profile in RoleProvider
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card padding="lg" className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <ProfilePhotoUpload 
              currentPhotoUrl={formData.profileImage}
              onPhotoUploaded={(url) => setFormData({ ...formData, profileImage: url })}
              size="lg"
            />
          </div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Complete Your Profile</h1>
          <p className="text-text-secondary text-sm mt-2">
            Please provide a few details to personalize your healthcare experience.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary ml-1">Date of Birth</label>
              <input
                type="date"
                required
                className="w-full px-4 h-12 rounded-xl border border-border bg-white text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary ml-1">Gender</label>
              <select
                required
                className="w-full px-4 h-12 rounded-xl border border-border bg-white text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              required
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className="mt-8 h-12 text-sm" isLoading={loading}>
            Save Profile & Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
