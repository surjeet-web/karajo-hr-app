// ============================================
// RBAC — Role-Based Access Control
// ============================================

export type RoleId = 'ceo' | 'hr_manager' | 'hr_specialist' | 'recruiter' | 'finance_mgr' | 'accountant' | 'manager' | 'team_lead' | 'employee';

export type PermissionKey =
  // Employee domain
  | 'employee:profile:read' | 'employee:profile:update'
  | 'employee:attendance:read' | 'employee:attendance:checkin' | 'employee:attendance:correction'
  | 'employee:leave:read' | 'employee:leave:request' | 'employee:leave:cancel'
  | 'employee:permission:read' | 'employee:permission:request'
  | 'employee:overtime:read' | 'employee:overtime:request'
  | 'employee:activity:read' | 'employee:activity:create' | 'employee:activity:update'
  | 'employee:timesheet:read' | 'employee:timesheet:submit'
  | 'employee:payslip:read' | 'employee:expense:read' | 'employee:expense:request'
  | 'employee:notification:read'
  | 'employee:penalty:read' | 'employee:penalty:appeal'
  | 'employee:directory:read'
  | 'employee:performance:read' | 'employee:performance:review'
  | 'employee:ai:use'
  // Team domain
  | 'team:attendance:read' | 'team:leave:read' | 'team:leave:approve'
  | 'team:permission:read' | 'team:permission:approve'
  | 'team:overtime:read' | 'team:overtime:approve'
  | 'team:expense:read' | 'team:expense:approve'
  | 'team:performance:read' | 'team:performance:review'
  | 'team:goals:manage' | 'team:planning:read'
  | 'team:all:manage' | 'team:cross-department:read' | 'team:cross-department:approve'
  // HR domain
  | 'hr:employee:read' | 'hr:employee:create' | 'hr:employee:update' | 'hr:employee:deactivate'
  | 'hr:attendance:read' | 'hr:attendance:manage' | 'hr:attendance:correction:approve'
  | 'hr:leave:read' | 'hr:leave:approve' | 'hr:leave:policy:manage'
  | 'hr:permission:read' | 'hr:permission:approve'
  | 'hr:overtime:read' | 'hr:overtime:approve'
  | 'hr:onboarding:manage' | 'hr:offboarding:manage' | 'hr:policy:manage'
  | 'hr:compliance:read' | 'hr:compliance:manage'
  | 'hr:reports:read' | 'hr:reports:export'
  | 'hr:bulk:actions'
  | 'hr:department:read' | 'hr:department:manage'
  | 'hr:analytics:read' | 'hr:role:manage'
  // Recruiter domain
  | 'recruiter:candidates:read' | 'recruiter:candidates:manage'
  | 'recruiter:jobs:read' | 'recruiter:jobs:manage'
  | 'recruiter:interviews:read' | 'recruiter:interviews:manage'
  | 'recruiter:offers:read' | 'recruiter:offers:manage'
  // Finance domain
  | 'finance:payroll:read' | 'finance:payroll:process' | 'finance:payroll:approve'
  | 'finance:expense:read' | 'finance:expense:approve' | 'finance:expense:manage'
  | 'finance:budget:read' | 'finance:budget:manage'
  | 'finance:tax:read' | 'finance:tax:manage'
  | 'finance:audit:read'
  | 'finance:reports:read' | 'finance:reports:export'
  | 'finance:employee:financial:read'
  // CEO domain
  | 'ceo:dashboard:read' | 'ceo:analytics:read'
  | 'ceo:department:read' | 'ceo:department:manage'
  | 'ceo:goals:read' | 'ceo:goals:manage'
  | 'ceo:workforce:read' | 'ceo:workforce:manage'
  | 'ceo:reports:read' | 'ceo:reports:export'
  | 'ceo:approvals:high' | 'ceo:policy:approve'
  | 'ceo:all:read' | 'ceo:all:manage';

