import React, { useState, useMemo, useEffect } from "react";
import { Edit2, Plus, RefreshCw, Search, Trash2, UserPlus } from "lucide-react";
import { Badge, Btn, Popup, FieldInput } from "@/components/shared";
import { BRAND as C } from "@/constants/brand";
import { usersApi } from "@/api/users.api";
import type { UserResponse } from "@/api/users.api";
import type { Role } from "@/types";
import { useAuth } from "@/features/auth/AuthContext";

const ROL_LABEL: Record<string, string> = {
  estudiante: "Estudiante",
  profesor:   "Profesor",
  admin:      "Administrador",
};

export function CrudUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [nuevo, setNuevo]       = useState({ name: "", email: "", role: "estudiante" });
  const [editando, setEditando] = useState<UserResponse | null>(null);

  // ── Cargar usuarios ──────────────────────────────────────────────────
  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAll(user?.companyId);
      setUsuarios(data);
    } catch (e: any) {
      console.error("❌ [CRUD] Error cargando usuarios →", e);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(
    () => usuarios.filter(
      (u) =>
        u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase())
    ),
    [usuarios, busqueda]
  );

  // ── CRUD ─────────────────────────────────────────────────────────────
  const crear = async () => {
    if (!nuevo.name.trim() || !nuevo.email.trim()) return;
    try {
      const creado = await usersApi.create(
        { name: nuevo.name, email: nuevo.email, role: nuevo.role },
        user?.companyId
      );
      setUsuarios((p) => [...p, creado]);
      setNuevo({ name: "", email: "", role: "estudiante" });
    } catch (e: any) {
      console.error("❌ [CRUD] Error creando usuario →", e);
      alert(e?.response?.data?.message ?? "Error al crear usuario.");
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await usersApi.remove(id);
      setUsuarios((p) => p.filter((u) => u.id !== id));
    } catch (e: any) {
      console.error("❌ [CRUD] Error eliminando usuario →", e);
    }
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    try {
      const actualizado = await usersApi.update(editando.id, {
        name:   editando.name,
        email:  editando.email,
        role:   editando.role,
        status: editando.status,
      });
      setUsuarios((p) => p.map((u) => (u.id === actualizado.id ? actualizado : u)));
      setEditando(null);
    } catch (e: any) {
      console.error("❌ [CRUD] Error actualizando usuario →", e);
      alert(e?.response?.data?.message ?? "Error al actualizar usuario.");
    }
  };

  const selectStyle: React.CSSProperties = {
    width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 7,
    padding: "8px 10px", fontSize: 13, outline: "none", background: "#fff",
    fontFamily: "inherit", color: C.text, cursor: "pointer",
  };

  if (loading) return (
    <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>
      <RefreshCw size={20} style={{ animation: "spin 1s linear infinite", marginBottom: 8 }} />
      <p>Cargando usuarios…</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: 24, color: C.accent, background: "#fde8ec", borderRadius: 8 }}>
      {error} <button onClick={cargar} style={{ marginLeft: 10, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: C.accent }}>Reintentar</button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Crear usuario */}
      <div style={{ background: "#F5F4F9", borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Crear Nuevo Usuario</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px auto", gap: 10, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Nombre</label>
            <input value={nuevo.name} onChange={(e) => setNuevo((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nombre completo"
              onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", color: C.text }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Correo</label>
            <input value={nuevo.email} onChange={(e) => setNuevo((p) => ({ ...p, email: e.target.value }))}
              placeholder="correo@test.com"
              onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", color: C.text }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Rol</label>
            <select value={nuevo.role} onChange={(e) => setNuevo((p) => ({ ...p, role: e.target.value }))} style={selectStyle}>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <Btn icon={<UserPlus size={14} />} onClick={crear} small>Crear</Btn>
        </div>
      </div>

      {/* Buscador */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ position: "relative", maxWidth: 300 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar usuario..."
            onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
            style={{ width: "100%", padding: "8px 10px 8px 32px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.text, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <p style={{ fontSize: 12, color: C.textMuted }}>{filtrados.length} de {usuarios.length} usuarios</p>
          <button onClick={cargar} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, color: C.textMuted, fontFamily: "inherit" }}>
            <RefreshCw size={12} /> Actualizar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.accent }}>
              {["Nombre", "Correo Electrónico", "Rol", "Estatus", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", color: "#fff", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((u, i) => (
              <tr key={u.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAF9FD", borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 16px", fontWeight: 600, color: C.text }}>{u.name}</td>
                <td style={{ padding: "10px 16px", color: C.textMuted }}>{u.email}</td>
                <td style={{ padding: "10px 16px" }}><Badge text={ROL_LABEL[u.role] ?? u.role} /></td>
                <td style={{ padding: "10px 16px" }}><Badge text={u.status ?? "Activo"} /></td>
                <td style={{ padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditando({ ...u })} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", border: `1px solid ${C.border}`, borderRadius: 6, background: "transparent", cursor: "pointer", fontSize: 12, color: C.primary, fontFamily: "inherit" }}>
                      <Edit2 size={12} /> Editar
                    </button>
                    <button onClick={() => eliminar(u.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", border: "none", borderRadius: 6, background: "#fde8ec", cursor: "pointer", fontSize: 12, color: C.accent, fontFamily: "inherit" }}>
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup editar */}
      {editando && (
        <Popup title="Editar Usuario" onClose={() => setEditando(null)}>
          <FieldInput label="Nombre" value={editando.name} onChange={(v) => setEditando((p) => p ? { ...p, name: v } : null)} placeholder="Nombre completo" />
          <FieldInput label="Correo" type="email" value={editando.email} onChange={(v) => setEditando((p) => p ? { ...p, email: v } : null)} placeholder="correo@test.com" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>Rol</label>
            <select value={editando.role} onChange={(e) => setEditando((p) => p ? { ...p, role: e.target.value } : null)}
              style={{ ...selectStyle, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13 }}>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>Estatus</label>
            <select value={editando.status ?? "Activo"} onChange={(e) => setEditando((p) => p ? { ...p, status: e.target.value } : null)}
              style={{ ...selectStyle, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13 }}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setEditando(null)}>Cancelar</Btn>
            <Btn icon={<RefreshCw size={14} />} onClick={guardarEdicion}>Actualizar</Btn>
          </div>
        </Popup>
      )}
    </div>
  );
}
