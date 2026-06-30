import React, { useState, useMemo, useEffect } from "react";
import { BarChart2, CheckCircle, ChevronDown, ClipboardList, Edit2, Plus, Save, Search, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard, Badge, Table, Popup, Btn, FieldInput } from "@/components/shared";
import { BRAND as C } from "@/constants/brand";
import { studentsApi, gradesApi } from "@/api/students.api";
import type { StudentResponse, GradeResponse } from "@/api/students.api";
import { useAuth } from "@/features/auth/AuthContext";
import type { TeacherSection } from "@/types";

export function TeacherPanel() {
  const { user, logout, switchUser } = useAuth();
  const [section, setSection]           = useState<TeacherSection>("dashboard");
  const [alumnos, setAlumnos]           = useState<StudentResponse[]>([]);
  const [loading, setLoading]           = useState(true);
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Popup actividad
  const [popupActividad, setPopupActividad] = useState(false);
  const [actividad, setActividad] = useState({ nombre: "", descripcion: "", plazo: "" });

  // Popup notas
  const [popupNotas, setPopupNotas]     = useState(false);
  const [alumnoSelNotas, setAlumnoSelNotas] = useState<StudentResponse | null>(null);
  const [notasAlumno, setNotasAlumno]   = useState<GradeResponse[]>([]);
  const [notasEdit, setNotasEdit]       = useState<Record<string, string>>({});

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await studentsApi.getAll({
          companyId: user?.companyId,
        });
        setAlumnos(data);
      } catch (e) {
        console.error("❌ [TEACHER] Error cargando alumnos →", e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [user?.id, user?.companyId]);

  const alumnosFiltrados = useMemo(
    () => alumnos.filter(
      (a) =>
        a.name.toLowerCase().includes(busquedaAlumno.toLowerCase()) ||
        a.code.includes(busquedaAlumno)
    ),
    [alumnos, busquedaAlumno]
  );

  // KPIs calculados desde datos reales
  const totalAlumnos  = alumnos.length;
  const promedioGrupo = alumnos.length
    ? (alumnos.reduce((s, a) => s + a.average, 0) / alumnos.length).toFixed(1)
    : "0";
  const asistenciaMedia = alumnos.length
    ? Math.round(alumnos.reduce((s, a) => s + a.attendance, 0) / alumnos.length)
    : 0;
  const enRiesgo = alumnos.filter((a) => a.status === "En Riesgo").length;

  // Abrir popup de notas para un alumno
  const abrirNotas = async (alumno: StudentResponse) => {
    setAlumnoSelNotas(alumno);
    try {
      const notas = await studentsApi.getGrades(alumno.id);
      setNotasAlumno(notas);
      const init: Record<string, string> = {};
      notas.forEach((n) => { init[n.id] = String(n.value); });
      setNotasEdit(init);
    } catch (e) {
      console.error("❌ [TEACHER] Error cargando notas →", e);
    }
    setPopupNotas(true);
  };

  // Guardar notas editadas
  const guardarNotas = async () => {
    try {
      for (const nota of notasAlumno) {
        const nuevoValor = parseFloat(notasEdit[nota.id]);
        if (!isNaN(nuevoValor) && nuevoValor !== nota.value) {
          await gradesApi.update(nota.id, { value: nuevoValor, published: true });
        }
      }
      setPopupNotas(false);
    } catch (e: any) {
      console.error("❌ [TEACHER] Error guardando notas →", e);
      alert(e?.response?.data?.message ?? "Error al guardar notas.");
    }
  };

  return (
    <AppLayout
      sidebarProps={{
        role: "profesor",
        userName: user?.nombre ?? "",
        activeSection: section,
        onSection: (s) => setSection(s as TeacherSection),
        onLogout: logout,
        onSwitchUser: switchUser,
      }}
    >
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header sticky */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(34,9,102,0.05)" }}>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["Institución", user?.companyName ?? ""],
              ["Semestre", "2026-1"],
              ["Alumnos", String(totalAlumnos)],
            ].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>{k}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setPopupActividad(true)} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
              <Plus size={15} /> Agregar Actividad
            </button>
          </div>
        </div>

        <div style={{ padding: "26px 28px" }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 21, fontWeight: 800, color: C.text }}>
              {section === "dashboard" ? "Dashboard" : "Gestión de Alumnos"}
            </h1>
          </div>

          {/* Dashboard */}
          {section === "dashboard" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <KpiCard icon={<Users size={20} />}         label="Total de Alumnos"     value={String(totalAlumnos)}    sub="En mis grupos" />
              <KpiCard icon={<BarChart2 size={20} />}     label="Promedio del Grupo"   value={promedioGrupo}           sub="Calificación media" />
              <KpiCard icon={<CheckCircle size={20} />}   label="Asistencia Media"     value={`${asistenciaMedia}%`}   sub="Promedio de asistencia" />
              <KpiCard icon={<ClipboardList size={20} />} label="Alumnos en Riesgo"    value={String(enRiesgo)}        sub="Requieren atención" accent />
            </div>
          )}

          {/* Alumnos */}
          {section === "alumnos" && (
            <div>
              {loading ? (
                <p style={{ color: C.textMuted, padding: 20 }}>Cargando alumnos…</p>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
                      <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
                      <input value={busquedaAlumno} onChange={(e) => setBusquedaAlumno(e.target.value)}
                        placeholder="Buscar alumno por nombre o matrícula..."
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        style={{ width: "100%", padding: "8px 10px 8px 32px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.text, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: C.textMuted }}>{alumnosFiltrados.length} alumnos</p>
                  </div>
                  <Table
                    cols={["Matrícula", "Nombre del Alumno", "Asistencia", "Promedio", "Estatus", "Notas"]}
                    rows={alumnosFiltrados.map((a) => [
                      <span style={{ color: C.textMuted, fontFamily: "monospace", fontSize: 12 }}>{a.code}</span>,
                      <span style={{ fontWeight: 600 }}>{a.name}</span>,
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 56, height: 5, borderRadius: 3, background: "#E2E0EE", overflow: "hidden" }}>
                          <div style={{ width: `${a.attendance}%`, height: "100%", background: a.attendance >= 90 ? "#2e7d32" : a.attendance >= 75 ? "#f59e0b" : C.accent }} />
                        </div>
                        <span style={{ fontSize: 12 }}>{a.attendance}%</span>
                      </div>,
                      <span style={{ fontWeight: 700, color: a.average >= 9 ? "#2e7d32" : a.average >= 7 ? C.primary : C.accent }}>{(a.average ?? 0).toFixed(1)}</span>,
                      <Badge text={a.status} />,
                      <button onClick={() => abrirNotas(a)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", border: `1px solid ${C.border}`, borderRadius: 6, background: "transparent", cursor: "pointer", fontSize: 12, color: C.accent, fontFamily: "inherit" }}>
                        <Edit2 size={12} /> Notas
                      </button>,
                    ])}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popup: Agregar actividad */}
      {popupActividad && (
        <Popup title="Agregar Nueva Actividad" onClose={() => setPopupActividad(false)}>
          <FieldInput label="Nombre de la Actividad" value={actividad.nombre} onChange={(v) => setActividad((p) => ({ ...p, nombre: v }))} placeholder="Ej. Examen Parcial 2" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>Descripción</label>
            <textarea value={actividad.descripcion} onChange={(e) => setActividad((p) => ({ ...p, descripcion: e.target.value }))} rows={3}
              style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.text, outline: "none", background: "#fafafa", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <FieldInput label="Plazo de Entrega" type="date" value={actividad.plazo} onChange={(v) => setActividad((p) => ({ ...p, plazo: v }))} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setPopupActividad(false)}>Cerrar</Btn>
            <Btn icon={<Plus size={14} />} onClick={() => { setActividad({ nombre: "", descripcion: "", plazo: "" }); setPopupActividad(false); }}>Agregar</Btn>
          </div>
        </Popup>
      )}

      {/* Popup: Notas del alumno */}
      {popupNotas && alumnoSelNotas && (
        <Popup title={`Notas – ${alumnoSelNotas.name}`} onClose={() => setPopupNotas(false)}>
          {notasAlumno.length === 0 ? (
            <p style={{ color: C.textMuted, fontSize: 13 }}>Este alumno no tiene notas registradas.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notasAlumno.map((n) => (
                <div key={n.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "#F5F4F9", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{n.activity}</p>
                    <p style={{ fontSize: 11, color: C.textMuted }}>{n.subject} · {n.type} · {n.date}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="number" min={0} max={n.maxValue} step={0.1}
                      value={notasEdit[n.id] ?? n.value}
                      onChange={(e) => setNotasEdit((p) => ({ ...p, [n.id]: e.target.value }))}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                      style={{ width: 66, border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "6px 8px", fontSize: 14, fontWeight: 600, color: C.primary, textAlign: "center", outline: "none", fontFamily: "inherit" }}
                    />
                    <span style={{ fontSize: 11, color: C.textMuted }}>/ {n.maxValue}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setPopupNotas(false)}>Cancelar</Btn>
            {notasAlumno.length > 0 && <Btn icon={<Save size={14} />} onClick={guardarNotas}>Guardar</Btn>}
          </div>
        </Popup>
      )}
    </AppLayout>
  );
}