export type ScreenKey =
  // Employee screens
  | 'HomeMain' | 'CheckedOut' | 'Shortcuts' | 'Notifications'
  | 'AIChat' | 'AIChatExpanded' | 'AIChatConversation' | 'DocumentView'
  | 'ActivityList' | 'ActivityFilter' | 'AddActivity' | 'EditActivity' | 'ActivityDetail'
  | 'TimesheetWeekly' | 'TimesheetMonthly' | 'SubmitConfirmation' | 'TimesheetSubmitted' | 'ApprovalStatus' | 'RevisionRequested'
  | 'AttendanceLocation' | 'FaceValidation' | 'QRValidation' | 'AttendanceSuccess' | 'AttendanceHistory'
  | 'AttendanceFilter' | 'MonthlySummary' | 'AttendanceDetail' | 'AttendanceCalendar'
  | 'CorrectionReason' | 'CorrectionForm' | 'CorrectionSummary' | 'CorrectionSubmitted'
  | 'LeaveHome' | 'LeaveHistory' | 'SelectLeaveType' | 'SelectDates' | 'SelectDelegate' | 'UploadDocument' | 'LeaveReview' | 'LeaveSuccess'
  | 'PermissionHome' | 'PermissionRequest' | 'PermissionReview' | 'PermissionSuccess'
  | 'OvertimeHome' | 'OvertimeRequest' | 'OvertimeReview' | 'OvertimeSuccess'
  | 'PayslipHome' | 'PayslipDetail' | 'ExpenseOverview' | 'ExpenseDetail'
  | 'Profile' | 'PersonalInfo' | 'IdentityVerification' | 'EmploymentInfo'
  | 'PenaltyHome' | 'PenaltyDetail' | 'PenaltyAppeal' | 'PenaltyReview' | 'PenaltySuccess'
  | 'EmployeeDirectory' | 'EmployeeDetail' | 'OrgChart' | 'Onboarding'
  | 'PerformanceDashboard' | 'KPITracking' | 'PerformanceReview' | 'GoalSetting' | 'Feedback360'
  // HR screens
  | 'HRDashboard' | 'HRApprovalCenter' | 'HRApprovalDetail' | 'HREmployeeManagement' | 'HREmployeeProfile'
  | 'HRAttendanceManagement' | 'HRLeaveManagement' | 'HRReports' | 'HRReportDetail' | 'HRSettings'
  | 'HRAnalytics' | 'HRBulkActions' | 'HRCompliance' | 'HROnboardingManagement' | 'HROffboarding' | 'HRPolicyManagement'
  // Finance screens
  | 'FinanceDashboard' | 'FinanceEmployee' | 'PayrollManagement' | 'PayrollDetail' | 'PayrollHistory'
  | 'FinanceExpenseManagement' | 'FinanceBudget' | 'FinanceTax' | 'FinanceAudit'
  | 'FinanceReports' | 'FinanceReportDetail' | 'FinanceSettings'
  // Manager screens
  | 'ManagerDashboard' | 'MyTeam' | 'ManagerApproval' | 'ManagerApprovalDetail'
  | 'TeamAttendance' | 'TeamPlanning' | 'TeamReports' | 'TeamPerformance' | 'TeamGoals'
  // CEO screens
  | 'CEODashboard' | 'CEOAnalytics' | 'DepartmentOverview' | 'DepartmentDetail'
  | 'CompanyGoals' | 'WorkforcePlanning' | 'CEOReports';

export type DepartmentAccessType = 'own' | 'all' | 'none';
export type RequestType = 'leave' | 'permission' | 'overtime' | 'expense' | 'payroll';

// ============================================
// Type definitions
// ============================================

export interface RoleConfig {
  level: number;
  label: string;
  inherits: RoleId[];
}

export type RoleHierarchy = Record<RoleId, RoleConfig>;
export type PermissionsMap = Record<PermissionKey, string>;
export type RolePermissions = Record<RoleId, PermissionKey[]>;
export type ScreenPermissions = Record<ScreenKey, PermissionKey[]>;

export interface ApprovalLimitConfig {
  maxDays?: number;
  maxHours?: number;
  maxHoursPerMonth?: number;
  maxAmount?: number;
  escalateTo?: RoleId | null;
}

export type ApprovalLimits = Record<RoleId, Partial<Record<RequestType, ApprovalLimitConfig>>>;
export type DepartmentAccess = Record<RoleId, DepartmentAccessType>;

