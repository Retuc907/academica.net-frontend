// ─── Roles ────────────────────────────────────────────────────────────────
export type Role = "estudiante" | "profesor" | "admin";

// ─── Secciones por rol ────────────────────────────────────────────────────
export type StudentSection  = "dashboard" | "cursos" | "rendimiento";
export type TeacherSection  = "dashboard" | "alumnos";
export type AdminSection    = "dashboard" | "usuarios";

// ─── Auth ─────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  nombre: string;
  correo: string;
  rol: Role;
  companyId?: string;
  companyName?: string;
}

// ─── Tipos internos UI (mapeados desde API) ───────────────────────────────
export interface AppUser {
  id: string;       // UUID del backend
  nombre: string;
  correo: string;
  rol: Role;
  estatus: string;
}

export interface Curso {
  id: string;
  nombre: string;
  codigo: string;
  profesor: string;
  creditos: number;
  promedio: number;
  horario: string;
  modalidad?: string;
  estatus?: string;
}

export interface Nota {
  id: string;
  actividad: string;
  materia: string;
  tipo: string;
  fecha: string;
  nota: number;
  notaMax: number;
  publicada: boolean;
}

export interface Entrega {
  tarea: string;
  materia: string;
  plazo: string;
  prioridad: string;
}

export interface Alumno {
  id: string;
  nombre: string;
  matricula: string;
  asistencia: number;
  promedio: number;
  estatus: string;
}

export interface DashboardMetrics {
  totalUsuarios: number;
  totalEstudiantes: number;
  totalProfesores: number;
  cursosActivos: number;
  promedioInstitucional: number;
}
