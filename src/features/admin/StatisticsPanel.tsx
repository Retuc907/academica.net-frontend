import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart2, Users, Clock, AlertTriangle, Sparkles, Loader2,
  TrendingUp, Activity,
} from "lucide-react";
import { BRAND as C } from "@/constants/brand";
import { KpiCard, SectionTitle } from "@/components/shared";
import { dashboardApi, type DashboardStats } from "@/api/dashboard.api";
import { studentsApi, type StudentResponse } from "@/api/students.api";
import { generateAdminInsights, type AdminInsightResult } from "@/api/gemini.api";

const ACTIVITY_HOURS = [
  { hour: "6-8", pct: 12 }, { hour: "8-10", pct: 45 }, { hour: "10-12", pct: 78 },
  { hour: "12-14", pct: 35 }, { hour: "14-16", pct: 62 }, { hour: "16-18", pct: 55 },
  { hour: "18-20", pct: 28 }, { hour: "20-22", pct: 15 },
];

interface Props {
  companyId?: string;
}

export function StatisticsPanel({ companyId }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState<AdminInsightResult | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsData, studentsData] = await Promise.all([
          dashboardApi.getStats(companyId),
          studentsApi.getAll({ companyId }),
        ]);
        setStats(statsData);
        setStudents(studentsData);
      } catch (e) {
        console.error("❌ [STATS] Error cargando datos →", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [companyId]);

  const derived = useMemo(() => {
    if (!students.length) return { enRiesgo: 0, promedioAlto: 0, distribucion: [0, 0, 0, 0] };
    const enRiesgo = students.filter((s) => s.status === "En Riesgo" || s.average < 7).length;
    const promedioAlto = students.filter((s) => s.average >= 9).length;
    const distribucion = [
      students.filter((s) => s.average < 6).length,
      students.filter((s) => s.average >= 6 && s.average < 7).length,
      students.filter((s) => s.average >= 7 && s.average < 9).length,
      students.filter((s) => s.average >= 9).length,
    ];
    return { enRiesgo, promedioAlto, distribucion };
  }, [students]);

  const generateInsights = async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const context = `
Total usuarios: ${stats?.totalUsers ?? 0}
Estudiantes: ${stats?.totalStudents ?? 0}
Profesores: ${stats?.totalProfessors ?? 0}
Cursos activos: ${stats?.activeCourses ?? 0}
Promedio institucional: ${stats?.institutionalAverage ?? 0}/10
Estudiantes en riesgo (<7): ${derived.enRiesgo}
Estudiantes con promedio alto (≥9): ${derived.promedioAlto}
Hora pico de actividad: 10:00–12:00 (78% actividad)
Distribución de calificaciones: <6: ${derived.distribucion[0]}, 6-7: ${derived.distribucion[1]}, 7-9: ${derived.distribucion[2]}, ≥9: ${derived.distribucion[3]}
      `.trim();
      const result = await generateAdminInsights(context);
      setInsights(result);
    } catch (e: unknown) {
      setInsightsError(e instanceof Error ? e.message : "Error al generar insights.");
    } finally {
      setInsightsLoading(false);
    }
  };

  const distLabels = ["< 6.0", "6.0 – 6.9", "7.0 – 8.9", "≥ 9.0"];
  const distColors = ["#dc2626", "#f59e0b", C.primary, "#2e7d32"];
  const maxDist = Math.max(...derived.distribucion, 1);

  if (loading) {
    return <p style={{ color: C.textMuted, padding: 20 }}>Cargando estadísticas…</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <KpiCard icon={<Users size={20} />} label="Estudiantes Activos" value={String(stats?.totalStudents ?? 0)} sub="Matriculados" />
        <KpiCard icon={<BarChart2 size={20} />} label="Promedio Institucional" value={String(stats?.institutionalAverage ?? 0)} sub="Sobre 10.0" accent />
        <KpiCard icon={<AlertTriangle size={20} />} label="En Riesgo Académico" value={String(derived.enRiesgo)} sub="Promedio < 7.0" />
        <KpiCard icon={<TrendingUp size={20} />} label="Alto Rendimiento" value={String(derived.promedioAlto)} sub="Promedio ≥ 9.0" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Actividad por hora */}
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <SectionTitle extra={<Activity size={16} color={C.primary} />}>Actividad en Plataforma</SectionTitle>
          <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
            Horarios con mayor uso del sistema (datos estimados)
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
            {ACTIVITY_HOURS.map((h) => (
              <div key={h.hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, color: C.textMuted }}>{h.pct}%</span>
                <div style={{
                  width: "100%", borderRadius: "4px 4px 0 0",
                  height: `${(h.pct / 78) * 100}px`,
                  background: h.pct >= 60 ? C.primary : `${C.primary}60`,
                  minHeight: 4,
                }} />
                <span style={{ fontSize: 9, color: C.textMuted, whiteSpace: "nowrap" }}>{h.hour}h</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMuted }}>
            <Clock size={13} /> Pico: 10:00 – 12:00 hrs
          </div>
        </div>

        {/* Distribución de calificaciones */}
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <SectionTitle>Distribución de Promedios</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {distLabels.map((label, i) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.text }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: distColors[i] }}>{derived.distribucion[i]} alumnos</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#E2E0EE", overflow: "hidden" }}>
                  <div style={{
                    width: `${(derived.distribucion[i] / maxDist) * 100}%`,
                    height: "100%", background: distColors[i], borderRadius: 4,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SectionTitle extra={<Sparkles size={16} color={C.accent} />}>Análisis con IA</SectionTitle>
          <button
            onClick={generateInsights}
            disabled={insightsLoading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: C.primary, color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: insightsLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: insightsLoading ? 0.7 : 1,
            }}
          >
            {insightsLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={14} />}
            {insightsLoading ? "Analizando…" : "Generar informe IA"}
          </button>
        </div>

        {!insights && !insightsError && (
          <p style={{ fontSize: 13, color: C.textMuted }}>
            Presiona el botón para que la IA analice las estadísticas y genere alertas y recomendaciones.
          </p>
        )}

        {insightsError && (
          <p style={{ fontSize: 13, color: "#dc2626" }}>{insightsError}</p>
        )}

        {insights && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{insights.resumen}</p>

            {insights.alertas.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 8 }}>ALERTAS</p>
                {insights.alertas.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px",
                    background: "#fef2f2", borderRadius: 7, marginBottom: 6, fontSize: 13, color: C.text,
                  }}>
                    <AlertTriangle size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                    {a}
                  </div>
                ))}
              </div>
            )}

            {insights.recomendaciones.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 8 }}>RECOMENDACIONES</p>
                {insights.recomendaciones.map((r, i) => (
                  <div key={i} style={{
                    padding: "8px 12px", background: "#F5F4F9", borderRadius: 7,
                    marginBottom: 6, fontSize: 13, color: C.text, borderLeft: `3px solid ${C.primary}`,
                  }}>
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
