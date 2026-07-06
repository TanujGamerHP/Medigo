"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, ShieldAlert } from "lucide-react";
import { Button } from "./Button";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onResend: () => void;
  initialTimer?: number;
  error?: string;
  isSending?: boolean;
}

export function OtpInput({
  length = 6,
  onComplete,
  onResend,
  initialTimer = 45,
  error = "",
  isSending = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [timer, setTimer] = useState(initialTimer);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (element: HTMLInputElement, idx: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[idx] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (val && idx < length - 1) {
      inputRefs.current[idx + 1].focus();
    }

    // Submit if complete
    const combined = newOtp.join("");
    if (combined.length === length) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0) {
        inputRefs.current[idx - 1].focus();
      }
    }
  };

  const handleResendClick = async () => {
    if (timer > 0) return;
    setIsResending(true);
    await onResend();
    setIsResending(false);
    setTimer(initialTimer);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            ref={(el) => {
              if (el) inputRefs.current[idx] = el;
            }}
            value={digit}
            maxLength={1}
            onChange={(e) => handleInputChange(e.target, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`w-11 h-12 text-center text-lg font-bold border rounded-xl bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              error ? "border-error" : "border-border"
            }`}
            disabled={isSending}
          />
        ))}
      </div>

      {error && (
        <div className="flex gap-2 items-center justify-center text-xs text-error font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-center text-xs text-text-secondary">
        {timer > 0 ? (
          <span className="flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-text-tertiary" />
            Resend code in <strong className="text-text-primary font-semibold">0:{String(timer).padStart(2, "0")}</strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isResending}
            className="text-primary font-bold hover:underline focus:outline-none"
          >
            {isResending ? "Sending..." : "Resend Verification Code"}
          </button>
        )}
      </div>
    </div>
  );
}
