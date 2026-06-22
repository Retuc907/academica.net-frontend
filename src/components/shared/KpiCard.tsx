import React from "react";
import { BRAND as C } from "@/constants/brand";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export function KpiCard({ icon, label, value, sub, accent }: KpiCardProps) {
  return (
    <div
      style={{
        background: C.card,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        padding: "20px 22px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        boxShadow: "0 1px 4px rgba(34,9,102,0.06)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          flexShrink: 0,
          background: accent ? `${C.accent}18` : `${C.primary}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent ? C.accent : C.primary,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 23, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}
