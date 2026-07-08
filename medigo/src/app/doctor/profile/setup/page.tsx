"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";
import { ProfilePhotoUpload } from "@/components/ui/ProfilePhotoUpload";

export default function DoctorProfileSetup() {
  const router = useRouter();
  const { user } = useRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    specialization: "",
    experience: "",
    profileImage: "",
    consultationFee: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.patch("/api/v1/users/profile", formData);
      if (response.success) {
        window.location.href = "/doctor/dashboard";
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
          <h1 className="font-heading text-2xl font-bold text-text-primary">Doctor Profile Setup</h1>
          <p className="text-text-secondary text-sm mt-2">
            Complete your professional profile to start seeing patients.
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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary ml-1">Specialization</label>
            <select
              required
              className="w-full px-4 h-12 rounded-xl border border-border bg-white text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            >
              <option value="">Select Specialization</option>
              <option value="Obesity Medicine">Obesity Medicine</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Bariatric Medicine">Bariatric Medicine</option>
              <option value="General Practitioner">General Practitioner</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary ml-1">Years of Experience</label>
            <select
              required
              className="w-full px-4 h-12 rounded-xl border border-border bg-white text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            >
              <option value="">Select Experience</option>
              <option value="0-5 years">0-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10-15 years">10-15 years</option>
              <option value="15+ years">15+ years</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <h3 className="font-semibold text-text-primary mb-4">Financial Details</h3>
            <Input
              label="Consultation Fee (₹)"
              type="number"
              min="0"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              required
              className="mb-4"
            />

            <div className="space-y-4">
              <Input
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
              />
              <Input
                label="Account Number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
              <Input
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth className="mt-8 h-12 text-sm" isLoading={loading}>
            Complete Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}
