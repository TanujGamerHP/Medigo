"use client";

import React, { useState } from "react";
import { Mail, Phone, Lock, ArrowLeft, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import Link from "next/link";
import { useRole } from "@/features/shared/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export function LoginUX() {
  const router = useRouter();
  const { loginUser } = useRole();
  const { show } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [verifying, setVerifying] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateCredentials = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sync Firebase user with our own backend
  const syncWithBackend = async (firebaseEmail: string | null, firebaseName: string | null) => {
    try {
      // Simulate backend sync for the frontend context
      const randomPatientEmail = firebaseEmail || `user.${Math.floor(Math.random() * 1000)}@medigo.com`;
      
      // Auto-register/sync the user to the NestJS backend
      await api.post("/api/v1/auth/register", {
        email: randomPatientEmail,
        password: "OAuthSecurePassword123!",
        role: "Patient",
        name: firebaseName || "MediGo Portal User",
        phone: "555-123-4567"
      }, { silent: true }).catch(() => { /* Ignore if already registered */ });

      const otpRes = await api.post("/api/v1/auth/send-otp", { email: randomPatientEmail });
      const code = otpRes.data.simulatedCode;

      const verifyRes = await api.post("/api/v1/auth/verify-otp", {
        email: randomPatientEmail,
        otpCode: code,
      });

      if (verifyRes.data) {
        const { accessToken, refreshToken, user } = verifyRes.data;
        loginUser(accessToken, refreshToken, user);
      }
    } catch (err) {
      console.error("Backend Sync Error:", err);
      // Fallback: If backend is down, we still log them in locally for testing
      loginUser("mock-access-token", "mock-refresh-token", {
        id: "mock-id",
        email: firebaseEmail || "mock@medigo.com",
        role: "Patient",
        profile: { firstName: firebaseName || "Patient" }
      });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCredentials()) return;

    setVerifying(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      show("Successfully logged in securely via Firebase.", "success");
      await syncWithBackend(userCredential.user.email, userCredential.user.displayName);
    } catch (err: any) {
      setVerifying(false);
      
      const errorCode = err.code;
      if (errorCode === 'auth/user-not-found') {
        show("You don't have an account. Please sign up first.", "error");
        router.push("/signup");
      } else if (errorCode === 'auth/wrong-password') {
        show("Incorrect password. Please try again.", "error");
      } else if (errorCode === 'auth/invalid-credential') {
        show("Invalid email or password. If you don't have an account, please sign up.", "error");
      } else {
        show(err.message || "Invalid credentials. Please try again.", "error");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setVerifying(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      show("Successfully authenticated via Google.", "success");
      await syncWithBackend(result.user.email, result.user.displayName);
    } catch (err: any) {
      setVerifying(false);
      if (err.code !== 'auth/popup-closed-by-user') {
        show(err.message || "Google Authentication failed", "error");
      }
    }
  };


  return (
    <div className="bg-background min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-border/60 shadow-xl space-y-6 text-left relative overflow-hidden">
        
        <div className="absolute top-4 left-4 z-20">
          <BackButton variant="ghost" size="sm" label="" className="text-text-secondary hover:text-text-primary hover:bg-slate-50" />
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 text-center relative z-10 pt-2">
          <h2 className="font-heading font-black text-3xl text-text-primary tracking-tight">Sign In</h2>
          <p className="text-sm text-text-secondary">Enter credentials to securely log into your MediGo portal.</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5 relative z-10 mt-6">
          
          <div className="space-y-1.5">
            <label htmlFor="email-field" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider select-none">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-text-tertiary">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <input
                type="email"
                id="email-field"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                placeholder="patient@medigo.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.email ? "border-error focus:ring-error/20" : "border-border hover:border-primary/50"
                }`}
              />
            </div>
            {errors.email && <p className="text-[10px] font-semibold text-error mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password-field" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider select-none">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-text-tertiary">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type="password"
                id="password-field"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.password ? "border-error focus:ring-error/20" : "border-border hover:border-primary/50"
                }`}
              />
            </div>
            {errors.password && <p className="text-[10px] font-semibold text-error mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-end pt-1">
            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={verifying}
            fullWidth
            className="py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            Secure Sign In
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6 select-none z-10">
          <div className="border-t border-border-light w-full"></div>
          <span className="absolute bg-white px-3 text-[10px] text-text-tertiary uppercase font-black tracking-widest">Or Continue With</span>
        </div>

        {/* Social SSO Logins - Fixed Logos */}
        <div className="grid grid-cols-1 gap-3 z-10 relative">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={verifying}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-border bg-white text-text-secondary hover:bg-slate-50 hover:border-border-dark transition-all text-xs font-bold disabled:opacity-50 shadow-sm w-full"
          >
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="border-t border-border-light pt-5 mt-2 text-center text-xs text-text-secondary select-none relative z-10">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-black hover:underline tracking-wide">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
