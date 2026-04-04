import { api } from './api';

export const authService = {
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password }, { requiresAuth: false });
    await api.setTokens(data.token, data.refreshToken);
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout', {});
    } catch {
    } finally {
      await api.clearTokens();
    }
  },

  async getProfile() {
    return api.get('/auth/profile');
  },

  async updateProfile(updates) {
    return api.put('/auth/profile', updates);
  },

  async changePassword(currentPassword, newPassword) {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email }, { requiresAuth: false });
  },

  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, newPassword }, { requiresAuth: false });
  },

  async isAuthenticated() {
    const token = await api.getToken();
    return !!token;
  },
};

export const attendanceService = {
  async getToday() {
    return api.get('/attendance/today');
  },

  async checkIn(data) {
    return api.post('/attendance/check-in', data);
  },

  async checkOut(data) {
    return api.post('/attendance/check-out', data);
  },

  async getHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/attendance/history?${query}`);
  },

  async getDayDetail(date) {
    return api.get(`/attendance/${date}`);
  },

  async getMonthlySummary(year, month) {
    return api.get(`/attendance/summary?year=${year}&month=${month}`);
  },

  async getCalendar(year, month) {
    return api.get(`/attendance/calendar?year=${year}&month=${month}`);
  },

  async submitCorrection(data) {
    return api.post('/attendance/corrections', data);
  },

  async getCorrections() {
    return api.get('/attendance/corrections');
  },

  async verifyLocation(location) {
    return api.post('/attendance/verify-location', location);
  },

  async verifyFace(imageData) {
    return api.post('/attendance/verify-face', { image: imageData });
  },

  async verifyQR(qrData) {
    return api.post('/attendance/verify-qr', { qrData });
  },
};

export const leaveService = {
  async getBalances() {
    return api.get('/leave/balances');
  },

  async getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/leave/requests?${query}`);
  },

  async create(data) {
    return api.post('/leave/requests', data);
  },

  async cancel(id) {
    return api.post(`/leave/requests/${id}/cancel`);
  },

  async getHistory() {
    return api.get('/leave/history');
  },
};

export const permissionService = {
  async getSummary() {
    return api.get('/permission/summary');
  },

  async getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/permission/requests?${query}`);
  },

  async create(data) {
    return api.post('/permission/requests', data);
  },
};

export const overtimeService = {
  async getSummary() {
    return api.get('/overtime/summary');
  },

  async getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/overtime/requests?${query}`);
  },

  async create(data) {
    return api.post('/overtime/requests', data);
  },
};

export const activityService = {
  async getActivities(date) {
    return api.get(`/activities?date=${date}`);
  },

  async create(data) {
    return api.post('/activities', data);
  },

  async update(id, data) {
    return api.put(`/activities/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/activities/${id}`);
  },

  async getDetail(id) {
    return api.get(`/activities/${id}`);
  },

  async getWeekly(startDate, endDate) {
    return api.get(`/activities/weekly?start=${startDate}&end=${endDate}`);
  },

  async getMonthly(year, month) {
    return api.get(`/activities/monthly?year=${year}&month=${month}`);
  },

  async submitTimesheet(data) {
    return api.post('/activities/submit', data);
  },

  async getApprovalStatus(weekId) {
    return api.get(`/activities/approval/${weekId}`);
  },

  async getCategories() {
    return api.get('/activities/categories');
  },

  async getProjects() {
    return api.get('/activities/projects');
  },
};

export const payrollService = {
  async getPayslips() {
    return api.get('/payroll/payslips');
  },

  async getPayslip(id) {
    return api.get(`/payroll/payslips/${id}`);
  },

  async getTaxDocuments() {
    return api.get('/payroll/tax-documents');
  },

  async downloadPayslip(id) {
    return api.get(`/payroll/payslips/${id}/download`);
  },

  async downloadTaxDocument(id) {
    return api.get(`/payroll/tax-documents/${id}/download`);
  },
};

export const expenseService = {
  async getExpenses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/expenses?${query}`);
  },

  async create(data) {
    return api.post('/expenses', data);
  },

  async getDetail(id) {
    return api.get(`/expenses/${id}`);
  },

  async uploadReceipt(expenseId, formData) {
    return api.uploadFile(`/expenses/${expenseId}/receipt`, formData);
  },
};

export const notificationService = {
  async getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/notifications?${query}`);
  },

  async markRead(id) {
    return api.put(`/notifications/${id}/read`);
  },

  async markAllRead() {
    return api.put('/notifications/read-all');
  },

  async delete(id) {
    return api.delete(`/notifications/${id}`);
  },

  async getUnreadCount() {
    return api.get('/notifications/unread-count');
  },
};

export const penaltyService = {
  async getPenalties(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/penalties?${query}`);
  },

  async getDetail(id) {
    return api.get(`/penalties/${id}`);
  },

  async appeal(id, data) {
    return api.post(`/penalties/${id}/appeal`, data);
  },

  async getAppeals() {
    return api.get('/penalties/appeals');
  },
};

export const employeeService = {
  async getDirectory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/employees?${query}`);
  },

  async getDetail(id) {
    return api.get(`/employees/${id}`);
  },

  async getOrgChart() {
    return api.get('/employees/org-chart');
  },

  async getDepartments() {
    return api.get('/employees/departments');
  },

  async getOnboarding() {
    return api.get('/employees/onboarding');
  },

  async updateOnboardingTask(taskId, done) {
    return api.put(`/employees/onboarding/tasks/${taskId}`, { done });
  },
};

export const performanceService = {
  async getDashboard() {
    return api.get('/performance/dashboard');
  },

  async getKPIs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/kpis?${query}`);
  },

  async getGoals(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/goals?${query}`);
  },

  async createGoal(data) {
    return api.post('/performance/goals', data);
  },

  async updateGoal(id, data) {
    return api.put(`/performance/goals/${id}`, data);
  },

  async getReviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/reviews?${query}`);
  },

  async submitReview(data) {
    return api.post('/performance/reviews', data);
  },

  async getFeedback(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/performance/feedback?${query}`);
  },

  async submitFeedback(data) {
    return api.post('/performance/feedback', data);
  },
};

export const aiService = {
  async chat(message, context = {}) {
    return api.post('/ai/chat', { message, context });
  },

  async getQuickActions(category) {
    return api.get(`/ai/quick-actions${category ? `?category=${category}` : ''}`);
  },
};
