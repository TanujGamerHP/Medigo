"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/Loader";

export default function PharmacyPageRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pharmacy/dashboard");
  }, [router]);

  return <PageLoader text="Navigating to pharmacy portal..." />;
}
