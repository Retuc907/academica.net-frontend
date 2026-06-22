import React, { useState, useEffect } from "react";
import { BarChart2, BookOpen, CheckCircle, ClipboardList, Edit2, GraduationCap, Save, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard, Popup, Btn, FieldInput, SectionTitle } from "@/components/shared";
import { BRAND as C } from "@/constants/brand";
import { dashboardApi } from "@/api/dashboard.api";
import type { DashboardStats } from "@/api/dashboard.api";
import { useAuth } from "@/features/auth/AuthContext";
import { CrudUsuarios } from "./CrudUsuarios";
import type { AdminSection } from "@/types";

export function AdminPanel() {
  const { user, logout, switchUser } = useAuth();
  const [section, setSection]           = useState<AdminSection>("dashboard");
  const [stats, setStats]               = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [popupSeccion, setPopupSeccion] = useState<string | null>(null);
  const [seccionConfig, setSeccionConfig] = useState({ titulo: "", descripcion: "" });

  useEffect(() => {
    const cargar = async () => {
      setLoadingStats(true);
      try {
        const data = await dashboardApi.getStats(user?.companyId);
        setStats(data);
      } catch (e) {
        console.error("❌ [ADMIN] Error cargando stats →", e);
      } finally {
        setLoadingStats(false);
      }
    };
    cargar();
  }, [user?.companyId]);

  const abrirSeccion = (nombre: string) => {
    setSeccionConfig({ titulo: nombre, descripcion: "" });
    setPopupSeccion(nombre);
  };

  // Construir bloques KPI con datos reales
  const bloques = [
    {
      titulo: "Métricas Globales del Sistema",
      kpis: [
        { icon: <Users size={20} />,        label: "Total de Usuarios",      value: loadingStats ? "…" : String(stats?.totalUsers ?? 0),              sub: "En el sistema"      },
        { icon: <BookOpen size={20} />,     label: "Cursos Activos",         value: loadingStats ? "…" : String(stats?.activeCourses ?? 0),           sub: "Este semestre"      },
        { icon: <GraduationCap size={20} />,label: "Total de Estudiantes",   value: loadingStats ? "…" : String(stats?.totalStudents ?? 0),           sub: "Matriculados"       },
        { icon: <BarChart2 size={20} />,    label: "Promedio Institucional", value: loadingStats ? "…" : String(stats?.institutionalAverage ?? 0),    sub: "Semestre 2026-1", accent: true },
      ],
    },
    {
      titulo: "Métricas de Estudiantes",
      kpis: [
        { icon: <BarChart2 size={20} />,     label: "Total Estudiantes",   value: loadingStats ? "…" : String(stats?.totalStudents ?? 0),  sub: "Registrados"       },
        { icon: <Users size={20} />,         label: "Total Profesores",    value: loadingStats ? "…" : String(stats?.totalProfessors ?? 0), sub: "Activos"           },
        { icon: <CheckCircle size={20} />,   label: "Cursos Activos",      value: loadingStats ? "…" : String(stats?.activeCourses ?? 0),  sub: "Este periodo"      },
        { icon: <ClipboardList size={20} />, label: "Promedio Global",     value: loadingStats ? "…" : String(stats?.institutionalAverage ?? 0), sub: "Promedio general", accent: true },
      ],
    },
  ];

  return (
    <AppLayout
      sidebarProps={{
        role: "admin",
        userName: user?.nombre ?? "",
        activeSection: section,
        onSection: (s) => setSection(s as AdminSection),
        onLogout: logout,
        onSwitchUser: switchUser,
      }}
    >
      <div style={{ padding: "28px 32px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 21, fontWeight: 800, color: C.text }}>
            {section === "dashboard" ? "Dashboard General" : "Control de Usuarios"}
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {section === "dashboard"
              ? `Vista unificada del sistema · ${user?.companyName ?? ""}`
              : "Gestión CRUD de usuarios del sistema"}
          </p>
        </div>

        {section === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {bloques.map((bloque) => (
              <div key={bloque.titulo} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
                <SectionTitle
                  extra={
                    <button onClick={() => abrirSeccion(bloque.titulo)}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", border: `1.5px solid ${C.border}`, borderRadius: 7, background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.textMuted, fontFamily: "inherit" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
                    >
                      <Edit2 size={12} /> Editar Sección
                    </button>
                  }
                >
                  {bloque.titulo}
                </SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {bloque.kpis.map((k) => <KpiCard key={k.label} {...k} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {section === "usuarios" && (
          <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }}>
            <CrudUsuarios />
          </div>
        )}
      </div>

      {popupSeccion && (
        <Popup title={`Configurar: ${popupSeccion}`} onClose={() => setPopupSeccion(null)}>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Modifica los parámetros visuales para este bloque.</p>
          <FieldInput label="Título de la Sección" value={seccionConfig.titulo} onChange={(v) => setSeccionConfig((p) => ({ ...p, titulo: v }))} placeholder={popupSeccion} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>Descripción</label>
            <textarea value={seccionConfig.descripcion} onChange={(e) => setSeccionConfig((p) => ({ ...p, descripcion: e.target.value }))} rows={3}
              style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.text, outline: "none", background: "#fafafa", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setPopupSeccion(null)}>Cancelar</Btn>
            <Btn icon={<Save size={14} />} onClick={() => setPopupSeccion(null)}>Guardar Cambios</Btn>
          </div>
        </Popup>
      )}
    </AppLayout>
  );
}
