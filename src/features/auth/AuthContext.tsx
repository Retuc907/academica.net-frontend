import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Role, AuthUser } from "@/types";
import { authApi } from "@/api/auth.api";
import { TOKEN_KEY } from "@/api/client";

// ─── Tipos del contexto ───────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  switchUser: (rol: Role, nombre: string) => void;
}

// ─── Contexto ─────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        console.log("🔐 [AUTH] Enviando login →", { email, password });
        const res = await authApi.login({ email, password });
        console.log("✅ [AUTH] Respuesta del backend →", res);

        // Guardar el token JWT
        localStorage.setItem(TOKEN_KEY, res.token);

        // Mapear la respuesta al tipo interno AuthUser
        setUser({
          id:          res.id,
          nombre:      res.name,
          correo:      res.email,
          rol:         res.role,
          companyId:   res.companyId,
          companyName: res.companyName,
        });

        return { ok: true };
      } catch (err: any) {
        console.error("❌ [AUTH] Error completo →", err);
        console.error("❌ [AUTH] err.response  →", err?.response);
        console.error("❌ [AUTH] err.response.data →", err?.response?.data);
        console.error("❌ [AUTH] err.message   →", err?.message);

        const message =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "Error desconocido.";
        return { ok: false, error: message };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  /** Cambio rápido de usuario (demo) — quitar en producción */
  const switchUser = useCallback((rol: Role, nombre: string) => {
    setUser((prev) => (prev ? { ...prev, rol, nombre } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
