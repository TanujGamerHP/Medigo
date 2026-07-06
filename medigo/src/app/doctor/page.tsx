"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/Loader";

export default function DoctorPageRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/doctor/dashboard");
  }, [router]);

  return <PageLoader text="Navigating to doctor dashboard..." />;
}
