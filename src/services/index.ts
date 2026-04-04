import { api, ApiResponse } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Record<string, unknown>;
}

export interface ProfileUpdate {
  [key: string]: unknown;
}

export interface AttendanceCheckInData {
  location?: { latitude: number; longitude: number };
  imageData?: string;
  qrData?: string;
  [key: string]: unknown;
}

export interface AttendanceHistoryParams {
  [key: string]: string;
}

export interface LeaveRequestData {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  [key: string]: unknown;
}

export interface PermissionRequestData {
  date: string;
  reason: string;
  [key: string]: unknown;
}

export interface OvertimeRequestData {
  date: string;
  hours: number;
  reason: string;
  [key: string]: unknown;
}

export interface ActivityData {
  [key: string]: unknown;
}

export interface ExpenseData {
  [key: string]: unknown;
}

export interface NotificationParams {
  [key: string]: string;
}

export interface PenaltyData {
  [key: string]: unknown;
}

export interface EmployeeParams {
  [key: string]: string;
}

export interface KPIParams {
  [key: string]: string;
}

export interface GoalData {
  [key: string]: unknown;
}

export interface ReviewData {
  [key: string]: unknown;
}

export interface FeedbackData {
  [key: string]: unknown;
}

export interface AIChatContext {
  [key: string]: unknown;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await api.post<LoginResponse>('/auth/login', { email, password }, { requiresAuth: false });
    await api.setTokens(data.token, data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {});
    } catch {
    } finally {
      await api.clearTokens();
    }
  },

  async getProfile(): Promise<ApiResponse> {
    return api.get('/auth/profile');
  },

  async updateProfile(updates: ProfileUpdate): Promise<ApiResponse> {
    return api.put('/auth/profile', updates);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    return api.post('/auth/forgot-password', { email }, { requiresAuth: false });
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return api.post('/auth/reset-password', { token, newPassword }, { requiresAuth: false });
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await api.getToken();
    return !!token;
  },
};

export const attendanceService = {
  async getToday(): Promise<ApiResponse> {
    return api.get('/attendance/today');
  },

  async checkIn(data: AttendanceCheckInData): Promise<ApiResponse> {
    return api.post('/attendance/check-in', data);
  },

  async checkOut(data: AttendanceCheckInData): Promise<ApiResponse> {
    return api.post('/attendance/check-out', data);
  },

  async getHistory(params: AttendanceHistoryParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/attendance/history?${query}`);
  },

  async getDayDetail(date: string): Promise<ApiResponse> {
    return api.get(`/attendance/${date}`);
  },

  async getMonthlySummary(year: number, month: number): Promise<ApiResponse> {
    return api.get(`/attendance/summary?year=${year}&month=${month}`);
  },

  async getCalendar(year: number, month: number): Promise<ApiResponse> {
    return api.get(`/attendance/calendar?year=${year}&month=${month}`);
  },

  async submitCorrection(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/attendance/corrections', data);
  },

  async getCorrections(): Promise<ApiResponse> {
    return api.get('/attendance/corrections');
  },

  async verifyLocation(location: { latitude: number; longitude: number }): Promise<ApiResponse> {
    return api.post('/attendance/verify-location', location);
  },

  async verifyFace(imageData: string): Promise<ApiResponse> {
    return api.post('/attendance/verify-face', { image: imageData });
  },

  async verifyQR(qrData: string): Promise<ApiResponse> {
    return api.post('/attendance/verify-qr', { qrData });
  },
};

export const leaveService = {
  async getBalances(): Promise<ApiResponse> {
    return api.get('/leave/balances');
  },

  async getRequests(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/leave/requests?${query}`);
  },

  async create(data: LeaveRequestData): Promise<ApiResponse> {
    return api.post('/leave/requests', data);
  },

  async cancel(id: string): Promise<ApiResponse> {
    return api.post(`/leave/requests/${id}/cancel`);
  },

  async getHistory(): Promise<ApiResponse> {
    return api.get('/leave/history');
  },
};

export const permissionService = {
  async getSummary(): Promise<ApiResponse> {
    return api.get('/permission/summary');
  },

  async getRequests(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/permission/requests?${query}`);
  },

  async create(data: PermissionRequestData): Promise<ApiResponse> {
    return api.post('/permission/requests', data);
  },
};

export const overtimeService = {
  async getSummary(): Promise<ApiResponse> {
    return api.get('/overtime/summary');
  },

  async getRequests(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/overtime/requests?${query}`);
  },

  async create(data: OvertimeRequestData): Promise<ApiResponse> {
    return api.post('/overtime/requests', data);
  },
};

