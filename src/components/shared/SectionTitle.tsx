import React from "react";
import { BRAND as C } from "@/constants/brand";

interface SectionTitleProps {
  children: React.ReactNode;
  extra?: React.ReactNode;
}

export function SectionTitle({ children, extra }: SectionTitleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{children}</h2>
      {extra}
    </div>
  );
}
