import React, { useState, useRef } from "react";
import { Upload, ScanLine, AlertCircle, Loader2 } from "lucide-react";
import { BRAND as C } from "@/constants/brand";
import { detectAiInDocument, type AiDetectionResult } from "@/api/gemini.api";

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getRiskColor(pct: number): string {
  if (pct >= 70) return "#dc2626";
  if (pct >= 40) return "#f59e0b";
  return "#2e7d32";
}

function getRiskLabel(pct: number): string {
  if (pct >= 70) return "Alto riesgo de IA";
  if (pct >= 40) return "Riesgo moderado";
  return "Bajo riesgo de IA";
}

export function AiDetector() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiDetectionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Solo se aceptan imágenes (JPG, PNG, WEBP).");
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const res = await detectAiInDocument(base64, mimeType);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al analizar el documento.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  const pct = result?.porcentaje ?? 0;
  const riskColor = getRiskColor(pct);

  return (
    <div style={{ maxWidth: 720 }}>
      <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
        Sube una foto del documento del alumno. La IA estimará qué porcentaje del contenido pudo ser generado por inteligencia artificial.
        Este análisis es orientativo y no se guarda en el sistema.
      </p>

      {!preview ? (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${C.border}`,
            borderRadius: 12,
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: "#FAF9FD",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
        >
          <Upload size={36} color={C.primary} style={{ margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>Arrastra una imagen o haz clic para subir</p>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>JPG, PNG o WEBP · Máx. 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <img src={preview} alt="Documento" style={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {loading && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <Loader2 size={32} color={C.primary} style={{ animation: "spin 1s linear infinite" }} />
                  <p style={{ fontSize: 13, color: C.textMuted }}>Analizando documento…</p>
                </div>
              )}

              {!loading && !result && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
                  <p style={{ fontSize: 13, color: C.textMuted }}>Imagen lista. Presiona analizar para obtener el resultado.</p>
                  <button
                    onClick={analyze}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: C.primary, color: "#fff", border: "none", borderRadius: 8,
                      padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <ScanLine size={16} /> Analizar con IA
                  </button>
                  <button onClick={reset} style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                    Cambiar imagen
                  </button>
                </div>
              )}

              {!loading && result && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: 120, height: 120, borderRadius: "50%", margin: "0 auto 12px",
                      background: `conic-gradient(${riskColor} ${pct * 3.6}deg, #E2E0EE ${pct * 3.6}deg)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{
                        width: 96, height: 96, borderRadius: "50%", background: C.card,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: riskColor }}>{pct}%</span>
                        <span style={{ fontSize: 10, color: C.textMuted }}>IA detectada</span>
                      </div>
                    </div>
                    <p style={{ fontWeight: 700, color: riskColor, fontSize: 14 }}>{getRiskLabel(pct)}</p>
                  </div>

                  <div style={{ background: "#F5F4F9", borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>JUSTIFICACIÓN</p>
                    <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{result.justificacion}</p>
                  </div>

                  <button onClick={reset} style={{
                    background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: "8px 14px", fontSize: 13, color: C.textMuted, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    Analizar otro documento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 16,
          padding: "10px 14px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca",
        }}>
          <AlertCircle size={16} color="#dc2626" />
          <p style={{ fontSize: 13, color: "#dc2626" }}>{error}</p>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
