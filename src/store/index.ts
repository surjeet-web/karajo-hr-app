import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  attendanceService,
  leaveService,
  permissionService,
  overtimeService,
  activityService,
  payrollService,
  expenseService,
  notificationService,
  penaltyService,
  employeeService,
  performanceService,
} from '../services';
import {
  calculateLeaveDays,
  calculateDuration,
  calculateTotalHours,
  calculateOvertime,
  calculateAttendanceStatus,
  calculateLeaveBalance,
  calculateBudgetUtilization,
  calculateProductivityScore,
  calculateGoalProgress,
  formatCurrency,
  formatDuration,
} from '../utils/calculations';
import {
  validateLeaveRequest,
  validatePermissionRequest,
  validateOvertimeRequest,
  validateExpenseRequest,
  validateActivity,
  validateCorrection,
} from '../utils/validators';
import {
  createApprovalRequest,
  approveRequest,
  rejectRequest,
  cancelApproval,
  getPendingApprovals,
} from '../services/approvalWorkflow';
import {
  runPayroll,
  savePayrollRun,
  approvePayrollRun,
  getPayrollSummary,
  getEmployeePayslip,
  getDepartmentPayrollSummary,
  getPayrollTrends,
  generateW2Form,
  type PayrollRun as PayrollEngineRun,
} from '../services/payrollEngine';

// ============================
// TYPE INTERFACES
// ============================

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  avatar: string;
  salary: {
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
    tax: number;
  };
  manager: string;
  status: string;
}

export interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: string;
  location: string | null;
  overtime?: number;
}

export interface AttendanceCorrection {
  id: number;
  date: string;
  status: string;
  submittedOn: string;
  [key: string]: unknown;
}

export interface AttendanceState {
  today: AttendanceRecord;
  history: AttendanceRecord[];
  corrections: AttendanceCorrection[];
}

export interface LeaveBalance {
  type: string;
  total: number | null;
  used: number;
  remaining: number | null;
  icon: string;
  color: string;
}

export interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  appliedOn: string;
  delegate: string | null;
  documents: string[];
}

export interface LeaveState {
  balances: LeaveBalance[];
  requests: LeaveRequest[];
  nextId: number;
}

export interface PermissionRequest {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  reason: string;
  status: string;
  appliedOn: string;
}

export interface PermissionState {
  totalHoursUsed: number;
  monthlyAllowance: number;
  requests: PermissionRequest[];
  nextId: number;
}

export interface OvertimeRequest {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  reason: string;
  status: string;
  appliedOn: string;
}

export interface OvertimeState {
  totalApproved: number;
  totalPending: number;
  requests: OvertimeRequest[];
  nextId: number;
}

export interface Activity {
  id: number;
  title: string;
  project: string;
  duration: string;
  time: string;
  category: string;
  date: string;
}

export interface TimesheetSubmission {
  id: number;
  status: string;
  submittedOn: string;
  hours: number | string;
  period: string;
  [key: string]: unknown;
}

export interface ActivityState {
  items: Activity[];
  nextId: number;
  submissions: TimesheetSubmission[];
}

export interface Payslip {
  id: number;
  month: string;
  period: string;
  basic: number;
  hra: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: string;
  paidOn: string;
}

export interface TaxDocument {
  id: number;
  name: string;
  year: number;
  type: string;
  status: string;
}

export interface PayrollRun {
  id: number;
  month: number;
  year: number;
  status: string;
  employeeCount?: number;
  totalPayroll?: number;
  totalTax?: number;
  totalDeductions?: number;
  totalOvertimePay?: number;
  totalGross?: number;
  employees?: unknown[];
  createdAt?: string;
  processedAt?: string | null;
  approvedAt?: string | null;
  processedBy?: string | null;
  approvedBy?: string | null;
  [key: string]: unknown;
}

export interface PayrollState {
  payslips: Payslip[];
  taxDocuments: TaxDocument[];
  payrollRuns: PayrollRun[];
}

