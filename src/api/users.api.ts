import apiClient from "./client";

// ─── Contratos ────────────────────────────────────────────────────────────
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
  status?: string;
}

// ─── Servicio ─────────────────────────────────────────────────────────────
export const usersApi = {
  /** GET /api/users */
  getAll: async (companyId?: string): Promise<UserResponse[]> => {
    const params = companyId ? { companyId } : {};
    const { data } = await apiClient.get<UserResponse[]>("/users", { params });
    console.log("👥 [USERS] getAll →", data);
    return data;
  },

  /** POST /api/users */
  create: async (dto: CreateUserRequest, companyId?: string): Promise<UserResponse> => {
    const params = companyId ? { companyId } : {};
    const { data } = await apiClient.post<UserResponse>("/users", dto, { params });
    console.log("👥 [USERS] create →", data);
    return data;
  },

  /** PUT /api/users/:id */
  update: async (id: string, dto: UpdateUserRequest): Promise<UserResponse> => {
    const { data } = await apiClient.put<UserResponse>(`/users/${id}`, dto);
    console.log("👥 [USERS] update →", data);
    return data;
  },

  /** DELETE /api/users/:id  (soft-delete → 204) */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
    console.log("👥 [USERS] delete → id:", id);
  },
};
