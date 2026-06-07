import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/CommonStates';
import type { RoleId } from '../utils/rbac';
import { ROLE_SCREEN_ACCESS, hasScreenAccess, getTabComponentForRole } from '../config/roleAccess';
import { ALL_SCREENS, getRoleScreens } from '../components/RoleBasedScreens';
import { MoreHomeScreen } from '../screens/More/MoreHomeScreen';

// Employee Screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { CheckedOutScreen } from '../screens/Home/CheckedOutScreen';
import { ShortcutsScreen } from '../screens/Home/ShortcutsScreen';
import { NotificationsScreen } from '../screens/Home/NotificationsScreen';
import { AIChatScreen } from '../screens/AIChat/AIChatScreen';
import { AIChatExpandedScreen } from '../screens/AIChat/AIChatExpandedScreen';
import { AIChatConversationScreen } from '../screens/AIChat/AIChatConversationScreen';
import { DocumentViewScreen } from '../screens/AIChat/DocumentViewScreen';
import { ActivityListScreen } from '../screens/Activity/ActivityListScreen';
import { ActivityFilterScreen } from '../screens/Activity/ActivityFilterScreen';
import { AddActivityScreen } from '../screens/Activity/AddActivityScreen';
import { EditActivityScreen } from '../screens/Activity/EditActivityScreen';
import { ActivityDetailScreen } from '../screens/Activity/ActivityDetailScreen';
import { TimesheetWeeklyScreen } from '../screens/Activity/TimesheetWeeklyScreen';
import { TimesheetMonthlyScreen } from '../screens/Activity/TimesheetMonthlyScreen';
import { SubmitConfirmationScreen } from '../screens/Activity/SubmitConfirmationScreen';
import { TimesheetSubmittedScreen } from '../screens/Activity/TimesheetSubmittedScreen';
import { ApprovalStatusScreen } from '../screens/Activity/ApprovalStatusScreen';
import { RevisionRequestedScreen } from '../screens/Activity/RevisionRequestedScreen';
import { AttendanceLocationScreen } from '../screens/Attendance/AttendanceLocationScreen';
import { FaceValidationScreen } from '../screens/Attendance/FaceValidationScreen';
import { QRValidationScreen } from '../screens/Attendance/QRValidationScreen';
import { AttendanceSuccessScreen } from '../screens/Attendance/AttendanceSuccessScreen';
import { AttendanceHistoryScreen } from '../screens/Attendance/AttendanceHistoryScreen';
import { AttendanceFilterScreen } from '../screens/Attendance/AttendanceFilterScreen';
import { MonthlySummaryScreen } from '../screens/Attendance/MonthlySummaryScreen';
import { AttendanceDetailScreen } from '../screens/Attendance/AttendanceDetailScreen';
import { AttendanceCalendarScreen } from '../screens/Attendance/AttendanceCalendarScreen';
import { CorrectionReasonScreen } from '../screens/Attendance/CorrectionReasonScreen';
import { CorrectionFormScreen } from '../screens/Attendance/CorrectionFormScreen';
import { CorrectionSummaryScreen } from '../screens/Attendance/CorrectionSummaryScreen';
import { CorrectionSubmittedScreen } from '../screens/Attendance/CorrectionSubmittedScreen';
import { LeaveHomeScreen } from '../screens/Leave/LeaveHomeScreen';
import { LeaveHistoryScreen } from '../screens/Leave/LeaveHistoryScreen';
import { SelectLeaveTypeScreen } from '../screens/Leave/SelectLeaveTypeScreen';
import { SelectDatesScreen } from '../screens/Leave/SelectDatesScreen';
import { SelectDelegateScreen } from '../screens/Leave/SelectDelegateScreen';
import { UploadDocumentScreen } from '../screens/Leave/UploadDocumentScreen';
import { LeaveReviewScreen } from '../screens/Leave/LeaveReviewScreen';
import { LeaveSuccessScreen } from '../screens/Leave/LeaveSuccessScreen';
import { PermissionHomeScreen } from '../screens/Permission/PermissionHomeScreen';
import { PermissionRequestScreen } from '../screens/Permission/PermissionRequestScreen';
import { PermissionReviewScreen } from '../screens/Permission/PermissionReviewScreen';
import { PermissionSuccessScreen } from '../screens/Permission/PermissionSuccessScreen';
import { OvertimeHomeScreen } from '../screens/Overtime/OvertimeHomeScreen';
import { OvertimeRequestScreen } from '../screens/Overtime/OvertimeRequestScreen';
import { OvertimeReviewScreen } from '../screens/Overtime/OvertimeReviewScreen';
import { OvertimeSuccessScreen } from '../screens/Overtime/OvertimeSuccessScreen';
import { PayslipHomeScreen } from '../screens/Finance/PayslipHomeScreen';
import { ExpenseOverviewScreen } from '../screens/Finance/ExpenseOverviewScreen';
import { ExpenseDetailScreen } from '../screens/Finance/ExpenseDetailScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { PersonalInfoScreen } from '../screens/Profile/PersonalInfoScreen';
import { IdentityVerificationScreen } from '../screens/Profile/IdentityVerificationScreen';
import { EmploymentInfoScreen } from '../screens/Profile/EmploymentInfoScreen';
import { PenaltyHomeScreen } from '../screens/Penalty/PenaltyHomeScreen';
import { PenaltyDetailScreen } from '../screens/Penalty/PenaltyDetailScreen';
import { PenaltyAppealScreen } from '../screens/Penalty/PenaltyAppealScreen';
import { PenaltyReviewScreen } from '../screens/Penalty/PenaltyReviewScreen';
import { PenaltySuccessScreen } from '../screens/Penalty/PenaltySuccessScreen';
import { EmployeeDirectoryScreen } from '../screens/Employee/EmployeeDirectoryScreen';
import { EmployeeDetailScreen } from '../screens/Employee/EmployeeDetailScreen';
import { OrgChartScreen } from '../screens/Employee/OrgChartScreen';
import { OnboardingScreen } from '../screens/Employee/OnboardingScreen';
import { PerformanceDashboardScreen } from '../screens/Performance/PerformanceDashboardScreen';
import { KPITrackingScreen } from '../screens/Performance/KPITrackingScreen';
import { PerformanceReviewScreen } from '../screens/Performance/PerformanceReviewScreen';
import { GoalSettingScreen } from '../screens/Performance/GoalSettingScreen';
import { Feedback360Screen } from '../screens/Performance/Feedback360Screen';

