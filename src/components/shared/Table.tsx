import React from "react";
import { BRAND as C } from "@/constants/brand";

interface TableProps {
  cols: string[];
  rows: React.ReactNode[][];
}

export function Table({ cols, rows }: TableProps) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: C.accent }}>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  padding: "11px 16px",
                  textAlign: "left",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.03em",
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#fff" : "#FAF9FD",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 16px", color: C.text, verticalAlign: "middle" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
