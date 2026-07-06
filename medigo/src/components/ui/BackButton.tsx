"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";

interface BackButtonProps {
  className?: string;
  label?: string;
  variant?: "ghost" | "outline" | "primary" | "secondary";
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
}

export function BackButton({ 
  className = "", 
  label = "Back", 
  variant = "ghost",
  size = "sm",
  onClick 
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBack}
      type="button"
      leftIcon={<ArrowLeft className="w-4 h-4" />}
    >
      {label}
    </Button>
  );
}
