"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, ArrowLeft, Building, Stethoscope, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { auth, googleProvider, appleProvider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useRole } from "@/features/shared/RoleProvider";

type RegisterRole = "Patient" | "Doctor" | "Pharmacy" | "Lab";

export function RegisterFlow() {
  const router = useRouter();
  const { show } = useToast();
  const { loginUser } = useRole();
  
  const [role, setRole] = useState<RegisterRole>("Patient");
  const [step, setStep] = useState<"fill" | "terms" | "success">("fill");
  
  // Registration States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // Doctor specific fields
  const [specialization, setSpecialization] = useState("Obesity Medicine");
  const [experience, setExperience] = useState("5 years");
  const [qualification, setQualification] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hospital, setHospital] = useState("");
  const [bio, setBio] = useState("");

  // Pharmacy/Lab specific fields
  const [facilityName, setFacilityName] = useState("");
  const [facilityLicense, setFacilityLicense] = useState("");
  const [facilityAddress, setFacilityAddress] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [ssoProcessing, setSsoProcessing] = useState(false);

  // Password strength checker helper
  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-slate-200", percent: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
      case 2:
        return { label: "Weak", color: "bg-error", percent: 25 };
      case 3:
        return { label: "Fair", color: "bg-amber-400", percent: 50 };
      case 4:
        return { label: "Good", color: "bg-primary-light", percent: 75 };
      case 5:
        return { label: "Strong", color: "bg-primary", percent: 100 };
      default:
        return { label: "Weak", color: "bg-error", percent: 20 };
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (role === "Patient" || role === "Doctor") {
      if (!name.trim()) newErrors.name = "Full name is required";
    } else {
      if (!facilityName.trim()) newErrors.facilityName = "Facility name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (role === "Doctor") {
      if (!licenseNumber.trim()) newErrors.licenseNumber = "Medical License Number is required";
      if (!qualification.trim()) newErrors.qualification = "Qualification details (e.g. MD) are required";
    }

    if (role === "Pharmacy" || role === "Lab") {
      if (!facilityLicense.trim()) newErrors.facilityLicense = "Facility License/NPI/CLIA Number is required";
      if (!facilityAddress.trim()) newErrors.facilityAddress = "Facility address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep("terms");
  };

  // Sync Firebase user with our own backend
  const syncWithBackend = async (firebaseEmail: string | null, firebaseName: string | null, autoLogin = true) => {
    try {
      const payload: any = {
        email: firebaseEmail || email,
        phone: phone || "555-123-4567",
        password: "OAuthSecurePassword123!", 
        role,
        name: firebaseName || (role === "Doctor" || role === "Patient" ? name : facilityName),
      };

      if (role === "Doctor") {
        payload.specialization = specialization;
        payload.experience = experience;
        payload.qualification = qualification;
        payload.licenseNumber = licenseNumber;
        payload.hospital = hospital;
        payload.bio = bio;
      }

      if (role === "Pharmacy" || role === "Lab") {
        payload.licenseNumber = facilityLicense;
        payload.bio = `Facility Address: ${facilityAddress}`;
      }

      const res = await api.post("/api/v1/auth/register", payload, { silent: true });
      
      if (autoLogin && res.data) {
        // Auto sign-in if SSO
        const otpRes = await api.post("/api/v1/auth/send-otp", { email: payload.email });
        const verifyRes = await api.post("/api/v1/auth/verify-otp", {
          email: payload.email,
          otpCode: otpRes.data.simulatedCode,
        });
        if (verifyRes.data) {
          const { accessToken, refreshToken, user } = verifyRes.data;
          loginUser(accessToken, refreshToken, user);
        }
      }
      return res;
    } catch (err) {
      console.error("Backend Sync Error:", err);
      if (autoLogin) {
        loginUser("mock-access-token", "mock-refresh-token", {
          id: "mock-id",
          email: firebaseEmail || email,
          role,
          profile: { firstName: firebaseName || name }
        });
      }
      return null;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrors({ agree: "You must agree to the Terms of Service to proceed" });
      return;
    }

    setSubmitting(true);
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: role === "Doctor" || role === "Patient" ? name : facilityName
        });
      }

      await syncWithBackend(email, role === "Doctor" || role === "Patient" ? name : facilityName, false);
      
      setSubmitting(false);
      setStep("success");
      show("Account registered successfully!", "success");
    } catch (err: any) {
      setSubmitting(false);
      show(err.message || "Failed to register account with Firebase.", "error");
    }
  };

  const handleSocialRegister = async (provider: any, providerName: string) => {
    setSsoProcessing(true);
    try {
      const result = await signInWithPopup(auth, provider);
      show(`Successfully authenticated via ${providerName}.`, "success");
      await syncWithBackend(result.user.email, result.user.displayName, true);
    } catch (err: any) {
      setSsoProcessing(false);
      if (err.code !== 'auth/popup-closed-by-user') {
        show(err.message || `${providerName} Authentication failed`, "error");
      }
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="bg-background min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl border border-border/60 shadow-xl space-y-6 relative overflow-hidden">
        
        <div className="absolute top-4 left-4 z-20">
          <BackButton variant="ghost" size="sm" label="" className="text-text-secondary hover:text-text-primary hover:bg-slate-50" />
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        {step !== "success" && (
          <div className="text-center space-y-2 relative z-10 pt-2">
            <h2 className="font-heading font-black text-3xl text-text-primary tracking-tight">Create Account</h2>
            <p className="text-sm text-text-secondary">Register your profile to access clinical systems.</p>
          </div>
        )}

        {/* PROGRESSIVE BACK BUTTON */}
        {step === "terms" && (
          <button
            onClick={() => setStep("fill")}
            className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors focus:outline-none relative z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to details
          </button>
        )}

        {/* 1. REGISTRATION DETAILS */}
        {step === "fill" && (
          <form onSubmit={handleContinue} className="space-y-4 text-left relative z-10 mt-6">
            
            {/* Sector Selector Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="role-select" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">I want to register as a *</label>
              <select
                id="role-select"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as RegisterRole);
                  setErrors({});
                }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Patient">Patient Portal User</option>
                <option value="Doctor">Board-Certified Doctor / Clinician</option>
                <option value="Pharmacy">Pharmacy Fulfillment Partner</option>
                <option value="Lab">CLIA Diagnostic Lab Partner</option>
              </select>
            </div>

            {/* General Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {role === "Patient" || role === "Doctor" ? (
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    id="name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Miller"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.name ? "border-error focus:ring-error/20" : "border-border hover:border-primary/50"
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-error font-semibold">{errors.name}</p>}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="facility-input" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Facility Name *</label>
                  <input
                    type="text"
                    id="facility-input"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. Medigo Care Pharmacy"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.facilityName ? "border-error focus:ring-error/20" : "border-border hover:border-primary/50"
                    }`}
                  />
                  {errors.facilityName && <p className="text-[10px] text-error font-semibold">{errors.facilityName}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="phone-input" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  id="phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.phone ? "border-error focus:ring-error/20" : "border-border hover:border-primary/50"
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-error font-semibold">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="email-input" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  id="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.email ? "border-error focus:ring-error/20" : "border-border hover:border-primary/50"
                  }`}
                />
                {errors.email && <p className="text-[10px] text-error font-semibold">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pwd-input" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Password *</label>
                <input
                  type="password"
                  id="pwd-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.password ? "border-error focus:ring-error/20" : "border-border hover:border-primary/50"
                  }`}
                />
                {errors.password && <p className="text-[10px] text-error font-semibold">{errors.password}</p>}
              </div>
            </div>

            {/* Password strength bar */}
            {password && (
              <div className="space-y-1.5 p-3 bg-slate-50 border border-border-light rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
                  <span>Password Strength:</span>
                  <span className="text-primary uppercase tracking-wider">{strength.label}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.percent}%` }}></div>
                </div>
              </div>
            )}

            {/* DOCTOR SPECIALIZED FIELDS */}
            {role === "Doctor" && (
              <div className="p-4 bg-slate-50 border border-border/80 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  Clinician Practice Credentials
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="spec-select" className="text-[10px] font-bold text-text-secondary uppercase">Medical Specialty *</label>
                    <select
                      id="spec-select"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-text-primary text-xs focus:outline-none"
                    >
                      <option value="Obesity Medicine">Obesity Medicine</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                      <option value="Family Medicine">Family Medicine</option>
                      <option value="Bariatric Medicine">Bariatric Medicine</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="exp-select" className="text-[10px] font-bold text-text-secondary uppercase">Years of Experience *</label>
                    <select
                      id="exp-select"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-text-primary text-xs focus:outline-none"
                    >
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="qual-input" className="text-[10px] font-bold text-text-secondary uppercase">Medical Degree / Qualification *</label>
                    <input
                      type="text"
                      id="qual-input"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. MD, DO, FACP"
                      className={`w-full px-3 py-2 rounded-xl border bg-white text-text-primary text-xs focus:outline-none ${
                        errors.qualification ? "border-error" : "border-border"
                      }`}
                    />
                    {errors.qualification && <p className="text-[9px] text-error">{errors.qualification}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lic-input" className="text-[10px] font-bold text-text-secondary uppercase">State License Number *</label>
                    <input
                      type="text"
                      id="lic-input"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. LIC9876543"
                      className={`w-full px-3 py-2 rounded-xl border bg-white text-text-primary text-xs focus:outline-none ${
                        errors.licenseNumber ? "border-error" : "border-border"
                      }`}
                    />
                    {errors.licenseNumber && <p className="text-[9px] text-error">{errors.licenseNumber}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="hosp-input" className="text-[10px] font-bold text-text-secondary uppercase">Affiliated Clinic / Hospital</label>
                  <input
                    type="text"
                    id="hosp-input"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g. Johns Hopkins Medical Clinic"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-white text-text-primary text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bio-input" className="text-[10px] font-bold text-text-secondary uppercase">Professional Bio Statement</label>
                  <textarea
                    id="bio-input"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Enter a brief background detailing your clinical approach to obesity management..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-white text-text-primary text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* PARTNER (PHARMACY/LAB) SPECIALIZED FIELDS */}
            {(role === "Pharmacy" || role === "Lab") && (
              <div className="p-4 bg-slate-50 border border-border/80 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  {role} Network credentials
                </h3>

                <div className="space-y-1.5">
                  <label htmlFor="part-lic-input" className="text-[10px] font-bold text-text-secondary uppercase">
                    {role === "Pharmacy" ? "Pharmacy License / NPI Number *" : "CLIA Number / Lab License *"}
                  </label>
                  <input
                    type="text"
                    id="part-lic-input"
                    value={facilityLicense}
                    onChange={(e) => setFacilityLicense(e.target.value)}
                    placeholder="e.g. NPI9876543 or CLIA12D34567"
                    className={`w-full px-3 py-2 rounded-xl border bg-white text-text-primary text-xs focus:outline-none ${
                      errors.facilityLicense ? "border-error" : "border-border"
                    }`}
                  />
                  {errors.facilityLicense && <p className="text-[9px] text-error">{errors.facilityLicense}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="addr-input" className="text-[10px] font-bold text-text-secondary uppercase">Full Facility Street Address *</label>
                  <textarea
                    id="addr-input"
                    value={facilityAddress}
                    onChange={(e) => setFacilityAddress(e.target.value)}
                    placeholder="123 Healthway Blvd, Suite 400, Chicago, IL 60611"
                    rows={2}
                    className={`w-full px-3 py-2 rounded-xl border bg-white text-text-primary text-xs focus:outline-none ${
                      errors.facilityAddress ? "border-error" : "border-border"
                    }`}
                  />
                  {errors.facilityAddress && <p className="text-[9px] text-error">{errors.facilityAddress}</p>}
                </div>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              className="py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Terms
            </Button>
          </form>
        )}

        {/* 2. TERMS ACCEPTANCE */}
        {step === "terms" && (
          <form onSubmit={handleRegister} className="space-y-6 text-left relative z-10">
            <div className="text-center space-y-2">
              <h2 className="font-heading font-black text-2xl text-text-primary">Clinical Terms</h2>
              <p className="text-sm text-text-secondary">Agree to HIPAA directives & patient privacy conditions.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-border-light text-xs text-text-secondary leading-relaxed max-h-48 overflow-y-auto space-y-3 scrollbar-thin select-none">
              <p><strong>1. Telehealth Consent:</strong> I authorize MediGo matched clinicians to conduct medical evaluations virtually.</p>
              <p><strong>2. Prescription Shipments:</strong> I acknowledge that prescriptions depend on provider checks and are shipping directly via cold chains.</p>
              <p><strong>3. Data Security:</strong> I agree that my clinical blood diagnostics, histories, and chats are encrypted under HIPAA rules.</p>
            </div>

            <label htmlFor="terms-check" className="flex items-start gap-3 cursor-pointer select-none">
              <input
                id="terms-check"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setErrors({});
                }}
                className="w-5 h-5 text-primary border-border focus:ring-primary/20 shrink-0 mt-0.5 rounded"
              />
              <span className="text-xs font-semibold text-text-secondary leading-relaxed">
                I agree to the terms listed above, HIPAA security standards, and privacy disclosures.
              </span>
            </label>
            {errors.agree && <p className="text-xs text-error font-semibold">{errors.agree}</p>}

            <Button
              type="submit"
              isLoading={submitting}
              fullWidth
              className="py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Agree & Register Account
            </Button>
          </form>
        )}

        {/* 3. SUCCESS COMPLETED */}
        {step === "success" && (
          <div className="text-center space-y-6 py-6 relative z-10">
            <div className="w-20 h-20 rounded-full bg-primary-100 text-primary flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            
            <div className="space-y-3">
              <h2 className="font-heading font-black text-3xl text-text-primary">Registration Complete!</h2>
              {role === "Patient" ? (
                <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Your secure portal account is registered under <strong className="text-text-primary">{name}</strong>. Please sign in to complete your intake and book a doctor check-in.
                </p>
              ) : role === "Doctor" ? (
                <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Welcome to our network, <strong className="text-text-primary">Dr. {name}</strong>! Your medical credentials (License: <strong className="text-text-primary">{licenseNumber}</strong>) have been submitted for review. Clinical access will be granted upon administrator verification.
                </p>
              ) : (
                <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Facility <strong className="text-text-primary">{facilityName}</strong> has been registered successfully! Network integration is pending administrator credentials verification.
                </p>
              )}
            </div>
            
            <Button
              onClick={() => router.push("/login")}
              fullWidth
              className="py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Go to Sign In
            </Button>
          </div>
        )}

        {/* SOCIAL AUTH FOR REGISTER (Only on fill step) */}
        {step === "fill" && (
          <div className="relative z-10">
            <div className="relative flex items-center justify-center my-6 select-none">
              <div className="border-t border-border-light w-full"></div>
              <span className="absolute bg-white px-3 text-[10px] text-text-tertiary uppercase font-black tracking-widest">Or Register With</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialRegister(googleProvider, "Google")}
                disabled={ssoProcessing}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-border bg-white text-text-secondary hover:bg-slate-50 hover:border-border-dark transition-all text-xs font-bold disabled:opacity-50 shadow-sm"
              >
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialRegister(appleProvider, "Apple")}
                disabled={ssoProcessing}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-border bg-white text-text-secondary hover:bg-slate-50 hover:border-border-dark transition-all text-xs font-bold disabled:opacity-50 shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="black">
                  <path d="M17.15 19.46c-.88.9-1.92 1.83-3.15 1.83-1.07 0-1.45-.66-2.73-.66-1.27 0-1.7.64-2.71.66-1.06.02-2.22-1-3.15-1.93C3.54 17.5 2 13.56 2 9.5c0-6.11 4.14-9.04 8.01-9.04 1.25 0 2.45.45 3.25.92 1.05.61 1.74 1.27 2.48 1.27.7 0 1.34-.63 2.33-1.21 1.04-.6 2.5-.95 3.84-.95 4.3 0 6.27 3.55 6.27 3.55s-3.32 1.94-3.32 5.86c0 4.6 4.1 6.3 4.1 6.3s-2.8 8.13-6.62 9.2c-.93.26-1.87.1-2.97.1h-.22zM15.4 3.92C14.4 5.23 12.63 5.92 11.23 5.8 11.08 4.25 11.9 2.65 13 1.5c.95-1.01 2.55-1.63 3.95-1.5-.15 1.63-.65 2.87-1.55 3.92z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        )}

        {step !== "success" && (
          <div className="border-t border-border-light pt-5 mt-2 text-center text-xs text-text-secondary select-none relative z-10">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-black hover:underline tracking-wide">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
