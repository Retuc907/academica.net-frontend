import React, { useState, useMemo, useEffect } from "react";
import { BarChart2, BookOpen, CheckCircle, ClipboardList, Clock, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard, Badge, Table, SectionTitle } from "@/components/shared";
import { BRAND as C } from "@/constants/brand";
import { cursosApi } from "@/api/cursos.api";
import { studentsApi } from "@/api/students.api";
import type { CourseResponse } from "@/api/cursos.api";
import type { GradeResponse, StudentResponse } from "@/api/students.api";
import { useAuth } from "@/features/auth/AuthContext";
import { ENTREGAS_MOCK } from "@/constants/mockData";
import type { StudentSection } from "@/types";

export function StudentPanel() {
  const { user, logout, switchUser } = useAuth();
  const [section, setSection]   = useState<StudentSection>("dashboard");
  const [busqueda, setBusqueda] = useState("");

  const [cursos, setCursos]   = useState<CourseResponse[]>([]);
  const [notas, setNotas]     = useState<GradeResponse[]>([]);
  const [miPerfil, setMiPerfil] = useState<StudentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        // Cargar cursos
        const cursosData = await cursosApi.getAll(user?.companyId);
        setCursos(cursosData);

        // Buscar el perfil del estudiante en la lista y cargar sus notas
        const estudiantes = await studentsApi.getAll({ companyId: user?.companyId });
        const yo = estudiantes.find((e) => e.name === user?.nombre) ?? estudiantes[0];
        if (yo) {
          setMiPerfil(yo);
          const notasData = await studentsApi.getGrades(yo.id);
          setNotas(notasData);
        }
      } catch (e) {
        console.error("❌ [STUDENT] Error cargando datos →", e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [user?.companyId, user?.nombre]);

  const cursosFiltrados = useMemo(
    () => cursos.filter(
      (c) =>
        c.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.code.toLowerCase().includes(busqueda.toLowerCase())
    ),
    [cursos, busqueda]
  );

  // Calcular KPIs del estudiante
  const promedio      = miPerfil?.average ?? 0;
  const asistencia    = miPerfil?.attendance ?? 0;
  const notasRecientes = notas.slice(0, 4);

  return (
    <AppLayout
      sidebarProps={{
        role: "estudiante",
        userName: user?.nombre ?? "",
        activeSection: section,
        onSection: (s) => setSection(s as StudentSection),
        onLogout: logout,
        onSwitchUser: switchUser,
      }}
    >
      <div style={{ padding: "28px 32px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 21, fontWeight: 800, color: C.text }}>
            {section === "dashboard"   && "Dashboard"}
            {section === "cursos"      && "Mis Cursos"}
            {section === "rendimiento" && "Rendimiento Académico"}
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {user?.companyName ?? "Ciclo Escolar 2026-1"}
          </p>
        </div>

        {loading && (
          <p style={{ color: C.textMuted, padding: 20 }}>Cargando datos…</p>
        )}

        {!loading && section === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              <KpiCard icon={<BarChart2 size={20} />}     label="Promedio General"    value={promedio.toFixed(1)}   sub="Sobre 10.0" />
              <KpiCard icon={<BookOpen size={20} />}      label="Cursos Activos"      value={String(cursos.length)} sub="Este semestre" />
              <KpiCard icon={<CheckCircle size={20} />}   label="Asistencia"          value={`${asistencia}%`}      sub="Promedio general" />
              <KpiCard icon={<ClipboardList size={20} />} label="Notas Registradas"   value={String(notas.length)}  sub="Total" accent />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
                <SectionTitle>Notas Recientes</SectionTitle>
                {notasRecientes.length === 0
                  ? <p style={{ color: C.textMuted, fontSize: 13 }}>Sin notas registradas.</p>
                  : notasRecientes.map((n, i) => (
                  <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < notasRecientes.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{n.activity}</p>
                      <p style={{ fontSize: 11, color: C.textMuted }}>{n.subject}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: n.value >= 9 ? "#2e7d32" : n.value >= 7 ? C.primary : C.accent }}>{n.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
                <SectionTitle>Próximas Entregas</SectionTitle>
                {ENTREGAS_MOCK.slice(0, 4).map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{e.tarea}</p>
                      <p style={{ fontSize: 11, color: C.textMuted }}>{e.plazo}</p>
                    </div>
                    <Badge text={e.prioridad} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && section === "cursos" && (
          <div>
            <div style={{ position: "relative", marginBottom: 18, maxWidth: 340 }}>
              <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
              <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar curso por nombre o código..."
                onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                style={{ width: "100%", padding: "9px 12px 9px 34px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.text, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ height: "calc(100vh - 220px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {cursosFiltrados.length === 0
                ? <p style={{ textAlign: "center", color: C.textMuted, padding: 40 }}>Sin resultados.</p>
                : cursosFiltrados.map((c) => (
                  <div key={c.id} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: `${C.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}>
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{c.name}</p>
                        <p style={{ fontSize: 11, color: C.textMuted }}>{c.code} · {c.professor} · {c.schedule}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 22, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 10, color: C.textMuted }}>Créditos</p>
                        <p style={{ fontWeight: 700, color: C.text }}>{c.credits}</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 10, color: C.textMuted }}>Promedio</p>
                        <p style={{ fontWeight: 700, color: c.average >= 9 ? "#2e7d32" : c.average >= 7 ? C.primary : C.accent }}>{c.average?.toFixed(1)}</p>
                      </div>
                      {c.modality && (
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 10, color: C.textMuted }}>Modalidad</p>
                          <p style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{c.modality}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!loading && section === "rendimiento" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <SectionTitle>Mis Calificaciones</SectionTitle>
              {notas.length === 0
                ? <p style={{ color: C.textMuted, padding: 20 }}>Sin calificaciones registradas.</p>
                : <Table
                    cols={["Actividad", "Materia", "Tipo", "Fecha", "Calificación"]}
                    rows={notas.map((n) => [
                      <span style={{ fontWeight: 500 }}>{n.activity}</span>,
                      <span style={{ color: C.textMuted }}>{n.subject}</span>,
                      <Badge text={n.type} />,
                      n.date,
                      <span style={{ fontWeight: 700, color: n.value >= 9 ? "#2e7d32" : n.value >= 7 ? C.primary : C.accent }}>{n.value} / {n.maxValue}</span>,
                    ])}
                  />
              }
            </div>
            <div>
              <SectionTitle>Próximas Entregas</SectionTitle>
              <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                {ENTREGAS_MOCK.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: i < ENTREGAS_MOCK.length - 1 ? `1px solid ${C.border}` : "none", background: i % 2 === 0 ? "#fff" : "#FAF9FD" }}>
                    <Clock size={14} style={{ color: C.accent, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{e.tarea}</p>
                      <p style={{ fontSize: 11, color: C.textMuted }}>{e.materia}</p>
                    </div>
                    <p style={{ fontSize: 12, color: C.textMuted, marginRight: 10 }}>{e.plazo}</p>
                    <Badge text={e.prioridad} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