export interface EmployeeFeatures {
  // Employee base
  canCheckIn?: boolean;
  canRequestLeave?: boolean;
  canRequestPermission?: boolean;
  canRequestOvertime?: boolean;
  canSubmitTimesheet?: boolean;
  canRequestExpense?: boolean;
  canViewPayslip?: boolean;
  canUseAI?: boolean;
  canViewDirectory?: boolean;
  canWriteReview?: boolean;
  canAppealPenalty?: boolean;
  // Team lead / manager
  canApproveTeamRequests?: boolean;
  canViewTeamAttendance?: boolean;
  canViewTeamPerformance?: boolean;
  canManageTeamGoals?: boolean;
  canWriteTeamReviews?: boolean;
  canApproveAllTeamRequests?: boolean;
  canViewDepartmentData?: boolean;
  canManageDepartmentGoals?: boolean;
  canViewDepartmentPerformance?: boolean;
  canManageAllTeams?: boolean;
  canViewAllDepartments?: boolean;
  canCrossDepartmentApprove?: boolean;
  // HR
  canManageEmployees?: boolean;
  canApproveLeave?: boolean;
  canManageOnboarding?: boolean;
  canManageOffboarding?: boolean;
  canViewReports?: boolean;
  canManageAllEmployees?: boolean;
  canCreateEmployees?: boolean;
  canDeactivateEmployees?: boolean;
  canManagePolicies?: boolean;
  canManageCompliance?: boolean;
  canViewAnalytics?: boolean;
  canManageRoles?: boolean;
  canPerformBulkActions?: boolean;
  // Recruiter
  canManageCandidates?: boolean;
  canManageJobs?: boolean;
  canManageInterviews?: boolean;
  canManageOffers?: boolean;
  // Finance
  canViewPayroll?: boolean;
  canApproveExpenses?: boolean;
  canViewBudgets?: boolean;
  canViewTaxData?: boolean;
  canViewAuditTrail?: boolean;
  canProcessPayroll?: boolean;
  canApprovePayroll?: boolean;
  canManageBudgets?: boolean;
  canManageTax?: boolean;
  canViewFinancialReports?: boolean;
  canExportReports?: boolean;
  canViewEmployeeFinancials?: boolean;
  // CEO
  canViewAllData?: boolean;
  canManageAllData?: boolean;
  canApproveHighValue?: boolean;
  canApprovePolicies?: boolean;
  canViewExecutiveReports?: boolean;
  canExportExecutiveReports?: boolean;
}

export type RoleFeatures = Record<RoleId, EmployeeFeatures>;

// ============================================
// ROLE HIERARCHY
// FIX: hr_specialist no longer inherits team_lead (HR ≠ line management)
// FIX: recruiter inherits only employee (correct)
// ============================================

export const ROLE_HIERARCHY: RoleHierarchy = {
  ceo: {
    level: 6,
    label: 'CEO',
    inherits: ['hr_manager', 'finance_mgr', 'manager', 'team_lead', 'employee'],
  },
  hr_manager: {
    level: 5,
    label: 'HR Manager',
    inherits: ['hr_specialist', 'employee'],
  },
  hr_specialist: {
    level: 4,
    label: 'HR Specialist',
    inherits: ['employee'],
  },
  recruiter: {
    level: 3,
    label: 'Recruiter',
    inherits: ['employee'],
  },
  finance_mgr: {
    level: 5,
    label: 'Finance Manager',
    inherits: ['accountant', 'employee'],
  },
  accountant: {
    level: 4,
    label: 'Accountant',
    inherits: ['employee'],
  },
  manager: {
    level: 4,
    label: 'Department Manager',
    inherits: ['team_lead', 'employee'],
  },
  team_lead: {
    level: 3,
    label: 'Team Lead',
    inherits: ['employee'],
  },
  employee: {
    level: 1,
    label: 'Employee',
    inherits: [],
  },
};

// ============================================
// PERMISSION DESCRIPTIONS
// Added recruiter domain permissions
// ============================================