export interface BudgetDepartment {
  id: number;
  name: string;
  budget: number;
  spent: number;
  allocated: number;
}

export interface BudgetState {
  departments: BudgetDepartment[];
  totalBudget: number;
  totalSpent: number;
}

export interface Expense {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  status: string;
  description: string;
  receipt: string | null;
}

export interface ExpenseState {
  requests: Expense[];
  nextId: number;
}

export interface Penalty {
  id: number;
  type: string;
  date: string;
  severity: string;
  status: string;
  description: string;
  fine: number;
  issuedBy: string;
  reference: string;
  appealDeadline: string;
}

export interface PenaltyAppeal {
  id: number;
  penaltyId: number;
  type: string;
  explanation: string;
  status: string;
  submittedOn: string;
}

export interface PenaltyState {
  records: Penalty[];
  appeals: PenaltyAppeal[];
  nextId: number;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  manager: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: string;
  location: string;
  employmentType: string;
  rating: number;
  kpiScore: number;
  pendingReviews: number;
}

export interface PerformanceOverview {
  overallRating: number;
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  avgKpiScore: number;
  topPerformers: number;
  needsImprovement: number;
}

export interface KPI {
  id: number;
  name: string;
  target: string;
  current: string;
  status: string;
  trend: string;
  category: string;
}

export interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  status: string;
  priority: string;
  category: string;
}

export interface Review {
  id: number;
  reviewer: string;
  type: string;
  date: string;
  status: string;
  rating: number;
  summary: string;
}

export interface Feedback {
  id: number;
  from: string;
  to: string;
  type: string;
  date: string;
  text: string;
  category: string;
}

