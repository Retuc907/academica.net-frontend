import React from "react";
import { BRAND as C } from "@/constants/brand";

type BtnVariant = "primary" | "accent" | "ghost" | "danger";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  small?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const VARIANT_STYLES: Record<BtnVariant, React.CSSProperties> = {
  primary: { background: C.primary, color: "#fff", border: "none" },
  accent:  { background: C.accent,  color: "#fff", border: "none" },
  ghost:   { background: "transparent", color: C.primary, border: `1.5px solid ${C.primary}` },
  danger:  { background: "#fde8ec", color: C.accent, border: "none" },
};

export function Btn({ children, onClick, variant = "primary", small, icon, disabled }: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...VARIANT_STYLES[variant],
        borderRadius: 8,
        padding: small ? "6px 12px" : "9px 18px",
        fontSize: small ? 12 : 14,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        opacity: disabled ? 0.6 : 1,
        fontFamily: "inherit",
      }}
    >
      {icon}
      {children}
    </button>
  );
}
