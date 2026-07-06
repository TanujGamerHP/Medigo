"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/Loader";

export default function LabPageRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/lab/dashboard");
  }, [router]);

  return <PageLoader text="Navigating to lab portal..." />;
}