export const PERMISSIONS: PermissionsMap = {
  // Employee
  'employee:profile:read': 'View own profile',
  'employee:profile:update': 'Update own profile',
  'employee:attendance:read': 'View own attendance',
  'employee:attendance:checkin': 'Check in/out',
  'employee:attendance:correction': 'Request attendance correction',
  'employee:leave:read': 'View own leave',
  'employee:leave:request': 'Request leave',
  'employee:leave:cancel': 'Cancel own leave',
  'employee:permission:read': 'View own permissions',
  'employee:permission:request': 'Request permission',
  'employee:overtime:read': 'View own overtime',
  'employee:overtime:request': 'Request overtime',
  'employee:activity:read': 'View own activities',
  'employee:activity:create': 'Create activity log',
  'employee:activity:update': 'Update own activity',
  'employee:timesheet:read': 'View own timesheet',
  'employee:timesheet:submit': 'Submit timesheet',
  'employee:payslip:read': 'View own payslips',
  'employee:expense:read': 'View own expenses',
  'employee:expense:request': 'Request expense reimbursement',
  'employee:notification:read': 'View notifications',
  'employee:penalty:read': 'View own penalties',
  'employee:penalty:appeal': 'Appeal penalty',
  'employee:directory:read': 'View employee directory',
  'employee:performance:read': 'View own performance',
  'employee:performance:review': 'Write peer review',
  'employee:ai:use': 'Use Karajo AI assistant',

  // Team
  'team:attendance:read': 'View team attendance',
  'team:leave:read': 'View team leave requests',
  'team:leave:approve': 'Approve team leave (up to 3 days)',
  'team:permission:read': 'View team permissions',
  'team:permission:approve': 'Approve team permissions (up to 2h)',
  'team:overtime:read': 'View team overtime',
  'team:overtime:approve': 'Approve team overtime (up to 10h/month)',
  'team:expense:read': 'View team expenses',
  'team:expense:approve': 'Approve team expenses (up to $500)',
  'team:performance:read': 'View team performance',
  'team:performance:review': 'Write team member reviews',
  'team:goals:manage': 'Manage team goals',
  'team:planning:read': 'View team planning',
  'team:all:manage': 'Manage all teams across departments',
  'team:cross-department:read': 'View all teams across departments',
  'team:cross-department:approve': 'Approve requests from all teams',

  // HR
  'hr:employee:read': 'View all employees',
  'hr:employee:create': 'Add new employees',
  'hr:employee:update': 'Update employee details',
  'hr:employee:deactivate': 'Deactivate employees',
  'hr:attendance:read': 'View company attendance',
  'hr:attendance:manage': 'Manage attendance settings',
  'hr:attendance:correction:approve': 'Approve attendance corrections',
  'hr:leave:read': 'View all leave requests',
  'hr:leave:approve': 'Approve all leave requests',
  'hr:leave:policy:manage': 'Manage leave policies',
  'hr:permission:read': 'View all permissions',
  'hr:permission:approve': 'Approve all permissions',
  'hr:overtime:read': 'View all overtime',
  'hr:overtime:approve': 'Approve all overtime',
  'hr:onboarding:manage': 'Manage onboarding',
  'hr:offboarding:manage': 'Manage offboarding',
  'hr:policy:manage': 'Manage company policies',
  'hr:compliance:read': 'View compliance status',
  'hr:compliance:manage': 'Manage compliance',
  'hr:reports:read': 'View HR reports',
  'hr:reports:export': 'Export HR reports',
  'hr:bulk:actions': 'Perform bulk actions',
  'hr:department:read': 'View department data',
  'hr:department:manage': 'Manage departments',
  'hr:analytics:read': 'View HR analytics',
  'hr:role:manage': 'Manage user roles',

  // Recruiter
  'recruiter:candidates:read': 'View candidates',
  'recruiter:candidates:manage': 'Manage candidates',
  'recruiter:jobs:read': 'View job postings',
  'recruiter:jobs:manage': 'Manage job postings',
  'recruiter:interviews:read': 'View interviews',
  'recruiter:interviews:manage': 'Schedule interviews',
  'recruiter:offers:read': 'View offers',
  'recruiter:offers:manage': 'Manage offer letters',

  // Finance
  'finance:payroll:read': 'View payroll data',
  'finance:payroll:process': 'Process payroll',
  'finance:payroll:approve': 'Approve payroll runs',
  'finance:expense:read': 'View all expenses',
  'finance:expense:approve': 'Approve expenses (up to $5000)',
  'finance:expense:manage': 'Manage expense policies',
  'finance:budget:read': 'View budgets',
  'finance:budget:manage': 'Manage budgets',
  'finance:tax:read': 'View tax data',
  'finance:tax:manage': 'Manage tax filings',
  'finance:audit:read': 'View audit trail',
  'finance:reports:read': 'View finance reports',
  'finance:reports:export': 'Export finance reports',
  'finance:employee:financial:read': 'View employee financial data',

  // CEO
  'ceo:dashboard:read': 'View CEO dashboard',
  'ceo:analytics:read': 'View company analytics',
  'ceo:department:read': 'View all departments',
  'ceo:department:manage': 'Manage departments',
  'ceo:goals:read': 'View company goals',
  'ceo:goals:manage': 'Manage company goals',
  'ceo:workforce:read': 'View workforce planning',
  'ceo:workforce:manage': 'Manage workforce planning',
  'ceo:reports:read': 'View executive reports',
  'ceo:reports:export': 'Export executive reports',
  'ceo:approvals:high': 'Approve high-value requests',
  'ceo:policy:approve': 'Approve company policies',
  'ceo:all:read': 'Read access to all data',
  'ceo:all:manage': 'Manage all company data',
};

// ============================================
// ROLE PERMISSIONS
// FIX: Removed duplicate permissions from manager (already gets team:* via team_lead inheritance)
// FIX: Removed duplicate permissions from hr_manager (already gets hr:* via hr_specialist inheritance)
// FIX: Added hr:department:read to hr_specialist
// FIX: Added hr:reports:export to hr_manager explicitly
// FIX: Added recruiter-specific permissions
// FIX: Added accountant approval limits
// ============================================

