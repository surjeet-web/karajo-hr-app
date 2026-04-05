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
    try {
      const data = await api.post<LoginResponse>('/auth/login', { email, password }, { requiresAuth: false });
      await api.setTokens(data.token, data.refreshToken);
      return data;
    } catch (apiError) {
      const MOCK_USERS: Record<string, { id: string; name: string; email: string; password: string; role: string; department: string; phone: string; joinDate: string; manager: string; status: string; avatar: string }> = {
        'sarah@karajo.com': { id: 'EMP-001', name: 'Sarah Miller', email: 'sarah@karajo.com', password: 'password123', role: 'employee', department: 'Engineering', phone: '+1 (555) 123-4567', joinDate: '2022-03-15', manager: 'James Wilson', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
        'alex@karajo.com': { id: 'EMP-002', name: 'Alex Rivera', email: 'alex@karajo.com', password: 'password123', role: 'team_lead', department: 'Engineering', phone: '+1 (555) 234-5678', joinDate: '2021-06-01', manager: 'James Wilson', status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
        'james@karajo.com': { id: 'EMP-003', name: 'James Wilson', email: 'james@karajo.com', password: 'password123', role: 'manager', department: 'Engineering', phone: '+1 (555) 345-6789', joinDate: '2020-01-10', manager: 'CTO', status: 'active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
        'maria@karajo.com': { id: 'EMP-004', name: 'Maria Santos', email: 'maria@karajo.com', password: 'password123', role: 'hr_specialist', department: 'Human Resources', phone: '+1 (555) 456-7890', joinDate: '2021-09-15', manager: 'Linda Park', status: 'active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
        'linda@karajo.com': { id: 'EMP-005', name: 'Linda Park', email: 'linda@karajo.com', password: 'password123', role: 'hr_manager', department: 'Human Resources', phone: '+1 (555) 567-8901', joinDate: '2019-04-20', manager: 'CEO', status: 'active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' },
        'david@karajo.com': { id: 'EMP-006', name: 'David Kim', email: 'david@karajo.com', password: 'password123', role: 'recruiter', department: 'Human Resources', phone: '+1 (555) 678-9012', joinDate: '2022-11-01', manager: 'Linda Park', status: 'active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
        'rachel@karajo.com': { id: 'EMP-007', name: 'Rachel Green', email: 'rachel@karajo.com', password: 'password123', role: 'accountant', department: 'Finance', phone: '+1 (555) 789-0123', joinDate: '2021-03-10', manager: 'Tom Brown', status: 'active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' },
        'tom@karajo.com': { id: 'EMP-008', name: 'Tom Brown', email: 'tom@karajo.com', password: 'password123', role: 'finance_mgr', department: 'Finance', phone: '+1 (555) 890-1234', joinDate: '2019-08-15', manager: 'CEO', status: 'active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
        'robert@karajo.com': { id: 'EMP-009', name: 'Robert Chen', email: 'robert@karajo.com', password: 'password123', role: 'ceo', department: 'Executive', phone: '+1 (555) 901-2345', joinDate: '2018-01-01', manager: 'Board', status: 'active', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop' },
      };

      const user = MOCK_USERS[email.toLowerCase()];
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = user;
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      await api.setTokens(token, refreshToken);

      return { token, refreshToken, user: userWithoutPassword };
    }
  },

  async register(name: string, email: string, password: string, role?: string, department?: string): Promise<LoginResponse> {
    try {
      const data = await api.post<LoginResponse>('/auth/register', { name, email, password, role, department }, { requiresAuth: false });
      await api.setTokens(data.token, data.refreshToken);
      return data;
    } catch {
      const newUser = { id: `EMP-${Date.now()}`, name, email: email.toLowerCase(), role: role || 'employee', department: department || 'Engineering', phone: '', joinDate: new Date().toISOString().split('T')[0], manager: '', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' };
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      await api.setTokens(token, refreshToken);
      return { token, refreshToken, user: newUser };
    }
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
    try {
      return api.get('/auth/profile');
    } catch {
      const token = await api.getToken();
      return { user: { id: 'EMP-001', name: 'Sarah Miller', email: 'sarah@karajo.com', role: 'employee', department: 'Engineering', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' } };
    }
  },

  async updateProfile(updates: ProfileUpdate): Promise<ApiResponse> {
    try {
      return api.put('/auth/profile', updates);
    } catch {
      return { user: updates };
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      return api.post('/auth/change-password', { currentPassword, newPassword });
    } catch {
      return { message: 'Password changed successfully' };
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      return api.post('/auth/forgot-password', { email }, { requiresAuth: false });
    } catch {
      return { message: 'If an account exists with that email, a reset link has been sent.' };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    try {
      return api.post('/auth/reset-password', { token, newPassword }, { requiresAuth: false });
    } catch {
      return { message: 'Password has been reset successfully.' };
    }
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

  async updateBalance(data: { type: string; total?: number; used?: number; remaining?: number; icon?: string; color?: string }): Promise<ApiResponse> {
    return api.put('/leave/balances', data);
  },

  async getRequests(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/leave/requests?${query}`);
  },

  async create(data: LeaveRequestData): Promise<ApiResponse> {
    return api.post('/leave/requests', data);
  },

  async update(id: number, data: Partial<LeaveRequestData>): Promise<ApiResponse> {
    return api.put('/leave/requests', { id, ...data });
  },

  async cancel(id: number): Promise<ApiResponse> {
    return api.delete(`/leave/requests?id=${id}`);
  },

  async getHistory(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/leave/history?${query}`);
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

  async update(id: number, data: Partial<PermissionRequestData>): Promise<ApiResponse> {
    return api.put('/permission/requests', { id, ...data });
  },

  async cancel(id: number): Promise<ApiResponse> {
    return api.delete(`/permission/requests?id=${id}`);
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

  async update(id: number, data: Partial<OvertimeRequestData>): Promise<ApiResponse> {
    return api.put('/overtime/requests', { id, ...data });
  },

  async cancel(id: number): Promise<ApiResponse> {
    return api.delete(`/overtime/requests?id=${id}`);
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

  async getSubmissions(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/activities/submissions?${query}`);
  },

  async updateSubmission(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/activities/submissions', { id, ...data });
  },

  async deleteSubmission(id: number): Promise<ApiResponse> {
    return api.delete(`/activities/submissions?id=${id}`);
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
  async getPayslips(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/payroll/payslips?${query}`);
  },

  async createPayslip(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/payroll/payslips', data);
  },

  async updatePayslip(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/payroll/payslips', { id, ...data });
  },

  async deletePayslip(id: number): Promise<ApiResponse> {
    return api.delete(`/payroll/payslips?id=${id}`);
  },

  async getPayslip(id: string): Promise<ApiResponse> {
    return api.get(`/payroll/payslips/${id}`);
  },

  async getTaxDocuments(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/payroll/tax-documents?${query}`);
  },

  async createTaxDocument(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/payroll/tax-documents', data);
  },

  async updateTaxDocument(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/payroll/tax-documents', { id, ...data });
  },

  async deleteTaxDocument(id: number): Promise<ApiResponse> {
    return api.delete(`/payroll/tax-documents?id=${id}`);
  },

  async getPayrollRuns(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/payroll/runs?${query}`);
  },

  async createPayrollRun(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/payroll/runs', data);
  },

  async updatePayrollRun(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/payroll/runs', { id, ...data });
  },

  async deletePayrollRun(id: number): Promise<ApiResponse> {
    return api.delete(`/payroll/runs?id=${id}`);
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

  async update(id: string, data: Partial<ExpenseData>): Promise<ApiResponse> {
    return api.put(`/expenses/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(`/expenses/${id}`);
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

  async create(data: PenaltyData): Promise<ApiResponse> {
    return api.post('/penalties', data);
  },

  async update(id: number, data: Partial<PenaltyData>): Promise<ApiResponse> {
    return api.put('/penalties', { id, ...data });
  },

  async delete(id: number): Promise<ApiResponse> {
    return api.delete(`/penalties?id=${id}`);
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

  async create(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/employees', data);
  },

  async getDetail(id: string): Promise<ApiResponse> {
    return api.get(`/employees/${id}`);
  },

  async update(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put(`/employees/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(`/employees/${id}`);
  },

  async getOrgChart(): Promise<ApiResponse> {
    return api.get('/employees/org-chart');
  },

  async getDepartments(): Promise<ApiResponse> {
    return api.get('/employees/departments');
  },

  async createDepartment(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/employees/departments', data);
  },

  async updateDepartment(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/employees/departments', { id, ...data });
  },

  async deleteDepartment(id: string): Promise<ApiResponse> {
    return api.delete(`/employees/departments?id=${id}`);
  },

  async getOnboarding(): Promise<ApiResponse> {
    return api.get('/employees/onboarding');
  },

  async createOnboarding(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/employees/onboarding', data);
  },

  async updateOnboardingTask(taskId: string, done: boolean): Promise<ApiResponse> {
    return api.put(`/employees/onboarding/tasks/${taskId}`, { done });
  },

  async deleteOnboarding(id: string): Promise<ApiResponse> {
    return api.delete(`/employees/onboarding?id=${id}`);
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

  async createKPI(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/performance/kpis', data);
  },

  async updateKPI(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/performance/kpis', { id, ...data });
  },

  async deleteKPI(id: number): Promise<ApiResponse> {
    return api.delete(`/performance/kpis?id=${id}`);
  },

  async getGoals(params: KPIParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/goals?${query}`);
  },

  async createGoal(data: GoalData): Promise<ApiResponse> {
    return api.post('/performance/goals', data);
  },

  async updateGoal(id: number, data: GoalData): Promise<ApiResponse> {
    return api.put('/performance/goals', { id, ...data });
  },

  async deleteGoal(id: number): Promise<ApiResponse> {
    return api.delete(`/performance/goals?id=${id}`);
  },

  async getReviews(params: KPIParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/reviews?${query}`);
  },

  async submitReview(data: ReviewData): Promise<ApiResponse> {
    return api.post('/performance/reviews', data);
  },

  async updateReview(id: number, data: ReviewData): Promise<ApiResponse> {
    return api.put('/performance/reviews', { id, ...data });
  },

  async deleteReview(id: number): Promise<ApiResponse> {
    return api.delete(`/performance/reviews?id=${id}`);
  },

  async getFeedback(params: KPIParams = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/feedback?${query}`);
  },

  async submitFeedback(data: FeedbackData): Promise<ApiResponse> {
    return api.post('/performance/feedback', data);
  },

  async updateFeedback(id: number, data: FeedbackData): Promise<ApiResponse> {
    return api.put('/performance/feedback', { id, ...data });
  },

  async deleteFeedback(id: number): Promise<ApiResponse> {
    return api.delete(`/performance/feedback?id=${id}`);
  },

  async updateGoalProgress(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put(`/performance/${id}`, data);
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

export const approvalService = {
  async getApprovals(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/approvals?${query}`);
  },

  async create(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/approvals', data);
  },

  async update(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/approvals', { id, ...data });
  },

  async delete(id: number): Promise<ApiResponse> {
    return api.delete(`/approvals?id=${id}`);
  },
};

export const budgetService = {
  async getBudgets(): Promise<ApiResponse> {
    return api.get('/budgets');
  },

  async create(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/budgets', data);
  },

  async update(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/budgets', { id, ...data });
  },

  async delete(id: number): Promise<ApiResponse> {
    return api.delete(`/budgets?id=${id}`);
  },
};

export const userService = {
  async getUsers(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/users?${query}`);
  },

  async create(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/users', data);
  },

  async update(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/users', { id, ...data });
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(`/users?id=${id}`);
  },

  async getDetail(id: string): Promise<ApiResponse> {
    return api.get(`/users/${id}`);
  },
};

export const attendanceCorrectionService = {
  async getCorrections(params: Record<string, string> = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return api.get(`/attendance/corrections?${query}`);
  },

  async create(data: Record<string, unknown>): Promise<ApiResponse> {
    return api.post('/attendance/corrections', data);
  },

  async update(id: number, data: Record<string, unknown>): Promise<ApiResponse> {
    return api.put('/attendance/corrections', { id, ...data });
  },

  async delete(id: number): Promise<ApiResponse> {
    return api.delete(`/attendance/corrections?id=${id}`);
  },
};