export const activityService = {
  async getActivities(date: string): Promise<ApiResponse> {
    return api.get(`/activities?date=${date}`);
  },

  async create(data: ActivityData): Promise<ApiResponse> {
    return api.post('/activities', data);
  },

  async update(id: string, data: ActivityData): Promise<ApiResponse> {
    return api.put(`/activities/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(`/activities/${id}`);
  },

  async getDetail(id: string): Promise<ApiResponse> {
    return api.get(`/activities/${id}`);
  },

  async getWeekly(startDate: string, endDate: string): Promise<ApiResponse> {
    return api.get(`/activities/weekly?start=${startDate}&end=${endDate}`);
  },

  async getMonthly(year: number, month: number): Promise<ApiResponse> {
    return api.get(`/activities/monthly?year=${year}&month=${month}`);
  },

  async submitTimesheet(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/activities/submit', data);
  },

  async getApprovalStatus(weekId: string): Promise<ApiResponse> {
    return api.get(`/activities/approval/${weekId}`);
  },

  async getCategories(): Promise<ApiResponse> {
    return api.get('/activities/categories');
  },

  async getProjects(): Promise<ApiResponse> {
    return api.get('/activities/projects');
  },
};

export const payrollService = {
  async getPayslips(): Promise<ApiResponse> {
    return api.get('/payroll/payslips');
  },

  async getPayslip(id: string): Promise<ApiResponse> {
    return api.get(`/payroll/payslips/${id}`);
  },

  async getTaxDocuments(): Promise<ApiResponse> {
    return api.get('/payroll/tax-documents');
  },

  async downloadPayslip(id: string): Promise<ApiResponse> {
    return api.get(`/payroll/payslips/${id}/download`);
  },

  async downloadTaxDocument(id: string): Promise<ApiResponse> {
    return api.get(`/payroll/tax-documents/${id}/download`);
  },
};

export const expenseService = {
  async getExpenses(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/expenses?${query}`);
  },

  async create(data: ExpenseData): Promise<ApiResponse> {
    return api.post('/expenses', data);
  },

  async getDetail(id: string): Promise<ApiResponse> {
    return api.get(`/expenses/${id}`);
  },

  async uploadReceipt(expenseId: string, formData: FormData): Promise<ApiResponse> {
    return api.uploadFile(`/expenses/${expenseId}/receipt`, formData);
  },
};

export const notificationService = {
  async getNotifications(params: NotificationParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/notifications?${query}`);
  },

  async markRead(id: string): Promise<ApiResponse> {
    return api.put(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<ApiResponse> {
    return api.put('/notifications/read-all');
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(`/notifications/${id}`);
  },

  async getUnreadCount(): Promise<ApiResponse> {
    return api.get('/notifications/unread-count');
  },
};

export const penaltyService = {
  async getPenalties(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/penalties?${query}`);
  },

  async getDetail(id: string): Promise<ApiResponse> {
    return api.get(`/penalties/${id}`);
  },

  async appeal(id: string, data: PenaltyData): Promise<ApiResponse> {
    return api.post(`/penalties/${id}/appeal`, data);
  },

  async getAppeals(): Promise<ApiResponse> {
    return api.get('/penalties/appeals');
  },
};

export const employeeService = {
  async getDirectory(params: EmployeeParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/employees?${query}`);
  },

  async getDetail(id: string): Promise<ApiResponse> {
    return api.get(`/employees/${id}`);
  },

  async getOrgChart(): Promise<ApiResponse> {
    return api.get('/employees/org-chart');
  },

  async getDepartments(): Promise<ApiResponse> {
    return api.get('/employees/departments');
  },

  async getOnboarding(): Promise<ApiResponse> {
    return api.get('/employees/onboarding');
  },

  async updateOnboardingTask(taskId: string, done: boolean): Promise<ApiResponse> {
    return api.put(`/employees/onboarding/tasks/${taskId}`, { done });
  },
};

export const performanceService = {
  async getDashboard(): Promise<ApiResponse> {
    return api.get('/performance/dashboard');
  },

  async getKPIs(params: KPIParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/kpis?${query}`);
  },

  async getGoals(params: KPIParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/goals?${query}`);
  },

  async createGoal(data: GoalData): Promise<ApiResponse> {
    return api.post('/performance/goals', data);
  },

  async updateGoal(id: string, data: GoalData): Promise<ApiResponse> {
    return api.put(`/performance/goals/${id}`, data);
  },

  async getReviews(params: KPIParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/reviews?${query}`);
  },

  async submitReview(data: ReviewData): Promise<ApiResponse> {
    return api.post('/performance/reviews', data);
  },

  async getFeedback(params: KPIParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/feedback?${query}`);
  },

  async submitFeedback(data: FeedbackData): Promise<ApiResponse> {
    return api.post('/performance/feedback', data);
  },
};

export const aiService = {
  async chat(message: string, context: AIChatContext = {}): Promise<ApiResponse> {
    return api.post('/ai/chat', { message, context });
  },

  async getQuickActions(category?: string): Promise<ApiResponse> {
    return api.get(`/ai/quick-actions${category ? `?category=${category}` : ''}`);
  },
};
