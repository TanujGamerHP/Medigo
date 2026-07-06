"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordStrength = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    let strength = "Weak";
    let color = "bg-error";
    if (score === 4) {
      strength = "Strong";
      color = "bg-success";
    } else if (score >= 2) {
      strength = "Moderate";
      color = "bg-amber-500";
    }

    return { score, strength, color };
  }, [password]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!password) {
      newErrors.password = "New password is required";
    } else if (passwordStrength.score < 2) {
      newErrors.password = "Password is too weak";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    // Mock API update password delay
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center pt-24 pb-12">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-lg text-center space-y-6">
        
        {isSuccess ? (
          <div className="space-y-6 py-6">
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-xl text-text-primary">
                Password Restored
              </h2>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                Your clinical account credentials have been updated successfully.
              </p>
            </div>
            <div className="pt-4">
              <Button
                id="reset-success-login"
                onClick={() => router.push("/login")}
                fullWidth
                className="py-3 text-sm font-bold gradient-cta text-white"
              >
                Sign In Now
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading font-bold text-2xl text-text-primary">
                Create New Password
              </h1>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                Set a strong password for your MediGo account below to restore portal dashboard privileges.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="new-password-input" className="text-sm font-semibold text-text-primary">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password-input"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-4 pr-11 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.password ? "border-error" : "border-border"
                    }`}
                  />
                  <button
                    type="button"
                    id="reset-toggle-pwd"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-3.5 text-text-tertiary hover:text-text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-error">{errors.password}</p>}

                {/* Password strength visual indicator */}
                {password && (
                  <div className="pt-1.5 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary uppercase">
                      <span>Strength:</span>
                      <span className={passwordStrength.score >= 3 ? "text-success" : passwordStrength.score >= 2 ? "text-amber-500" : "text-error"}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-background rounded-full overflow-hidden border border-border-light">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-password-input" className="text-sm font-semibold text-text-primary">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirm-password-input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                    errors.confirmPassword ? "border-error" : "border-border"
                  }`}
                />
                {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword}</p>}
              </div>

              <Button
                id="reset-submit-btn"
                type="submit"
                isLoading={isSending}
                fullWidth
                className="py-3 text-sm font-bold gradient-cta text-white"
              >
                Reset Password
              </Button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
