/**
 * Role-Based Access Control (RBAC) Configuration
 * 
 * Defines which screens each role can access in the Karajo HR app.
 * 
 * Role Hierarchy:
 * - employee: Base role with personal screens only
 * - team_lead: Employee + team management (limited)
 * - manager: Team management + department oversight
 * - hr_specialist: HR operations + employee data
 * - recruiter: HR recruitment-focused access
 * - hr_manager: Full HR management
 * - accountant: Finance operations
 * - finance_mgr: Full finance management
 * - ceo: Organization-wide read access + strategic tools
 */

export type RoleId =
  | 'employee'
  | 'team_lead'
  | 'manager'
  | 'hr_specialist'
  | 'recruiter'
  | 'hr_manager'
  | 'accountant'
  | 'finance_mgr'
  | 'ceo';

export type ScreenAccess = {
  // Tab screens (main navigation)
  tabs: string[];
  
  // Stack screens (drill-down screens accessible from tabs)
  stack: string[];
};

// ==================== SCREEN CATEGORIES ====================

const EMPLOYEE_SCREENS = [
  // Attendance
  'AttendanceLocation',
  'FaceValidation',
  'QRValidation',
  'AttendanceSuccess',
  'AttendanceHistory',
  'AttendanceFilter',
  'MonthlySummary',
  'AttendanceDetail',
  'AttendanceCalendar',
  'CorrectionReason',
  'CorrectionForm',
  'CorrectionSummary',
  'CorrectionSubmitted',
  
  // Leave
  'LeaveHome',
  'LeaveHistory',
  'SelectLeaveType',
  'SelectDates',
  'SelectDelegate',
  'UploadDocument',
  'LeaveReview',
  'LeaveSuccess',
  
  // Permission
  'PermissionHome',
  'PermissionRequest',
  'PermissionReview',
  'PermissionSuccess',
  
  // Overtime
  'OvertimeHome',
  'OvertimeRequest',
  'OvertimeReview',
  'OvertimeSuccess',
  
  // Profile
  'Profile',
  'PersonalInfo',
  'IdentityVerification',
  'EmploymentInfo',
  
  // Penalty
  'PenaltyHome',
  'PenaltyDetail',
  'PenaltyAppeal',
  'PenaltyReview',
  'PenaltySuccess',
  
  // AI Chat (available to all authenticated users)
  'AIChat',
  'AIChatExpanded',
  'AIChatConversation',
  
  // Document viewer (available to all authenticated users)
  'DocumentView',
  
  // Performance (own performance & feedback)
  'PerformanceDashboard',
  'KPITracking',
  'PerformanceReview',
  'GoalSetting',
  'Feedback360',
  
  // Employee Directory (to see team leader & team members)
  'EmployeeDirectory',
  'EmployeeDetail',
  'OrgChart',
];

const TEAM_LEAD_SCREENS = [
  ...EMPLOYEE_SCREENS,
  
  // Team Management
  'TeamAttendance',
  'TeamPerformance',
  'TeamGoals',
];

const MANAGER_SCREENS = [
  ...TEAM_LEAD_SCREENS,
  
  // Manager-specific
  'MyTeam',
  'ManagerApproval',
  'TeamPlanning',
  'TeamReports',
];

const HR_SPECIALIST_SCREENS = [
  ...EMPLOYEE_SCREENS,
  
  // HR Operations
  'HREmployeeProfile',
  'HRApprovalDetail',
  'HRReportDetail',
  'HRAnalytics',
  'HRLeaveManagement',
  'HROnboardingManagement',
  'HROffboarding',
  'HRPolicyManagement',
  'HRCompliance',
  'HRBulkActions',
  
  // Employee Directory
  'EmployeeDirectory',
  'EmployeeDetail',
  'OrgChart',
];

const RECRUITER_SCREENS = [
  ...EMPLOYEE_SCREENS,
  
  // Recruitment-focused HR screens
  'HREmployeeProfile',
  'HRApprovalDetail',
  'HROnboardingManagement',
  'HROffboarding',
  'EmployeeDirectory',
  'EmployeeDetail',
  'OrgChart',
];

const HR_MANAGER_SCREENS = [
  ...HR_SPECIALIST_SCREENS,
  
  // Full HR management
  'HRPolicyManagement',
  'HRCompliance',
  'HRBulkActions',
];