export const ROLE_PERMISSIONS: RolePermissions = {
  employee: [
    'employee:profile:read',
    'employee:profile:update',
    'employee:attendance:read',
    'employee:attendance:checkin',
    'employee:attendance:correction',
    'employee:leave:read',
    'employee:leave:request',
    'employee:leave:cancel',
    'employee:permission:read',
    'employee:permission:request',
    'employee:overtime:read',
    'employee:overtime:request',
    'employee:activity:read',
    'employee:activity:create',
    'employee:activity:update',
    'employee:timesheet:read',
    'employee:timesheet:submit',
    'employee:payslip:read',
    'employee:expense:read',
    'employee:expense:request',
    'employee:notification:read',
    'employee:penalty:read',
    'employee:penalty:appeal',
    'employee:directory:read',
    'employee:performance:read',
    'employee:performance:review',
    'employee:ai:use',
  ],
  team_lead: [
    'team:attendance:read',
    'team:leave:read',
    'team:leave:approve',
    'team:permission:read',
    'team:permission:approve',
    'team:overtime:read',
    'team:overtime:approve',
    'team:expense:read',
    'team:expense:approve',
    'team:performance:read',
    'team:performance:review',
    'team:goals:manage',
    'team:planning:read',
  ],
  // manager inherits team_lead + employee → only add manager-specific permissions
  manager: [
    'hr:employee:read',
    'hr:department:read',
    'team:all:manage',
    'team:cross-department:read',
    'team:cross-department:approve',
  ],
  // hr_specialist inherits employee → only add HR-specific permissions
  hr_specialist: [
    'hr:employee:read',
    'hr:attendance:read',
    'hr:attendance:correction:approve',
    'hr:leave:read',
    'hr:leave:approve',
    'hr:permission:read',
    'hr:permission:approve',
    'hr:overtime:read',
    'hr:overtime:approve',
    'hr:onboarding:manage',
    'hr:offboarding:manage',
    'hr:policy:manage',
    'hr:compliance:read',
    'hr:reports:read',
    'hr:reports:export',
    'hr:department:read',
    'hr:analytics:read',
  ],
  // hr_manager inherits hr_specialist + employee → only add manager-level HR permissions
  hr_manager: [
    'hr:employee:create',
    'hr:employee:update',
    'hr:employee:deactivate',
    'hr:attendance:manage',
    'hr:leave:policy:manage',
    'hr:compliance:manage',
    'hr:reports:export',
    'hr:bulk:actions',
    'hr:department:manage',
    'hr:role:manage',
  ],
  // Recruiter inherits employee → add recruiter-specific permissions
  recruiter: [
    'hr:employee:read',
    'hr:onboarding:manage',
    'hr:reports:read',
    'recruiter:candidates:read',
    'recruiter:candidates:manage',
    'recruiter:jobs:read',
    'recruiter:jobs:manage',
    'recruiter:interviews:read',
    'recruiter:interviews:manage',
    'recruiter:offers:read',
    'recruiter:offers:manage',
  ],
  // accountant inherits employee → add finance-specific permissions
  accountant: [
    'finance:payroll:read',
    'finance:expense:read',
    'finance:expense:approve',
    'finance:budget:read',
    'finance:tax:read',
    'finance:audit:read',
    'finance:reports:read',
    'finance:reports:export',
  ],
  // finance_mgr inherits accountant + employee → add manager-level finance permissions
  finance_mgr: [
    'finance:payroll:process',
    'finance:payroll:approve',
    'finance:expense:manage',
    'finance:budget:manage',
    'finance:tax:manage',
    'finance:employee:financial:read',
  ],
  // ceo inherits hr_manager + finance_mgr + manager + team_lead + employee → only add CEO-specific
  ceo: [
    'ceo:dashboard:read',
    'ceo:analytics:read',
    'ceo:department:read',
    'ceo:department:manage',
    'ceo:goals:read',
    'ceo:goals:manage',
    'ceo:workforce:read',
    'ceo:workforce:manage',
    'ceo:reports:read',
    'ceo:reports:export',
    'ceo:approvals:high',
    'ceo:policy:approve',
    'ceo:all:read',
    'ceo:all:manage',
  ],
};

// ============================================
// SCREEN PERMISSIONS
// FIX: Added all missing screens (OvertimeRequest, OvertimeReview, ActivityFilter, etc.)
// FIX: Fixed Onboarding → hr:onboarding:manage
// FIX: Fixed OvertimeSuccess → employee:overtime:read
// ============================================

