"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export type UserRole = "Patient" | "Doctor" | "Admin" | "Pharmacy" | "Lab";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  phone?: string;
  patient?: any;
  doctor?: any;
}

interface RoleContextType {
  currentRole: UserRole;
  user: UserProfile | null;
  loading: boolean;
  setRole: (role: UserRole) => void;
  loginUser: (accessToken: string, refreshToken: string, user: UserProfile) => void;
  logoutUser: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
  isSimulatedSessionExpired: boolean;
  triggerSessionExpiry: () => void;
  resetSession: () => void;
  refreshProfile: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setRoleState] = useState<UserRole>("Patient");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulatedSessionExpired, setIsSimulatedSessionExpired] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load actual authenticated profile on mount
  useEffect(() => {
    async function loadProfile() {
      const { accessToken } = api.getTokens();
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/v1/users/profile");
        if (response.success && response.data) {
          const userProfile: UserProfile = {
            id: response.data.id,
            email: response.data.email,
            role: response.data.role as UserRole,
            phone: response.data.phone,
            patient: response.data.patient,
            doctor: response.data.doctor,
          };
          setUser(userProfile);
          setRoleState(userProfile.role);
        } else {
          api.clearTokens();
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        api.clearTokens();
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const refreshProfile = async () => {
    const { accessToken } = api.getTokens();
    if (!accessToken) return;
    try {
      const response = await api.get("/api/v1/users/profile");
      if (response.success && response.data) {
        setUser({
          id: response.data.id,
          email: response.data.email,
          role: response.data.role as UserRole,
          phone: response.data.phone,
          patient: response.data.patient,
          doctor: response.data.doctor,
        });
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  const loginUser = (accessToken: string, refreshToken: string, userProfile: UserProfile) => {
    api.setTokens(accessToken, refreshToken);
    setUser(userProfile);
    setRoleState(userProfile.role);
    setIsSimulatedSessionExpired(false);

    // Redirect to respective dashboards on login
    if (userProfile.role === "Patient") {
      if (!userProfile.patient || !userProfile.patient.firstName) {
        router.push("/dashboard/profile/setup");
        return;
      }
      const redirectUrl = typeof window !== 'undefined' ? localStorage.getItem('redirectAfterLogin') : null;
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push("/"); // Default patient redirect to home
      }
    }
    else if (userProfile.role === "Doctor") {
      if (!userProfile.doctor || !userProfile.doctor.firstName) {
        router.push("/doctor/profile/setup");
        return;
      }
      router.push("/doctor/dashboard");
    }
    else if (userProfile.role === "Admin") router.push("/admin/dashboard");
    else if (userProfile.role === "Pharmacy") router.push("/pharmacy/dashboard");
    else if (userProfile.role === "Lab") router.push("/lab/dashboard");
  };

  const logoutUser = () => {
    api.clearTokens();
    setUser(null);
    setRoleState("Patient");
    router.push("/login");
  };

  const setRole = (role: UserRole) => {
    setRoleState(role);
  };

  const hasPermission = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(currentRole);
  };

  const triggerSessionExpiry = () => {
    setIsSimulatedSessionExpired(true);
    router.push("/session-expired");
  };

  const resetSession = () => {
    setIsSimulatedSessionExpired(false);
    if (currentRole === "Patient") router.push("/dashboard");
    else if (currentRole === "Doctor") router.push("/doctor/dashboard");
    else if (currentRole === "Admin") router.push("/admin/dashboard");
    else if (currentRole === "Pharmacy") router.push("/pharmacy/dashboard");
    else if (currentRole === "Lab") router.push("/lab/dashboard");
  };

  // Guard routing on path changes
  useEffect(() => {
    if (loading) return;

    if (isSimulatedSessionExpired && pathname !== "/session-expired") {
      router.push("/session-expired");
      return;
    }

    // Public pages are exempt from login check
    const isPublic = [
      "/",
      "/about",
      "/contact",
      "/faq",
      "/how-it-works",
      "/pricing",
      "/privacy",
      "/refund-policy",
      "/terms",
      "/disclaimer",
      "/login",
      "/signup",
      "/verify-otp",
      "/forgot-password",
      "/reset-password",
      "/unauthorized",
      "/session-expired",
      "/admin/login",
      "/assessment",
      "/programs",
      "/doctors",
      "/dashboard/profile/setup",
      "/doctor/profile/setup",
    ].includes(pathname) || pathname.startsWith("/knowledge") || pathname.startsWith("/doctors/");

    if (isPublic) return;

    // Check if user is logged in
    const { accessToken } = api.getTokens();
    if (!accessToken) {
      router.push("/login");
      return;
    }

    // Check custom roles routing rules
    if (pathname.startsWith("/doctor") && !hasPermission(["Doctor", "Admin"])) {
      router.push("/unauthorized");
    } else if (pathname.startsWith("/admin") && !hasPermission(["Admin"])) {
      router.push("/unauthorized");
    } else if (pathname.startsWith("/pharmacy") && !hasPermission(["Pharmacy"])) {
      router.push("/unauthorized");
    } else if (pathname.startsWith("/lab") && !hasPermission(["Lab"])) {
      router.push("/unauthorized");
    } else if (pathname.startsWith("/dashboard") && !hasPermission(["Patient"])) {
      // Redirect doctor or admin to their pages if they try to access Patient dashboard
      if (currentRole === "Doctor") router.push("/doctor/dashboard");
      else if (currentRole === "Admin") router.push("/admin/dashboard");
      else if (currentRole === "Pharmacy") router.push("/pharmacy/dashboard");
      else if (currentRole === "Lab") router.push("/lab/dashboard");
    }
  }, [pathname, currentRole, isSimulatedSessionExpired, loading]);

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        user,
        loading,
        setRole,
        loginUser,
        logoutUser,
        hasPermission,
        isSimulatedSessionExpired,
        triggerSessionExpiry,
        resetSession,
        refreshProfile,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