// Auth
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { ChangePasswordScreen } from '../screens/auth/ChangePasswordScreen';

// HR Manager Screens
import { HRDashboardScreen } from '../screens/hr/HRDashboardScreen';
import { HRApprovalCenterScreen } from '../screens/hr/HRApprovalCenterScreen';
import { HREmployeeManagementScreen } from '../screens/hr/HREmployeeManagementScreen';
import { HREmployeeProfileScreen } from '../screens/hr/HREmployeeProfileScreen';
import { HRAttendanceManagementScreen } from '../screens/hr/HRAttendanceManagementScreen';
import { HRReportsScreen } from '../screens/hr/HRReportsScreen';
import { HRSettingsScreen } from '../screens/hr/HRSettingsScreen';
import { HRAnalyticsScreen } from '../screens/hr/HRAnalyticsScreen';
import { HRLeaveManagementScreen } from '../screens/hr/HRLeaveManagementScreen';
import { HROnboardingManagementScreen } from '../screens/hr/HROnboardingManagementScreen';
import { HROffboardingScreen } from '../screens/hr/HROffboardingScreen';
import { OffboardingScreen } from '../screens/Offboarding/OffboardingScreen';
import { HRPolicyManagementScreen } from '../screens/hr/HRPolicyManagementScreen';
import { HRComplianceScreen } from '../screens/hr/HRComplianceScreen';
import { HRBulkActionsScreen } from '../screens/hr/HRBulkActionsScreen';
import { HRApprovalDetailScreen } from '../screens/hr/HRApprovalDetailScreen';
import { HRReportDetailScreen } from '../screens/hr/HRReportDetailScreen';

// Finance Manager Screens
import { FinanceDashboardScreen } from '../screens/finance-mgr/FinanceDashboardScreen';
import { PayrollManagementScreen } from '../screens/finance-mgr/PayrollManagementScreen';
import { FinanceExpenseManagementScreen } from '../screens/finance-mgr/FinanceExpenseManagementScreen';
import { FinanceReportsScreen } from '../screens/finance-mgr/FinanceReportsScreen';
import { FinanceSettingsScreen } from '../screens/finance-mgr/FinanceSettingsScreen';
import { FinanceEmployeeScreen } from '../screens/finance-mgr/FinanceEmployeeScreen';
import { FinanceBudgetScreen } from '../screens/finance-mgr/FinanceBudgetScreen';
import { FinanceTaxScreen } from '../screens/finance-mgr/FinanceTaxScreen';
import { FinanceAuditScreen } from '../screens/finance-mgr/FinanceAuditScreen';
import { PayrollDetailScreen } from '../screens/finance-mgr/PayrollDetailScreen';
import { PayrollHistoryScreen } from '../screens/finance-mgr/PayrollHistoryScreen';
import { FinanceReportDetailScreen } from '../screens/finance-mgr/FinanceReportDetailScreen';