export const SCREEN_PERMISSIONS: ScreenPermissions = {
  // Employee screens
  HomeMain: ['employee:attendance:read'],
  CheckedOut: ['employee:attendance:read'],
  Shortcuts: ['employee:profile:read'],
  Notifications: ['employee:notification:read'],
  AIChat: ['employee:ai:use'],
  AIChatExpanded: ['employee:ai:use'],
  AIChatConversation: ['employee:ai:use'],
  DocumentView: ['employee:ai:use'],
  ActivityList: ['employee:activity:read'],
  ActivityFilter: ['employee:activity:read'],
  AddActivity: ['employee:activity:create'],
  EditActivity: ['employee:activity:update'],
  ActivityDetail: ['employee:activity:read'],
  TimesheetWeekly: ['employee:timesheet:read'],
  TimesheetMonthly: ['employee:timesheet:read'],
  SubmitConfirmation: ['employee:timesheet:submit'],
  TimesheetSubmitted: ['employee:timesheet:submit'],
  ApprovalStatus: ['employee:timesheet:read'],
  RevisionRequested: ['employee:activity:update'],
  AttendanceLocation: ['employee:attendance:checkin'],
  FaceValidation: ['employee:attendance:checkin'],
  QRValidation: ['employee:attendance:checkin'],
  AttendanceSuccess: ['employee:attendance:checkin'],
  AttendanceHistory: ['employee:attendance:read'],
  AttendanceFilter: ['employee:attendance:read'],
  MonthlySummary: ['employee:attendance:read'],
  AttendanceDetail: ['employee:attendance:read'],
  AttendanceCalendar: ['employee:attendance:read'],
  CorrectionReason: ['employee:attendance:correction'],
  CorrectionForm: ['employee:attendance:correction'],
  CorrectionSummary: ['employee:attendance:correction'],
  CorrectionSubmitted: ['employee:attendance:correction'],
  LeaveHome: ['employee:leave:read'],
  LeaveHistory: ['employee:leave:read'],
  SelectLeaveType: ['employee:leave:request'],
  SelectDates: ['employee:leave:request'],
  SelectDelegate: ['employee:leave:request'],
  UploadDocument: ['employee:leave:request'],
  LeaveReview: ['employee:leave:request'],
  LeaveSuccess: ['employee:leave:read'],
  PermissionHome: ['employee:permission:read'],
  PermissionRequest: ['employee:permission:request'],
  PermissionReview: ['employee:permission:request'],
  PermissionSuccess: ['employee:permission:read'],
  OvertimeHome: ['employee:overtime:read'],
  OvertimeRequest: ['employee:overtime:request'],
  OvertimeReview: ['employee:overtime:request'],
  OvertimeSuccess: ['employee:overtime:read'],
  PayslipHome: ['employee:payslip:read'],
  PayslipDetail: ['employee:payslip:read'],
  ExpenseOverview: ['employee:expense:read'],
  ExpenseDetail: ['employee:expense:read'],
  Profile: ['employee:profile:read'],
  PersonalInfo: ['employee:profile:read'],
  IdentityVerification: ['employee:profile:read'],
  EmploymentInfo: ['employee:profile:read'],
  PenaltyHome: ['employee:penalty:read'],
  PenaltyDetail: ['employee:penalty:read'],
  PenaltyAppeal: ['employee:penalty:appeal'],
  PenaltyReview: ['employee:penalty:appeal'],
  PenaltySuccess: ['employee:penalty:read'],
  EmployeeDirectory: ['employee:directory:read'],
  EmployeeDetail: ['employee:directory:read'],
  OrgChart: ['employee:directory:read'],
  Onboarding: ['hr:onboarding:manage'],
  PerformanceDashboard: ['employee:performance:read'],
  KPITracking: ['employee:performance:read'],
  PerformanceReview: ['employee:performance:review'],
  GoalSetting: ['employee:performance:read'],
  Feedback360: ['employee:performance:review'],

  // HR screens
  HRDashboard: ['hr:employee:read'],
  HRApprovalCenter: ['hr:leave:approve'],
  HRApprovalDetail: ['hr:leave:approve'],
  HREmployeeManagement: ['hr:employee:read'],
  HREmployeeProfile: ['hr:employee:read'],
  HRAttendanceManagement: ['hr:attendance:read'],
  HRLeaveManagement: ['hr:leave:read'],
  HRReports: ['hr:reports:read'],
  HRReportDetail: ['hr:reports:read'],
  HRSettings: ['hr:employee:read'],
  HRAnalytics: ['hr:analytics:read'],
  HRBulkActions: ['hr:bulk:actions'],
  HRCompliance: ['hr:compliance:read'],
  HROnboardingManagement: ['hr:onboarding:manage'],
  HROffboarding: ['hr:offboarding:manage'],
  HRPolicyManagement: ['hr:policy:manage'],

  // Finance screens
  FinanceDashboard: ['finance:payroll:read'],
  FinanceEmployee: ['finance:employee:financial:read'],
  PayrollManagement: ['finance:payroll:read'],
  PayrollDetail: ['finance:payroll:read'],
  PayrollHistory: ['finance:payroll:read'],
  FinanceExpenseManagement: ['finance:expense:read'],
  FinanceBudget: ['finance:budget:read'],
  FinanceTax: ['finance:tax:read'],
  FinanceAudit: ['finance:audit:read'],
  FinanceReports: ['finance:reports:read'],
  FinanceReportDetail: ['finance:reports:read'],
  FinanceSettings: ['finance:payroll:read'],

  // Manager screens
  ManagerDashboard: ['team:attendance:read'],
  MyTeam: ['team:attendance:read'],
  ManagerApproval: ['team:leave:approve'],
  ManagerApprovalDetail: ['team:leave:approve'],
  TeamAttendance: ['team:attendance:read'],
  TeamPlanning: ['team:planning:read'],
  TeamReports: ['team:performance:read'],
  TeamPerformance: ['team:performance:read'],
  TeamGoals: ['team:goals:manage'],

  // CEO screens
  CEODashboard: ['ceo:dashboard:read'],
  CEOAnalytics: ['ceo:analytics:read'],
  DepartmentOverview: ['ceo:department:read'],
  DepartmentDetail: ['ceo:department:read'],
  CompanyGoals: ['ceo:goals:read'],
  WorkforcePlanning: ['ceo:workforce:read'],
  CEOReports: ['ceo:reports:read'],
};