const ACCOUNTANT_SCREENS = [
  ...EMPLOYEE_SCREENS,
  
  // Finance Operations
  'FinanceEmployee',
  'FinanceBudget',
  'FinanceTax',
  'FinanceAudit',
  'PayrollDetail',
  'PayrollHistory',
  'FinanceReportDetail',
];

const FINANCE_MANAGER_SCREENS = [
  ...ACCOUNTANT_SCREENS,
  
  // Full finance management
  'FinanceBudget',
  'FinanceTax',
  'FinanceAudit',
];

const CEO_SCREENS = [
  ...EMPLOYEE_SCREENS,
  
  // Organization-wide read access
  'HRAnalytics',
  'HRReportDetail',
  'FinanceReportDetail',
  'DepartmentDetail',
  'WorkforcePlanning',
  'EmployeeDirectory',
  'EmployeeDetail',
  'OrgChart',
  
  // Performance
  'PerformanceDashboard',
  'KPITracking',
  'PerformanceReview',
  'GoalSetting',
  'Feedback360',
];

// ==================== ROLE TO SCREEN MAPPING ====================

export const ROLE_SCREEN_ACCESS: Record<RoleId, ScreenAccess> = {
  employee: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'Finance', 'Notification'],
    stack: EMPLOYEE_SCREENS,
  },
  
  team_lead: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'Team', 'Finance', 'Notification'],
    stack: TEAM_LEAD_SCREENS,
  },
  
  manager: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'Team', 'Finance', 'Notification'],
    stack: MANAGER_SCREENS,
  },
  
  hr_specialist: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'HR', 'Finance', 'Notification'],
    stack: HR_SPECIALIST_SCREENS,
  },
  
  recruiter: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'HR', 'Finance', 'Notification'],
    stack: RECRUITER_SCREENS,
  },
  
  hr_manager: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'HR', 'Finance', 'Notification'],
    stack: HR_MANAGER_SCREENS,
  },
  
  accountant: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'Finance', 'Notification'],
    stack: ACCOUNTANT_SCREENS,
  },
  
  finance_mgr: {
    tabs: ['Home', 'Activity', 'Center', 'Performance', 'Finance', 'Notification'],
    stack: FINANCE_MANAGER_SCREENS,
  },
  
  ceo: {
    tabs: ['CEO Home', 'Analytics', 'Departments', 'Goals', 'CEO Reports'],
    stack: CEO_SCREENS,
  },
};

// ==================== ROLE HIERARCHY ====================

export const ROLE_HIERARCHY: Record<RoleId, number> = {
  employee: 1,
  team_lead: 2,
  manager: 3,
  hr_specialist: 4,
  recruiter: 4,
  accountant: 5,
  hr_manager: 6,
  finance_mgr: 7,
  ceo: 10,
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if a role has access to a specific screen
 */
export function hasScreenAccess(role: RoleId, screenName: string): boolean {
  const access = ROLE_SCREEN_ACCESS[role];
  if (!access) return false;
  return access.stack.includes(screenName);
}

/**
 * Check if a role has access to a specific tab
 */
export function hasTabAccess(role: RoleId, tabName: string): boolean {
  const access = ROLE_SCREEN_ACCESS[role];
  if (!access) return false;
  return access.tabs.includes(tabName);
}

/**
 * Get all roles that have access to a screen
 */
export function getRolesWithScreenAccess(screenName: string): RoleId[] {
  return (Object.keys(ROLE_SCREEN_ACCESS) as RoleId[]).filter((role) =>
    hasScreenAccess(role, screenName)
  );
}

/**
 * Get the tab component name for a role
 */
export function getTabComponentForRole(role: RoleId): string {
  const tabMap: Record<RoleId, string> = {
    employee: 'EmployeeTabs',
    team_lead: 'ManagerTabs',
    manager: 'ManagerTabs',
    hr_specialist: 'HRTabs',
    recruiter: 'HRTabs',
    hr_manager: 'HRTabs',
    accountant: 'FinanceTabs',
    finance_mgr: 'FinanceTabs',
    ceo: 'CEOTabs',
  };
  return tabMap[role];
}