// Department Manager Screens
import { ManagerDashboardScreen } from '../screens/manager/ManagerDashboardScreen';
import { MyTeamScreen } from '../screens/manager/MyTeamScreen';
import { ManagerApprovalScreen } from '../screens/manager/ManagerApprovalScreen';
import { ManagerApprovalDetailScreen } from '../screens/manager/ManagerApprovalDetailScreen';
import { TeamPlanningScreen } from '../screens/manager/TeamPlanningScreen';
import { TeamReportsScreen } from '../screens/manager/TeamReportsScreen';
import { TeamAttendanceScreen } from '../screens/manager/TeamAttendanceScreen';
import { TeamPerformanceScreen } from '../screens/manager/TeamPerformanceScreen';
import { TeamGoalsScreen } from '../screens/manager/TeamGoalsScreen';
import { TeamMembersScreen } from '../screens/Team/TeamMembersScreen';

// CEO Screens
import { CEODashboardScreen } from '../screens/ceo/CEODashboardScreen';
import { CEOAnalyticsScreen } from '../screens/ceo/CEOAnalyticsScreen';
import { DepartmentOverviewScreen } from '../screens/ceo/DepartmentOverviewScreen';
import { DepartmentDetailScreen } from '../screens/ceo/DepartmentDetailScreen';
import { CompanyGoalsScreen } from '../screens/ceo/CompanyGoalsScreen';
import { CEOReportsScreen } from '../screens/ceo/CEOReportsScreen';
import { WorkforcePlanningScreen } from '../screens/ceo/WorkforcePlanningScreen';
import { CEOFinancialScreen } from '../screens/ceo/CEOFinancialScreen';
import { CEOComplianceScreen } from '../screens/ceo/CEOComplianceScreen';
import { CEODiversityScreen } from '../screens/ceo/CEODiversityScreen';
import { CEOSuccessionScreen } from '../screens/ceo/CEOSuccessionScreen';
import { CEOCompensationScreen } from '../screens/ceo/CEOCompensationScreen';

// Recruiter Screens
import { RecruiterDashboardScreen } from '../screens/recruiter/RecruiterDashboardScreen';
import { CandidateManagementScreen } from '../screens/recruiter/CandidateManagementScreen';
import { JobManagementScreen } from '../screens/recruiter/JobManagementScreen';
import { InterviewManagementScreen } from '../screens/recruiter/InterviewManagementScreen';
import { OfferManagementScreen } from '../screens/recruiter/OfferManagementScreen';

// ==================== TYPES ====================

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string; email?: string };
  ChangePassword: undefined;
  MainTabs: undefined;
  AIChat: undefined;
  AIChatExpanded: undefined;
  AIChatConversation: undefined;
  DocumentView: undefined;
  AttendanceLocation: undefined;
  FaceValidation: undefined;
  QRValidation: undefined;
  AttendanceSuccess: undefined;
  AttendanceHistory: undefined;
  AttendanceFilter: undefined;
  MonthlySummary: undefined;
  AttendanceDetail: undefined;
  AttendanceCalendar: undefined;
  CorrectionReason: undefined;
  CorrectionForm: undefined;
  CorrectionSummary: undefined;
  CorrectionSubmitted: undefined;
  LeaveHome: undefined;
  LeaveHistory: undefined;
  SelectLeaveType: undefined;
  SelectDates: undefined;
  SelectDelegate: undefined;
  UploadDocument: undefined;
  LeaveReview: undefined;
  LeaveSuccess: undefined;
  PermissionHome: undefined;
  PermissionRequest: undefined;
  PermissionReview: undefined;
  PermissionSuccess: undefined;
  OvertimeHome: undefined;
  OvertimeRequest: undefined;
  OvertimeReview: undefined;
  OvertimeSuccess: undefined;
  Profile: undefined;
  PenaltyHome: undefined;
  PenaltyDetail: undefined;
  PenaltyAppeal: undefined;
  PenaltyReview: undefined;
  PenaltySuccess: undefined;
  EmployeeDirectory: undefined;
  EmployeeDetail: undefined;
  OrgChart: undefined;
  Onboarding: undefined;
  PerformanceDashboard: undefined;
  KPITracking: undefined;
  PerformanceReview: undefined;
  GoalSetting: undefined;
  Feedback360: undefined;
  HREmployeeProfile: undefined;
  HRApprovalDetail: undefined;
  HRReportDetail: undefined;
  HRAnalytics: undefined;
  HRLeaveManagement: undefined;
  HROnboardingManagement: undefined;
  HROffboarding: undefined;
  HRPolicyManagement: undefined;
  HRCompliance: undefined;
  HRBulkActions: undefined;
  FinanceEmployee: undefined;
  FinanceBudget: undefined;
  FinanceTax: undefined;
  FinanceAudit: undefined;
  PayrollDetail: undefined;
  PayrollHistory: undefined;
  FinanceReportDetail: undefined;
  PersonalInfo: undefined;
  IdentityVerification: undefined;
  EmploymentInfo: undefined;
  TeamAttendance: undefined;
  TeamPerformance: undefined;
  TeamGoals: undefined;
  DepartmentDetail: undefined;
  WorkforcePlanning: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  CheckedOut: undefined;
  Shortcuts: undefined;
  Notifications: undefined;
};