// ============================================
// APPROVAL LIMITS
// FIX: Added accountant limits
// FIX: Added hr_specialist limits
// FIX: Added recruiter limits (none — recruiters cannot approve)
// ============================================

export const APPROVAL_LIMITS: ApprovalLimits = {
  team_lead: {
    leave: { maxDays: 3, escalateTo: 'manager' },
    permission: { maxHours: 2, escalateTo: 'manager' },
    overtime: { maxHoursPerMonth: 10, escalateTo: 'manager' },
    expense: { maxAmount: 500, escalateTo: 'manager' },
  },
  manager: {
    leave: { maxDays: 10, escalateTo: 'hr_manager' },
    permission: { maxHours: 8, escalateTo: 'hr_manager' },
    overtime: { maxHoursPerMonth: 20, escalateTo: 'hr_manager' },
    expense: { maxAmount: 2000, escalateTo: 'finance_mgr' },
  },
  hr_specialist: {
    leave: { maxDays: 5, escalateTo: 'hr_manager' },
    permission: { maxHours: 4, escalateTo: 'hr_manager' },
    overtime: { maxHoursPerMonth: 15, escalateTo: 'hr_manager' },
  },
  hr_manager: {
    leave: { maxDays: 30, escalateTo: 'ceo' },
    permission: { maxHours: 40, escalateTo: 'ceo' },
    overtime: { maxHoursPerMonth: 50, escalateTo: 'ceo' },
    expense: { maxAmount: 5000, escalateTo: 'ceo' },
  },
  accountant: {
    expense: { maxAmount: 1000, escalateTo: 'finance_mgr' },
    payroll: { maxAmount: 50000, escalateTo: 'finance_mgr' },
  },
  finance_mgr: {
    expense: { maxAmount: 10000, escalateTo: 'ceo' },
    payroll: { maxAmount: 100000, escalateTo: 'ceo' },
  },
  ceo: {
    leave: { maxDays: Infinity },
    permission: { maxHours: Infinity },
    overtime: { maxHoursPerMonth: Infinity },
    expense: { maxAmount: Infinity },
    payroll: { maxAmount: Infinity },
  },
  // employee, team_lead, recruiter have no approval limits by default
  employee: {},
  recruiter: {},
};

// ============================================
// DEPARTMENT ACCESS
// FIX: recruiter → 'all' (needs to see candidates across departments)
// ============================================

export const DEPARTMENT_ACCESS: DepartmentAccess = {
  employee: 'own',
  team_lead: 'own',
  manager: 'all',
  hr_specialist: 'all',
  hr_manager: 'all',
  recruiter: 'all',
  accountant: 'all',
  finance_mgr: 'all',
  ceo: 'all',
};

