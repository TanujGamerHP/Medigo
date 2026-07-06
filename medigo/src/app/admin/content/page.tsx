"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/Loader";

export default function AdminContentPageRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/content/blogs");
  }, [router]);

  return <PageLoader text="Loading CMS modules..." />;
}
