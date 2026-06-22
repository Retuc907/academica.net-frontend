import React from "react";
import { BRAND as C } from "@/constants/brand";

interface FieldInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export function FieldInput({ label, value, onChange, placeholder, type = "text" }: FieldInputProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          border: `1.5px solid ${C.border}`,
          borderRadius: 8,
          padding: "9px 12px",
          fontSize: 13,
          color: C.text,
          outline: "none",
          background: "#fafafa",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
      />
    </div>
  );
}
