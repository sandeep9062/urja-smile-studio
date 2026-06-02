// ============================================================
// API Client for Urja Dental Clinic Admin Dashboard
// ============================================================

import type {
  ApiResponse,
  PaginatedResponse,
  Appointment,
  Patient,
  Doctor,
  Service,
  BlogPost,
  GalleryImage,
  Testimonial,
  Enquiry,
  User,
  ActivityLog,
  Backup,
  Redirect,
  ClinicSettings,
  SEOScore,
  DashboardStats,
  LoginCredentials,
  AuthResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/admin";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("admin_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== "undefined") {
          window.location.href = "/admin-dashboard/login";
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (response.success && response.data) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
    this.clearToken();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/me");
  }

  // Appointments
  async getAppointments(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<Appointment>>(`/appointments${queryString}`);
  }

  async getAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${id}`);
  }

  async createAppointment(data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(
    id: string,
    data: Partial<Appointment>,
  ): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/appointments/${id}`, { method: "DELETE" });
  }

  // Patients
  async getPatients(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<Patient>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<Patient>>(`/patients${queryString}`);
  }

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    return this.request<Patient>(`/patients/${id}`);
  }

  async createPatient(data: Partial<Patient>): Promise<ApiResponse<Patient>> {
    return this.request<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<ApiResponse<Patient>> {
    return this.request<Patient>(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Doctors
  async getDoctors(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<Doctor>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<Doctor>>(`/doctors${queryString}`);
  }

  async getDoctor(id: string): Promise<ApiResponse<Doctor>> {
    return this.request<Doctor>(`/doctors/${id}`);
  }

  async createDoctor(data: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    return this.request<Doctor>("/doctors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDoctor(id: string, data: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    return this.request<Doctor>(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteDoctor(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/doctors/${id}`, { method: "DELETE" });
  }

  // Services
  async getServices(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<Service>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<Service>>(`/services${queryString}`);
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/services/${id}`);
  }

  async createService(data: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request<Service>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/services/${id}`, { method: "DELETE" });
  }

  // Blogs
  async getBlogs(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<BlogPost>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<BlogPost>>(`/blogs${queryString}`);
  }

  async getBlog(id: string): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>(`/blogs/${id}`);
  }

  async createBlog(data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>("/blogs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBlog(id: string, data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    return this.request<BlogPost>(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/blogs/${id}`, { method: "DELETE" });
  }

  // Gallery
  async getGalleryImages(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<GalleryImage>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<GalleryImage>>(`/gallery${queryString}`);
  }

  async uploadGalleryImage(formData: FormData): Promise<ApiResponse<GalleryImage>> {
    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: "POST",
      headers,
      body: formData,
    });
    return response.json();
  }

  async deleteGalleryImage(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/gallery/${id}`, { method: "DELETE" });
  }

  // Testimonials
  async getTestimonials(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<Testimonial>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<Testimonial>>(`/testimonials${queryString}`);
  }

  async createTestimonial(data: Partial<Testimonial>): Promise<ApiResponse<Testimonial>> {
    return this.request<Testimonial>("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(
    id: string,
    data: Partial<Testimonial>,
  ): Promise<ApiResponse<Testimonial>> {
    return this.request<Testimonial>(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/testimonials/${id}`, { method: "DELETE" });
  }

  // Enquiries
  async getEnquiries(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<Enquiry>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<Enquiry>>(`/enquiries${queryString}`);
  }

  async getEnquiry(id: string): Promise<ApiResponse<Enquiry>> {
    return this.request<Enquiry>(`/enquiries/${id}`);
  }

  async updateEnquiry(id: string, data: Partial<Enquiry>): Promise<ApiResponse<Enquiry>> {
    return this.request<Enquiry>(`/enquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers(params?: Record<string, string>): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<User>>(`/users${queryString}`);
  }

  async createUser(data: Partial<User> & { password: string }): Promise<ApiResponse<User>> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, { method: "DELETE" });
  }

  // Activity Logs
  async getActivityLogs(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PaginatedResponse<ActivityLog>>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<PaginatedResponse<ActivityLog>>(`/logs${queryString}`);
  }

  // Backups
  async getBackups(): Promise<ApiResponse<Backup[]>> {
    return this.request<Backup[]>("/backups");
  }

  async createBackup(): Promise<ApiResponse<Backup>> {
    return this.request<Backup>("/backups", { method: "POST" });
  }

  async restoreBackup(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/backups/${id}/restore`, { method: "POST" });
  }

  // Redirects
  async getRedirects(): Promise<ApiResponse<Redirect[]>> {
    return this.request<Redirect[]>("/redirects");
  }

  async createRedirect(data: Partial<Redirect>): Promise<ApiResponse<Redirect>> {
    return this.request<Redirect>("/redirects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRedirect(id: string, data: Partial<Redirect>): Promise<ApiResponse<Redirect>> {
    return this.request<Redirect>(`/redirects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRedirect(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/redirects/${id}`, { method: "DELETE" });
  }

  // Settings
  async getSettings(): Promise<ApiResponse<ClinicSettings>> {
    return this.request<ClinicSettings>("/settings");
  }

  async updateSettings(data: Partial<ClinicSettings>): Promise<ApiResponse<ClinicSettings>> {
    return this.request<ClinicSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // SEO
  async getSEOScores(): Promise<ApiResponse<SEOScore[]>> {
    return this.request<SEOScore[]>("/seo/scores");
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>("/stats");
  }

  // File Upload
  async uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();
