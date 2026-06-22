import React from "react";
import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { LoginPage }    from "@/features/auth/LoginPage";
import { StudentPanel } from "@/features/student/StudentPanel";
import { TeacherPanel } from "@/features/teacher/TeacherPanel";
import { AdminPanel }   from "@/features/admin/AdminPanel";

// ─── Router interno basado en rol ─────────────────────────────────────────
function AppRouter() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <LoginPage />;

  switch (user.rol) {
    case "estudiante": return <StudentPanel />;
    case "profesor":   return <TeacherPanel />;
    case "admin":      return <AdminPanel />;
    default:           return <LoginPage />;
  }
}

// ─── Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