export type ActivityStackParamList = {
  ActivityList: undefined;
  ActivityFilter: undefined;
  AddActivity: undefined;
  EditActivity: undefined;
  ActivityDetail: undefined;
  TimesheetWeekly: undefined;
  TimesheetMonthly: undefined;
  SubmitConfirmation: undefined;
  TimesheetSubmitted: undefined;
  ApprovalStatus: undefined;
  RevisionRequested: undefined;
};

export type FinanceStackParamList = {
  PayslipHome: undefined;
  ExpenseOverview: undefined;
  ExpenseDetail: undefined;
  PayslipDetail: undefined;
};

export type NotificationStackParamList = {
  NotificationsMain: undefined;
};

export type EmployeeTabParamList = {
  Home: undefined;
  Work: undefined;
  Center: undefined;
  Finance: undefined;
  More: undefined;
};

export type HRTabParamList = {
  Home: undefined;
  Work: undefined;
  Center: undefined;
  Finance: undefined;
  More: undefined;
};

export type FinanceMgrTabParamList = {
  Home: undefined;
  Work: undefined;
  Center: undefined;
  Finance: undefined;
  More: undefined;
};

export type ManagerTabParamList = {
  Home: undefined;
  Work: undefined;
  Center: undefined;
  Finance: undefined;
  More: undefined;
};

export type CEOTabParamList = {
  Home: undefined;
  Analytics: undefined;
  Finance: undefined;
  Departments: undefined;
  More: undefined;
};

export type UserRole = RoleId;

// ==================== NAVIGATORS ====================

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// ==================== HOME STACKS (role-specific) ====================

