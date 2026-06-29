import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Calculator, TrendingUp, Loader2 } from "lucide-react";
import { BRAND as C } from "@/constants/brand";
import { SectionTitle } from "@/components/shared";
import { askAcademicAssistant } from "@/api/gemini.api";
import type { GradeResponse } from "@/api/students.api";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const QUICK_QUESTIONS = [
  "¿Qué nota necesito en el examen final para aprobar con 7?",
  "¿En qué materia debo enfocarme más?",
  "Dame consejos para mejorar mi promedio este semestre",
  "¿Cuánto peso tiene cada actividad en mi calificación?",
];

interface Props {
  notas: GradeResponse[];
  promedio: number;
}

function buildGradesContext(notas: GradeResponse[], promedio: number): string {
  if (notas.length === 0) {
    return `Promedio general: ${promedio.toFixed(1)}/10\n(Sin calificaciones detalladas aún — usa datos de ejemplo para orientar al estudiante)`;
  }
  const lines = notas.map(
    (n) => `- ${n.activity} (${n.subject}): ${n.value}/${n.maxValue} · ${n.type} · ${n.date}`
  );
  return `Promedio general: ${promedio.toFixed(1)}/10\nCalificaciones:\n${lines.join("\n")}`;
}

export function AcademicAssistant({ notas, promedio }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "¡Hola! Soy tu asistente académico. Puedo ayudarte a calcular qué nota necesitas para aprobar, interpretar tus calificaciones y darte consejos de estudio. ¿En qué te ayudo?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (question: string) => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const context = buildGradesContext(notas, promedio);
      const answer = await askAcademicAssistant(q, context);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No pude procesar tu pregunta. Intenta de nuevo.";
      setMessages((prev) => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const bySubject = notas.reduce<Record<string, number[]>>((acc, n) => {
    if (!acc[n.subject]) acc[n.subject] = [];
    acc[n.subject].push(n.value);
    return acc;
  }, {});

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, minHeight: 480 }}>
      {/* Panel de notas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <SectionTitle>Resumen de Notas</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 10, background: `${C.primary}12`,
              display: "flex", alignItems: "center", justifyContent: "center", color: C.primary,
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.textMuted }}>Promedio general</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: promedio >= 7 ? "#2e7d32" : C.accent }}>
                {promedio.toFixed(1)} <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>/ 10</span>
              </p>
            </div>
          </div>

          {Object.keys(bySubject).length === 0 ? (
            <p style={{ fontSize: 13, color: C.textMuted }}>
              Tus calificaciones se cargarán desde el sistema. Mientras tanto, puedes hacer preguntas al asistente.
            </p>
          ) : (
            Object.entries(bySubject).map(([subject, values]) => {
              const avg = values.reduce((s, v) => s + v, 0) / values.length;
              return (
                <div key={subject} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{subject}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: avg >= 7 ? C.primary : C.accent }}>{avg.toFixed(1)}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: "#E2E0EE", overflow: "hidden" }}>
                    <div style={{ width: `${(avg / 10) * 100}%`, height: "100%", background: avg >= 7 ? C.primary : C.accent }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <Calculator size={13} /> Preguntas rápidas
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                style={{
                  textAlign: "left", padding: "8px 10px", borderRadius: 7,
                  border: `1px solid ${C.border}`, background: "#FAF9FD",
                  fontSize: 12, color: C.text, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.borderColor = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div style={{
        background: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={16} color={C.primary} />
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Asistente Académico IA</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, maxHeight: 380 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "85%", padding: "10px 14px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
                background: m.role === "user" ? C.primary : "#F5F4F9",
                color: m.role === "user" ? "#fff" : C.text,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.textMuted, fontSize: 13 }}>
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Pensando…
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Pregunta sobre tus notas, cálculos o consejos…"
            disabled={loading}
            style={{
              flex: 1, padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8,
              fontSize: 13, outline: "none", fontFamily: "inherit", background: "#FAF9FD",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{
              background: C.primary, color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 14px", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.5 : 1, display: "flex", alignItems: "center",
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
