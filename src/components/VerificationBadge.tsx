"use client";

import { CheckCircle } from "lucide-react";

interface VerificationBadgeProps {
  isVerified: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function VerificationBadge({
  isVerified,
  size = "md",
  showLabel = true,
}: VerificationBadgeProps) {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const labelClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="inline-flex items-center gap-1">
      <CheckCircle
        className={`${sizeClasses[size]} text-blue-600 fill-blue-100`}
      />
      {showLabel && (
        <span className={`${labelClasses[size]} font-medium text-blue-600`}>
          Verificado
        </span>
      )}
    </div>
  );
}
