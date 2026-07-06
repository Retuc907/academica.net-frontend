import type { Role, Curso, Nota, Entrega, Alumno, AppUser } from "@/types";
import { GraduationCap, User, Shield } from "lucide-react";
import React from "react";

// ─── Credenciales mock (reemplazar con llamadas al backend) ───────────────
export const MOCK_CREDENTIALS: Record<string, { password: string; role: Role; name: string }> = {
  "estudiante@test.com": { password: "123456", role: "estudiante", name: "Ana García López" },
  "profesor@test.com":   { password: "123456", role: "profesor",   name: "Dr. Carlos Mendoza" },
  "admin@test.com":      { password: "123456", role: "admin",      name: "Administrador Sistema" },
};

export const ROLES_RAPIDOS: {
  label: string; correo: string; rol: Role; color: string; icon: React.ReactNode;
}[] = [
  { label: "Estudiante", correo: "estudiante@test.com", rol: "estudiante", color: "#4527a0", icon: React.createElement(GraduationCap, { size: 14 }) },
  { label: "Profesor",   correo: "profesor@test.com",   rol: "profesor",   color: "#0d47a1", icon: React.createElement(User, { size: 14 }) },
  { label: "Admin",      correo: "admin@test.com",       rol: "admin",      color: "#880e4f", icon: React.createElement(Shield, { size: 14 }) },
];

// ─── Datos académicos mock (reemplazar con llamadas al backend) ───────────
export const CURSOS_MOCK: Curso[] = [
  { id: "1", nombre: "Cálculo Diferencial e Integral",    codigo: "MAT-101", profesor: "Dr. Martínez",    creditos: 6, promedio: 8.7, horario: "Lun-Mié-Vie 08:00" },
  { id: "2", nombre: "Programación Orientada a Objetos",  codigo: "INF-203", profesor: "Ing. Rodríguez",  creditos: 5, promedio: 9.2, horario: "Mar-Jue 10:00" },
  { id: "3", nombre: "Álgebra Lineal",                    codigo: "MAT-102", profesor: "Dra. Flores",     creditos: 5, promedio: 7.8, horario: "Lun-Mié 12:00" },
  { id: "4", nombre: "Física General",                    codigo: "FIS-101", profesor: "Dr. Herrera",     creditos: 6, promedio: 8.1, horario: "Mar-Jue-Sáb 09:00" },
  { id: "5", nombre: "Estadística y Probabilidad",        codigo: "MAT-203", profesor: "Ing. Vázquez",    creditos: 4, promedio: 8.5, horario: "Vie 14:00" },
  { id: "6", nombre: "Bases de Datos",                    codigo: "INF-305", profesor: "M.C. Torres",     creditos: 5, promedio: 9.0, horario: "Lun-Mié 16:00" },
  { id: "7", nombre: "Redes de Computadoras",             codigo: "INF-401", profesor: "Ing. Sánchez",    creditos: 4, promedio: 8.3, horario: "Jue 08:00" },
  { id: "8", nombre: "Ética Profesional",                 codigo: "HUM-101", profesor: "Lic. Moreno",     creditos: 3, promedio: 9.5, horario: "Mar 15:00" },
];

export const NOTAS_MOCK: Nota[] = [
  { actividad: "Examen Parcial 1 – Cálculo",  materia: "MAT-101", fecha: "15 May 2026", nota: 8.5, tipo: "Examen"    },
  { actividad: "Práctica de Laboratorio 3",    materia: "INF-203", fecha: "12 May 2026", nota: 9.0, tipo: "Práctica"  },
  { actividad: "Tarea: Matrices y Vectores",   materia: "MAT-102", fecha: "10 May 2026", nota: 7.5, tipo: "Tarea"     },
  { actividad: "Quiz Electromagnetismo",       materia: "FIS-101", fecha: "08 May 2026", nota: 8.0, tipo: "Quiz"      },
  { actividad: "Proyecto: Sistema CRUD",       materia: "INF-305", fecha: "05 May 2026", nota: 9.5, tipo: "Proyecto"  },
];

export const ENTREGAS_MOCK: Entrega[] = [
  { tarea: "Informe de Laboratorio 4",              materia: "FIS-101", plazo: "27 May 2026", prioridad: "Alta"  },
  { tarea: "Examen Final – Estadística",            materia: "MAT-203", plazo: "30 May 2026", prioridad: "Alta"  },
  { tarea: "Práctica 5: Herencia y Polimorfismo",   materia: "INF-203", plazo: "02 Jun 2026", prioridad: "Media" },
  { tarea: "Ensayo Ética en IA",                    materia: "HUM-101", plazo: "05 Jun 2026", prioridad: "Baja"  },
  { tarea: "Proyecto Final: Diseño de BD",          materia: "INF-305", plazo: "10 Jun 2026", prioridad: "Alta"  },
];

export const ALUMNOS_MOCK: Alumno[] = [
  { id: "1", nombre: "Ana García López",      matricula: "2023001", asistencia: 95, promedio: 8.7, estatus: "Activo"    },
  { id: "2", nombre: "Luis Ramírez Torres",   matricula: "2023002", asistencia: 88, promedio: 7.5, estatus: "Activo"    },
  { id: "3", nombre: "María Fernández Cruz",  matricula: "2023003", asistencia: 92, promedio: 9.2, estatus: "Activo"    },
  { id: "4", nombre: "Carlos Jiménez Vega",   matricula: "2023004", asistencia: 75, promedio: 6.8, estatus: "En Riesgo" },
  { id: "5", nombre: "Sofía Morales Díaz",    matricula: "2023005", asistencia: 98, promedio: 9.8, estatus: "Activo"    },
  { id: "6", nombre: "Roberto Castillo Ruiz", matricula: "2023006", asistencia: 80, promedio: 7.2, estatus: "Activo"    },
  { id: "7", nombre: "Valeria Reyes Gómez",   matricula: "2023007", asistencia: 91, promedio: 8.5, estatus: "Activo"    },
  { id: "8", nombre: "Miguel Ángel Soto",     matricula: "2023008", asistencia: 70, promedio: 6.0, estatus: "En Riesgo" },
];

export const USUARIOS_MOCK: AppUser[] = [
  { id: "1", nombre: "Ana García López",      correo: "ana.garcia@test.com",      rol: "estudiante", estatus: "Activo" },
  { id: "2", nombre: "Luis Ramírez Torres",   correo: "luis.ramirez@test.com",    rol: "estudiante", estatus: "Activo" },
  { id: "3", nombre: "María Fernández Cruz",  correo: "maria.fernandez@test.com", rol: "estudiante", estatus: "Activo" },
  { id: "4", nombre: "Dr. Carlos Mendoza",    correo: "carlos.mendoza@test.com",  rol: "profesor",   estatus: "Activo" },
  { id: "5", nombre: "Dra. Flores",           correo: "flores@test.com",          rol: "profesor",   estatus: "Activo" },
  { id: "6", nombre: "Administrador Sistema", correo: "admin@test.com",           rol: "admin",      estatus: "Activo" },
];
