import React from "react";

const BADGE_MAP: Record<string, { bg: string; fg: string }> = {
  alta:          { bg: "#fde8ec", fg: "#66093C" },
  media:         { bg: "#fff3cd", fg: "#856404" },
  baja:          { bg: "#e8f5e9", fg: "#2e7d32" },
  activo:        { bg: "#e8f0fe", fg: "#1a56db" },
  "en riesgo":   { bg: "#fde8ec", fg: "#66093C" },
  estudiante:    { bg: "#ede7f6", fg: "#4527a0" },
  profesor:      { bg: "#e3f2fd", fg: "#0d47a1" },
  admin:         { bg: "#fce4ec", fg: "#880e4f" },
  administrador: { bg: "#fce4ec", fg: "#880e4f" },
  examen:        { bg: "#f3e5f5", fg: "#6a1b9a" },
  práctica:      { bg: "#e8f5e9", fg: "#2e7d32" },
  tarea:         { bg: "#fff8e1", fg: "#f57f17" },
  quiz:          { bg: "#e3f2fd", fg: "#0d47a1" },
  proyecto:      { bg: "#fce4ec", fg: "#880e4f" },
};

interface BadgeProps {
  text: string;
}

export function Badge({ text }: BadgeProps) {
  const style = BADGE_MAP[text.toLowerCase()] ?? { bg: "#f0f0f0", fg: "#555" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.fg,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}