// Employee Home
const HomeStack = () => (
  <Stack.Navigator<HomeStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CheckedOut" component={CheckedOutScreen} />
    <Stack.Screen name="Shortcuts" component={ShortcutsScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// HR Home
const HRHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HRDashboard" component={HRDashboardScreen} />
    <Stack.Screen name="HRApprovalCenter" component={HRApprovalCenterScreen} />
    <Stack.Screen name="HREmployeeManagement" component={HREmployeeManagementScreen} />
    <Stack.Screen name="HRAttendanceManagement" component={HRAttendanceManagementScreen} />
    <Stack.Screen name="HRReports" component={HRReportsScreen} />
    <Stack.Screen name="HRSettings" component={HRSettingsScreen} />
    <Stack.Screen name="HRAnalytics" component={HRAnalyticsScreen} />
    <Stack.Screen name="HRLeaveManagement" component={HRLeaveManagementScreen} />
    <Stack.Screen name="HROnboardingManagement" component={HROnboardingManagementScreen} />
    <Stack.Screen name="HROffboarding" component={HROffboardingScreen} />
    <Stack.Screen name="HRPolicyManagement" component={HRPolicyManagementScreen} />
    <Stack.Screen name="HRCompliance" component={HRComplianceScreen} />
    <Stack.Screen name="HRBulkActions" component={HRBulkActionsScreen} />
    <Stack.Screen name="HREmployeeProfile" component={HREmployeeProfileScreen} />
    <Stack.Screen name="HRApprovalDetail" component={HRApprovalDetailScreen} />
    <Stack.Screen name="HRReportDetail" component={HRReportDetailScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// Finance Home
const FinanceHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FinanceDashboard" component={FinanceDashboardScreen} />
    <Stack.Screen name="FinanceEmployees" component={FinanceEmployeeScreen} />
    <Stack.Screen name="Payroll" component={PayrollManagementScreen} />
    <Stack.Screen name="FinanceExpenses" component={FinanceExpenseManagementScreen} />
    <Stack.Screen name="FinanceReports" component={FinanceReportsScreen} />
    <Stack.Screen name="FinanceBudget" component={FinanceBudgetScreen} />
    <Stack.Screen name="FinanceTax" component={FinanceTaxScreen} />
    <Stack.Screen name="FinanceAudit" component={FinanceAuditScreen} />
    <Stack.Screen name="PayrollDetail" component={PayrollDetailScreen} />
    <Stack.Screen name="PayrollHistory" component={PayrollHistoryScreen} />
    <Stack.Screen name="FinanceReportDetail" component={FinanceReportDetailScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// Manager/TL Home
const ManagerHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} />
    <Stack.Screen name="MyTeam" component={MyTeamScreen} />
    <Stack.Screen name="TeamApprovals" component={ManagerApprovalScreen} />
    <Stack.Screen name="TeamApprovalDetail" component={ManagerApprovalDetailScreen} />
    <Stack.Screen name="TeamPlanning" component={TeamPlanningScreen} />
    <Stack.Screen name="TeamReports" component={TeamReportsScreen} />
    <Stack.Screen name="TeamAttendance" component={TeamAttendanceScreen} />
    <Stack.Screen name="TeamPerformance" component={TeamPerformanceScreen} />
    <Stack.Screen name="TeamGoals" component={TeamGoalsScreen} />
    <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// Recruiter Home
const RecruiterHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RecruiterDashboard" component={RecruiterDashboardScreen} />
    <Stack.Screen name="CandidateManagement" component={CandidateManagementScreen} />
    <Stack.Screen name="JobManagement" component={JobManagementScreen} />
    <Stack.Screen name="InterviewManagement" component={InterviewManagementScreen} />
    <Stack.Screen name="OfferManagement" component={OfferManagementScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// ==================== EMPLOYEE TABS ====================

const ActivityStack = () => (
  <Stack.Navigator<ActivityStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
    <Stack.Screen name="ActivityFilter" component={ActivityFilterScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="AddActivity" component={AddActivityScreen} />
    <Stack.Screen name="EditActivity" component={EditActivityScreen} />
    <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
    <Stack.Screen name="TimesheetWeekly" component={TimesheetWeeklyScreen} />
    <Stack.Screen name="TimesheetMonthly" component={TimesheetMonthlyScreen} />
    <Stack.Screen name="SubmitConfirmation" component={SubmitConfirmationScreen} />
    <Stack.Screen name="TimesheetSubmitted" component={TimesheetSubmittedScreen} />
    <Stack.Screen name="ApprovalStatus" component={ApprovalStatusScreen} />
    <Stack.Screen name="RevisionRequested" component={RevisionRequestedScreen} />
  </Stack.Navigator>
);

const FinanceStack = () => (
  <Stack.Navigator<FinanceStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PayslipHome" component={PayslipHomeScreen} />
    <Stack.Screen name="ExpenseOverview" component={ExpenseOverviewScreen} />
    <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
    <Stack.Screen name="PayslipDetail" component={ExpenseDetailScreen} />
  </Stack.Navigator>
);

const PerformanceStack = () => (
  <Stack.Navigator<PerformanceStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PerformanceHome" component={PerformanceDashboardScreen} />
    <Stack.Screen name="MyKPIs" component={KPITrackingScreen} />
    <Stack.Screen name="MyReviews" component={PerformanceReviewScreen} />
    <Stack.Screen name="MyGoals" component={GoalSettingScreen} />
    <Stack.Screen name="MyFeedback" component={Feedback360Screen} />
    <Stack.Screen name="MyTeamLeader" component={EmployeeDirectoryScreen} />
    <Stack.Screen name="TeamMembers" component={TeamMembersScreen} />
  </Stack.Navigator>
);

const NotificationStack = () => (
  <Stack.Navigator<NotificationStackParamList> screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
  </Stack.Navigator>
);

// More Tab - bundles Performance + Notifications
const MoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreHome" component={MoreHomeScreen} />
    <Stack.Screen name="PerformanceHome" component={PerformanceDashboardScreen} />
    <Stack.Screen name="MyKPIs" component={KPITrackingScreen} />
    <Stack.Screen name="MyReviews" component={PerformanceReviewScreen} />
    <Stack.Screen name="MyGoals" component={GoalSettingScreen} />
    <Stack.Screen name="MyFeedback" component={Feedback360Screen} />
    <Stack.Screen name="MyTeamLeader" component={EmployeeDirectoryScreen} />
    <Stack.Screen name="TeamMembers" component={TeamMembersScreen} />
    <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
  </Stack.Navigator>
);

// ==================== ROLE-SPECIFIC STACKS ====================

// HR Management Stack (for HR users)
const HRManagementStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HRHome" component={HRDashboardScreen} />
    <Stack.Screen name="HRApprovals" component={HRApprovalCenterScreen} />
    <Stack.Screen name="HREmployees" component={HREmployeeManagementScreen} />
    <Stack.Screen name="HRAttendance" component={HRAttendanceManagementScreen} />
    <Stack.Screen name="HRReports" component={HRReportsScreen} />
    <Stack.Screen name="HRSettings" component={HRSettingsScreen} />
    <Stack.Screen name="HRAnalytics" component={HRAnalyticsScreen} />
    <Stack.Screen name="HRLeaveManagement" component={HRLeaveManagementScreen} />
    <Stack.Screen name="HROnboardingManagement" component={HROnboardingManagementScreen} />
    <Stack.Screen name="HROffboarding" component={HROffboardingScreen} />
    <Stack.Screen name="HRPolicyManagement" component={HRPolicyManagementScreen} />
    <Stack.Screen name="HRCompliance" component={HRComplianceScreen} />
    <Stack.Screen name="HRBulkActions" component={HRBulkActionsScreen} />
    <Stack.Screen name="HREmployeeProfile" component={HREmployeeProfileScreen} />
    <Stack.Screen name="HRApprovalDetail" component={HRApprovalDetailScreen} />
    <Stack.Screen name="HRReportDetail" component={HRReportDetailScreen} />
  </Stack.Navigator>
);

// Finance Management Stack (for Finance users)
const FinanceManagementStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FinanceHome" component={FinanceDashboardScreen} />
    <Stack.Screen name="FinanceEmployees" component={FinanceEmployeeScreen} />
    <Stack.Screen name="Payroll" component={PayrollManagementScreen} />
    <Stack.Screen name="FinanceExpenses" component={FinanceExpenseManagementScreen} />
    <Stack.Screen name="FinanceReports" component={FinanceReportsScreen} />
    <Stack.Screen name="FinanceBudget" component={FinanceBudgetScreen} />
    <Stack.Screen name="FinanceTax" component={FinanceTaxScreen} />
    <Stack.Screen name="FinanceAudit" component={FinanceAuditScreen} />
    <Stack.Screen name="PayrollDetail" component={PayrollDetailScreen} />
    <Stack.Screen name="PayrollHistory" component={PayrollHistoryScreen} />
    <Stack.Screen name="FinanceReportDetail" component={FinanceReportDetailScreen} />
  </Stack.Navigator>
);

// Team Management Stack (for Managers/TLs)
const TeamManagementStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TeamDashboard" component={ManagerDashboardScreen} />
    <Stack.Screen name="MyTeam" component={MyTeamScreen} />
    <Stack.Screen name="TeamApprovals" component={ManagerApprovalScreen} />
    <Stack.Screen name="TeamApprovalDetail" component={ManagerApprovalDetailScreen} />
    <Stack.Screen name="TeamPlanning" component={TeamPlanningScreen} />
    <Stack.Screen name="TeamReports" component={TeamReportsScreen} />
    <Stack.Screen name="TeamAttendance" component={TeamAttendanceScreen} />
    <Stack.Screen name="TeamPerformance" component={TeamPerformanceScreen} />
    <Stack.Screen name="TeamGoals" component={TeamGoalsScreen} />
  </Stack.Navigator>
);

// ==================== WORK STACKS (Activity + Role Features) ====================

// HR Work: Activity + HR Management
const HRWorkStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
    <Stack.Screen name="HRHome" component={HRDashboardScreen} />
    <Stack.Screen name="HRApprovals" component={HRApprovalCenterScreen} />
    <Stack.Screen name="HREmployees" component={HREmployeeManagementScreen} />
    <Stack.Screen name="HRAttendance" component={HRAttendanceManagementScreen} />
    <Stack.Screen name="HRReports" component={HRReportsScreen} />
    <Stack.Screen name="HRSettings" component={HRSettingsScreen} />
    <Stack.Screen name="HRAnalytics" component={HRAnalyticsScreen} />
    <Stack.Screen name="HRLeaveManagement" component={HRLeaveManagementScreen} />
    <Stack.Screen name="HROnboardingManagement" component={HROnboardingManagementScreen} />
    <Stack.Screen name="HROffboarding" component={HROffboardingScreen} />
    <Stack.Screen name="HRPolicyManagement" component={HRPolicyManagementScreen} />
    <Stack.Screen name="HRCompliance" component={HRComplianceScreen} />
    <Stack.Screen name="HRBulkActions" component={HRBulkActionsScreen} />
    <Stack.Screen name="HREmployeeProfile" component={HREmployeeProfileScreen} />
    <Stack.Screen name="HRApprovalDetail" component={HRApprovalDetailScreen} />
    <Stack.Screen name="HRReportDetail" component={HRReportDetailScreen} />
  </Stack.Navigator>
);

