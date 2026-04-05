import React from 'react';
import type { RoleId } from '../utils/rbac';
import { hasScreenAccess } from '../config/roleAccess';

export interface ScreenConfig {
  name: string;
  component: React.ComponentType<any>;
  isModal?: boolean;
  isFade?: boolean;
}

export const ALL_SCREENS: ScreenConfig[] = [
  // AI Chat
  { name: 'AIChat', component: require('../screens/AIChat/AIChatScreen').AIChatScreen, isModal: true },
  { name: 'AIChatExpanded', component: require('../screens/AIChat/AIChatExpandedScreen').AIChatExpandedScreen, isModal: true },
  { name: 'AIChatConversation', component: require('../screens/AIChat/AIChatConversationScreen').AIChatConversationScreen },
  { name: 'DocumentView', component: require('../screens/AIChat/DocumentViewScreen').DocumentViewScreen },
  
  // Attendance
  { name: 'AttendanceLocation', component: require('../screens/Attendance/AttendanceLocationScreen').AttendanceLocationScreen, isModal: true },
  { name: 'FaceValidation', component: require('../screens/Attendance/FaceValidationScreen').FaceValidationScreen, isModal: true },
  { name: 'QRValidation', component: require('../screens/Attendance/QRValidationScreen').QRValidationScreen, isModal: true },
  { name: 'AttendanceSuccess', component: require('../screens/Attendance/AttendanceSuccessScreen').AttendanceSuccessScreen, isFade: true },
  { name: 'AttendanceHistory', component: require('../screens/Attendance/AttendanceHistoryScreen').AttendanceHistoryScreen },
  { name: 'AttendanceFilter', component: require('../screens/Attendance/AttendanceFilterScreen').AttendanceFilterScreen, isModal: true },
  { name: 'MonthlySummary', component: require('../screens/Attendance/MonthlySummaryScreen').MonthlySummaryScreen },
  { name: 'AttendanceDetail', component: require('../screens/Attendance/AttendanceDetailScreen').AttendanceDetailScreen },
  { name: 'AttendanceCalendar', component: require('../screens/Attendance/AttendanceCalendarScreen').AttendanceCalendarScreen },
  { name: 'CorrectionReason', component: require('../screens/Attendance/CorrectionReasonScreen').CorrectionReasonScreen, isModal: true },
  { name: 'CorrectionForm', component: require('../screens/Attendance/CorrectionFormScreen').CorrectionFormScreen },
  { name: 'CorrectionSummary', component: require('../screens/Attendance/CorrectionSummaryScreen').CorrectionSummaryScreen },
  { name: 'CorrectionSubmitted', component: require('../screens/Attendance/CorrectionSubmittedScreen').CorrectionSubmittedScreen, isFade: true },
  
  // Leave
  { name: 'LeaveHome', component: require('../screens/Leave/LeaveHomeScreen').LeaveHomeScreen },
  { name: 'LeaveHistory', component: require('../screens/Leave/LeaveHistoryScreen').LeaveHistoryScreen },
  { name: 'SelectLeaveType', component: require('../screens/Leave/SelectLeaveTypeScreen').SelectLeaveTypeScreen },
  { name: 'SelectDates', component: require('../screens/Leave/SelectDatesScreen').SelectDatesScreen },
  { name: 'SelectDelegate', component: require('../screens/Leave/SelectDelegateScreen').SelectDelegateScreen },
  { name: 'UploadDocument', component: require('../screens/Leave/UploadDocumentScreen').UploadDocumentScreen },
  { name: 'LeaveReview', component: require('../screens/Leave/LeaveReviewScreen').LeaveReviewScreen },
  { name: 'LeaveSuccess', component: require('../screens/Leave/LeaveSuccessScreen').LeaveSuccessScreen, isFade: true },
  
  // Permission
  { name: 'PermissionHome', component: require('../screens/Permission/PermissionHomeScreen').PermissionHomeScreen },
  { name: 'PermissionRequest', component: require('../screens/Permission/PermissionRequestScreen').PermissionRequestScreen },
  { name: 'PermissionReview', component: require('../screens/Permission/PermissionReviewScreen').PermissionReviewScreen },
  { name: 'PermissionSuccess', component: require('../screens/Permission/PermissionSuccessScreen').PermissionSuccessScreen, isFade: true },
  
  // Overtime
  { name: 'OvertimeHome', component: require('../screens/Overtime/OvertimeHomeScreen').OvertimeHomeScreen },
  { name: 'OvertimeRequest', component: require('../screens/Overtime/OvertimeRequestScreen').OvertimeRequestScreen },
  { name: 'OvertimeReview', component: require('../screens/Overtime/OvertimeReviewScreen').OvertimeReviewScreen },
  { name: 'OvertimeSuccess', component: require('../screens/Overtime/OvertimeSuccessScreen').OvertimeSuccessScreen, isFade: true },
  
  // Profile
  { name: 'Profile', component: require('../screens/Profile/ProfileScreen').ProfileScreen },
  { name: 'PersonalInfo', component: require('../screens/Profile/PersonalInfoScreen').PersonalInfoScreen },
  { name: 'IdentityVerification', component: require('../screens/Profile/IdentityVerificationScreen').IdentityVerificationScreen },
  { name: 'EmploymentInfo', component: require('../screens/Profile/EmploymentInfoScreen').EmploymentInfoScreen },
  
  // Penalty
  { name: 'PenaltyHome', component: require('../screens/Penalty/PenaltyHomeScreen').PenaltyHomeScreen },
  { name: 'PenaltyDetail', component: require('../screens/Penalty/PenaltyDetailScreen').PenaltyDetailScreen },
  { name: 'PenaltyAppeal', component: require('../screens/Penalty/PenaltyAppealScreen').PenaltyAppealScreen },
  { name: 'PenaltyReview', component: require('../screens/Penalty/PenaltyReviewScreen').PenaltyReviewScreen },
  { name: 'PenaltySuccess', component: require('../screens/Penalty/PenaltySuccessScreen').PenaltySuccessScreen, isFade: true },
  
  // Employee
  { name: 'EmployeeDirectory', component: require('../screens/Employee/EmployeeDirectoryScreen').EmployeeDirectoryScreen },
  { name: 'EmployeeDetail', component: require('../screens/Employee/EmployeeDetailScreen').EmployeeDetailScreen },
  { name: 'OrgChart', component: require('../screens/Employee/OrgChartScreen').OrgChartScreen },
  { name: 'Onboarding', component: require('../screens/Employee/OnboardingScreen').OnboardingScreen, isFade: true },
  { name: 'Offboarding', component: require('../screens/Offboarding/OffboardingScreen').OffboardingScreen, isFade: true },
  
  // Performance
  { name: 'PerformanceDashboard', component: require('../screens/Performance/PerformanceDashboardScreen').PerformanceDashboardScreen },
  { name: 'KPITracking', component: require('../screens/Performance/KPITrackingScreen').KPITrackingScreen },
  { name: 'PerformanceReview', component: require('../screens/Performance/PerformanceReviewScreen').PerformanceReviewScreen },
  { name: 'GoalSetting', component: require('../screens/Performance/GoalSettingScreen').GoalSettingScreen },
  { name: 'Feedback360', component: require('../screens/Performance/Feedback360Screen').Feedback360Screen },
  
  // HR
  { name: 'HREmployeeProfile', component: require('../screens/hr/HREmployeeProfileScreen').HREmployeeProfileScreen },
  { name: 'HRApprovalDetail', component: require('../screens/hr/HRApprovalDetailScreen').HRApprovalDetailScreen },
  { name: 'HRReportDetail', component: require('../screens/hr/HRReportDetailScreen').HRReportDetailScreen },
  { name: 'HRAnalytics', component: require('../screens/hr/HRAnalyticsScreen').HRAnalyticsScreen },
  { name: 'HRLeaveManagement', component: require('../screens/hr/HRLeaveManagementScreen').HRLeaveManagementScreen },
  { name: 'HROnboardingManagement', component: require('../screens/hr/HROnboardingManagementScreen').HROnboardingManagementScreen },
  { name: 'HROffboarding', component: require('../screens/hr/HROffboardingScreen').HROffboardingScreen },
  { name: 'HRPolicyManagement', component: require('../screens/hr/HRPolicyManagementScreen').HRPolicyManagementScreen },
  { name: 'HRCompliance', component: require('../screens/hr/HRComplianceScreen').HRComplianceScreen },
  { name: 'HRBulkActions', component: require('../screens/hr/HRBulkActionsScreen').HRBulkActionsScreen },
  
  // Finance
  { name: 'FinanceEmployee', component: require('../screens/finance-mgr/FinanceEmployeeScreen').FinanceEmployeeScreen },
  { name: 'FinanceBudget', component: require('../screens/finance-mgr/FinanceBudgetScreen').FinanceBudgetScreen },
  { name: 'FinanceTax', component: require('../screens/finance-mgr/FinanceTaxScreen').FinanceTaxScreen },
  { name: 'FinanceAudit', component: require('../screens/finance-mgr/FinanceAuditScreen').FinanceAuditScreen },
  { name: 'PayrollDetail', component: require('../screens/finance-mgr/PayrollDetailScreen').PayrollDetailScreen },
  { name: 'PayrollHistory', component: require('../screens/finance-mgr/PayrollHistoryScreen').PayrollHistoryScreen },
  { name: 'FinanceReportDetail', component: require('../screens/finance-mgr/FinanceReportDetailScreen').FinanceReportDetailScreen },
  
  // Manager
  { name: 'TeamAttendance', component: require('../screens/manager/TeamAttendanceScreen').TeamAttendanceScreen },
  { name: 'TeamPerformance', component: require('../screens/manager/TeamPerformanceScreen').TeamPerformanceScreen },
  { name: 'TeamGoals', component: require('../screens/manager/TeamGoalsScreen').TeamGoalsScreen },
  
  // CEO
  { name: 'DepartmentDetail', component: require('../screens/ceo/DepartmentDetailScreen').DepartmentDetailScreen },
  { name: 'WorkforcePlanning', component: require('../screens/ceo/WorkforcePlanningScreen').WorkforcePlanningScreen },
];

/**
 * Get screens accessible to a specific role
 */
export function getRoleScreens(role: RoleId): ScreenConfig[] {
  return ALL_SCREENS.filter((screen) => hasScreenAccess(role, screen.name));
}
