# AcadémicaNet — Sistema de Gestión Educativa

Aplicación React con Vite + TypeScript para la gestión educativa institucional con tres roles: Estudiante, Profesor y Administrador.

---

## Stack

| Herramienta | Propósito |
|---|---|
| **Vite + React 18** | Base de la aplicación |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos utilitarios |
| **shadcn/ui** | Componentes UI base |
| **Axios** | Cliente HTTP para el backend |
| **lucide-react** | Iconografía |

---

## Estructura de carpetas

```
src/
├── api/                  # Capa de comunicación con el backend
│   ├── client.ts         # Instancia Axios con interceptores JWT
│   ├── auth.api.ts       # Endpoints de autenticación
│   ├── users.api.ts      # CRUD de usuarios
│   ├── cursos.api.ts     # Endpoints de cursos
│   └── index.ts          # Barrel export
│
├── components/
│   ├── layout/           # Sidebar, AppLayout
│   ├── shared/           # Badge, KpiCard, Table, Btn, Popup, FieldInput
│   └── ui/               # Componentes shadcn/ui (generados)
│
├── constants/
│   ├── brand.ts          # Colores y tokens de marca
│   └── mockData.ts       # Datos de prueba (reemplazar con API calls)
│
├── features/             # Lógica agrupada por dominio
│   ├── auth/             # AuthContext, LoginPage
│   ├── student/          # StudentPanel
│   ├── teacher/          # TeacherPanel
│   └── admin/            # AdminPanel, CrudUsuarios
│
├── hooks/                # Custom hooks reutilizables
├── lib/                  # Utilidades (cn, formatters, etc.)
├── types/                # Tipos TypeScript globales
├── App.tsx               # Router principal por rol
├── main.tsx              # Entry point
└── index.css             # Estilos globales + variables CSS
```

---

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

---

## Credenciales de prueba (modo mock)

| Rol | Correo | Contraseña |
|---|---|---|
| Estudiante | estudiante@test.com | 123456 |
| Profesor   | profesor@test.com   | 123456 |
| Admin      | admin@test.com      | 123456 |

---

## Conectar el backend

### 1. Configurar la URL

En `.env`:
```
VITE_API_URL=https://tu-backend.com/api/v1
```

### 2. Autenticación real

En `src/features/auth/AuthContext.tsx`, reemplaza la lógica mock del método `login`:

```ts
// Antes (mock):
const cred = MOCK_CREDENTIALS[correo];
if (cred && cred.password === password) { ... }

// Después (backend real):
import { authApi } from "@/api";
const response = await authApi.login({ correo, password });
localStorage.setItem("access_token", response.access_token);
setUser(response.user);
```

### 3. Consumir datos reales

En cada panel, reemplaza los datos `_MOCK` con llamadas a los servicios en `src/api/`:

```ts
// Antes:
const cursos = CURSOS_MOCK;

// Después:
const cursos = await cursosApi.getByEstudiante(user.id);
```

El cliente Axios en `src/api/client.ts` ya está configurado con:
- Token JWT automático en cada request
- Redirect al login si el token expira (401)
- Timeout de 10 segundos

---

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Verificar código
```