// Finance Work: Activity + Finance Management
const FinanceWorkStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
    <Stack.Screen name="FinanceHome" component={FinanceDashboardScreen} />
    <Stack.Screen name="FinanceEmployees" component={FinanceEmployeeScreen} />
    <Stack.Screen name="Payroll" component={PayrollManagementScreen} />
    <Stack.Screen name="FinanceExpenses" component={FinanceExpenseManagementScreen} />
    <Stack.Screen name="FinanceReports" component={FinanceReportsScreen} />
    <Stack.Screen name="FinanceBudget" component={FinanceBudgetScreen} />
    <Stack.Screen name="FinanceTax" component={FinanceTaxScreen} />
    <Stack.Screen name="FinanceAudit" component={FinanceAuditScreen} />
    <Stack.Screen name="PayrollDetail" component={PayrollDetailScreen} />
    <Stack.Screen name="PayrollHistory" component={PayrollHistoryScreen} />
    <Stack.Screen name="FinanceReportDetail" component={FinanceReportDetailScreen} />
  </Stack.Navigator>
);

// Manager Work: Activity + Team Management
const ManagerWorkStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
    <Stack.Screen name="TeamDashboard" component={ManagerDashboardScreen} />
    <Stack.Screen name="MyTeam" component={MyTeamScreen} />
    <Stack.Screen name="TeamApprovals" component={ManagerApprovalScreen} />
    <Stack.Screen name="TeamApprovalDetail" component={ManagerApprovalDetailScreen} />
    <Stack.Screen name="TeamPlanning" component={TeamPlanningScreen} />
    <Stack.Screen name="TeamReports" component={TeamReportsScreen} />
    <Stack.Screen name="TeamAttendance" component={TeamAttendanceScreen} />
    <Stack.Screen name="TeamPerformance" component={TeamPerformanceScreen} />
    <Stack.Screen name="TeamGoals" component={TeamGoalsScreen} />
  </Stack.Navigator>
);

