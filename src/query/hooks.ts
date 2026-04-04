import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// ============================
// TYPE INTERFACES
// ============================

export interface ApiResponse<T = unknown> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
  type?: string;
  category?: string;
  employeeId?: string;
  date?: string;
  month?: string;
  year?: string;
  minAmount?: number;
  maxAmount?: number;
  unreadOnly?: boolean;
  period?: string;
  approverId?: string;
  [key: string]: unknown;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  [key: string]: unknown;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: string;
  [key: string]: unknown;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string;
  [key: string]: unknown;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

export interface PermissionRequest {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  reason: string;
  [key: string]: unknown;
}

export interface OvertimeRequest {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  reason: string;
  [key: string]: unknown;
}

export interface Expense {
  id: string;
  employeeId: string;
  title: string;
  category: string;
  amount: number;
  status: string;
  date: string;
  [key: string]: unknown;
}

export interface PayrollRun {
  id: string;
  month: number;
  year: number;
  status: string;
  employeeCount: number;
  totalPayroll: number;
  [key: string]: unknown;
}

export interface Budget {
  id: string;
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
  [key: string]: unknown;
}

export interface Approval {
  id: string;
  type: string;
  status: string;
  employeeId: string;
  requestedBy: string;
  approverId: string;
  value: number;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  [key: string]: unknown;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  progress: number;
  status: string;
  deadline: string;
  [key: string]: unknown;
}

export interface PerformanceData {
  employeeId: string;
  period: string;
  rating: number;
  kpis: Record<string, number>;
  goals: Goal[];
  [key: string]: unknown;
}

// ============================
// PAGINATION HELPERS
// ============================

const buildQueryString = (params: Record<string, unknown>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

// ============================
// EMPLOYEE HOOKS
// ============================

export const useEmployees = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, search, department, status, ...rest } = params;
  return useQuery<ApiResponse<Employee[]>>({
    queryKey: ['employees', { page, limit, search, department, status, ...rest }],
    queryFn: () => api.get(`/employees?${buildQueryString({ page, limit, search, department, status, ...rest })}`),
    staleTime: 1000 * 60 * 2,
  });
};