export interface PerformanceState {
  overview: PerformanceOverview;
  kpis: KPI[];
  goals: Goal[];
  reviews: Review[];
  feedback: Feedback[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

export interface AppState {
  user: UserProfile;
  attendance: AttendanceState;
  leave: LeaveState;
  permission: PermissionState;
  overtime: OvertimeState;
  activities: ActivityState;
  payroll: PayrollState;
  budgets: BudgetState;
  expenses: ExpenseState;
  penalties: PenaltyState;
  employees: Employee[];
  performance: PerformanceState;
  notifications: Notification[];
}

// ============================
// STATE MANAGEMENT
// ============================

const STORAGE_KEY = '@karajo_hr_data';

const getDefaultState = (): AppState => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  return {
    user: {
      id: 'EMP-2024-889',
      name: 'Sarah Miller',
      role: 'Senior Software Engineer',
      department: 'Engineering',
      email: 'sarah.miller@karajo.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2022-03-15',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      salary: { basic: 5000, hra: 2000, allowances: 1500, deductions: 800, tax: 450 },
      manager: 'James Wilson',
      status: 'active',
    },
    attendance: {
      today: { date: today, checkIn: null, checkOut: null, status: 'not-checked-in', location: null, totalHours: 0 },
      history: [
        { date: '2026-02-24', checkIn: '09:00', checkOut: '18:00', totalHours: 9, status: 'on-time', location: 'Office - New York' },
        { date: '2026-02-23', checkIn: '09:45', checkOut: '18:45', totalHours: 9, status: 'late', location: 'Office - New York' },
        { date: '2026-02-20', checkIn: '09:00', checkOut: '20:30', totalHours: 11.5, status: 'overtime', location: 'Office - New York' },
        { date: '2026-02-19', checkIn: null, checkOut: null, totalHours: 0, status: 'absent', location: null },
        { date: '2026-02-18', checkIn: '08:55', checkOut: '17:00', totalHours: 8.08, status: 'on-time', location: 'Office - New York' },
      ],
      corrections: [],
    },
    leave: {
      balances: [
        { type: 'Annual', total: 20, used: 8, remaining: 12, icon: 'umbrella', color: '#2563EB' },
        { type: 'Sick', total: 7, used: 2, remaining: 5, icon: 'medkit', color: '#EF4444' },
        { type: 'Personal', total: 3, used: 1, remaining: 2, icon: 'person', color: '#8B5CF6' },
        { type: 'Unpaid', total: null, used: 0, remaining: null, icon: 'cash', color: '#F59E0B' },
      ],
      requests: [
        { id: 1, type: 'Annual', startDate: '2026-02-24', endDate: '2026-02-25', days: 2, reason: 'Family vacation', status: 'pending', appliedOn: '2026-02-20', delegate: 'David Miller', documents: [] },
        { id: 2, type: 'Sick', startDate: '2026-02-02', endDate: '2026-02-03', days: 2, reason: 'Medical appointment', status: 'approved', appliedOn: '2026-02-01', delegate: null, documents: [] },
        { id: 3, type: 'Annual', startDate: '2026-01-15', endDate: '2026-01-17', days: 3, reason: 'Personal matters', status: 'approved', appliedOn: '2026-01-10', delegate: 'Rachel Green', documents: [] },
        { id: 4, type: 'Personal', startDate: '2025-12-20', endDate: '2025-12-20', days: 1, reason: 'Bank work', status: 'rejected', appliedOn: '2025-12-18', delegate: null, documents: [] },
      ],
      nextId: 5,
    },
    permission: {
      totalHoursUsed: 12.5,
      monthlyAllowance: 16,
      requests: [
        { id: 1, date: '2026-02-24', startTime: '09:00', endTime: '11:00', duration: 2, reason: "Doctor's appointment", status: 'pending', appliedOn: '2026-02-22' },
        { id: 2, date: '2026-02-18', startTime: '15:00', endTime: '16:30', duration: 1.5, reason: 'School pick-up', status: 'approved', appliedOn: '2026-02-17' },
        { id: 3, date: '2026-01-12', startTime: '08:00', endTime: '12:00', duration: 4, reason: 'Internet maintenance', status: 'approved', appliedOn: '2026-01-11' },
      ],
      nextId: 4,
    },
    overtime: {
      totalApproved: 12.5,
      totalPending: 3,
      requests: [
        { id: 1, date: '2026-02-24', startTime: '18:00', endTime: '21:00', duration: 3, reason: 'Quarterly Report Prep', status: 'pending', appliedOn: '2026-02-23' },
        { id: 2, date: '2026-02-22', startTime: '17:30', endTime: '20:30', duration: 3, reason: 'Server Migration', status: 'approved', appliedOn: '2026-02-21' },
        { id: 3, date: '2026-02-18', startTime: '18:00', endTime: '22:30', duration: 4.5, reason: 'Inventory Audit', status: 'approved', appliedOn: '2026-02-17' },
      ],
      nextId: 4,
    },
    activities: {
      items: [
        { id: 1, title: 'Frontend Development', project: 'Karajo HRIS Internal Tools', duration: '3h 15m', time: '1:00 PM - 4:15 PM', category: 'Development', date: '2026-02-28' },
        { id: 2, title: 'Client Meeting', project: 'Project Alpha', duration: '1h 00m', time: '9:00 AM - 10:00 AM', category: 'Meeting', date: '2026-02-28' },
      ],
      nextId: 3,
      submissions: [],
    },
    payroll: {
      payslips: [
        { id: 1, month: 'February 2026', period: 'Feb 1 - Feb 28, 2026', basic: 5000, hra: 2000, allowances: 1500, overtime: 450, bonus: 0, deductions: 800, tax: 450, netPay: 7700, status: 'paid', paidOn: '2026-03-01' },
        { id: 2, month: 'January 2026', period: 'Jan 1 - Jan 31, 2026', basic: 5000, hra: 2000, allowances: 1500, overtime: 200, bonus: 0, deductions: 800, tax: 450, netPay: 7450, status: 'paid', paidOn: '2026-02-01' },
        { id: 3, month: 'December 2025', period: 'Dec 1 - Dec 31, 2025', basic: 5000, hra: 2000, allowances: 1500, overtime: 0, bonus: 1500, deductions: 800, tax: 450, netPay: 8750, status: 'paid', paidOn: '2026-01-01' },
        { id: 4, month: 'November 2025', period: 'Nov 1 - Nov 30, 2025', basic: 5000, hra: 2000, allowances: 1500, overtime: 300, bonus: 0, deductions: 800, tax: 450, netPay: 7550, status: 'paid', paidOn: '2025-12-01' },
      ],
      taxDocuments: [
        { id: 1, name: 'W-2 Form 2025', year: 2025, type: 'W-2', status: 'available' },
        { id: 2, name: '1099 Form 2025', year: 2025, type: '1099', status: 'pending' },
      ],
      payrollRuns: [],
    },
    budgets: {
      departments: [
        { id: 1, name: 'Engineering', budget: 450000, spent: 380000, allocated: 450000 },
        { id: 2, name: 'Marketing', budget: 200000, spent: 165000, allocated: 200000 },
        { id: 3, name: 'Sales', budget: 320000, spent: 290000, allocated: 320000 },
        { id: 4, name: 'Operations', budget: 280000, spent: 210000, allocated: 280000 },
        { id: 5, name: 'Design', budget: 150000, spent: 120000, allocated: 150000 },
        { id: 6, name: 'HR', budget: 80000, spent: 65000, allocated: 80000 },
      ],
      totalBudget: 1480000,
      totalSpent: 1230000,
    },
    expenses: {
      requests: [
        { id: 1, title: 'Uber to Airport', category: 'Travel', date: '2026-02-24', amount: 45, status: 'pending', description: 'Client meeting transport', receipt: null },
        { id: 2, title: 'Flight to NYC', category: 'Travel', date: '2026-02-20', amount: 450, status: 'approved', description: 'Business trip', receipt: null },
        { id: 3, title: 'Client Lunch', category: 'Meals', date: '2026-02-18', amount: 85, status: 'approved', description: 'Client discussion', receipt: null },
        { id: 4, title: 'Office Supplies', category: 'Supplies', date: '2026-02-10', amount: 32, status: 'rejected', description: 'Printer cartridges', receipt: null },
      ],
      nextId: 5,
    },
    penalties: {
      records: [
        { id: 1, type: 'Late Arrival', date: '2026-02-24', severity: 'warning', status: 'active', description: 'Arrived 45 minutes late without prior notice', fine: 25, issuedBy: 'HR Department', reference: 'PEN-2026-001', appealDeadline: '2026-03-03' },
        { id: 2, type: 'Dress Code Violation', date: '2026-02-20', severity: 'warning', status: 'active', description: 'Did not follow company dress code policy', fine: 50, issuedBy: 'Admin Team', reference: 'PEN-2026-002', appealDeadline: '2026-02-27' },
        { id: 3, type: 'Policy Violation', date: '2026-01-15', severity: 'warning', status: 'resolved', description: 'Used personal email for company communication', fine: 0, issuedBy: 'IT Department', reference: 'PEN-2025-089', appealDeadline: '2026-01-22' },
      ],
      appeals: [],
      nextId: 4,
    },
    employees: [
      { id: 1, name: 'Sarah Miller', role: 'Senior Software Engineer', department: 'Engineering', manager: 'James Wilson', email: 'sarah.miller@karajo.com', phone: '+1 (555) 123-4567', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', joinDate: 'Mar 15, 2022', status: 'active', location: 'New York', employmentType: 'Full-time', rating: 4.5, kpiScore: 94, pendingReviews: 2 },
      { id: 2, name: 'James Wilson', role: 'Engineering Manager', department: 'Engineering', manager: 'CTO', email: 'james.wilson@karajo.com', phone: '+1 (555) 234-5678', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', joinDate: 'Jan 10, 2020', status: 'active', location: 'New York', employmentType: 'Full-time', rating: 4.8, kpiScore: 97, pendingReviews: 5 },
      { id: 3, name: 'Hanna Jenkins', role: 'Senior Project Manager', department: 'Operations', manager: 'COO', email: 'hanna.jenkins@karajo.com', phone: '+1 (555) 345-6789', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', joinDate: 'Jun 01, 2021', status: 'active', location: 'San Francisco', employmentType: 'Full-time', rating: 4.6, kpiScore: 91, pendingReviews: 3 },
      { id: 4, name: 'Michael Chen', role: 'UX Designer', department: 'Design', manager: 'Design Lead', email: 'michael.chen@karajo.com', phone: '+1 (555) 456-7890', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', joinDate: 'Sep 20, 2022', status: 'active', location: 'Remote', employmentType: 'Full-time', rating: 4.3, kpiScore: 88, pendingReviews: 1 },
      { id: 5, name: 'Emma Wilson', role: 'Product Marketing', department: 'Marketing', manager: 'Marketing Director', email: 'emma.wilson@karajo.com', phone: '+1 (555) 567-8901', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', joinDate: 'Feb 14, 2023', status: 'active', location: 'Chicago', employmentType: 'Full-time', rating: 4.7, kpiScore: 93, pendingReviews: 0 },
    ],
    performance: {
      overview: { overallRating: 4.3, totalReviews: 24, completedReviews: 18, pendingReviews: 6, avgKpiScore: 89, topPerformers: 5, needsImprovement: 2 },
      kpis: [
        { id: 1, name: 'Code Quality', target: '95%', current: '92%', status: 'on-track', trend: 'up', category: 'Technical' },
        { id: 2, name: 'Sprint Completion', target: '90%', current: '88%', status: 'on-track', trend: 'up', category: 'Technical' },
        { id: 3, name: 'Bug Resolution Time', target: '< 24h', current: '18h', status: 'exceeding', trend: 'up', category: 'Technical' },
        { id: 4, name: 'Team Collaboration', target: '4.0/5', current: '4.5/5', status: 'exceeding', trend: 'stable', category: 'Soft Skills' },
        { id: 5, name: 'Documentation', target: '100%', current: '78%', status: 'at-risk', trend: 'down', category: 'Technical' },
      ],
      goals: [
        { id: 1, title: 'Lead Frontend Architecture Redesign', progress: 72, deadline: 'Mar 31, 2026', status: 'on-track', priority: 'high', category: 'Technical' },
        { id: 2, title: 'Mentor 2 Junior Developers', progress: 60, deadline: 'Jun 30, 2026', status: 'on-track', priority: 'medium', category: 'Leadership' },
        { id: 3, title: 'Complete AWS Certification', progress: 45, deadline: 'Dec 31, 2026', status: 'on-track', priority: 'medium', category: 'Growth' },
      ],
      reviews: [
        { id: 1, reviewer: 'James Wilson', type: 'Manager Review', date: 'Feb 28, 2026', status: 'completed', rating: 4.5, summary: 'Excellent technical skills and strong team collaboration.' },
        { id: 2, reviewer: 'Hanna Jenkins', type: 'Peer Review', date: 'Feb 25, 2026', status: 'completed', rating: 4.3, summary: 'Great problem solver, very helpful to the team.' },
      ],
      feedback: [
        { id: 1, from: 'James Wilson', to: 'Sarah Miller', type: 'positive', date: 'Feb 28, 2026', text: 'Sarah consistently delivers high-quality work.', category: 'Technical Excellence' },
        { id: 2, from: 'Hanna Jenkins', to: 'Sarah Miller', type: 'constructive', date: 'Feb 25, 2026', text: 'Would benefit from more proactive communication.', category: 'Communication' },
      ],
    },
    notifications: [
      { id: 1, title: 'Time to Check In', message: "Your workday has started. Don't forget to record your attendance.", time: new Date().toISOString(), type: 'reminder', read: false },
      { id: 2, title: 'Leave Request Approved', message: 'Your annual leave for Feb 28 has been approved.', time: new Date(Date.now() - 3600000).toISOString(), type: 'success', read: false },
      { id: 3, title: 'Payslip Available', message: 'Your payslip for February 2026 is now available.', time: new Date(Date.now() - 7200000).toISOString(), type: 'info', read: true },
    ],
  };
};

let state = getDefaultState();
let listeners = new Set<(s: AppState) => void>();

export const getState = (): AppState => JSON.parse(JSON.stringify(state));

export const subscribe = (listener: (s: AppState) => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = (): void => {
  listeners.forEach(listener => listener(state));
};

type StateUpdater = (prev: AppState) => Partial<AppState>;

export const setState = (updater: StateUpdater | Partial<AppState>): void => {
  const newState = typeof updater === 'function' ? (updater as StateUpdater)(state) : updater;
  state = { ...state, ...newState };
  saveState();
  notifyListeners();
};

export const resetState = (): void => {
  state = getDefaultState();
  saveState();
  notifyListeners();
};

export const loadState = async (): Promise<void> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...getDefaultState(), ...parsed };
      notifyListeners();
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
};

export const saveState = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
};

// ============================
// ATTENDANCE ACTIONS
// ============================

export const checkIn = (location = 'Office - New York'): void => {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);
  const status = calculateAttendanceStatus(timeStr);

  setState(prev => ({
    attendance: {
      ...prev.attendance,
      today: { date: now.toISOString().split('T')[0], checkIn: timeStr, checkOut: null, status, location, totalHours: 0 },
    },
    notifications: [{ id: Date.now(), title: 'Checked In', message: `You checked in at ${timeStr} from ${location}`, time: now.toISOString(), type: 'success', read: false }, ...prev.notifications],
  }));
};

export const checkOut = (): void => {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);
  setState(prev => {
    const checkInTime = prev.attendance.today.checkIn;
    const totalHours = calculateTotalHours(checkInTime as string, timeStr);
    const overtimeHours = calculateOvertime(checkInTime as string, timeStr);

    const todayRecord: AttendanceRecord = {
      date: prev.attendance.today.date,
      checkIn: prev.attendance.today.checkIn,
      checkOut: timeStr,
      totalHours,
      overtime: overtimeHours,
      status: totalHours > 9 ? 'overtime' : prev.attendance.today.status,
      location: prev.attendance.today.location,
    };

    return {
      attendance: {
        ...prev.attendance,
        today: { ...prev.attendance.today, checkOut: timeStr, totalHours, overtime: overtimeHours, status: todayRecord.status },
        history: [todayRecord, ...prev.attendance.history],
      },
      notifications: [{ id: Date.now(), title: 'Checked Out', message: `You checked out at ${timeStr}. Total: ${formatDuration(totalHours)}`, time: now.toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

interface CorrectionData {
  date: string;
  [key: string]: unknown;
}

export const submitCorrection = (data: CorrectionData): void => {
  const errors = validateCorrection(data);
  if (errors) throw new Error(Object.values(errors).join(', '));

  setState(prev => ({
    attendance: {
      ...prev.attendance,
      corrections: [{ id: Date.now(), ...data, status: 'pending', submittedOn: new Date().toISOString().split('T')[0] }, ...prev.attendance.corrections],
    },
    notifications: [{ id: Date.now(), title: 'Correction Requested', message: `Attendance correction for ${data.date}`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
  }));
};

// ============================
// LEAVE ACTIONS
// ============================

interface LeaveRequestData {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  totalDays?: number;
  usedDays?: number;
  delegate?: string;
  documents?: string[];
}

export const requestLeave = (data: LeaveRequestData): void => {
  const errors = validateLeaveRequest(data);
  if (errors) throw new Error(Object.values(errors).join(', '));

  const days = calculateLeaveDays(data.startDate, data.endDate);
  const balance = data.type ? {
    total: data.totalDays || 0,
    used: data.usedDays || 0,
    remaining: (data.totalDays || 0) - (data.usedDays || 0),
  } : null;

  if (balance && balance.remaining < days) {
    throw new Error(`Insufficient leave balance. Only ${balance.remaining} days remaining.`);
  }

  setState(prev => {
    const newRequest: LeaveRequest = {
      id: prev.leave.nextId,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      delegate: data.delegate || null,
      documents: data.documents || [],
    };

    const updatedBalances = prev.leave.balances.map(b =>
      b.type === data.type ? { ...b, used: b.used + days, remaining: b.remaining !== null ? Math.max(0, b.remaining - days) : null } : b
    );

    return {
      leave: {
        ...prev.leave,
        requests: [newRequest, ...prev.leave.requests],
        balances: updatedBalances,
        nextId: prev.leave.nextId + 1,
      },
      notifications: [{ id: Date.now(), title: 'Leave Request Submitted', message: `${days} day(s) of ${data.type} leave requested`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

export const cancelLeave = (id: number): void => {
  setState(prev => ({
    leave: {
      ...prev.leave,
      requests: prev.leave.requests.map(r => r.id === id ? { ...r, status: 'cancelled' } : r),
    },
  }));
};

// ============================
// PERMISSION ACTIONS
// ============================

interface PermissionRequestData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export const requestPermission = (data: PermissionRequestData): void => {
  const errors = validatePermissionRequest(data);
  if (errors) throw new Error(Object.values(errors).join(', '));

  const duration = calculateDuration(data.startTime, data.endTime);

  setState(prev => {
    const remaining = prev.permission.monthlyAllowance - prev.permission.totalHoursUsed;
    if (duration > remaining) {
      throw new Error(`Insufficient permission hours. Only ${remaining}h remaining.`);
    }

    const newRequest: PermissionRequest = {
      id: prev.permission.nextId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      duration,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    return {
      permission: {
        ...prev.permission,
        requests: [newRequest, ...prev.permission.requests],
        totalHoursUsed: prev.permission.totalHoursUsed + duration,
        nextId: prev.permission.nextId + 1,
      },
      notifications: [{ id: Date.now(), title: 'Permission Requested', message: `${formatDuration(duration)} permission requested for ${data.date}`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

interface OvertimeRequestData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export const requestOvertime = (data: OvertimeRequestData): void => {
  const errors = validateOvertimeRequest(data);
  if (errors) throw new Error(Object.values(errors).join(', '));

  const duration = calculateDuration(data.startTime, data.endTime);

  setState(prev => {
    const newRequest: OvertimeRequest = {
      id: prev.overtime.nextId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      duration,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    return {
      overtime: {
        ...prev.overtime,
        requests: [newRequest, ...prev.overtime.requests],
        totalPending: prev.overtime.totalPending + duration,
        nextId: prev.overtime.nextId + 1,
      },
      notifications: [{ id: Date.now(), title: 'Overtime Requested', message: `${formatDuration(duration)} overtime requested for ${data.date}`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
    };
  });
};

// ============================
// ACTIVITY ACTIONS
// ============================

interface ActivityData {
  title: string;
  project: string;
  duration: string;
  time: string;
  category: string;
  date?: string;
}

export const addActivity = (data: ActivityData): void => {
  const errors = validateActivity(data);
  if (errors) throw new Error(Object.values(errors).join(', '));

  setState(prev => ({
    activities: {
      ...prev.activities,
      items: [{ id: prev.activities.nextId, ...data, date: data.date || new Date().toISOString().split('T')[0] }, ...prev.activities.items],
      nextId: prev.activities.nextId + 1,
    },
  }));
};

export const updateActivity = (id: number, data: Partial<Activity>): void => {
  setState(prev => ({
    activities: {
      ...prev.activities,
      items: prev.activities.items.map(a => a.id === id ? { ...a, ...data } : a),
    },
  }));
};

export const deleteActivity = (id: number): void => {
  setState(prev => ({
    activities: {
      ...prev.activities,
      items: prev.activities.items.filter(a => a.id !== id),
    },
  }));
};

interface TimesheetData {
  hours: number | string;
  period: string;
}

export const submitTimesheet = (data: TimesheetData): void => {
  setState(prev => ({
    activities: {
      ...prev.activities,
      submissions: [{ id: Date.now(), ...data, status: 'pending', submittedOn: new Date().toISOString().split('T')[0] }, ...prev.activities.submissions],
    },
    notifications: [{ id: Date.now(), title: 'Timesheet Submitted', message: `${data.hours}h for ${data.period}`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
  }));
};

// ============================
// PENALTY ACTIONS
// ============================

interface PenaltyAppealData {
  penaltyId: number;
  type: string;
  explanation: string;
  penaltyType: string;
}

export const appealPenalty = (data: PenaltyAppealData): void => {
  setState(prev => ({
    penalties: {
      ...prev.penalties,
      appeals: [{ id: Date.now(), penaltyId: data.penaltyId, type: data.type, explanation: data.explanation, status: 'submitted', submittedOn: new Date().toISOString().split('T')[0] }, ...prev.penalties.appeals],
    },
    notifications: [{ id: Date.now(), title: 'Penalty Appeal Filed', message: `Appeal for ${data.penaltyType} has been submitted`, time: new Date().toISOString(), type: 'info', read: false }, ...prev.notifications],
  }));
};

// ============================
// NOTIFICATION ACTIONS
// ============================

export const markNotificationRead = (id: number): void => {
  setState(prev => ({
    notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  }));
};

export const markAllNotificationsRead = (): void => {
  setState(prev => ({
    notifications: prev.notifications.map(n => ({ ...n, read: true })),
  }));
};

export const deleteNotification = (id: number): void => {
  setState(prev => ({
    notifications: prev.notifications.filter(n => n.id !== id),
  }));
};

// ============================
// PAYROLL ACTIONS
// ============================

export const createPayrollRun = (month: number, year: number): PayrollEngineRun => {
  const payrollRun = runPayroll(month, year);
  savePayrollRun(payrollRun);
  return payrollRun;
};

export const approvePayroll = (payrollId: number, approvedBy: string): void => {
  approvePayrollRun(payrollId, approvedBy);
};

export const getPayrollData = (month: number, year: number) => {
  return getPayrollSummary(month, year);
};

export const getEmployeePayslipData = (employeeId: string, month: number, year: number) => {
  return getEmployeePayslip(employeeId, month, year);
};

export const getDepartmentPayroll = (department: string, month: number, year: number) => {
  return getDepartmentPayrollSummary(department, month, year);
};

export const getPayrollTrendData = (months = 6) => {
  return getPayrollTrends(months);
};

export const generateW2 = (employeeId: string, year: number) => {
  return generateW2Form(employeeId, year);
};

// ============================
// BUDGET ACTIONS
// ============================

export const updateBudget = (departmentId: number, newBudget: number): void => {
  setState(prev => ({
    budgets: {
      ...prev.budgets,
      departments: prev.budgets.departments.map(d =>
        d.id === departmentId ? { ...d, budget: newBudget, allocated: newBudget } : d
      ),
      totalBudget: prev.budgets.departments.reduce((sum, d) =>
        d.id === departmentId ? sum + newBudget : sum + d.budget, 0
      ),
    },
  }));
};

export const addExpenseToBudget = (departmentId: number, amount: number): void => {
  setState(prev => ({
    budgets: {
      ...prev.budgets,
      departments: prev.budgets.departments.map(d =>
        d.id === departmentId ? { ...d, spent: d.spent + amount } : d
      ),
      totalSpent: prev.budgets.totalSpent + amount,
    },
  }));
};

export const getBudgetUtilization = () => {
  const currentState = getState();
  return currentState.budgets.departments.map(d => ({
    ...d,
    ...calculateBudgetUtilization(d.spent, d.budget),
  }));
};