// ============================================
// ROLE FEATURES
// FIX: Now includes inherited features for each role
// FIX: Added recruiter features
// FIX: Added accountant employee features
// ============================================

const EMPLOYEE_FEATURES: EmployeeFeatures = {
  canCheckIn: true,
  canRequestLeave: true,
  canRequestPermission: true,
  canRequestOvertime: true,
  canSubmitTimesheet: true,
  canRequestExpense: true,
  canViewPayslip: true,
  canUseAI: true,
  canViewDirectory: true,
  canWriteReview: true,
  canAppealPenalty: true,
};

export const ROLE_FEATURES: RoleFeatures = {
  employee: { ...EMPLOYEE_FEATURES },

  team_lead: {
    ...EMPLOYEE_FEATURES,
    canApproveTeamRequests: true,
    canViewTeamAttendance: true,
    canViewTeamPerformance: true,
    canManageTeamGoals: true,
    canWriteTeamReviews: true,
  },

  manager: {
    ...EMPLOYEE_FEATURES,
    canApproveTeamRequests: true,
    canViewTeamAttendance: true,
    canViewTeamPerformance: true,
    canManageTeamGoals: true,
    canWriteTeamReviews: true,
    canApproveAllTeamRequests: true,
    canViewDepartmentData: true,
    canManageDepartmentGoals: true,
    canViewDepartmentPerformance: true,
    canManageAllTeams: true,
    canViewAllDepartments: true,
    canCrossDepartmentApprove: true,
  },

  hr_specialist: {
    ...EMPLOYEE_FEATURES,
    canManageEmployees: true,
    canApproveLeave: true,
    canManageOnboarding: true,
    canManageOffboarding: true,
    canViewReports: true,
  },

  hr_manager: {
    ...EMPLOYEE_FEATURES,
    canManageEmployees: true,
    canApproveLeave: true,
    canManageOnboarding: true,
    canManageOffboarding: true,
    canViewReports: true,
    canManageAllEmployees: true,
    canCreateEmployees: true,
    canDeactivateEmployees: true,
    canManagePolicies: true,
    canManageCompliance: true,
    canViewAnalytics: true,
    canManageRoles: true,
    canPerformBulkActions: true,
  },

  recruiter: {
    ...EMPLOYEE_FEATURES,
    canManageOnboarding: true,
    canViewReports: true,
    canManageCandidates: true,
    canManageJobs: true,
    canManageInterviews: true,
    canManageOffers: true,
  },

  accountant: {
    ...EMPLOYEE_FEATURES,
    canViewPayroll: true,
    canApproveExpenses: true,
    canViewBudgets: true,
    canViewTaxData: true,
    canViewAuditTrail: true,
  },

  finance_mgr: {
    ...EMPLOYEE_FEATURES,
    canViewPayroll: true,
    canApproveExpenses: true,
    canViewBudgets: true,
    canViewTaxData: true,
    canViewAuditTrail: true,
    canProcessPayroll: true,
    canApprovePayroll: true,
    canManageBudgets: true,
    canManageTax: true,
    canViewFinancialReports: true,
    canExportReports: true,
    canViewEmployeeFinancials: true,
  },

  ceo: {
    ...EMPLOYEE_FEATURES,
    canApproveTeamRequests: true,
    canViewTeamAttendance: true,
    canViewTeamPerformance: true,
    canManageTeamGoals: true,
    canWriteTeamReviews: true,
    canApproveAllTeamRequests: true,
    canViewDepartmentData: true,
    canManageDepartmentGoals: true,
    canViewDepartmentPerformance: true,
    canManageAllTeams: true,
    canViewAllDepartments: true,
    canCrossDepartmentApprove: true,
    canManageAllEmployees: true,
    canCreateEmployees: true,
    canDeactivateEmployees: true,
    canManagePolicies: true,
    canManageCompliance: true,
    canViewAnalytics: true,
    canManageRoles: true,
    canPerformBulkActions: true,
    canManageOnboarding: true,
    canManageOffboarding: true,
    canViewReports: true,
    canViewPayroll: true,
    canApproveExpenses: true,
    canViewBudgets: true,
    canViewTaxData: true,
    canViewAuditTrail: true,
    canProcessPayroll: true,
    canApprovePayroll: true,
    canManageBudgets: true,
    canManageTax: true,
    canViewFinancialReports: true,
    canExportReports: true,
    canViewEmployeeFinancials: true,
    canViewAllData: true,
    canManageAllData: true,
    canApproveHighValue: true,
    canApprovePolicies: true,
    canViewExecutiveReports: true,
    canExportExecutiveReports: true,
  },
};