export const useEmployee = (id: string | undefined) => {
  return useQuery<ApiResponse<Employee>>({
    queryKey: ['employee', id],
    queryFn: () => api.get(`/employees/${id}`),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, Partial<Employee>>({
    mutationFn: (data) => api.post('/employees', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, { id: string } & Partial<Employee>>({
    mutationFn: ({ id, ...data }) => api.put(`/employees/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });
};

export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.put(`/employees/${id}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// ============================
// ATTENDANCE HOOKS
// ============================

export const useAttendance = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, date, status, employeeId, ...rest } = params;
  return useQuery<ApiResponse<AttendanceRecord[]>>({
    queryKey: ['attendance', { page, limit, date, status, employeeId, ...rest }],
    queryFn: () => api.get(`/attendance?${buildQueryString({ page, limit, date, status, employeeId, ...rest })}`),
    staleTime: 1000 * 60,
  });
};

export const useAttendanceToday = () => {
  return useQuery<ApiResponse<AttendanceRecord>>({
    queryKey: ['attendance', 'today'],
    queryFn: () => api.get('/attendance/today'),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceRecord, Error, Partial<AttendanceRecord>>({
    mutationFn: (data) => api.post('/attendance/check-in', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] });
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceRecord, Error, Partial<AttendanceRecord>>({
    mutationFn: (data) => api.post('/attendance/check-out', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] });
    },
  });
};

export const useAttendanceCalendar = (year: number | undefined, month: number | undefined) => {
  return useQuery<ApiResponse<AttendanceRecord[]>>({
    queryKey: ['attendance', 'calendar', year, month],
    queryFn: () => api.get(`/attendance/calendar?year=${year}&month=${month}`),
    enabled: !!year && !!month,
  });
};

export const useAttendanceSummary = (year: number | undefined, month: number | undefined) => {
  return useQuery<ApiResponse<Record<string, unknown>>>({
    queryKey: ['attendance', 'summary', year, month],
    queryFn: () => api.get(`/attendance/summary?year=${year}&month=${month}`),
    enabled: !!year && !!month,
  });
};

// ============================
// LEAVE HOOKS
// ============================

export const useLeaveRequests = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, status, type, employeeId, department, ...rest } = params;
  return useQuery<ApiResponse<LeaveRequest[]>>({
    queryKey: ['leave', 'requests', { page, limit, status, type, employeeId, department, ...rest }],
    queryFn: () => api.get(`/leave/requests?${buildQueryString({ page, limit, status, type, employeeId, department, ...rest })}`),
    staleTime: 1000 * 60,
  });
};

export const useLeaveBalances = () => {
  return useQuery<ApiResponse<LeaveBalance[]>>({
    queryKey: ['leave', 'balances'],
    queryFn: () => api.get('/leave/balances'),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  return useMutation<LeaveRequest, Error, Partial<LeaveRequest>>({
    mutationFn: (data) => api.post('/leave/requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      queryClient.invalidateQueries({ queryKey: ['leave', 'balances'] });
    },
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();
  return useMutation<LeaveRequest, Error, { id: string; comment: string }>({
    mutationFn: ({ id, comment }) => api.put(`/leave/requests/${id}/approve`, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      queryClient.invalidateQueries({ queryKey: ['leave', 'balances'] });
    },
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();
  return useMutation<LeaveRequest, Error, { id: string; reason: string }>({
    mutationFn: ({ id, reason }) => api.put(`/leave/requests/${id}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
    },
  });
};

// ============================
// PERMISSION HOOKS
// ============================

export const usePermissions = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, status, employeeId, department, ...rest } = params;
  return useQuery<ApiResponse<PermissionRequest[]>>({
    queryKey: ['permissions', { page, limit, status, employeeId, department, ...rest }],
    queryFn: () => api.get(`/permission/requests?${buildQueryString({ page, limit, status, employeeId, department, ...rest })}`),
    staleTime: 1000 * 60,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<PermissionRequest, Error, Partial<PermissionRequest>>({
    mutationFn: (data) => api.post('/permission/requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export const useApprovePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<PermissionRequest, Error, { id: string; comment: string }>({
    mutationFn: ({ id, comment }) => api.put(`/permission/requests/${id}/approve`, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

// ============================
// OVERTIME HOOKS
// ============================

export const useOvertime = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, status, employeeId, department, ...rest } = params;
  return useQuery<ApiResponse<OvertimeRequest[]>>({
    queryKey: ['overtime', { page, limit, status, employeeId, department, ...rest }],
    queryFn: () => api.get(`/overtime/requests?${buildQueryString({ page, limit, status, employeeId, department, ...rest })}`),
    staleTime: 1000 * 60,
  });
};

export const useCreateOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation<OvertimeRequest, Error, Partial<OvertimeRequest>>({
    mutationFn: (data) => api.post('/overtime/requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overtime'] });
    },
  });
};

// ============================
// EXPENSE HOOKS
// ============================

export const useExpenses = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, status, category, employeeId, department, minAmount, maxAmount, ...rest } = params;
  return useQuery<ApiResponse<Expense[]>>({
    queryKey: ['expenses', { page, limit, status, category, employeeId, department, minAmount, maxAmount, ...rest }],
    queryFn: () => api.get(`/expenses?${buildQueryString({ page, limit, status, category, employeeId, department, minAmount, maxAmount, ...rest })}`),
    staleTime: 1000 * 60,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<Expense, Error, Partial<Expense>>({
    mutationFn: (data) => api.post('/expenses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};

export const useApproveExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<Expense, Error, { id: string; comment: string }>({
    mutationFn: ({ id, comment }) => api.put(`/expenses/${id}/approve`, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};

// ============================
// PAYROLL HOOKS
// ============================

export const usePayrollRuns = (params: QueryParams = {}) => {
  const { page = 1, limit = 10, status, month, year, ...rest } = params;
  return useQuery<ApiResponse<PayrollRun[]>>({
    queryKey: ['payroll', 'runs', { page, limit, status, month, year, ...rest }],
    queryFn: () => api.get(`/payroll-runs?${buildQueryString({ page, limit, status, month, year, ...rest })}`),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePayrollRun = () => {
  const queryClient = useQueryClient();
  return useMutation<PayrollRun, Error, Partial<PayrollRun>>({
    mutationFn: (data) => api.post('/payroll-runs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });
};

export const useApprovePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation<PayrollRun, Error, { id: string; approvedBy: string }>({
    mutationFn: ({ id, approvedBy }) => api.put(`/payroll-runs/${id}/approve`, { approvedBy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });
};

// ============================
// BUDGET HOOKS
// ============================

export const useBudgets = () => {
  return useQuery<ApiResponse<Budget[]>>({
    queryKey: ['budgets'],
    queryFn: () => api.get('/budgets'),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation<Budget, Error, { id: string } & Partial<Budget>>({
    mutationFn: ({ id, ...data }) => api.put(`/budgets/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

// ============================
// APPROVAL HOOKS
// ============================

export const useApprovals = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, type, status, department, approverId, ...rest } = params;
  return useQuery<ApiResponse<Approval[]>>({
    queryKey: ['approvals', { page, limit, type, status, department, approverId, ...rest }],
    queryFn: () => api.get(`/approvals?${buildQueryString({ page, limit, type, status, department, approverId, ...rest })}`),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};

export const useApprovalStats = (approverId: string | undefined) => {
  return useQuery<ApiResponse<Record<string, unknown>>>({
    queryKey: ['approvals', 'stats', approverId],
    queryFn: () => api.get(`/approvals/stats?approverId=${approverId}`),
    enabled: !!approverId,
    staleTime: 1000 * 60,
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<Approval, Error, { id: string; comment: string }>({
    mutationFn: ({ id, comment }) => api.put(`/approvals/${id}/approve`, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approvals', 'stats'] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<Approval, Error, { id: string; reason: string }>({
    mutationFn: ({ id, reason }) => api.put(`/approvals/${id}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approvals', 'stats'] });
    },
  });
};

export const useBulkApprove = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { ids: string[]; comment: string }>({
    mutationFn: ({ ids, comment }) => api.post('/approvals/bulk-approve', { ids, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
};

export const useBulkReject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { ids: string[]; reason: string }>({
    mutationFn: ({ ids, reason }) => api.post('/approvals/bulk-reject', { ids, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
};

// ============================
// NOTIFICATION HOOKS
// ============================

export const useNotifications = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, type, unreadOnly, ...rest } = params;
  return useQuery<ApiResponse<Notification[]>>({
    queryKey: ['notifications', { page, limit, type, unreadOnly, ...rest }],
    queryFn: () => api.get(`/notifications?${buildQueryString({ page, limit, type, unreadOnly, ...rest })}`),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation<Notification, Error, string>({
    mutationFn: (id) => api.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// ============================
// REPORT HOOKS
// ============================

export const useReport = (type: string, params: QueryParams = {}) => {
  return useQuery<ApiResponse<Record<string, unknown>>>({
    queryKey: ['reports', type, params],
    queryFn: () => api.get(`/reports/${type}?${buildQueryString(params)}`),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Record<string, unknown>>, Error, { type: string; params: QueryParams }>({
    mutationFn: ({ type, params }) => api.post(`/reports/${type}/generate`, params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports', variables.type] });
    },
  });
};

// ============================
// PERFORMANCE HOOKS
// ============================

export const usePerformance = (params: QueryParams = {}) => {
  const { employeeId, period, ...rest } = params;
  return useQuery<ApiResponse<PerformanceData>>({
    queryKey: ['performance', { employeeId, period, ...rest }],
    queryFn: () => api.get(`/performance?${buildQueryString({ employeeId, period, ...rest })}`),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGoals = (params: QueryParams = {}) => {
  const { page = 1, limit = 20, status, department, ...rest } = params;
  return useQuery<ApiResponse<Goal[]>>({
    queryKey: ['goals', { page, limit, status, department, ...rest }],
    queryFn: () => api.get(`/goals?${buildQueryString({ page, limit, status, department, ...rest })}`),
    staleTime: 1000 * 60 * 2,
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<Goal, Error, { id: string } & Partial<Goal>>({
    mutationFn: ({ id, ...data }) => api.put(`/goals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};