// Recruiter Work Stack
const RecruiterWorkStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
    <Stack.Screen name="RecruiterDashboard" component={RecruiterDashboardScreen} />
    <Stack.Screen name="CandidateManagement" component={CandidateManagementScreen} />
    <Stack.Screen name="JobManagement" component={JobManagementScreen} />
    <Stack.Screen name="InterviewManagement" component={InterviewManagementScreen} />
    <Stack.Screen name="OfferManagement" component={OfferManagementScreen} />
  </Stack.Navigator>
);

// ==================== CENTER BUTTON ====================

interface CenterButtonProps {
  onPress?: any;
}

const CenterButton: React.FC<CenterButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.centerButton} onPress={onPress}>
    <View style={styles.centerButtonInner}>
      <Ionicons name="briefcase" size={24} color={colors.textInverse} />
    </View>
  </TouchableOpacity>
);

const EmployeeTabs = () => (
  <Tab.Navigator<EmployeeTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Work') iconName = focused ? 'briefcase' : 'briefcase-outline';
        else if (route.name === 'Center') return null;
        else if (route.name === 'Finance') iconName = focused ? 'wallet' : 'wallet-outline';
        else if (route.name === 'More') iconName = focused ? 'grid' : 'grid-outline';
        else return 'home-outline' as keyof typeof Ionicons.glyphMap;
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Work" component={ActivityStack} />
    <Tab.Screen name="Center" component={ShortcutsScreen} options={{ tabBarButton: (props) => <CenterButton {...props} /> }} />
    <Tab.Screen name="Finance" component={FinanceStack} />
    <Tab.Screen name="More" component={MoreStack} />
  </Tab.Navigator>
);

// ==================== HR TABS ====================
// HR users: Home, Work (Activity+HR), Center, Finance, More

const HRTabs = () => (
  <Tab.Navigator<HRTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Work') iconName = focused ? 'briefcase' : 'briefcase-outline';
        else if (route.name === 'Center') return null;
        else if (route.name === 'Finance') iconName = focused ? 'wallet' : 'wallet-outline';
        else if (route.name === 'More') iconName = focused ? 'grid' : 'grid-outline';
        else return 'home-outline' as keyof typeof Ionicons.glyphMap;
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="Home" component={HRHomeStack} />
    <Tab.Screen name="Work" component={HRWorkStack} />
    <Tab.Screen name="Center" component={ShortcutsScreen} options={{ tabBarButton: (props) => <CenterButton {...props} /> }} />
    <Tab.Screen name="Finance" component={FinanceStack} />
    <Tab.Screen name="More" component={MoreStack} />
  </Tab.Navigator>
);

// Recruiter Tabs
const RecruiterTabs = () => (
  <Tab.Navigator<HRTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Work') iconName = focused ? 'briefcase' : 'briefcase-outline';
        else if (route.name === 'Center') return null;
        else if (route.name === 'Finance') iconName = focused ? 'wallet' : 'wallet-outline';
        else if (route.name === 'More') iconName = focused ? 'grid' : 'grid-outline';
        else return 'home-outline' as keyof typeof Ionicons.glyphMap;
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="Home" component={RecruiterHomeStack} />
    <Tab.Screen name="Work" component={RecruiterWorkStack} />
    <Tab.Screen name="Center" component={ShortcutsScreen} options={{ tabBarButton: (props) => <CenterButton {...props} /> }} />
    <Tab.Screen name="Finance" component={FinanceStack} />
    <Tab.Screen name="More" component={MoreStack} />
  </Tab.Navigator>
);

