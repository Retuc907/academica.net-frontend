export { default as apiClient } from "./client";
export { authApi }      from "./auth.api";
export { usersApi }     from "./users.api";
export { cursosApi }    from "./cursos.api";
export { studentsApi, gradesApi } from "./students.api";
export { dashboardApi } from "./dashboard.api";

// Re-export types
export type { LoginRequest, LoginResponse }        from "./auth.api";
export type { UserResponse, CreateUserRequest, UpdateUserRequest } from "./users.api";
export type { CourseResponse }                     from "./cursos.api";
export type { StudentResponse, GradeResponse, GradeUpdateRequest } from "./students.api";
export type { DashboardStats }                     from "./dashboard.api";
