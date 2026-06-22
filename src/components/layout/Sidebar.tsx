import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, BookOpen, TrendingUp, Users, LogOut,
  ChevronDown, GraduationCap, ClipboardList, User, Shield, Zap,
} from "lucide-react";
import { BRAND as C } from "@/constants/brand";
import { ROLES_RAPIDOS, MOCK_CREDENTIALS } from "@/constants/mockData";
import type { Role } from "@/types";

interface NavItem { label: string; section: string; icon: React.ReactNode; }

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  estudiante: [
    { label: "Dashboard",    section: "dashboard",    icon: <LayoutDashboard size={16} /> },
    { label: "Mis Cursos",   section: "cursos",       icon: <BookOpen size={16} /> },
    { label: "Rendimiento",  section: "rendimiento",  icon: <TrendingUp size={16} /> },
  ],
  profesor: [
    { label: "Dashboard",    section: "dashboard",    icon: <LayoutDashboard size={16} /> },
    { label: "Mis Alumnos",  section: "alumnos",      icon: <Users size={16} /> },
  ],
  admin: [
    { label: "Dashboard",    section: "dashboard",    icon: <LayoutDashboard size={16} /> },
    { label: "Usuarios",     section: "usuarios",     icon: <ClipboardList size={16} /> },
  ],
};

const ROLE_ICON: Record<Role, React.ReactNode> = {
  estudiante: <GraduationCap size={14} />,
  profesor:   <User size={14} />,
  admin:      <Shield size={14} />,
};

const ROLE_LABEL: Record<Role, string> = {
  estudiante: "Estudiante",
  profesor:   "Profesor",
  admin:      "Administrador",
};

export interface SidebarProps {
  role: Role;
  userName: string;
  activeSection: string;
  onSection: (section: string) => void;
  onLogout: () => void;
  onSwitchUser: (rol: Role, nombre: string) => void;
}

export function Sidebar({ role, userName, activeSection, onSection, onLogout, onSwitchUser }: SidebarProps) {
  const [switchOpen, setSwitchOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setSwitchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const otherRoles = ROLES_RAPIDOS.filter((r) => r.rol !== role);
  const navItems = NAV_BY_ROLE[role];

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${C.navbar} 0%, #2d0b7a 100%)`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>AcadémicaNet</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>Gestión Educativa</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `${C.primary}cc`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700,
          }}>
            {userName.charAt(0)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {userName}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{ROLE_ICON[role]}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{ROLE_LABEL[role]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.section;
          return (
            <button
              key={item.section}
              onClick={() => onSection(item.section)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: isActive ? "rgba(255,255,255,0.13)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                fontFamily: "inherit", textAlign: "left", width: "100%",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Switch user */}
      <div ref={ref} style={{ padding: "0 10px 8px", position: "relative" }}>
        <button
          onClick={() => setSwitchOpen((p) => !p)}
          style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "9px 11px", borderRadius: 7, border: "none", cursor: "pointer",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)",
            fontSize: 12, fontFamily: "inherit",
          }}
        >
          <Zap size={13} />
          <span>Cambiar usuario</span>
          <ChevronDown size={14} style={{ marginLeft: "auto", transform: switchOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>

        {switchOpen && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 6px)", left: 10, right: 10,
            background: "#fff", borderRadius: 8, boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
            border: `1px solid ${C.border}`, overflow: "hidden", zIndex: 50,
          }}>
            <p style={{ padding: "8px 12px 6px", fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>
              CAMBIAR A
            </p>
            {otherRoles.map((r) => (
              <button
                key={r.rol}
                onClick={() => { onSwitchUser(r.rol, MOCK_CREDENTIALS[r.correo].name); setSwitchOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", border: "none", background: "transparent",
                  cursor: "pointer", fontSize: 13, color: C.text, fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F4F9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: r.color + "20", color: r.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{r.icon}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 12 }}>{MOCK_CREDENTIALS[r.correo].name}</p>
                  <p style={{ fontSize: 11, color: C.textMuted }}>{r.label}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div style={{ padding: "0 10px 18px" }}>
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "9px 11px", borderRadius: 7, border: "none", cursor: "pointer",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
            fontSize: 13, fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(220,50,50,0.18)"; e.currentTarget.style.color = "#ff8a8a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <LogOut size={15} />Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