// ==================== CEO TABS ====================

const CEOTabs = () => (
  <Tab.Navigator<CEOTabParamList>
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: 'home',
          Analytics: 'stats-chart',
          Finance: 'wallet',
          Departments: 'business',
          More: 'grid',
        };
        const iconName = icons[route.name];
        return <Ionicons name={focused ? iconName : `${iconName}-outline` as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    })}
  >
    <Tab.Screen name="Home" component={CEODashboardScreen} />
    <Tab.Screen name="Analytics" component={CEOAnalyticsScreen} />
    <Tab.Screen name="Finance" component={CEOFinancialScreen} />
    <Tab.Screen name="Departments" component={DepartmentOverviewScreen} />
    <Tab.Screen name="More" component={CEOMoreStack} />
  </Tab.Navigator>
);

// CEO More Stack - bundles Goals, Reports, Compliance, Diversity, Workforce
const CEOMoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreHome" component={CEOMoreHomeScreen} />
    <Stack.Screen name="CompanyGoals" component={CompanyGoalsScreen} />
    <Stack.Screen name="CEOReports" component={CEOReportsScreen} />
    <Stack.Screen name="CEOCompliance" component={CEOComplianceScreen} />
    <Stack.Screen name="CEODiversity" component={CEODiversityScreen} />
    <Stack.Screen name="CEOSuccession" component={CEOSuccessionScreen} />
    <Stack.Screen name="CEOCompensation" component={CEOCompensationScreen} />
    <Stack.Screen name="WorkforcePlanning" component={WorkforcePlanningScreen} />
  </Stack.Navigator>
);

// CEO More Home
const CEOMoreHomeScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const sections = [
    {
      title: 'Strategy',
      icon: 'flag' as const,
      items: [
        { label: 'Company Goals', icon: 'trophy' as const, screen: 'CompanyGoals' },
        { label: 'Succession Planning', icon: 'people' as const, screen: 'CEOSuccession' },
        { label: 'Workforce Planning', icon: 'briefcase' as const, screen: 'WorkforcePlanning' },
      ],
    },
    {
      title: 'People & Culture',
      icon: 'heart' as const,
      items: [
        { label: 'Diversity & Inclusion', icon: 'people' as const, screen: 'CEODiversity' },
        { label: 'Compensation', icon: 'cash' as const, screen: 'CEOCompensation' },
      ],
    },
    {
      title: 'Reports & Compliance',
      icon: 'document-text' as const,
      items: [
        { label: 'Executive Reports', icon: 'bar-chart' as const, screen: 'CEOReports' },
        { label: 'Compliance & Risk', icon: 'shield-checkmark' as const, screen: 'CEOCompliance' },
      ],
    },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
        <Text style={{ fontSize: 34, fontWeight: '700', color: colors.text }}>More</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: 24 }} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Ionicons name={section.icon} size={20} color={colors.primary} />
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>{section.title}</Text>
            </View>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: colors.surface, borderRadius: 12 }}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
                <Text style={{ flex: 1, fontSize: 16, color: colors.text }}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ==================== ROOT NAVIGATOR ====================

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Loading Karajo HR..." />;
  }

  const RoleNavigator: React.FC = () => {
    switch (role) {
      case 'hr_manager':
      case 'hr_specialist':
        return <HRTabs />;
      case 'recruiter':
        return <RecruiterTabs />;
      case 'finance_mgr':
      case 'accountant':
        return <FinanceTabs />;
      case 'manager':
      case 'team_lead':
        return <ManagerTabs />;
      case 'ceo':
        return <CEOTabs />;
      default:
        return <EmployeeTabs />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 250,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={RoleNavigator} options={{ animation: 'fade', animationDuration: 200, gestureEnabled: false }} />

              {/* Role-based screens - only show screens the user's role has access to */}
              {getRoleScreens(role as RoleId).map((screen) => (
                <Stack.Screen
                  key={screen.name}
                  name={screen.name as keyof RootStackParamList}
                  component={screen.component}
                  options={{
                    presentation: screen.isModal ? 'modal' : undefined,
                    animation: screen.isModal ? 'slide_from_bottom' : screen.isFade ? 'fade' : undefined,
                    animationDuration: screen.isFade ? 300 : undefined,
                    gestureEnabled: !screen.isModal,
                  }}
                />
              ))}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabLabel: { fontSize: 11, fontWeight: '500' as const, marginTop: 4 },
  centerButton: { top: -20, justifyContent: 'center' as const, alignItems: 'center' as const },
  centerButtonInner: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    justifyContent: 'center' as const, alignItems: 'center' as const,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
});
