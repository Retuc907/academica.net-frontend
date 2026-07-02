import React, { useState } from "react";
import { AlertCircle, CheckCircle, GraduationCap, Zap } from "lucide-react";
import { BRAND as C } from "@/constants/brand";
import { ROLES_RAPIDOS } from "@/constants/mockData";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const [correo, setCorreo]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    setError("");
    const { ok, error: apiError } = await login(correo, password);
    if (!ok) setError(apiError ?? "Error al iniciar sesión.");
  };

  const rellenarCredenciales = (r: (typeof ROLES_RAPIDOS)[0]) => {
    setCorreo(r.correo);
    setPassword("123456");
    setError("");
  };

  const stats = [
    { label: "Estudiantes activos",  value: "1,240" },
    { label: "Docentes registrados", value: "86"    },
    { label: "Cursos disponibles",   value: "148"   },
    { label: "Ciclos completados",   value: "12"    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F5F4F9", fontFamily: "'Inter', sans-serif" }}>
      {/* Panel izquierdo */}
      <div style={{
        width: "52%",
        background: `linear-gradient(155deg, ${C.navbar} 0%, #3a0e7a 55%, ${C.primary} 100%)`,
        display: "flex", flexDirection: "column", padding: "52px 56px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", top: -80, right: -120, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", bottom: 60, left: -60, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "rgba(94,9,102,0.25)", bottom: 140, right: 40, pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 56, zIndex: 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
            <GraduationCap size={24} color="#fff" />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>AcadémicaNet</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Sistema de Gestión Educativa</p>
          </div>
        </div>

        <div style={{ flex: 1, zIndex: 1 }}>
          <h1 style={{ color: "#fff", fontSize: 34, fontWeight: 800, lineHeight: 1.25, marginBottom: 16, maxWidth: 380 }}>
            Gestiona tu comunidad académica en un solo lugar
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, maxWidth: 360, marginBottom: 48 }}>
            Plataforma institucional para estudiantes, docentes y administradores.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 380 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>{s.value}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ zIndex: 1, marginTop: 40 }}>
          {["Seguimiento en tiempo real del rendimiento académico", "Gestión centralizada de cursos y actividades", "Panel diferenciado por rol (Estudiante, Profesor, Admin)"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              <CheckCircle size={15} color="#a78bfa" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 64px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 28 }}>Ingresa tus credenciales institucionales</p>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 8, letterSpacing: "0.06em" }}>ACCESO RÁPIDO POR ROL</p>
            <div style={{ display: "flex", gap: 8 }}>
              {ROLES_RAPIDOS.map((r) => (
                <button key={r.rol} onClick={() => rellenarCredenciales(r)} style={{
                  flex: 1, padding: "8px 6px", border: `1.5px solid ${r.color}22`,
                  borderRadius: 8, background: r.color + "0e", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 5, fontFamily: "inherit", color: r.color, fontSize: 12, fontWeight: 600,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = r.color + "20"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = r.color + "0e"; }}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.textMuted }}>o ingresa manualmente</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {error && (
            <div style={{ background: "#fde8ec", border: `1px solid ${C.accent}40`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: C.accent, fontSize: 13 }}>
              <AlertCircle size={15} />{error}
            </div>
          )}

          {[
            { label: "Correo Electrónico", value: correo, setter: setCorreo, type: "email", placeholder: "usuario@test.com" },
            { label: "Contraseña",         value: password, setter: setPassword, type: "password", placeholder: "••••••••" },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, color: C.text, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}
              />
            </div>
          ))}

          <button onClick={handleLogin} style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Zap size={16} />Iniciar Sesión
          </button>

          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 20, textAlign: "center" }}>
            Contraseña de prueba para todos los roles: <strong>123456</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
